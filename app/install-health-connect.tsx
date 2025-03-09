import { useAppInit } from '@/hooks/useAppInit';
import { useColors } from '@/hooks/useColors';
import { isHealthConnectInstalled } from '@/utils/health/android';
import { TriangleAlert } from 'lucide-react-native';
import { usePostHog } from 'posthog-react-native';
import { useEffect, useState } from 'react';
import { AppState, Linking, Text, TouchableOpacity, View } from 'react-native';

export default function InstallHealthConnect() {
    const colors = useColors();
    const { initHealthAndAsyncLoadState } = useAppInit();
    const [ isAppInstalled, setIsAppInstalled ] = useState(false);
    const posthog = usePostHog();

    async function handleInstallClick() {
        posthog.capture('install_health_connect_btn_click');
        await Linking.openURL('https://play.google.com/store/apps/details?id=com.google.android.apps.healthdata');
    }

    async function handleHealthConnectSetup() {
        posthog.capture('health_connect_setup_done');
        await initHealthAndAsyncLoadState();
    }

    useEffect(() => {
        const subscription = AppState.addEventListener('change', () => {
            isHealthConnectInstalled().then(setIsAppInstalled);
        });

        return () => subscription.remove();
    }, []);

    return <View className="min-h-screen flex gap-4 p-4 bg-slate-50 dark:bg-slate-950">
        <View className="flex-1 flex justify-center gap-4">
            <View className="flex items-center mb-4">
                <TriangleAlert color={colors.red} size={96}/>
            </View>

            <Text className="text-slate-800 dark:text-slate-200 text-2xl font-bold">
                Health connect needed!
            </Text>

            <Text className="text-slate-800 dark:text-slate-200">
                In order for this app to work, you need to have
                {' '}<Text className="font-bold">Health Connect</Text>{' '}
                installed and configured.
            </Text>

            <Text className="text-slate-800 dark:text-slate-200">
                First, install it from the Play Store.
            </Text>

            <Text className="text-slate-800 dark:text-slate-200">
                Then, open it, and give
                {' '}<Text className="font-bold">App Permissions</Text>{' '}
                to a health data provider of your choice (e.g. Google Fit, Samsung Health, Garmin).
            </Text>

            <Text className="text-slate-800 dark:text-slate-200">
                Once it's done, open this app again.
            </Text>
        </View>

        {!isAppInstalled ?
            <TouchableOpacity
                className="bg-blue-500 dark:bg-blue-400 p-4 rounded-lg"
                activeOpacity={.9}
                onPress={handleInstallClick}>
                <Text className="text-white font-bold text-lg text-center">
                    Install on Play Store
                </Text>
            </TouchableOpacity>
            :
            <TouchableOpacity
                className="bg-green-500 dark:bg-green-400 p-4 rounded-lg"
                activeOpacity={.9}
                onPress={handleHealthConnectSetup}>
                <Text className="text-white font-bold text-lg text-center">
                    Health Connect configured!
                </Text>
            </TouchableOpacity>
        }
    </View>;
}
