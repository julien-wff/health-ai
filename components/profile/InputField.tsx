import { Text, TextInput, TextInputProps, TouchableOpacity } from 'react-native';
import { useRef } from 'react';

interface InputFieldProps {
    label: string;
    separator?: boolean;
    inputProps?: TextInputProps;
}

export default function InputField({ label, separator, inputProps }: InputFieldProps) {
    const inputRef = useRef<TextInput>(null);

    return <TouchableOpacity onPress={() => inputRef.current?.focus()}
                             className={`p-4 ${separator ? 'border-b border-slate-300 dark:border-slate-700' : ''}`}>
        <Text className="font-bold text-slate-900 dark:text-slate-50">{label}</Text>
        <TextInput ref={inputRef}
                   className="text-blue-600 dark:text-blue-500 mt-2"
                   returnKeyType="done"
                   maxLength={64}
                   enterKeyHint="done"
                   {...inputProps}/>
    </TouchableOpacity>;
}
