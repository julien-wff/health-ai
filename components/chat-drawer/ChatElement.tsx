import { StorageChat } from '@/utils/chat';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { usePostHog } from 'posthog-react-native';
import React from 'react';
import { Alert, Pressable, Text, useColorScheme, View } from 'react-native';
import { useAppState } from '@/hooks/useAppState';
import type { AiProfile } from '@/hooks/useFeatureFlags';
import { useTracking } from '@/hooks/useTracking';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { chatKeyFromId } from '@/utils/storageKeys';

interface ChatElementProps {
    chat: StorageChat;
}

function AgentModeIndicator({ mode }: { mode: AiProfile }) {
    const formattedMode = mode === 'extrovert' ? 'E' : mode === 'introvert' ? 'I' : '?';

    return <View
        className={`rounded-full ${mode === 'extrovert' ? 'bg-red-500' : mode === 'introvert' ? 'bg-green-500' : 'bg-slate-500'} 
                    h-4 w-4 flex items-center justify-center`}>
        <Text className="text-xs text-white">{formattedMode}</Text>
    </View>;
}

export default function ChatElement({ chat }: ChatElementProps) {
    // TODO: Check if this is the best way
    const { chats, setChats } = useAppState();
    const posthog = usePostHog();
    const { hasDebugAccess } = useAppState();
    const { id: chatId } = useLocalSearchParams<{ id: string }>();
    const tracking = useTracking();
    const colorScheme = useColorScheme();
    const router = useRouter();

    const selected = chatId === chat.id;

    function showChatDeletionAlert() {
        tracking.event('chat_deletion_prompt');
        Alert.alert(
            'Delete chat',
            `The chat "${chat.title}" will be removed. This action cannot be undone.`,
            [
                {
                    text: 'Go back',
                    style: 'cancel',
                },
                {
                    text: 'Delete chat',
                    onPress: deleteChat,
                    style: 'destructive',
                },
            ],
            {
                cancelable: true,
                userInterfaceStyle: colorScheme || 'light',
            },
        );
    }

    async function deleteChat() {
        tracking.event('chat_deletion_confirm');

        const filteredChats = chats.filter((c) => c.id !== chat.id);
        setChats(filteredChats);

        if (selected)
            router.replace('/chat');

        const chatKey = chatKeyFromId(chat.id);
        await AsyncStorage.removeItem(chatKey);
    }

    return <Link href={`/chat/${chat.id}`} replace asChild>
        <Pressable
            onPress={() => posthog.capture('chat_selected')}
            onLongPress={() => showChatDeletionAlert()}
            className={`w-full flex flex-row items-center gap-2 p-4 active:bg-slate-200 active:dark:bg-slate-800 rounded-lg ${selected ? 'bg-slate-200 dark:bg-slate-800' : ''}`}>
            {hasDebugAccess && <AgentModeIndicator mode={chat.agentMode}/>}
            <Text className="text-slate-900 dark:text-slate-100" numberOfLines={1}>{chat.title}</Text>
        </Pressable>
    </Link>;
}
