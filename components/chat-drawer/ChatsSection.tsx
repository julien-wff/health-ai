import { useAppState } from '@/hooks/useAppState';
import { useMemo } from 'react';
import { filterChatsByDaysRange } from '@/utils/chat';
import { Text } from 'react-native';
import ChatElement from '@/components/chat-drawer/ChatElement';

interface ChatsSectionProps {
    title: string;
    startDay: number;
    endDay?: number;
}

export default function ChatsSection({ title, startDay, endDay }: ChatsSectionProps) {
    const { chats } = useAppState();
    const filteredChats = useMemo(
        () => filterChatsByDaysRange(chats, startDay, endDay),
        [ chats.map(c => c.lastUpdated), startDay, endDay ],
    );

    if (filteredChats.length === 0)
        return null;

    return <>
        <Text className="text-slate-600 dark:text-slate-400 text-xs ml-4 mt-2">
            {title}
        </Text>
        {filteredChats.map(chat => (
            <ChatElement chat={chat} key={chat.id}/>
        ))}
    </>;
}
