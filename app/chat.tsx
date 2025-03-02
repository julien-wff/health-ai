import { generateId } from 'ai';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function NewChat() {
    const router = useRouter();

    useEffect(() => {
        const chatId = generateId();
        router.replace(`/chat/${chatId}`);
    }, []);

    return <></>;
}
