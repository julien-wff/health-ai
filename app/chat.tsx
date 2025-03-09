import { generateId } from 'ai';
import { useRouter } from 'expo-router';
import { usePostHog } from 'posthog-react-native';
import { useEffect } from 'react';

export default function NewChat() {
    const router = useRouter();
    const posthog = usePostHog();

    useEffect(() => {
        posthog.capture('new_chat');
        const chatId = generateId();
        router.replace(`/chat/${chatId}`);
    }, []);

    return <></>;
}
