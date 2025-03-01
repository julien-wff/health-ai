import AnimatedLoadingIcon from '@/components/chat/AnimatedLoadingIcon';
import { Send } from 'lucide-react-native';
import { FormEvent, useRef } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';

interface PromptInputProps {
    input: string;
    setInput: (value: string) => void;
    handleSubmit: (e?: FormEvent) => void;
    isLoading?: boolean;
}

export default function PromptInput({ input, setInput, handleSubmit, isLoading }: PromptInputProps) {

    const textInput = useRef<TextInput>(null);

    const looseFocus = () => {
        textInput.current?.blur();
    };

    return <View
        className="p-4 shadow-xl shadow-black bg-slate-50 dark:bg-slate-900 rounded-t-[20px] flex flex-row items-center gap-4">
        <TextInput
            ref={textInput}
            className="flex-1 p-4 rounded-xl dark:placeholder:text-slate-500 dark:text-slate-200"
            placeholder="Message the assistant"
            returnKeyType="send"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={e => {
                handleSubmit(e as unknown as FormEvent);
                e.preventDefault();
            }}
        />
        <TouchableOpacity className="bg-blue-500 dark:bg-blue-400 p-4 rounded-xl disabled:opacity-75 h-14 w-14"
                          disabled={isLoading}
                          onPress={() => {
                              looseFocus();
                              if (input.trim().length > 0)
                                  handleSubmit();
                          }}>
            {isLoading ?
                <AnimatedLoadingIcon size={20} color="white"/>
                :
                <Send size={20} color="white"/>
            }
        </TouchableOpacity>
    </View>;
}
