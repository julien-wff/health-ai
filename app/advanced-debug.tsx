import { SafeAreaView } from 'react-native-safe-area-context';
import ViewHeaderWithBack from '@/components/common/ViewHeaderWithBack';
import ProfileBtn from '@/components/profile/ProfileBtn';
import { Megaphone } from 'lucide-react-native';
import { View } from 'react-native';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';

export default function AdvancedDebug() {
    const { agentMode, overrideFeatureFlag } = useFeatureFlags();

    function toggleAgentMode() {
        const newMode = agentMode === 'introvert' ? 'extrovert' : 'introvert';
        void overrideFeatureFlag('ai-profile', newMode);
    }

    return <SafeAreaView className="flex h-full gap-4 bg-slate-50 p-4 dark:bg-slate-950">
        <ViewHeaderWithBack>Advanced debug</ViewHeaderWithBack>

        <View className="rounded-lg bg-white dark:bg-slate-900">
            <ProfileBtn icon={Megaphone} onPress={toggleAgentMode}>
                Agent mode: {agentMode}
            </ProfileBtn>
        </View>
    </SafeAreaView>;
}
