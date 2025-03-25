import { useHealthData } from '@/hooks/useHealthData';
import { useRouter } from 'expo-router';
import { ReactNode, useEffect } from 'react';
import { Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTracking } from '@/hooks/useTracking';
import ViewHeaderWithBack from '@/components/common/ViewHeaderWithBack';

interface LayoutProps {
    children: ReactNode;
}

export default function TroubleshootLayout({ children }: LayoutProps) {
    const router = useRouter();
    const tracking = useTracking();
    const { empty } = useHealthData();

    useEffect(() => {
        return () => {
            tracking.event('troubleshoot_closed', { resolved: !empty });
        };
    }, []);

    useEffect(() => {
        if (!empty) {
            router.back();
        }
    }, [ empty ]);

    return <SafeAreaView className="flex h-full gap-4 p-4">
        <ViewHeaderWithBack>
            {Platform.select({
                ios: 'HealthKit Troubleshooting',
                android: 'Health Connect Troubleshooting',
            })}
        </ViewHeaderWithBack>

        <ScrollView className="flex-1">
            <View className="flex gap-4">
                {children}
            </View>
        </ScrollView>
    </SafeAreaView>;
}
