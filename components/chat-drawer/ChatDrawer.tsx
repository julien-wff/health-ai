import ChatElement from '@/components/chat-drawer/ChatElement';
import ProjectIcon from '@/components/content/ProjectIcon';
import { useAppState } from '@/hooks/useAppState';
import { Link, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { UserRoundCog } from 'lucide-react-native';
import { useColors } from '@/hooks/useColors';

export default React.memo(ChatDrawer);

function ChatDrawer() {
    const { chats } = useAppState();
    const { id: chatId } = useLocalSearchParams<{ id: string }>();
    const colors = useColors();

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

        <Link href="/profile" asChild>
            <Pressable
                className="flex flex-row items-center gap-2 p-4 m-2 active:bg-slate-200 active:dark:bg-slate-800 rounded-lg">
                <UserRoundCog color={colors.text} size={20}/>
                <Text className="text-slate-900 dark:text-slate-100">Settings</Text>
            </Pressable>
        </Link>
    </View>;
}
