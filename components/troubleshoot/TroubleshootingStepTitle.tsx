import { Text, View } from 'react-native';

interface TroubleshootingStepTitleProps {
    title: string;
    index: number;
}

export default function TroubleshootingStepTitle({ title, index }: TroubleshootingStepTitleProps) {
    return <View className="flex flex-row items-center gap-2">
        <View className="w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-300 items-center justify-center">
            <Text className="text-slate-50 dark:text-slate-950 font-bold">{index}</Text>
        </View>

        <Text className="text-slate-800 dark:text-slate-200 text-lg font-bold">
            {title}
        </Text>
    </View>;
}
