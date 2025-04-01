import { Text, View } from 'react-native';
import { Dumbbell, Footprints, HeartHandshake, Medal, Moon } from 'lucide-react-native';
import ConversationStarter, { ConversationStarterProps } from '@/components/chat/ConversationStarter';
import { useMemo } from 'react';


const CONVERSATION_STARTERS: ConversationStarterProps[] = [
    {
        title: 'Help with sleep',
        prompt: 'Help me improve my sleep',
        icon: Moon,
        iconColor: '#6366f1',
    },
    {
        title: 'Exercice plan',
        prompt: 'Create me an adapted exercise plan based on my current activity',
        icon: Dumbbell,
        iconColor: '#ef4444',
    },
    {
        title: 'Do I exercise enough?',
        prompt: 'Do I exercise enough?',
        icon: HeartHandshake,
        iconColor: '#facc15',
    },
    {
        title: 'Walk more',
        prompt: 'Do I need to walk more? If so, how much?',
        icon: Footprints,
        iconColor: '#4ade80',
    },
    {
        title: 'Have I improved?',
        prompt: 'Have I improved lately?',
        icon: Medal,
        iconColor: '#e879f9',
    },
];


interface ChatEmptyMessagesProps {
    onPromptClick?: (prompt: string) => void;
}


export default function ChatEmptyMessages({ onPromptClick }: Readonly<ChatEmptyMessagesProps>) {
    // TODO: select x starters out of the list
    const starters = useMemo(() => CONVERSATION_STARTERS, []);

    return <View className="flex gap-8 flex-1 items-center justify-center">
        <Text className="text-center text-2xl font-bold text-slate-900 dark:text-slate-50">
            What can I help with?
        </Text>

        <View className="flex flex-row flex-wrap justify-center gap-2 max-w-full px-4">
            {starters.map(starter =>
                <ConversationStarter {...starter} key={starter.title} onClick={onPromptClick}/>,
            )}
        </View>
    </View>;
}
