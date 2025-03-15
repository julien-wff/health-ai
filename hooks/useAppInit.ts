import { useAndroidHealthInit } from '@/hooks/helpers/useAndroidHealthInit';
import { useAppState } from '@/hooks/useAppState';
import { useHealthData } from '@/hooks/useHealthData';
import { getStoredChats } from '@/utils/chat';
import { readHealthRecords } from '@/utils/health';
import { isHealthKitAvailable } from '@/utils/health/ios';
import { IS_ONBOARDED } from '@/utils/storageKeys';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { SplashScreen, useRouter } from 'expo-router';
import { Platform } from 'react-native';

/**
 * Platform-agnostic hook to initialize the app
 * @returns Functions to load state from storage, run health pre-checks, initialize health, and post-initialization
 */
export function useAppInit() {
    const { getItem: getIsOnboardedInStorage } = useAsyncStorage(IS_ONBOARDED);
    const { setIsOnboarded, setChats, setHasPermissions } = useAppState();
    const androidHealth = useAndroidHealthInit();
    const router = useRouter();
    const { setHealthRecords } = useHealthData();

    /**
     * Get saved state from async storage and load in global app store
     */
    const loadStateFromStorage = async () => {
        const isOnboarded = await getIsOnboardedInStorage();
        setIsOnboarded(!!isOnboarded);
    };

    /**
     * Initialize health and load state from storage.
     * Redirects the user to the appropriate screen based on the state.
     * This function can be called multiple times, after a pre-check has been done.
     */
    const initHealthAndAsyncLoadState = async () => {
        // Pre-checks
        let preCheckSuccess: boolean;
        switch (Platform.OS) {
            case 'android':
                preCheckSuccess = await androidHealth.runPreChecks();
                break;
            default:
                preCheckSuccess = await isHealthKitAvailable();
                break;
        }

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

        if (!healthInitSuccess) {
            await SplashScreen.hideAsync();
            return;
        }

        // Redirect to the appropriate screen
        if (useAppState.getState().isOnboarded && useAppState.getState().hasPermissions)
            router.replace('/chat');
        else
            router.replace('/onboarding');

        // Hide the splash screen
        await SplashScreen.hideAsync();

        // Load state from storage
        const chats = await getStoredChats();
        setChats(chats);

        // Load health records
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
