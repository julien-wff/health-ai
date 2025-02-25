import '@/assets/style/global.css';
import { useColors } from '@/hooks/useColors';
import { IS_ONBOARDED } from '@/utils/storageKeys';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { Slot, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme, View } from 'react-native';
import { initialize as initializeHealth } from 'react-native-health-connect';

void SplashScreen.preventAutoHideAsync();

export default function Layout() {
    const colorScheme = useColorScheme();
    const colors = useColors();
    const router = useRouter();

    const { getItem: getIsOnboarded } = useAsyncStorage(IS_ONBOARDED);

    async function load() {
        // Set the correct vue
        const isOnboarded = await getIsOnboarded();
        if (isOnboarded)
            router.replace('/chat');
        else
            router.replace('/onboarding');

        // Initialize health
        const healthInitialized = await initializeHealth();
        if (!healthInitialized)
            console.error('Health not initialized');

        // Hide the splash screen
        await SplashScreen.hideAsync();
    }

    useEffect(() => {
        void load();
    }, []);

    return <View>
        <StatusBar style={colorScheme === 'light' ? 'dark' : 'light'}
                   translucent={false}
                   backgroundColor={colors.background}/>
        <Slot/>
    </View>;
}
