import { SafeAreaView } from 'react-native-safe-area-context';
import ViewHeaderWithBack from '@/components/common/ViewHeaderWithBack';
import ProfileBtn from '@/components/profile/ProfileBtn';
import { Megaphone, ToggleRight } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { invertAgentMode, useFeatureFlags } from '@/hooks/useFeatureFlags';
import { useAppState } from '@/hooks/useAppState';
import GoalWidget from '@/components/goals/GoalWidget';

export default function AdvancedDebug() {
    const { agentMode, isAgentSwitched, overrideFeatureFlag } = useFeatureFlags();
    const { setRequireNewChat, goals } = useAppState();

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

        <Text className="mt-4 ml-4 text-slate-800 dark:text-slate-200">Feature flags</Text>
        <View className="rounded-lg bg-white dark:bg-slate-900">
            <ProfileBtn icon={Megaphone} onPress={toggleAgentMode} separator>
                Agent mode: {String(agentMode)}
            </ProfileBtn>

            <ProfileBtn icon={ToggleRight} onPress={toggleAgentSwitch}>
                Switch agent: {String(isAgentSwitched)}
            </ProfileBtn>
        </View>

        <Text className="mt-4 ml-4 text-slate-800 dark:text-slate-200">Goals</Text>
        <View className="rounded-lg bg-white dark:bg-slate-900 flex flex-col gap-2 p-2">
            {goals.map((goal) =>
                <GoalWidget goal={goal} key={goal.id} showID noMargin/>,
            )}
        </View>
    </SafeAreaView>;
}
