import AnimatedLoadingIcon from '@/components/chat/AnimatedLoadingIcon';
import { Send } from 'lucide-react-native';
import { type Dispatch, type FormEvent, type SetStateAction, useRef } from 'react';
import {
    NativeSyntheticEvent,
    TextInput,
    TextInputSubmitEditingEventData,
    TouchableOpacity,
    Vibration,
    View,
} from 'react-native';
import { useTracking } from '@/hooks/useTracking';
import { AiProfile } from '@/hooks/useFeatureFlags';
import { useAppState } from '@/hooks/useAppState';
import ChatSuggestions from '@/components/chat/ChatSuggestions';

interface PromptInputProps {
    input: string;
    setInput: (value: string) => void;
    handleSubmit: (e?: FormEvent) => void;
    isLoading?: boolean;
    chatAgentMode: AiProfile | undefined;
    suggestions?: string[];
    setSuggestions?: Dispatch<SetStateAction<string[]>>;
}

export default function PromptInput({
                                        input,
                                        setInput,
                                        handleSubmit,
                                        isLoading,
                                        chatAgentMode,
                                        suggestions,
                                        setSuggestions,
                                    }: PromptInputProps) {
    const tracking = useTracking();
    const textInput = useRef<TextInput>(null);
    const { hasDebugAccess } = useAppState();

    function sendPrompt(e?: NativeSyntheticEvent<TextInputSubmitEditingEventData>) {
        if (input.trim().length > 0) {
            setSuggestions?.([]);
            handleSubmit(e as unknown as FormEvent);
            tracking.event('chat_prompt_send');
        }

        if (!e) {
            textInput.current?.blur();
            Vibration.vibrate(50);
        }
    }

    return <View>
        <ChatSuggestions suggestions={suggestions ?? []} onSuggestionPress={setInput}/>
        <View
            className="flex flex-row items-center gap-4 bg-slate-50 p-4 shadow-xl shadow-black rounded-t-[20px] dark:bg-slate-900">
            <TextInput
                ref={textInput}
                className="flex-1 rounded-xl p-4 dark:placeholder:text-slate-500 dark:text-slate-200"
                placeholder="Message the assistant"
                returnKeyType="send"
                value={input}
                onChangeText={setInput}
                onSubmitEditing={sendPrompt}
            />
            <TouchableOpacity className={`h-14 w-14 rounded-xl p-4 disabled:opacity-75 
                                          ${!hasDebugAccess || !chatAgentMode ? 'bg-blue-500 dark:bg-blue-400' : chatAgentMode === 'extrovert' ? 'bg-red-500' : 'bg-green-500'}`}
                              disabled={isLoading}
                              onPress={() => sendPrompt()}>
                {isLoading
                    ? <AnimatedLoadingIcon size={20} color="white"/>
                    : <Send size={20} color="white"/>
                }
            </TouchableOpacity>
        </View>
    </View>;
}
