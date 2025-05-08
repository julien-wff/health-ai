import Constants from 'expo-constants';
import * as Updates from 'expo-updates';
import { usePostHog } from 'posthog-react-native';
import * as Clipboard from 'expo-clipboard';
import { Pressable, Text } from 'react-native';
import { Info } from 'lucide-react-native';
import { useColors } from '@/hooks/useColors';
import { useTracking } from '@/hooks/useTracking';
import dedent from 'dedent';

export default function DebugInfoBtn() {
    const posthog = usePostHog();
    const colors = useColors();
    const tracking = useTracking();

    const env = process.env.APP_VARIANT || process.env.NODE_ENV;
    const debugInfo = dedent`
        ${Constants.expoConfig?.name} v${Constants.expoConfig?.version}-${env} 
        Runtime v${Updates.runtimeVersion} (${Updates.channel})
        UID: ${posthog.getAnonymousId()}
    `;

    function copyDebugInfo() {
        tracking.event('profile_debug_info_copy');
        void Clipboard.setStringAsync(debugInfo);
    }

    return <Pressable
        className="flex flex-row items-center gap-2 rounded-lg p-4 active:bg-slate-200 dark:active:bg-slate-800"
        onPress={copyDebugInfo}>
        <Info size={20} color={colors.text}/>
        <Text className="text-slate-800 dark:text-slate-200">
            {debugInfo}
        </Text>
    </Pressable>;
}
