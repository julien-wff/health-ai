import { Linking, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { ArrowLeft, SquareArrowOutUpRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import ResetAppBtn from '@/components/profile/ResetAppBtn';
import DebugInfoBtn from '@/components/profile/DebugInfoBtn';
import ProfileBtn from '@/components/profile/ProfileBtn';
import { healthConnect } from '@/utils/health/android';
import StepsChart from '@/components/chart/StepsChart';
import ExerciseChart from '@/components/chart/ExerciseChart';
import SleepChart from '@/components/chart/SleepChart';
import { SafeAreaView } from 'react-native-safe-area-context';
import CopyStorageBtn from '@/components/profile/CopyStorageBtn';
import ChartLoadBtn from '@/components/profile/ChartLoadBtn';
import { useTracking } from '@/hooks/useTracking';

export default function Profile() {
    const router = useRouter();
    const colors = useColors();
    const tracking = useTracking();

    function handleOpenHealthApp() {
        tracking.event('profile_open_health_app');
        switch (Platform.OS) {
            case 'android':
                healthConnect?.openHealthConnectSettings();
                break;
            case 'ios':
                void Linking.openURL('x-apple-health://');
                break;
        }
    }

    return <SafeAreaView className="flex h-full gap-4 bg-slate-50 p-4 dark:bg-slate-950">
        <View className="flex flex-row items-center gap-2">
            <Pressable className="p-2" onPress={() => router.back()}>
                <ArrowLeft size={24} color={colors.text}/>
            </Pressable>
            <Text className="text-xl font-bold text-slate-900 dark:text-slate-50">
                Settings
            </Text>
        </View>

        <ScrollView>
            <View className="flex gap-4">

                {/*<Text className="ml-4 text-slate-800 dark:text-slate-200">Personal informations</Text>*/}
                {/*<View className="rounded-lg bg-white dark:bg-slate-900">*/}
                {/*    <InputField label="Display name" separator/>*/}
                {/*    <InputField label="Age" inputProps={{ keyboardType: 'numeric', maxLength: 2 }}/>*/}
                {/*</View>*/}

                <Text className="mt-4 ml-4 text-slate-800 dark:text-slate-200">General settings</Text>
                <View className="rounded-lg bg-white dark:bg-slate-900">
                    <ProfileBtn icon={SquareArrowOutUpRight} separator onPress={handleOpenHealthApp}>
                        {Platform.select({ ios: 'Open Apple Health', android: 'Open Health Connect' })}
                    </ProfileBtn>
                    <ResetAppBtn/>
                </View>

                <Text className="mt-4 ml-4 text-slate-800 dark:text-slate-200">
                    Steps, Daily Exercise Time and Sleep Duration
                </Text>
                <ChartLoadBtn chart={StepsChart} chartName="steps" noMargin gradient={colors.greenBackground}/>
                <ChartLoadBtn chart={ExerciseChart} chartName="exercise" noMargin gradient={colors.redBackground}/>
                <ChartLoadBtn chart={SleepChart} chartName="sleep" noMargin gradient={colors.indigoBackground}/>

                <Text className="mt-4 ml-4 text-slate-800 dark:text-slate-200">Debug</Text>
                <View className="rounded-lg bg-white dark:bg-slate-900">
                    <CopyStorageBtn/>
                    <DebugInfoBtn/>
                </View>

            </View>
        </ScrollView>
    </SafeAreaView>;
}
