import { Pressable, Text, View } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import ResetAppBtn from '@/components/profile/ResetAppBtn';
import DebugInfoBtn from '@/components/profile/DebugInfoBtn';

export default function Profile() {
    const router = useRouter();
    const colors = useColors();

    return <View className="min-h-screen flex gap-4 p-4 bg-slate-50 dark:bg-slate-950">
        <View className="flex items-center gap-2 flex-row">
            <Pressable className="p-2" onPress={() => router.back()}>
                <ArrowLeft size={24} color={colors.text}/>
            </Pressable>
            <Text className="text-xl font-bold text-slate-900 dark:text-slate-50">
                Settings
            </Text>
        </View>

        {/*<Text className="text-slate-800 dark:text-slate-200 ml-4">Personal informations</Text>*/}
        {/*<View className="bg-white dark:bg-slate-900 rounded-lg">*/}
        {/*    <InputField label="Display name" separator/>*/}
        {/*    <InputField label="Age" inputProps={{ keyboardType: 'numeric', maxLength: 2 }}/>*/}
        {/*</View>*/}

        <Text className="text-slate-800 dark:text-slate-200 ml-4 mt-4">General settings</Text>
        <View className="bg-white dark:bg-slate-900 rounded-lg">
            <View className="border-b border-slate-300 dark:border-slate-700">
                <ResetAppBtn/>
            </View>
            <DebugInfoBtn/>
        </View>
    </View>;
}
