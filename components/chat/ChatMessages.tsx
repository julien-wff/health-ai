import { UIMessage } from 'ai';
import { useEffect, useRef } from 'react';
import { ScrollView, Text, View } from 'react-native';

interface ChatMessagesProps {
    messages: UIMessage[];
}

export default function ChatMessages({ messages }: ChatMessagesProps) {
    const scrollView = useRef<ScrollView>(null);

    useEffect(() => {
        updateScroll(true);
    }, [ messages ]);

    function updateScroll(animated = false) {
        scrollView.current?.scrollToEnd({ animated });
    }

    return (
        <ScrollView className="flex-1 px-4" ref={scrollView} onLayout={() => updateScroll()}>
            {messages.map(m => (
                <View key={m.id} className="my-2">
                    <Text className="font-bold text-slate-900 dark:text-slate-100">{m.role}</Text>
                    <Text className="text-slate-800 dark:text-slate-200">{m.content}</Text>
                </View>
            ))}
        </ScrollView>
    );
}
