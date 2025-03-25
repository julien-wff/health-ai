import { Pressable, Text, View } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import type { ReactNode } from 'react';

interface ViewHeaderWithBackProps {
    children?: ReactNode;
}

export default function ViewHeaderWithBack({ children }: ViewHeaderWithBackProps) {
    const router = useRouter();
    const colors = useColors();

    return <View className="flex flex-row items-center gap-2">
        <Pressable className="p-2" onPress={() => router.back()}>
            <ArrowLeft size={24} color={colors.text}/>
        </Pressable>
        <Text className="text-xl font-bold text-slate-900 dark:text-slate-50">
            {children}
        </Text>
    </View>;
}
