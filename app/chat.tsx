import ChatDrawer from '@/components/chat-drawer/ChatDrawer';
import ChatEmptyMessages from '@/components/chat/ChatEmptyMessages';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatTopBar from '@/components/chat/ChatTopBar';
import PromptInput from '@/components/chat/PromptInput';
import { useAppState } from '@/hooks/useAppState';
import { DateRangeParams, generateConversationTitle, tools } from '@/utils/ai';
import { generateAPIUrl } from '@/utils/endpoints';
import { filterRecordsForAI, formatRecordsForAI } from '@/utils/health';
import { useChat } from '@ai-sdk/react';
import { fetch as expoFetch } from 'expo/fetch';
import { useEffect, useState } from 'react';
import { InteractionManager } from 'react-native';
import { Drawer } from 'react-native-drawer-layout';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Chat() {
    const { healthRecords } = useAppState();

    const { messages, setInput, input, handleSubmit, setMessages, stop, status } = useChat({
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
    });

    useEffect(() => {
        if (messages.length !== 2 || status !== 'ready' || title !== null)
            return;

        InteractionManager.runAfterInteractions(() => {
            generateConversationTitle(messages).then(setTitle);
        });
    }, [ messages.length, status ]);

    const [ drawerOpened, setDrawerOpened ] = useState(false);
    const [ title, setTitle ] = useState<string | null>(null);

    function onNewChat() {
        stop();
        setMessages([]);
        setTitle(null);
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
