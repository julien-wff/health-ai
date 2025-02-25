import { UIMessage } from 'ai';
import { ScrollView, Text, View } from 'react-native';

interface ChatMessagesProps {
    messages: UIMessage[];
}

export default function ChatMessages({ messages }: ChatMessagesProps) {
    return (
        <ScrollView className="flex-1 px-4">
            {messages.map(m => (
                <View key={m.id} className="my-2">
                    <Text className="font-bold text-slate-900 dark:text-slate-100">{m.role}</Text>
                    <Text className="text-slate-800 dark:text-slate-200">{m.content}</Text>
                </View>
            ))}
        </ScrollView>
    );
}
