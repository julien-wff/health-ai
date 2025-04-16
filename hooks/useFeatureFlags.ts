import { useFeatureFlag, usePostHog } from 'posthog-react-native';

export type AiProfile = 'introvert' | 'extrovert';

export const invertAgentMode = (mode: AiProfile): AiProfile => mode === 'introvert' ? 'extrovert' : 'introvert';

export function useFeatureFlags() {
    const posthog = usePostHog();
    const agentMode = useFeatureFlag('ai-profile') as AiProfile | undefined;
    const isAgentSwitched = useFeatureFlag('agent-switch') as boolean | undefined;

    async function overrideFeatureFlag(flag: 'ai-profile', value: AiProfile): Promise<void>;
    async function overrideFeatureFlag(flag: 'agent-switch', value: boolean): Promise<void>;
    async function overrideFeatureFlag(flag: string, value: string | boolean) {
        await posthog.overrideFeatureFlag({
            [flag]: value,
        });
        await posthog.reloadFeatureFlagsAsync();
    }

    return {
        agentMode: agentMode && isAgentSwitched ? invertAgentMode(agentMode) : agentMode,
        isAgentSwitched: isAgentSwitched ?? false,
        overrideFeatureFlag,
    };
}
