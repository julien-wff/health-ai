import AnimatedLoadingIcon from '@/components/chat/AnimatedLoadingIcon';
import * as Sentry from '@sentry/react-native';
import { Send } from 'lucide-react-native';
import { FormEvent, useRef } from 'react';
import {
    NativeSyntheticEvent,
    TextInput,
    TextInputSubmitEditingEventData,
    TouchableOpacity,
    Vibration,
    View,
} from 'react-native';

interface PromptInputProps {
    input: string;
    setInput: (value: string) => void;
    handleSubmit: (e?: FormEvent) => void;
    isLoading?: boolean;
}

export default function PromptInput({ input, setInput, handleSubmit, isLoading }: PromptInputProps) {

    const textInput = useRef<TextInput>(null);

    function sendPrompt(e?: NativeSyntheticEvent<TextInputSubmitEditingEventData>) {
        if (input.trim().length > 0) {
            handleSubmit(e as unknown as FormEvent);
            Sentry.captureEvent({ event_id: 'send-prompt' });
        }

        if (!e) {
            textInput.current?.blur();
            Vibration.vibrate(50);
        }
    }

    return <View
        className="p-4 shadow-xl shadow-black bg-slate-50 dark:bg-slate-900 rounded-t-[20px] flex flex-row items-center gap-4">
        <TextInput
            ref={textInput}
            className="flex-1 p-4 rounded-xl dark:placeholder:text-slate-500 dark:text-slate-200"
            placeholder="Message the assistant"
            returnKeyType="send"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={sendPrompt}
        />
        <TouchableOpacity className="bg-blue-500 dark:bg-blue-400 p-4 rounded-xl disabled:opacity-75 h-14 w-14"
                          disabled={isLoading}
                          onPress={() => sendPrompt()}>
            {isLoading ?
                <AnimatedLoadingIcon size={20} color="white"/>
                :
                <Send size={20} color="white"/>
            }
        </TouchableOpacity>
    </View>;
}
