import ChatDrawer from '@/components/chat-drawer/ChatDrawer';
import ChatEmptyMessages from '@/components/chat/ChatEmptyMessages';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatTopBar from '@/components/chat/ChatTopBar';
import PromptInput from '@/components/chat/PromptInput';
import { useAppState } from '@/hooks/useAppState';
import { useHealthData } from '@/hooks/useHealthData';
import { DateRangeParams, generateConversationTitle, tools } from '@/utils/ai';
import { getStorageChat, saveStorageChat } from '@/utils/chat';
import { generateAPIUrl } from '@/utils/endpoints';
import { filterCollectionRange, formatCollection } from '@/utils/health';
import { useChat } from '@ai-sdk/react';
import * as Sentry from '@sentry/react-native';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { fetch as expoFetch } from 'expo/fetch';
import { usePostHog } from 'posthog-react-native';
import { useEffect, useState } from 'react';
import { InteractionManager, KeyboardAvoidingView, Platform, View } from 'react-native';
import { Drawer } from 'react-native-drawer-layout';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import EmptyHealthNotification from '@/components/notification/EmptyHealthNotification';

export default function Chat() {
    const { addOrUpdateChat } = useAppState();
    const {
        steps,
        exercise,
        sleep,
        loaded: healthLoaded,
        empty: healthEmpty,
        warningNotificationStatus,
        setWarningNotificationStatus,
    } = useHealthData();
    const router = useRouter();
    const { id: chatId } = useLocalSearchParams<{ id: string }>();
    const posthog = usePostHog();
    const insets = useSafeAreaInsets();

    const [ responseStreamed, setResponseStreamed ] = useState(false);

    const { messages, setInput, input, handleSubmit, setMessages, stop, status } = useChat({
        id: chatId,
        fetch: expoFetch as unknown as typeof globalThis.fetch,
        api: generateAPIUrl('/api/chat'),
        maxSteps: 5,
        onError: error => {
            Sentry.captureException(error);
            console.error(error, 'ERROR');
        },
        onToolCall({ toolCall }) {
            const { startDate, endDate } = toolCall.args as DateRangeParams;

            switch (toolCall.toolName as keyof typeof tools) {
                case 'get-daily-steps':
                case 'display-steps':
                    posthog.capture('chat_get_daily_steps', { display: toolCall.toolName.startsWith('display') });
                    return formatCollection(filterCollectionRange(steps, startDate, endDate), 'steps');
                case 'get-daily-exercise':
                case 'display-exercise':
                    posthog.capture('chat_get_daily_exercise', { display: toolCall.toolName.startsWith('display') });
                    return formatCollection(filterCollectionRange(exercise, startDate, endDate), 'exercise');
                case 'get-daily-sleep':
                case 'display-sleep':
                    posthog.capture('chat_get_daily_sleep', { display: toolCall.toolName.startsWith('display') });
                    return formatCollection(filterCollectionRange(sleep, startDate, endDate), 'sleep');
            }
        },
        onResponse() {
            posthog.capture('chat_response');
            setResponseStreamed(true);
        },
    });

    const [ drawerOpened, setDrawerOpened ] = useState(false);
    const [ title, setTitle ] = useState<string | null>(null);

    useEffect(() => {
        if (healthEmpty && warningNotificationStatus === null)
            setWarningNotificationStatus('show');

        (async () => {
            const chat = await getStorageChat(chatId);
            if (!chat)
                return;

            setMessages(chat.messages);
            setTitle(chat.title);
        })();
    }, []);

    useEffect(() => {
        if (status !== 'ready' || messages.length < 2 || !responseStreamed)
            return;

        // Save chat if more than 2 messages and title is set
        InteractionManager.runAfterInteractions(() => {
            if (!title)
                return;
            addOrUpdateChat(chatId, messages, title);
            void saveStorageChat(chatId, messages, title);
        });

        // Register new message to PostHog
        if (title)
            posthog.capture('chat_message', { messageCount: messages.length });

        if (messages.length !== 2 || title !== null)
            return;

        // Generate title if exactly 2 messages and no title
        InteractionManager.runAfterInteractions(() => {
            generateConversationTitle(messages).then(setTitle);
        });
    }, [ messages.length, status, title, responseStreamed ]);

    // Slight vibration each time a part of a message is received
    useEffect(() => {
        if (!responseStreamed || messages.length % 2 === 1)
            return;

        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }, [ messages ]);

    /**
     * Stop current message streaming (if any) and navigate to new chat screen
     */
    function onNewChat() {
        posthog.capture('chat_new_click');
        stop();
        router.replace('/chat');
    }

    return <View className="h-full relative">
        <SafeAreaView className="h-full">
            <Drawer open={drawerOpened}
                    onOpen={() => setDrawerOpened(true)}
                    onClose={() => setDrawerOpened(false)}
                    renderDrawerContent={() => <ChatDrawer/>}>
                <KeyboardAvoidingView className="flex flex-1"
                                      keyboardVerticalOffset={insets.top}
                                      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    <ChatTopBar onOpen={() => setDrawerOpened(true)} onNew={onNewChat} text={title}/>

                    {messages.length === 0
                        ? <ChatEmptyMessages/>
                        : <ChatMessages messages={messages}/>
                    }

                    <PromptInput input={input}
                                 setInput={setInput}
                                 handleSubmit={handleSubmit}
                                 isLoading={status === 'streaming' || status === 'submitted'}/>
                </KeyboardAvoidingView>

                {healthLoaded && healthEmpty && <EmptyHealthNotification/>}
            </Drawer>
        </SafeAreaView>

        <View className="w-full absolute bottom-0 bg-slate-50 dark:bg-slate-900"
              style={{ height: insets.bottom }}/>
    </View>;
}
