import { useAppState } from '@/hooks/useAppState';
import { useColors } from '@/hooks/useColors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Trash } from 'lucide-react-native';
import { Pressable, Text } from 'react-native';

export default function ResetAppBtn() {
    const router = useRouter();
    const colors = useColors();
    const { setChats } = useAppState();

    async function resetApp() {
        const keys = await AsyncStorage.getAllKeys();
        await AsyncStorage.multiRemove(keys);
        console.log(`Removed ${keys.length} keys`);
        setChats([]);
        router.replace('/onboarding');
    }

    return <Pressable onPress={resetApp}
                      className="w-full flex flex-row items-center justify-start p-4 gap-2 active:bg-slate-100 active:dark:bg-slate-900">
        <Trash size={20} color={colors.text}/>
        <Text className="text-slate-800 dark:text-slate-200">Reset app</Text>
    </Pressable>;
}
