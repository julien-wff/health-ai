import { useAppState } from '@/hooks/useAppState';
import { hasAllRequiredPermissions, healthConnect, isHealthConnectInstalled } from '@/utils/health/android';
import * as Sentry from '@sentry/react-native';
import { SplashScreen, useRouter } from 'expo-router';

/**
 * Hook to initialize react-native-health-connect and manage permissions
 * @returns Functions to run pre-checks, initialize health, and load health records
 */
export function useAndroidHealthInit() {
    const { setHasHealthPermissions } = useAppState();
    const router = useRouter();

    const runPreChecks = async () => {
        // Check if health connect is installed
        const healthConnectInstalled = await isHealthConnectInstalled();
        if (!healthConnectInstalled) {
            router.replace('/troubleshoot/install-health-connect');
            await SplashScreen.hideAsync();
            return false;
        }
        return true;
    };

    const initAndroidHealth = async () => {
        // Initialize health connect
        const healthInitialized = await healthConnect!.initialize();
        if (!healthInitialized) {
            console.error('Health not initialized');
            Sentry.captureException(new Error('Health not initialized'));
            return false;
        }

        // Check for permissions
        const grantedPermissions = await healthConnect!.getGrantedPermissions();
        const hasPermissions = hasAllRequiredPermissions(grantedPermissions);
        setHasHealthPermissions(hasPermissions);

        return true;
    };

    return {
        runPreChecks,
        initAndroidHealth,
    };
}
