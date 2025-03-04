import ChatDrawer from '@/components/chat-drawer/ChatDrawer';
import ChatEmptyMessages from '@/components/chat/ChatEmptyMessages';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatTopBar from '@/components/chat/ChatTopBar';
import PromptInput from '@/components/chat/PromptInput';
import { useAppState } from '@/hooks/useAppState';
import { DateRangeParams, generateConversationTitle, tools } from '@/utils/ai';
import { getStorageChat, saveStorageChat } from '@/utils/chat';
import { generateAPIUrl } from '@/utils/endpoints';
import { filterRecordsForAI, formatRecordsForAI } from '@/utils/health';
import { useChat } from '@ai-sdk/react';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { fetch as expoFetch } from 'expo/fetch';
import { useEffect, useState } from 'react';
import { InteractionManager } from 'react-native';
import { Drawer } from 'react-native-drawer-layout';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Chat() {
    const { healthRecords, addOrUpdateChat } = useAppState();
    const router = useRouter();
    const { id: chatId } = useLocalSearchParams<{ id: string }>();

    const [ responseStreamed, setResponseStreamed ] = useState(false);

    const { messages, setInput, input, handleSubmit, setMessages, stop, status } = useChat({
        id: chatId,
        fetch: expoFetch as unknown as typeof globalThis.fetch,
        api: generateAPIUrl('/api/chat'),
        maxSteps: 5,
        onError: error => console.error(error, 'ERROR'),
        onToolCall({ toolCall }) {
            switch (toolCall.toolName as keyof typeof tools) {
                case 'get-daily-steps':
                    return formatRecordsForAI(filterRecordsForAI(healthRecords!.steps, toolCall.args as DateRangeParams));
                case 'get-daily-exercise':
                    return formatRecordsForAI(filterRecordsForAI(healthRecords!.exercise, toolCall.args as DateRangeParams));
                case 'display-exercise':
                case 'display-steps':
                    return 'ok';
            }
        },
        onResponse() {
            setResponseStreamed(true);
        },
    });

    const [ drawerOpened, setDrawerOpened ] = useState(false);
    const [ title, setTitle ] = useState<string | null>(null);

    useEffect(() => {
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
        stop();
        router.replace('/chat');
    }

    return <SafeAreaView className="h-full bg-slate-50 dark:bg-slate-950">
        <Drawer open={drawerOpened}
                onOpen={() => setDrawerOpened(true)}
                onClose={() => setDrawerOpened(false)}
                renderDrawerContent={() => <ChatDrawer/>}>
            <ChatTopBar onOpen={() => setDrawerOpened(true)} onNew={onNewChat} text={title}/>

            {messages.length === 0
                ? <ChatEmptyMessages/>
                : <ChatMessages messages={messages}/>
            }

            <PromptInput input={input}
                         setInput={setInput}
                         handleSubmit={handleSubmit}
                         isLoading={status === 'streaming' || status === 'submitted'}/>
        </Drawer>
    </SafeAreaView>;
}
