import HealthRecord from '@/components/onboarding/HealthRecord';
import { useColors } from '@/hooks/useColors';
import { Footprints, Medal, MoonStar } from 'lucide-react-native';
import { Image, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

export default function Onboarding() {
    const colorScheme = useColorScheme();
    const colors = useColors();

    function handleContinueClick() {
        // TODO
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
                If you continue, you accept that these personal records will be anonymously shared with LLM providers,
                such as Gemini.
            </Text>
        </View>

        <TouchableOpacity className="bg-blue-500 dark:bg-blue-400 p-4 rounded-lg"
                          activeOpacity={.9}
                          onPress={handleContinueClick}>
            <Text className="text-white font-bold text-lg text-center">
                Continue
            </Text>
        </TouchableOpacity>
    </View>;
}
