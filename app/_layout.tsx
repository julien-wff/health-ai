import '@/utils/polyfills';
import '@/assets/style/global.css';
import { useAppState } from '@/hooks/useAppState';
import { useColors } from '@/hooks/useColors';
import { hasAllRequiredPermissions, readHealthRecords } from '@/utils/health';
import { IS_ONBOARDED } from '@/utils/storageKeys';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isBetween from 'dayjs/plugin/isBetween';
import { Slot, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { setBackgroundColorAsync } from 'expo-system-ui';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { getGrantedPermissions, initialize as initializeHealth } from 'react-native-health-connect';

dayjs.extend(duration);
dayjs.extend(isBetween);
void SplashScreen.preventAutoHideAsync();

export default function Layout() {
    const colorScheme = useColorScheme();
    const colors = useColors();
    const router = useRouter();

    const { getItem: getIsOnboardedInStorage } = useAsyncStorage(IS_ONBOARDED);
    const { setIsOnboarded, setHasPermissions, setHealthRecords } = useAppState();

    /**
     * Check onboarding status, health permissions, redirect to the appropriate screen
     */
    async function load() {
        // Check onboarding status
        const isOnboarded = await getIsOnboardedInStorage();
        setIsOnboarded(!!isOnboarded);

        // Initialize health
        const healthInitialized = await initializeHealth();
        if (!healthInitialized)
            console.error('Health not initialized');

        // Check for permissions
        const grantedPermissions = await getGrantedPermissions();
        const hasPermissions = hasAllRequiredPermissions(grantedPermissions);
        setHasPermissions(hasPermissions);

        // Redirect to the appropriate screen
        if (isOnboarded && hasPermissions)
            router.replace('/chat');
        else
            router.replace('/onboarding');

        // Hide the splash screen
        await SplashScreen.hideAsync();

        // Read health data (after hiding the splash screen, faster and not noticeable)
        if (hasPermissions) {
            const records = await readHealthRecords();
            setHealthRecords(records);
        }
    }

    useEffect(() => {
        void load();
    }, []);

    useEffect(() => {
        void setBackgroundColorAsync(colors.background);
    }, [ colors.background ]);

    return <GestureHandlerRootView>
        <StatusBar style={colorScheme === 'light' ? 'dark' : 'light'}
                   translucent={false}
                   backgroundColor={colors.background}/>
        <Slot/>
    </GestureHandlerRootView>;
}
