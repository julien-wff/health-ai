import ChatToolWidget from '@/components/chat/ChatToolWidget';
import { useColors } from '@/hooks/useColors';
import { UIMessage } from 'ai';
import { LinearGradient } from 'expo-linear-gradient';
import { HeartPulse, User } from 'lucide-react-native';
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
        <ScrollView className="flex-1 px-4"
                    ref={scrollView}
                    onLayout={() => updateScroll()}
                    contentContainerClassName="pb-4">
            {messages.map(m => (
                <View key={m.id} className="my-2">
                    <View className="flex items-center flex-row gap-2 mb-1">
                        {m.role === 'user' ? <UserIcon/> : <AssistantIcon/>}
                        <Text className="font-bold text-slate-900 dark:text-slate-100">
                            {m.role === 'user' ? 'You' : 'Health AI'}
                        </Text>
                    </View>
                    {m.parts
                        .map((part, i) => {
                            switch (part.type) {
                                case 'text':
                                    return <Text key={i} className="text-slate-800 dark:text-slate-200">
                                        {part.text.trim()}
                                    </Text>;
                                case 'tool-invocation':
                                    return <ChatToolWidget invocation={part.toolInvocation}
                                                           key={part.toolInvocation.toolCallId}/>;
                            }
                        })}
                </View>
            ))}
        </ScrollView>
    );
}


function UserIcon() {
    const colors = useColors();

    return <View className="w-5 h-5 flex items-center justify-center rounded-full">
        <LinearGradient colors={colors.greenBackground}
                        start={[ 0, 0 ]}
                        end={[ 1, 1 ]}
                        className="absolute inset-0"
                        style={{ borderRadius: 20 }}/>
        <User size={12} color={colors.green}/>
    </View>;
}

function AssistantIcon() {
    const colors = useColors();

    return <View className="w-6 h-6 bg-white flex items-center justify-center rounded-full">
        <LinearGradient colors={colors.blueBackground}
                        start={[ 0, 0 ]}
                        end={[ 1, 1 ]}
                        className="absolute inset-0"
                        style={{ borderRadius: 20 }}/>
        <HeartPulse size={12} color={colors.blue}/>
    </View>;
}
