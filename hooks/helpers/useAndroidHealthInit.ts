import { useAppState } from '@/hooks/useAppState';
import { hasAllRequiredPermissions, isHealthConnectInstalled } from '@/utils/health/android';
import * as Sentry from '@sentry/react-native';
import { SplashScreen, useRouter } from 'expo-router';
import { getGrantedPermissions, initialize as initializeHealth } from 'react-native-health-connect';

/**
 * Custom React hook that initializes the react-native-health-connect library on Android and manages health permissions.
 *
 * This hook provides two asynchronous functions:
 * - runPreChecks: Checks whether Health Connect is installed. If not, it navigates to the installation page and hides the splash screen.
 * - initAndroidHealth: Attempts to initialize Health Connect, updates the application's permission state based on granted permissions, and logs any initialization failure.
 *
 * @returns An object containing the runPreChecks and initAndroidHealth functions.
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
