import '@/utils/polyfills';
import '@/assets/style/global.css';
import { useAppInit } from '@/hooks/useAppInit';
import { useColors } from '@/hooks/useColors';
import * as Sentry from '@sentry/react-native';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isBetween from 'dayjs/plugin/isBetween';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Slot, useNavigationContainerRef } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { setBackgroundColorAsync } from 'expo-system-ui';
import { PostHog, PostHogProvider } from 'posthog-react-native';
import { useEffect } from 'react';
import { useColorScheme, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

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
            maskAllText: false,
            maskAllVectors: false,
        }),
        navigationIntegration,
        Sentry.reactNativeTracingIntegration(),
    ],
});

let posthogClient: PostHog | null = null;
if (process.env.EXPO_PUBLIC_POSTHOG_AUTH_TOKEN) {
    posthogClient = new PostHog(process.env.EXPO_PUBLIC_POSTHOG_AUTH_TOKEN, {
        host: 'https://eu.i.posthog.com',
    });
}

dayjs.extend(duration);
dayjs.extend(isBetween);
void SplashScreen.preventAutoHideAsync();


export default Sentry.wrap(Layout);

function Layout() {
    const colorScheme = useColorScheme();
    const colors = useColors();
    const { loadStateFromStorage, initHealthAndAsyncLoadState } = useAppInit();

    const ref = useNavigationContainerRef();

    useEffect(() => {
        if (ref) {
            navigationIntegration.registerNavigationContainer(ref);
        }
    }, [ ref ]);

    useEffect(() => {
        if (posthogClient)
            void posthogClient.register({
                $dev: process.env.NODE_ENV === 'development',
            });

        // Load application data and switch views
        (async () => {
            await loadStateFromStorage();
            await initHealthAndAsyncLoadState();
        })();
    }, []);

    useEffect(() => {
        void setBackgroundColorAsync(colors.background);
    }, [ colors.background ]);

    const result = <GestureHandlerRootView>
        <StatusBar style={colorScheme === 'light' ? 'dark' : 'light'}
                   translucent={false}
                   backgroundColor={colors.background}/>
        <View className="h-full bg-slate-50 dark:bg-slate-950">
            <Slot/>
        </View>
    </GestureHandlerRootView>;

    if (posthogClient)
        return <PostHogProvider client={posthogClient}
                                autocapture={{
                                    captureScreens: true,
                                    captureLifecycleEvents: true,
                                    captureTouches: true,
                                }}>
            {result}
        </PostHogProvider>;
    return result;
}
