import * as Sentry from '@sentry/react-native';
import { generateId } from 'ai';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function NewChat() {
    const router = useRouter();

    useEffect(() => {
        Sentry.captureEvent({ event_id: 'new-chat' });
        const chatId = generateId();
        router.replace(`/chat/${chatId}`);
    }, []);

    return <></>;
}
