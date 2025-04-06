import { useAndroidHealthInit } from '@/hooks/helpers/useAndroidHealthInit';
import { useAppState } from '@/hooks/useAppState';
import { useHealthData } from '@/hooks/useHealthData';
import { getStoredChats } from '@/utils/chat';
import { readHealthRecords } from '@/utils/health';
import { isHealthKitAvailable } from '@/utils/health/ios';
import { HAS_DEBUG_ACCESS, IS_ONBOARDED } from '@/utils/storageKeys';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { SplashScreen, useRouter } from 'expo-router';
import { Platform } from 'react-native';
import * as Sentry from '@sentry/react-native';

/**
 * Platform-agnostic hook to initialize the app
 * @returns Functions to load state from storage, run health pre-checks, initialize health, and post-initialization
 */
export function useAppInit() {
    const { getItem: getIsOnboardedInStorage } = useAsyncStorage(IS_ONBOARDED);
    const { getItem: getHasDebugAccessInStorage } = useAsyncStorage(HAS_DEBUG_ACCESS);
    const { setIsOnboarded, setChats, setHasPermissions, setHasDebugAccess } = useAppState();
    const androidHealth = useAndroidHealthInit();
    const router = useRouter();
    const { setHealthRecords } = useHealthData();

    /**
     * Get saved state from async storage and load in global app store
     */
    const loadStateFromStorage = async () => {
        const isOnboarded = await getIsOnboardedInStorage();
        setIsOnboarded(!!isOnboarded);
        const hasDebugAccess = await getHasDebugAccessInStorage();
        setHasDebugAccess(!!hasDebugAccess);
        Sentry.captureEvent({ event_id: 'init_set_onboarded', level: 'info', extra: { isOnboarded, hasDebugAccess } });
    };

    /**
     * Initialize health and load state from storage.
     * Redirects the user to the appropriate screen based on the state.
     * This function can be called multiple times, after a pre-check has been done.
     */
    const initHealthAndAsyncLoadState = async () => {
        // Pre-checks
        Sentry.captureEvent({ event_id: 'init_health_precheck_start', level: 'info' });
        let preCheckSuccess: boolean;
        switch (Platform.OS) {
            case 'android':
                preCheckSuccess = await androidHealth.runPreChecks();
                break;
            default:
                preCheckSuccess = await isHealthKitAvailable();
                break;
        }

        Sentry.captureEvent({ event_id: 'init_health_precheck_end', level: 'info', extra: { preCheckSuccess } });
        if (!preCheckSuccess)
            return;

        // Health initialization
        let healthInitSuccess: boolean;
        switch (Platform.OS) {
            case 'android':
                healthInitSuccess = await androidHealth.initAndroidHealth();
                break;
            case 'ios':
                // Only necessary during onboarding
                setHasPermissions(useAppState.getState().isOnboarded);
                healthInitSuccess = true;
                break;
            default:
                console.warn(`Health init not supported on ${Platform.OS}`);
                setHasPermissions(true);
                healthInitSuccess = true;
                break;
        }

        Sentry.captureEvent({ event_id: 'init_health_init_end', level: 'info', extra: { healthInitSuccess } });
        if (!healthInitSuccess) {
            await SplashScreen.hideAsync();
            return;
        }

        // Redirect to the appropriate screen
        if (useAppState.getState().isOnboarded && useAppState.getState().hasPermissions)
            router.replace('/chat');
        else
            router.replace('/onboarding/health');

        // Hide the splash screen
        await SplashScreen.hideAsync();

        // Load state from storage
        Sentry.captureEvent({ event_id: 'init_load_state_start', level: 'info' });
        const chats = await getStoredChats();
        setChats(chats);
        Sentry.captureEvent({ event_id: 'init_load_state_end', level: 'info', extra: { count: chats.length } });

        // Load health records
        Sentry.captureEvent({ event_id: 'init_load_health_data_start', level: 'info' });
        if (useAppState.getState().hasPermissions) {
            const healthRecords = await readHealthRecords();
            setHealthRecords(healthRecords);
        }
    };

    return {
        loadStateFromStorage,
        initHealthAndAsyncLoadState,
    };
}
