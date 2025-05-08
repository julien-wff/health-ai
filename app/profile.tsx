import { Linking, Platform, ScrollView, Text, ToastAndroid, View } from 'react-native';
import { RefreshCw, SquareArrowOutUpRight } from 'lucide-react-native';
import * as Update from 'expo-updates';
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
import { useAppState } from '@/hooks/useAppState';
import AdvancedDebugBtn from '@/components/profile/AdvancedDebugBtn';
import ViewHeaderWithBack from '@/components/common/ViewHeaderWithBack';

export default function Profile() {
    const colors = useColors();
    const tracking = useTracking();
    const { hasDebugAccess } = useAppState();

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

    async function handleCheckForUpdate() {
        tracking.event('profile_check_for_update');
        const res = await Update.checkForUpdateAsync();
        if (res.isAvailable) {
            tracking.event('profile_update_available');
            ToastAndroid.show('Update available, downloading and reloading app...', ToastAndroid.SHORT);
            await Update.fetchUpdateAsync();
            await Update.reloadAsync();
        } else {
            ToastAndroid.show('No update available', ToastAndroid.SHORT);
        }
    }

    return <SafeAreaView className="flex h-full gap-4 bg-slate-50 p-4 dark:bg-slate-950">
        <ViewHeaderWithBack>Settings</ViewHeaderWithBack>

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
                    <ProfileBtn icon={RefreshCw} separator onPress={handleCheckForUpdate}>
                        Check for update
                    </ProfileBtn>
                    <CopyStorageBtn/>
                    {hasDebugAccess && <AdvancedDebugBtn/>}
                    <DebugInfoBtn/>
                </View>

            </View>
        </ScrollView>
    </SafeAreaView>;
}
