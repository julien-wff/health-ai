import { SafeAreaView } from 'react-native-safe-area-context';
import ViewHeaderWithBack from '@/components/common/ViewHeaderWithBack';
import ProfileBtn from '@/components/profile/ProfileBtn';
import { Megaphone, ToggleRight } from 'lucide-react-native';
import { View } from 'react-native';
import { invertAgentMode, useFeatureFlags } from '@/hooks/useFeatureFlags';
import { useAppState } from '@/hooks/useAppState';

export default function AdvancedDebug() {
    const { agentMode, isAgentSwitched, overrideFeatureFlag } = useFeatureFlags();
    const { setRequireNewChat } = useAppState();

    function toggleAgentMode() {
        const newMode = invertAgentMode(agentMode || 'introvert');
        void overrideFeatureFlag('ai-profile', newMode);
        setRequireNewChat(true);
    }

    function toggleAgentSwitch() {
        const newSwitch = !isAgentSwitched;
        void overrideFeatureFlag('agent-switch', newSwitch);
        setRequireNewChat(true);
    }

    return <SafeAreaView className="flex h-full gap-4 bg-slate-50 p-4 dark:bg-slate-950">
        <ViewHeaderWithBack>Advanced debug</ViewHeaderWithBack>

        <View className="rounded-lg bg-white dark:bg-slate-900">
            <ProfileBtn icon={Megaphone} onPress={toggleAgentMode} separator>
                Agent mode: {String(agentMode)}
            </ProfileBtn>

            <ProfileBtn icon={ToggleRight} onPress={toggleAgentSwitch}>
                Switch agent: {String(isAgentSwitched)}
            </ProfileBtn>
        </View>
    </SafeAreaView>;
}
