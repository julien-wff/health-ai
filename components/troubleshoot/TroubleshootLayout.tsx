import { SafeAreaView } from 'react-native-safe-area-context';
import type { ReactNode } from 'react';
import { Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useColors } from '@/hooks/useColors';

interface LayoutProps {
    children: ReactNode;
}

export default function TroubleshootLayout({ children }: LayoutProps) {
    const router = useRouter();
    const colors = useColors();

    return <SafeAreaView className="p-4 flex gap-4 h-full">
        <View className="flex items-center gap-2 flex-row">
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
