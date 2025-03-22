import { Text, View } from 'react-native';
import type { ReactNode } from 'react';

interface TroubleshootingStepProps {
    title: string;
    index: number;
    children?: ReactNode;
}

export default function TroubleshootingStep({ title, index, children }: TroubleshootingStepProps) {
    return <View>
        <View className="mb-1 flex flex-row items-center gap-2">
            <View className="h-8 w-8 items-center justify-center rounded-full bg-blue-600 dark:bg-blue-300">
                <Text className="font-bold text-slate-50 dark:text-slate-950">{index}</Text>
            </View>

            <Text className="text-lg font-bold text-slate-800 dark:text-slate-200">
                {title}
            </Text>
        </View>

        {children}
    </View>;
}
