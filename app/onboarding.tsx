import HealthRecord from '@/components/onboarding/HealthRecord';
import { useAppState } from '@/hooks/useAppState';
import { useColors } from '@/hooks/useColors';
import { hasAllRequiredPermissions, readHealthRecords, REQUIRED_PERMISSIONS } from '@/utils/health';
import { IS_ONBOARDED } from '@/utils/storageKeys';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Footprints, Medal, MoonStar } from 'lucide-react-native';
import { useState } from 'react';
import { Image, Text, ToastAndroid, TouchableOpacity, useColorScheme, View } from 'react-native';
import { requestPermission } from 'react-native-health-connect';

export default function Onboarding() {
    const colorScheme = useColorScheme();
    const colors = useColors();
    const router = useRouter();

    const { setItem: setIsOnboardedInStorage } = useAsyncStorage(IS_ONBOARDED);
    const { hasPermissions, setHasPermissions, setIsOnboarded, setHealthRecords } = useAppState();
    const [ isLoadingPermissions, setIsLoadingPermissions ] = useState(false);

    /**
     * Ask for permissions (if not already granted), continue to the chat screen and fetch health records
     */
    async function handleContinueClick() {
        setIsLoadingPermissions(true);

        if (hasPermissions) {
            await finishOnboarding();
            return;
        }

        ToastAndroid.show('Please allow all...', ToastAndroid.SHORT);
        const permissions = await requestPermission(REQUIRED_PERMISSIONS);
        if (hasAllRequiredPermissions(permissions)) {
            setHasPermissions(true);
            await finishOnboarding();
        } else {
            ToastAndroid.show('Missing permissions', ToastAndroid.SHORT);
        }

        setIsLoadingPermissions(false);
    }

    /**
     * Set isOnboarded to true, save it in storage, redirect to the chat screen and fetch health records
     */
    async function finishOnboarding() {
        setIsOnboarded(true);
        await setIsOnboardedInStorage('1');
        router.replace('/chat');
        const healthRecords = await readHealthRecords();
        setHealthRecords(healthRecords);
    }

    return <View className="min-h-screen flex gap-4 p-4 bg-slate-50 dark:bg-slate-950">
        <View className="flex-1 flex justify-center gap-4">
            <View className="flex items-center mb-4">
                {colorScheme === 'dark'
                    ? <Image source={require('@/assets/icons/splash-icon-dark.png')}
                             resizeMode="contain"
                             className="w-24 h-24"/>
                    : <Image source={require('@/assets/icons/splash-icon.png')}
                             resizeMode="contain"
                             className="w-24 h-24"/>
                }
            </View>

            <Text className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                Welcome to your Health Chatbot
            </Text>
            <Text className="text-lg text-slate-800 dark:text-slate-200">
                In order to provide recommandations, we need to access the following health records from your device:
            </Text>

            <View className="flex flex-row gap-4">
                <HealthRecord icon={Footprints} label="Steps" color={colors.green} background={colors.greenBackground}/>
                <HealthRecord icon={MoonStar} label="Sleep" color={colors.indigo} background={colors.indigoBackground}/>
                <HealthRecord icon={Medal} label="Activity" color={colors.red} background={colors.redBackground}/>
            </View>

            <Text className="text-lg text-slate-800 dark:text-slate-200 mt-4">
                If you continue, you accept that these personal records will be anonymously shared with Google Gemini
                via the LLM.
            </Text>
        </View>

        <TouchableOpacity
            className="bg-blue-500 dark:bg-blue-400 p-4 rounded-lg"
            activeOpacity={.9}
            disabled={isLoadingPermissions}
            onPress={handleContinueClick}>
            <Text className="text-white font-bold text-lg text-center">
                Continue
            </Text>
        </TouchableOpacity>
    </View>;
}
