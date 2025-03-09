import { useAppState } from '@/hooks/useAppState';
import { useColors } from '@/hooks/useColors';
import { getStoredChats } from '@/utils/chat';
import { hasAllRequiredPermissions, isHealthConnectInstalled, readHealthRecords } from '@/utils/health';
import * as Sentry from '@sentry/react-native';
import { useRouter } from 'expo-router';
import { TriangleAlert } from 'lucide-react-native';
import { usePostHog } from 'posthog-react-native';
import { useEffect, useState } from 'react';
import { AppState, Linking, Text, TouchableOpacity, View } from 'react-native';
import { getGrantedPermissions, initialize as initializeHealth } from 'react-native-health-connect';

export default function InstallHealthConnect() {
    const colors = useColors();
    const { setHasPermissions, isOnboarded, setChats, setHealthRecords } = useAppState();
    const router = useRouter();
    const [ isAppInstalled, setIsAppInstalled ] = useState(false);
    const posthog = usePostHog();

    async function handleInstallClick() {
        posthog.capture('install_health_connect_btn_click');
        await Linking.openURL('https://play.google.com/store/apps/details?id=com.google.android.apps.healthdata');
    }

    async function handleHealthConnectSetup() {
        posthog.capture('health_connect_setup_done');

        // Initialize health
        const healthInitialized = await initializeHealth();
        if (!healthInitialized) {
            Sentry.captureException(new Error('Health not initialized'));
            console.error('Health not initialized');
        }

        // Check for permissions
        const grantedPermissions = await getGrantedPermissions();
        const hasPermissions = hasAllRequiredPermissions(grantedPermissions);
        setHasPermissions(hasPermissions);

        // Redirect to the appropriate screen
        if (isOnboarded && hasPermissions)
            router.replace('/chat');
        else
            router.replace('/onboarding');

        // Load the chats
        const chats = await getStoredChats();
        setChats(chats);

        // Read health data (after hiding the splash screen, faster and not noticeable)
        if (hasPermissions) {
            const records = await readHealthRecords();
            setHealthRecords(records);
        }
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
