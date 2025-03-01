import { Send } from 'lucide-react-native';
import { ChangeEvent, FormEvent, useRef } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';

interface PromptInputProps {
    input: string;
    handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e?: FormEvent) => void;
}

export default function PromptInput({ input, handleInputChange, handleSubmit }: PromptInputProps) {

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
            onChange={e =>
                handleInputChange({
                    ...e,
                    target: {
                        ...e.target,
                        value: e.nativeEvent.text,
                    },
                } as unknown as ChangeEvent<HTMLInputElement>)
            }
            onSubmitEditing={e => {
                handleSubmit(e as unknown as FormEvent);
                e.preventDefault();
            }}
        />
        <TouchableOpacity onPress={() => {
            if (input.trim().length > 0)
                handleSubmit();
            else
                looseFocus();
        }}>
            <View className="bg-blue-500 dark:bg-blue-400 p-4 rounded-xl">
                <Send size={20} color="white"/>
            </View>
        </TouchableOpacity>
    </View>;
}