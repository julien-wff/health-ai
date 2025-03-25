import ChatElement from '@/components/chat-drawer/ChatElement';
import { useAppState } from '@/hooks/useAppState';
import { Link, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { UserRoundCog } from 'lucide-react-native';
import { useColors } from '@/hooks/useColors';
import ProjectIconWithDebug from '@/components/chat-drawer/ProjectIconWithDebug';

export default React.memo(ChatDrawer);

function ChatDrawer() {
    const { chats } = useAppState();
    const { id: chatId } = useLocalSearchParams<{ id: string }>();
    const colors = useColors();

    return <View className="flex h-full bg-slate-50 dark:bg-slate-950">
        <View className="my-4 flex items-center justify-center">
            <ProjectIconWithDebug/>
        </View>

        <View className="flex-1 p-2">
            <Text className="p-4 text-lg font-bold text-slate-900 dark:text-slate-100">Chat history</Text>
            <ScrollView fadingEdgeLength={192}>
                {chats.map(
                    (chat) => <ChatElement chat={chat} key={chat.id} selected={chatId === chat.id}/>,
                )}
            </ScrollView>
        </View>

        <Link href="/profile" asChild>
            <Pressable
                className="m-2 flex flex-row items-center gap-2 rounded-lg p-4 active:bg-slate-200 active:dark:bg-slate-800">
                <UserRoundCog color={colors.text} size={20}/>
                <Text className="text-slate-900 dark:text-slate-100">Settings</Text>
            </Pressable>
        </Link>
    </View>;
}
