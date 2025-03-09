import { useAndroidHealthInit } from '@/hooks/health/useAndroidHealthInit';
import { useAppState } from '@/hooks/useAppState';
import { getStoredChats } from '@/utils/chat';
import { IS_ONBOARDED } from '@/utils/storageKeys';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';

/**
 * Platform-agnostic hook to initialize the app
 * @returns Functions to load state from storage, run health pre-checks, initialize health, and post-initialization
 */
export function useAppInit() {
    const { getItem: getIsOnboardedInStorage } = useAsyncStorage(IS_ONBOARDED);
    const { setIsOnboarded, setChats } = useAppState();
    const androidHealth = useAndroidHealthInit();
    const router = useRouter();

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
                router.replace('/chat');
                healthInitSuccess = true;
                break;
        }

        if (!healthInitSuccess)
            return;

        // Load state from storage
        const chats = await getStoredChats();
        setChats(chats);

        // Load health records
        switch (Platform.OS) {
            case 'android':
                await androidHealth.loadHealthRecords();
                break;
        }
    };

    return {
        loadStateFromStorage,
        initHealthAndAsyncLoadState,
    };
}
