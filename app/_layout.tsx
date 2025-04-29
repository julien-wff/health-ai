import '@/utils/polyfills';
import '@/assets/style/global.css';
import { useAppInit } from '@/hooks/useAppInit';
import { useAppState } from '@/hooks/useAppState';
import { useColors } from '@/hooks/useColors';
import { useHealthData } from '@/hooks/useHealthData';
import { readHealthRecords } from '@/utils/health';
import * as Sentry from '@sentry/react-native';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isBetween from 'dayjs/plugin/isBetween';
import relativeTime from 'dayjs/plugin/relativeTime';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Stack, useNavigationContainerRef, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { setBackgroundColorAsync } from 'expo-system-ui';
import { PostHog, PostHogProvider } from 'posthog-react-native';
import { useEffect, useRef } from 'react';
import { AppState, NativeEventSubscription, Platform, useColorScheme, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Notifications from 'expo-notifications';
import { createNotificationChannels } from '@/utils/local-notification';

const navigationIntegration = Sentry.reactNavigationIntegration({
    // Only in native builds, not in Expo Go.
    enableTimeToInitialDisplay: Constants.executionEnvironment === ExecutionEnvironment.StoreClient,
});

Sentry.init({
    dsn: 'https://c8b3098796768b3d7e8e11f08b34535a@o796186.ingest.us.sentry.io/4508925967073280',
    replaysOnErrorSampleRate: 1.0,
    tracesSampleRate: 1.0,
    enabled: process.env.NODE_ENV !== 'development',
    enableNativeFramesTracking: Constants.executionEnvironment === ExecutionEnvironment.StoreClient,
    integrations: [
        Sentry.mobileReplayIntegration({
            maskAllImages: false,
            maskAllText: true,
            maskAllVectors: false,
        }),
        navigationIntegration,
        Sentry.reactNativeTracingIntegration(),
    ],
});

const posthogClient = new PostHog('phc_nDWFGdgxDYou6EFbpgmkVJRwpOv1Izk218FwFa5ksOT', {
    host: 'https://eu.i.posthog.com',
    persistence: [ 'ios', 'android' ].includes(Platform.OS) ? 'file' : 'memory',
});

dayjs.extend(duration);
dayjs.extend(isBetween);
dayjs.extend(relativeTime);
void SplashScreen.preventAutoHideAsync();

// Set the handler that will cause the notification to show the alert
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

export default Sentry.wrap(Layout);

function Layout() {
    const colorScheme = useColorScheme();
    const colors = useColors();
    const { loadStateFromStorage, initHealthAndAsyncLoadState } = useAppInit();
    const { hasHealthPermissions, setNotificationClickPrompt } = useAppState();
    const { setHealthRecords } = useHealthData();
    const router = useRouter();

    const ref = useNavigationContainerRef();

    useEffect(() => {
        if (ref) {
            navigationIntegration.registerNavigationContainer(ref);
        }
    }, [ ref ]);

    // Handle the click of a notification if the app is already open
    const notificationResponseListener = useRef<Notifications.EventSubscription>();
    useEffect(() => {
        notificationResponseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            const { data } = response.notification.request.content;
            setNotificationClickPrompt(data.userPrompt ?? null);
            router.replace('/chat');
        });

        return () => {
            if (notificationResponseListener.current) {
                Notifications.removeNotificationSubscription(notificationResponseListener.current);
            }
        };
    }, []);

    useEffect(() => {
        if (posthogClient)
            void posthogClient.register({
                $dev: process.env.NODE_ENV === 'development',
            });

        // Load application data and switch views
        let subscription: NativeEventSubscription;
        (async () => {
            await loadStateFromStorage();
            await initHealthAndAsyncLoadState();
            Sentry.captureEvent({ event_id: 'layout_state_loaded', level: 'info' });

            // Reload health data when the app comes back from background
            subscription = AppState.addEventListener('change', () => {
                if (!hasHealthPermissions || AppState.currentState !== 'active')
                    return;

                Sentry.captureEvent({ event_id: 'layout_state_health_data_update_start', level: 'info' });
                readHealthRecords()
                    .then(setHealthRecords)
                    .then(() => Sentry.captureEvent({ event_id: 'layout_state_health_data_updated', level: 'info' }));
            });
        })();

        return () => subscription?.remove();
    }, []);

    useEffect(() => {
        void setBackgroundColorAsync(colors.background);
    }, [ colors.background ]);

    // Initialize notification channels
    useEffect(() => {
        createNotificationChannels();
    }, []);

    return <PostHogProvider client={posthogClient}
                            autocapture={{
                                captureScreens: true,
                                captureLifecycleEvents: true,
                                captureTouches: true,
                            }}>
        <GestureHandlerRootView>
            <StatusBar style={colorScheme === 'light' ? 'dark' : 'light'}
                       translucent={false}
                       backgroundColor={colors.background}/>
            <Stack screenOptions={{ headerShown: false, animation: 'none' }}
                   screenLayout={({ children }) =>
                       <View className="h-full bg-slate-50 dark:bg-slate-950">{children}</View>
                   }>
                {/* Following screens have in and out animations, while all the others don't */}
                <Stack.Screen name="troubleshoot/index" options={{ animation: 'default' }}/>
                <Stack.Screen name="profile" options={{ animation: 'default' }}/>
                <Stack.Screen name="advanced-debug" options={{ animation: 'default' }}/>
            </Stack>
        </GestureHandlerRootView>
    </PostHogProvider>;
}
