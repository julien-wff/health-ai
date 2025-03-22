import { Linking, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { ArrowLeft, SquareArrowOutUpRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import ResetAppBtn from '@/components/profile/ResetAppBtn';
import DebugInfoBtn from '@/components/profile/DebugInfoBtn';
import ProfileBtn from '@/components/profile/ProfileBtn';
import { healthConnect } from '@/utils/health/android';
import StepsChart from '@/components/chart/StepsChart';
import dayjs from 'dayjs';
import ExerciseChart from '@/components/chart/ExerciseChart';
import SleepChart from '@/components/chart/SleepChart';
import { useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import CopyStorageBtn from '@/components/profile/CopyStorageBtn';

export default function Profile() {
    const router = useRouter();
    const colors = useColors();

    const graphStartDate = useMemo(() => dayjs().add(-28, 'day'), []);
    const graphEndDate = useMemo(() => dayjs(), []);

    function handleOpenHealthApp() {
        switch (Platform.OS) {
            case 'android':
                healthConnect?.openHealthConnectSettings();
                break;
            case 'ios':
                void Linking.openURL('x-apple-health://');
                break;
        }
    }

    return <SafeAreaView className="h-full flex gap-4 p-4 bg-slate-50 dark:bg-slate-950">
        <View className="flex items-center gap-2 flex-row">
            <Pressable className="p-2" onPress={() => router.back()}>
                <ArrowLeft size={24} color={colors.text}/>
            </Pressable>
            <Text className="text-xl font-bold text-slate-900 dark:text-slate-50">
                Settings
            </Text>
        </View>

        <ScrollView>
            <View className="flex gap-4">

                {/*<Text className="text-slate-800 dark:text-slate-200 ml-4">Personal informations</Text>*/}
                {/*<View className="bg-white dark:bg-slate-900 rounded-lg">*/}
                {/*    <InputField label="Display name" separator/>*/}
                {/*    <InputField label="Age" inputProps={{ keyboardType: 'numeric', maxLength: 2 }}/>*/}
                {/*</View>*/}

                <Text className="text-slate-800 dark:text-slate-200 ml-4 mt-4">General settings</Text>
                <View className="bg-white dark:bg-slate-900 rounded-lg">
                    <ProfileBtn icon={SquareArrowOutUpRight} separator onPress={handleOpenHealthApp}>
                        {Platform.select({ ios: 'Open Apple Health', android: 'Open Health Connect' })}
                    </ProfileBtn>
                    <ResetAppBtn/>
                </View>

                <Text className="text-slate-800 dark:text-slate-200 ml-4 mt-4">
                    Steps, Daily Exercise Time and Sleep Duration
                </Text>
                <StepsChart startDate={graphStartDate} endDate={graphEndDate} noMargin/>
                <ExerciseChart startDate={graphStartDate} endDate={graphEndDate} noMargin/>
                <SleepChart startDate={graphStartDate} endDate={graphEndDate} noMargin/>

                <Text className="text-slate-800 dark:text-slate-200 ml-4 mt-4">Debug</Text>
                <View className="bg-white dark:bg-slate-900 rounded-lg">
                    <CopyStorageBtn/>
                    <DebugInfoBtn/>
                </View>

            </View>
        </ScrollView>
    </SafeAreaView>;
}
