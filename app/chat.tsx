import { generateId } from 'ai';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useTracking } from '@/hooks/useTracking';

export default function NewChat() {
    const router = useRouter();
    const tracking = useTracking();

    useEffect(() => {
        tracking.event('chat_redirection');
        const chatId = generateId();
        router.replace(`/chat/${chatId}`);
    }, []);

    return <></>;
}
