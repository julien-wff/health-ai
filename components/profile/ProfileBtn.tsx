import { Pressable, Text, View } from 'react-native';
import { LucideProps } from 'lucide-react-native';
import { useColors } from '@/hooks/useColors';
import { ForwardRefExoticComponent, ReactNode } from 'react';

interface ResetAppBtnProps {
    onPress?: () => void;
    children?: ReactNode;
    icon: ForwardRefExoticComponent<LucideProps>;
    separator?: boolean;
}

export default function ProfileBtn({ onPress, children, icon: Icon, separator }: ResetAppBtnProps) {
    const colors = useColors();

    return <View className={separator ? 'border-b border-slate-300 dark:border-slate-700' : ''}>
        <Pressable onPress={onPress}
                   className="flex flex-row items-center justify-start p-4 gap-2 rounded-lg active:bg-slate-200 active:dark:bg-slate-800">
            <Icon size={20} color={colors.text}/>
            <Text className="text-slate-900 dark:text-slate-50">
                {children}
            </Text>
        </Pressable>
    </View>;
}
