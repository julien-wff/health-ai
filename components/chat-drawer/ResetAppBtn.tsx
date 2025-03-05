import { useAppState } from '@/hooks/useAppState';
import { useColors } from '@/hooks/useColors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Trash } from 'lucide-react-native';
import { Alert, Pressable, Text, useColorScheme } from 'react-native';

export default function ResetAppBtn() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const colors = useColors();
    const { setChats } = useAppState();

    function showResetAlert() {
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
        const keys = await AsyncStorage.getAllKeys();
        await AsyncStorage.multiRemove(keys);
        console.log(`Removed ${keys.length} keys`);
        setChats([]);
        router.replace('/onboarding');
    }

    return <Pressable onPress={showResetAlert}
                      className="flex flex-row items-center justify-start p-4 m-4 gap-2 rounded-lg active:bg-slate-200 active:dark:bg-slate-800">
        <Trash size={20} color={colors.text}/>
        <Text className="text-slate-800 dark:text-slate-200">Reset application</Text>
    </Pressable>;
}
