import { useColors } from '@/hooks/useColors';
import { useHealthData } from '@/hooks/useHealthData';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { ReactNode, useEffect } from 'react';
import { Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface LayoutProps {
    children: ReactNode;
}

export default function TroubleshootLayout({ children }: LayoutProps) {
    const router = useRouter();
    const colors = useColors();
    const { empty } = useHealthData();

    useEffect(() => {
        if (!empty)
            router.back();
    }, [ empty ]);

    return <SafeAreaView className="flex h-full gap-4 p-4">
        <View className="flex flex-row items-center gap-2">
            <Pressable className="p-2" onPress={() => router.back()}>
                <ArrowLeft size={24} color={colors.text}/>
            </Pressable>
            <Text className="text-xl font-bold text-slate-900 dark:text-slate-50">
                {Platform.select({
                    ios: 'HealthKit Troubleshooting',
                    android: 'Health Connect Troubleshooting',
                })}
            </Text>
        </View>

        <ScrollView className="flex-1">
            <View className="flex gap-4">
                {children}
            </View>
        </ScrollView>
    </SafeAreaView>;
}
