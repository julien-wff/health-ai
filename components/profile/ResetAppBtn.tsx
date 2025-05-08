import { useAppState } from '@/hooks/useAppState';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Trash } from 'lucide-react-native';
import { Alert, useColorScheme } from 'react-native';
import ProfileBtn from '@/components/profile/ProfileBtn';
import { useTracking } from '@/hooks/useTracking';
import * as Notifications from 'expo-notifications';

export default function ResetAppBtn() {
    const router = useRouter();
    const tracking = useTracking();
    const colorScheme = useColorScheme();
    const { setChats, setGoals } = useAppState();

    function showResetAlert() {
        tracking.event('profile_reset_app_prompt');
        Alert.alert(
            'Reset application',
            'All stored data, chats and settings will be removed. This action cannot be undone.',
            [
                {
                    text: 'Go back',
                    style: 'cancel',
                },
                {
                    text: 'Reset application',
                    onPress: resetApp,
                    style: 'destructive',
                },
            ],
            {
                cancelable: true,
                userInterfaceStyle: colorScheme || 'light',
            },
        );
    }

    async function resetApp() {
        tracking.event('profile_reset_app_confirm');
        const keys = await AsyncStorage.getAllKeys();
        await AsyncStorage.multiRemove(keys);
        console.log(`Removed ${keys.length} keys`);
        setChats([]);
        setGoals([]);
        await Notifications.cancelAllScheduledNotificationsAsync();
        router.replace('/onboarding/health');
    }

    return <ProfileBtn onPress={showResetAlert} icon={Trash}>
        Reset application
    </ProfileBtn>;
}
