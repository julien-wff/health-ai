import ChatToolWidget from '@/components/chat/ChatToolWidget';
import { useColors } from '@/hooks/useColors';
import { UIMessage } from 'ai';
import { LinearGradient } from 'expo-linear-gradient';
import { HeartPulse, User } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { isChatSystemPrompt } from '@/utils/prompts';
import ChatErrorWidget from '@/components/chat/widgets/ChatErrorWidget';

interface ChatMessagesProps {
    messages: UIMessage[];
    error: Error | null;
    retryAfterError?: () => void;
}

export default function ChatMessages({ messages, error, retryAfterError }: Readonly<ChatMessagesProps>) {
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
                    onLayout={() => updateScroll()}>
            {messages.map(m => !isChatSystemPrompt(m.content) && (
                <View key={m.id} className="my-2">
                    <View className="mb-1 flex flex-row items-center gap-2">
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

            {error && <ChatErrorWidget error={error} onRetry={retryAfterError}/>}
        </ScrollView>
    );
}


function UserIcon() {
    const colors = useColors();

    return <View className="flex h-5 w-5 items-center justify-center rounded-full">
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

    return <View className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
        <LinearGradient colors={colors.blueBackground}
                        start={[ 0, 0 ]}
                        end={[ 1, 1 ]}
                        className="absolute inset-0"
                        style={{ borderRadius: 20 }}/>
        <HeartPulse size={12} color={colors.blue}/>
    </View>;
}
