import { StorageChat } from '@/utils/chat';
import { Link } from 'expo-router';
import { usePostHog } from 'posthog-react-native';
import React from 'react';
import { Pressable, Text } from 'react-native';

interface ChatElementProps {
    chat: StorageChat;
    selected?: boolean;
}

export default function ChatElement({ chat, selected }: ChatElementProps) {
    const posthog = usePostHog();

    return <Link href={`/chat/${chat.id}`} replace asChild>
        <Pressable
            onPress={() => posthog.capture('chat_selected')}
            className={`w-full p-4 active:bg-slate-200 active:dark:bg-slate-800 rounded-lg ${selected ? 'bg-slate-200 dark:bg-slate-800' : ''}`}>
            <Text className="text-slate-900 dark:text-slate-100" numberOfLines={1}>{chat.title}</Text>
        </Pressable>
    </Link>;
}
