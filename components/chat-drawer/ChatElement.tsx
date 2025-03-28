import { StorageChat } from '@/utils/chat';
import { Link, useLocalSearchParams } from 'expo-router';
import { usePostHog } from 'posthog-react-native';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useAppState } from '@/hooks/useAppState';
import type { AiProfile } from '@/hooks/useFeatureFlags';

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
    const posthog = usePostHog();
    const { hasDebugAccess } = useAppState();
    const { id: chatId } = useLocalSearchParams<{ id: string }>();

    const selected = chatId === chat.id;

    return <Link href={`/chat/${chat.id}`} replace asChild>
        <Pressable
            onPress={() => posthog.capture('chat_selected')}
            className={`w-full flex flex-row items-center gap-2 p-4 active:bg-slate-200 active:dark:bg-slate-800 rounded-lg ${selected ? 'bg-slate-200 dark:bg-slate-800' : ''}`}>
            {hasDebugAccess && <AgentModeIndicator mode={chat.agentMode}/>}
            <Text className="text-slate-900 dark:text-slate-100" numberOfLines={1}>{chat.title}</Text>
        </Pressable>
    </Link>;
}
