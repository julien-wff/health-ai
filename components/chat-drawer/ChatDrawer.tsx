import ChatElement from '@/components/chat-drawer/ChatElement';
import ResetAppBtn from '@/components/chat-drawer/ResetAppBtn';
import ProjectIcon from '@/components/content/ProjectIcon';
import { useAppState } from '@/hooks/useAppState';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

export default React.memo(ChatDrawer);

function ChatDrawer() {
    const { chats } = useAppState();
    const { id: chatId } = useLocalSearchParams<{ id: string }>();

    return <View className="h-full flex bg-slate-50 dark:bg-slate-950">
        <View className="flex items-center justify-center my-4">
            <ProjectIcon className="w-24 h-24"/>
        </View>

        <View className="flex-1 p-2">
            {/* TODO: use ScrollView */}
            <Text className="text-slate-900 dark:text-slate-100 font-bold text-lg p-4">Chat history</Text>
            {chats.map(
                (chat) => <ChatElement chat={chat} key={chat.id} selected={chatId === chat.id}/>,
            )}
        </View>

        <ResetAppBtn/>
    </View>;
}
