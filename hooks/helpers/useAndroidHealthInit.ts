import { useAppState } from '@/hooks/useAppState';
import { hasAllRequiredPermissions, isHealthConnectInstalled } from '@/utils/health/android';
import * as Sentry from '@sentry/react-native';
import { SplashScreen, useRouter } from 'expo-router';
import { getGrantedPermissions, initialize as initializeHealth } from 'react-native-health-connect';

/**
 * Hook to initialize react-native-health-connect and manage permissions
 * @returns Functions to run pre-checks, initialize health, and load health records
 */
export function useAndroidHealthInit() {
    const { setHasPermissions } = useAppState();
    const router = useRouter();

    const runPreChecks = async () => {
        // Check if health connect is installed
        const healthConnectInstalled = await isHealthConnectInstalled();
        if (!healthConnectInstalled) {
            router.replace('/install-health-connect');
            await SplashScreen.hideAsync();
            return false;
        }
        return true;
    };

    const initAndroidHealth = async () => {
        // Initialize health connect
        const healthInitialized = await initializeHealth();
        if (!healthInitialized) {
            console.error('Health not initialized');
            Sentry.captureException(new Error('Health not initialized'));
            return false;
        }

        // Check for permissions
        const grantedPermissions = await getGrantedPermissions();
        const hasPermissions = hasAllRequiredPermissions(grantedPermissions);
        setHasPermissions(hasPermissions);

        return true;
    };

    return {
        runPreChecks,
        initAndroidHealth,
    };
}
