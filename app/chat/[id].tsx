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
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { fetch as expoFetch } from 'expo/fetch';
import { useCallback, useEffect, useState } from 'react';
import { InteractionManager, KeyboardAvoidingView, Platform, View } from 'react-native';
import { Drawer } from 'react-native-drawer-layout';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import HealthDataFoundNotification from '@/components/notification/HealthDataFoundNotification';
import EmptyHealthNotification from '@/components/notification/EmptyHealthNotification';
import { useTracking } from '@/hooks/useTracking';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';

export default function Chat() {
    const { addOrUpdateChat, requireNewChat, setRequireNewChat } = useAppState();
    const {
        steps,
        exercise,
        sleep,
        loaded: healthLoaded,
        empty: healthEmpty,
        warningNotificationStatus,
    } = useHealthData();
    const router = useRouter();
    const { id: chatId } = useLocalSearchParams<{ id: string }>();
    const insets = useSafeAreaInsets();
    const tracking = useTracking();
    const { agentMode } = useFeatureFlags();

    const [ responseStreamed, setResponseStreamed ] = useState(false);

    const { messages, setInput, input, handleSubmit, setMessages, stop, status } = useChat({
        id: chatId,
        fetch: expoFetch as unknown as typeof globalThis.fetch,
        api: generateAPIUrl(`/api/chat/${agentMode}`),
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
                    tracking.event('chat_get_daily_steps', { display: toolCall.toolName.startsWith('display') });
                    return formatCollection(filterCollectionRange(steps, startDate, endDate), 'steps');
                case 'get-daily-exercise':
                case 'display-exercise':
                    tracking.event('chat_get_daily_exercise', { display: toolCall.toolName.startsWith('display') });
                    return formatCollection(filterCollectionRange(exercise, startDate, endDate), 'exercise');
                case 'get-daily-sleep':
                case 'display-sleep':
                    tracking.event('chat_get_daily_sleep', { display: toolCall.toolName.startsWith('display') });
                    return formatCollection(filterCollectionRange(sleep, startDate, endDate), 'sleep');
            }
        },
        onResponse() {
            tracking.event('chat_response');
            setResponseStreamed(true);
        },
    });

    const [ drawerOpened, setDrawerOpened ] = useState(false);
    const [ title, setTitle ] = useState<string | null>(null);
    const [ chatAgentMode, setChatAgentMode ] = useState(agentMode);

    useEffect(() => {
        if (chatAgentMode === undefined && agentMode)
            setChatAgentMode(agentMode);
    }, [ agentMode ]);

    useFocusEffect(
        useCallback(() => {
            if (messages.length > 0 && requireNewChat) {
                setRequireNewChat(false);
                router.replace('/chat');
            }
        }, [ requireNewChat ]),
    );

    useEffect(() => {
        (async () => {
            const chat = await getStorageChat(chatId);
            if (!chat)
                return;

            tracking.event('chat_reopen');
            setMessages(chat.messages);
            setTitle(chat.title);
            setChatAgentMode(chat.agentMode);
        })();
    }, []);

    useEffect(() => {
        if (status !== 'ready' || messages.length < 2 || !responseStreamed || !chatAgentMode)
            return;

        // Save chat if more than 2 messages and title is set
        InteractionManager.runAfterInteractions(() => {
            if (!title)
                return;
            addOrUpdateChat(chatId, messages, title, chatAgentMode);
            void saveStorageChat(chatId, messages, title, chatAgentMode);
        });

        // Register new message to Posthog and Sentry
        if (title)
            tracking.event('chat_new_message', { messageCount: messages.length });

        if (messages.length !== 2 || title !== null)
            return;

        // Generate title if exactly 2 messages and no title
        InteractionManager.runAfterInteractions(() => {
            generateConversationTitle(messages)
                .then(setTitle)
                .then(() => tracking.event('chat_title_generated', { length: messages.length }));
        });
    }, [ messages.length, status, title, responseStreamed ]);

    // Slight vibration each time a part of a message is received
    useEffect(() => {
        if (!responseStreamed || messages.length % 2 === 1)
            return;

        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }, [ messages ]);

    // Report drawer status
    useEffect(() => {
        if (drawerOpened)
            tracking.event('chat_drawer_open');
        else
            tracking.event('chat_drawer_close');
    }, [ drawerOpened ]);

    /**
     * Stop current message streaming (if any) and navigate to new chat screen
     */
    function onNewChat() {
        tracking.event('chat_new_click');
        stop();
        router.replace('/chat');
    }

    return <View className="relative h-full">
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
                                 chatAgentMode={chatAgentMode!}
                                 isLoading={status === 'streaming' || status === 'submitted'}/>
                </KeyboardAvoidingView>

                {healthLoaded && healthEmpty && <EmptyHealthNotification/>}
                {healthLoaded && !healthEmpty && warningNotificationStatus && <HealthDataFoundNotification/>}
            </Drawer>
        </SafeAreaView>

        <View className="absolute bottom-0 w-full bg-slate-50 dark:bg-slate-900"
              style={{ height: insets.bottom }}/>
    </View>;
}
