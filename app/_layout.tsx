import '@/utils/polyfills';
import '@/assets/style/global.css';
import { useAppState } from '@/hooks/useAppState';
import { useColors } from '@/hooks/useColors';
import { getStoredChats } from '@/utils/chat';
import { hasAllRequiredPermissions, isHealthConnectInstalled, readHealthRecords } from '@/utils/health';
import { IS_ONBOARDED } from '@/utils/storageKeys';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import * as Sentry from '@sentry/react-native';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isBetween from 'dayjs/plugin/isBetween';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Slot, useNavigationContainerRef, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { setBackgroundColorAsync } from 'expo-system-ui';
import { PostHogProvider } from 'posthog-react-native';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { getGrantedPermissions, initialize as initializeHealth } from 'react-native-health-connect';

const navigationIntegration = Sentry.reactNavigationIntegration({
    // Only in native builds, not in Expo Go.
    enableTimeToInitialDisplay: Constants.executionEnvironment === ExecutionEnvironment.StoreClient,
});

Sentry.init({
    dsn: 'https://c8b3098796768b3d7e8e11f08b34535a@o796186.ingest.us.sentry.io/4508925967073280',
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    tracesSampleRate: 1.0,
    enableNativeFramesTracking: Constants.executionEnvironment === ExecutionEnvironment.StoreClient,
    integrations: [
        Sentry.mobileReplayIntegration({
            maskAllImages: false,
            maskAllText: false,
            maskAllVectors: false,
        }),
        navigationIntegration,
        Sentry.reactNativeTracingIntegration(),
    ],
});

dayjs.extend(duration);
dayjs.extend(isBetween);
void SplashScreen.preventAutoHideAsync();


export default Sentry.wrap(Layout);

function Layout() {
    const colorScheme = useColorScheme();
    const colors = useColors();
    const router = useRouter();

    const ref = useNavigationContainerRef();

    useEffect(() => {
        if (ref) {
            navigationIntegration.registerNavigationContainer(ref);
        }
    }, [ ref ]);

    const { getItem: getIsOnboardedInStorage } = useAsyncStorage(IS_ONBOARDED);
    const { setIsOnboarded, setHasPermissions, setHealthRecords, setChats } = useAppState();

    /**
     * Check onboarding status, health permissions, redirect to the appropriate screen
     */
    async function load() {
        // Check onboarding status
        const isOnboarded = await getIsOnboardedInStorage();
        setIsOnboarded(!!isOnboarded);

        // Check if health connect is initialized
        if (!await isHealthConnectInstalled()) {
            router.replace('/install-health-connect');
            await SplashScreen.hideAsync();
            return;
        }

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

        // Hide the splash screen
        await SplashScreen.hideAsync();

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
        void load();
    }, []);

    useEffect(() => {
        void setBackgroundColorAsync(colors.background);
    }, [ colors.background ]);

    const result = <GestureHandlerRootView>
        <StatusBar style={colorScheme === 'light' ? 'dark' : 'light'}
                   translucent={false}
                   backgroundColor={colors.background}/>
        <Slot/>
    </GestureHandlerRootView>;

    if (process.env.EXPO_PUBLIC_POSTHOG_AUTH_TOKEN)
        return <PostHogProvider apiKey={process.env.EXPO_PUBLIC_POSTHOG_AUTH_TOKEN}
                                options={{ host: 'https://eu.i.posthog.com' }}>
            {result}
        </PostHogProvider>;
    return result;
}
