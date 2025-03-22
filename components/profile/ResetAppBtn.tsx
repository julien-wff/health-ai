import { useAppState } from '@/hooks/useAppState';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Trash } from 'lucide-react-native';
import { usePostHog } from 'posthog-react-native';
import { Alert, useColorScheme } from 'react-native';
import ProfileBtn from '@/components/profile/ProfileBtn';

export default function ResetAppBtn() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const { setChats } = useAppState();
    const posthog = usePostHog();

    function showResetAlert() {
        posthog.capture('reset_app_prompt');
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
        posthog.capture('reset_app');
        const keys = await AsyncStorage.getAllKeys();
        await AsyncStorage.multiRemove(keys);
        console.log(`Removed ${keys.length} keys`);
        setChats([]);
        router.replace('/onboarding');
    }

    return <ProfileBtn onPress={showResetAlert} icon={Trash}>
        Reset application
    </ProfileBtn>;
}
