import { Text, View } from 'react-native';
import { Dumbbell, Footprints, HeartHandshake, Medal, Moon, Trophy } from 'lucide-react-native';
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
        title: 'Exercise plan',
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
    {
        title: 'See my goals',
        prompt: 'What are my goals, and their progress?',
        icon: Trophy,
        iconColor: '#60a5fa',
    },
];


interface ChatEmptyMessagesProps {
    onPromptClick?: (prompt: string) => void;
}


export default function ChatEmptyMessages({ onPromptClick }: Readonly<ChatEmptyMessagesProps>) {
    // Select X random starters from the list
    const starters = useMemo(() => {
        return [ ...CONVERSATION_STARTERS ].sort(() => 0.5 - Math.random()).slice(0, 3);
    }, []);

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
