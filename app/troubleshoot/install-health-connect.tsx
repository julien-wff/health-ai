import { useAppInit } from '@/hooks/useAppInit';
import { useColors } from '@/hooks/useColors';
import { isHealthConnectInstalled } from '@/utils/health/android';
import { TriangleAlert } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { AppState, Linking, Text, TouchableOpacity, View } from 'react-native';
import { useTracking } from '@/hooks/useTracking';

export default function InstallHealthConnect() {
    const colors = useColors();
    const { initHealthAndAsyncLoadState } = useAppInit();
    const [ isAppInstalled, setIsAppInstalled ] = useState(false);
    const tracking = useTracking();

    async function handleInstallClick() {
        tracking.event('install_health_connect_btn_click');
        await Linking.openURL('https://play.google.com/store/apps/details?id=com.google.android.apps.healthdata');
    }

    async function handleHealthConnectSetup() {
        tracking.event('install_health_connect_setup_done');
        await initHealthAndAsyncLoadState();
    }

    useEffect(() => {
        const subscription = AppState.addEventListener('change', () => {
            isHealthConnectInstalled().then(setIsAppInstalled);
        });

        return () => subscription.remove();
    }, []);

    return <View className="flex min-h-screen gap-4 bg-slate-50 p-4 dark:bg-slate-950">
        <View className="flex flex-1 justify-center gap-4">
            <View className="mb-4 flex items-center">
                <TriangleAlert color={colors.red} size={96}/>
            </View>

            <Text className="text-2xl font-bold text-slate-800 dark:text-slate-200">
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
                className="rounded-lg bg-blue-500 p-4 dark:bg-blue-400"
                activeOpacity={.9}
                onPress={handleInstallClick}>
                <Text className="text-center text-lg font-bold text-white">
                    Install on Play Store
                </Text>
            </TouchableOpacity>
            :
            <TouchableOpacity
                className="rounded-lg bg-green-500 p-4 dark:bg-green-400"
                activeOpacity={.9}
                onPress={handleHealthConnectSetup}>
                <Text className="text-center text-lg font-bold text-white">
                    Health Connect configured!
                </Text>
            </TouchableOpacity>
        }
    </View>;
}
