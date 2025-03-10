import { useAndroidHealthInit } from '@/hooks/helpers/useAndroidHealthInit';
import { useAppState } from '@/hooks/useAppState';
import { useHealthData } from '@/hooks/useHealthData';
import { getStoredChats } from '@/utils/chat';
import { readHealthRecords } from '@/utils/health';
import { IS_ONBOARDED } from '@/utils/storageKeys';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { SplashScreen, useRouter } from 'expo-router';
import { Platform } from 'react-native';

/**
 * Custom React hook to initialize application state and manage health data in a platform-agnostic way.
 *
 * This hook provides two asynchronous functions:
 * - loadStateFromStorage: Retrieves the onboarding status from persistent storage and updates the global application state.
 * - initHealthAndAsyncLoadState: Executes platform-specific health pre-checks and initializes health services. It then navigates the user to the appropriate screen based on onboarding status and permissions, hides the splash screen, loads stored chat data, and, if permissions are granted, updates the state with health records.
 *
 * @returns An object containing the loadStateFromStorage and initHealthAndAsyncLoadState functions.
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
                preCheckSuccess = true;
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
            default:
                console.warn(`Health not supported on ${Platform.OS}`);
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
