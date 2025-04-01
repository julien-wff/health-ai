import { Text, TouchableOpacity, View } from 'react-native';
import { LucideProps } from 'lucide-react-native';
import { ForwardRefExoticComponent } from 'react';

export interface ConversationStarterProps {
    title: string;
    prompt: string;
    icon: ForwardRefExoticComponent<LucideProps>;
    iconColor: string;
    onClick?: (prompt: string) => void;
}

export default function ConversationStarter({
                                                title,
                                                prompt,
                                                icon: Icon,
                                                iconColor,
                                                onClick,
                                            }: Readonly<ConversationStarterProps>) {
    return <TouchableOpacity activeOpacity={.5} onPress={() => onClick?.(prompt)}>
        <View
            className="flex flex-row gap-1 items-center p-2 border border-slate-300 dark:border-slate-600 rounded-full">
            <Icon color={iconColor}/>
            <Text className="text-slate-500 dark:text-slate-400">{title}</Text>
        </View>
    </TouchableOpacity>;
}
