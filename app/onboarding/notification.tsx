import ProjectIcon from '@/components/content/ProjectIcon';
import HealthRecord from '@/components/onboarding/HealthRecord';
import { useAppState } from '@/hooks/useAppState';
import { useColors } from '@/hooks/useColors';
import { useHealthData } from '@/hooks/useHealthData';
import { readHealthRecords } from '@/utils/health';
import { hasAllRequiredPermissions, healthConnect, REQUIRED_PERMISSIONS } from '@/utils/health/android';
import { initHealthKit } from '@/utils/health/ios';
import { IS_ONBOARDED } from '@/utils/storageKeys';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Bell, Footprints, Medal, MoonStar } from 'lucide-react-native';
import { useState } from 'react';
import { Linking, Platform, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTracking } from '@/hooks/useTracking';
import * as Notifications from 'expo-notifications'
import { AndroidImportance } from 'expo-notifications';

export default function Notification() {
    const colors = useColors();
    const router = useRouter();
    const tracking = useTracking();

    const { setItem: setIsOnboardedInStorage } = useAsyncStorage(IS_ONBOARDED);
    const { hasPermissions, setHasPermissions, setIsOnboarded } = useAppState();
    const { setHealthRecords } = useHealthData();
    const [ isLoadingPermissions, setIsLoadingPermissions ] = useState(false);

    /**
     * Ask for permissions (if not already granted), continue to the chat screen and fetch health records
     */
    async function handleContinueClick() {
        tracking.event('onboarding_notification_start');
        setIsLoadingPermissions(true);

        await Notifications.setNotificationChannelAsync(
            'default',
            {
                name: 'default',
                importance: AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            }
        );

        const permissionsStatus = await Notifications.requestPermissionsAsync({
            android: {
                allowAlert: true,
                allowBadge: true,
                allowSound: true,
            },
            ios: {
                allowAlert: true,
                allowBadge: true,
                allowSound: true,
            }
        });


        if (permissionsStatus.granted || permissionsStatus.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) {
            tracking.event('onboarding_notification_permission_granted');
            setHasPermissions(true);
            await finishOnboarding();
        } else {
            tracking.event('onboarding_permission_denied');

            // TODO: Check for iOS permissions
            if (!permissionsStatus.canAskAgain) {
                await Linking.openSettings();
            }

        }

        setIsLoadingPermissions(false);
    }

    /**
     * Set isOnboarded to true, save it in storage, redirect to the chat screen and fetch health records
     */
    async function finishOnboarding() {
        tracking.event('onboarding_notification_finish');
        setIsOnboarded(true);
        await setIsOnboardedInStorage('1');
        router.replace('/chat');
    }

    return <SafeAreaView className="flex h-full gap-4 p-4">
        <View className="flex flex-1 justify-center gap-4">
            <View className="mb-4 flex items-center">
                <ProjectIcon className="h-24 w-24"/>
            </View>

            <Text className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                One last step
            </Text>
            <Text className="text-lg text-slate-800 dark:text-slate-200">
                Our assistant will send you tailored notifications to help you stay consistent with your health and wellness goals. Allow notifications to get started.
            </Text>

            <View className="flex flex-row gap-4">
                <HealthRecord icon={Bell} label="Notifications" color={colors.blue} background={colors.indigoBackground}/>
            </View>
        </View>

        <TouchableOpacity
            className="rounded-lg bg-blue-500 p-4 dark:bg-blue-400"
            activeOpacity={.9}
            disabled={isLoadingPermissions}
            onPress={handleContinueClick}>
            <Text className="text-center text-lg font-bold text-white">
                Continue
            </Text>
        </TouchableOpacity>
    </SafeAreaView>;
}
