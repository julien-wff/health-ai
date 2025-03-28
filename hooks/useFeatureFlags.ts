import { useFeatureFlag, usePostHog } from 'posthog-react-native';

export type AiProfile = 'introvert' | 'extrovert';

export function useFeatureFlags() {
    const posthog = usePostHog();
    const agentMode = useFeatureFlag('ai-profile') as AiProfile | undefined;

    async function overrideFeatureFlag(flag: 'ai-profile', value: AiProfile) {
        await posthog.overrideFeatureFlag({
            [flag]: value,
        });
        await posthog.reloadFeatureFlagsAsync();
    }

    return {
        agentMode,
        overrideFeatureFlag,
    };
}
