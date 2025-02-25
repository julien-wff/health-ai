import ChatMessages from '@/components/chat/ChatMessages';
import PromptInput from '@/components/chat/PromptInput';
import { generateAPIUrl } from '@/utils/endpoints';
import { useChat } from '@ai-sdk/react';
import { fetch as expoFetch } from 'expo/fetch';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Chat() {
    const { messages, handleInputChange, input, handleSubmit } = useChat({
        fetch: expoFetch as unknown as typeof globalThis.fetch,
        api: generateAPIUrl('/api/chat'),
        onError: error => console.error(error, 'ERROR'),
    });

    return <SafeAreaView className="h-full bg-slate-50 dark:bg-slate-950">
        <ChatMessages messages={messages}/>
        <PromptInput input={input} handleInputChange={handleInputChange} handleSubmit={handleSubmit}/>
    </SafeAreaView>;
}
