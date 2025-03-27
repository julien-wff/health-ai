import { Link } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { UserRoundCog } from 'lucide-react-native';
import { useColors } from '@/hooks/useColors';
import ProjectIconWithDebug from '@/components/chat-drawer/ProjectIconWithDebug';
import ChatsSection from '@/components/chat-drawer/ChatsSection';

export default React.memo(ChatDrawer);

function ChatDrawer() {
    const colors = useColors();

    return <View className="flex h-full bg-slate-50 dark:bg-slate-950">
        <View className="my-4 flex items-center justify-center">
            <ProjectIconWithDebug/>
        </View>

        <View className="flex-1 p-2">
            <Text className="p-4 text-lg font-bold text-slate-900 dark:text-slate-100">Chat history</Text>
            <ScrollView fadingEdgeLength={192}>
                <ChatsSection title="Today" startDay={0}/>
                <ChatsSection title="Yesterday" startDay={1} endDay={2}/>
                <ChatsSection title="Last 7 days" startDay={2} endDay={8}/>
                <ChatsSection title="Last 14 days" startDay={8} endDay={15}/>
                <ChatsSection title="Last month" startDay={15} endDay={31}/>
                <ChatsSection title="Older" startDay={31} endDay={Infinity}/>
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
