import Constants from 'expo-constants';
import { usePostHog } from 'posthog-react-native';
import * as Clipboard from 'expo-clipboard';
import { Pressable, Text } from 'react-native';
import { Info } from 'lucide-react-native';
import { useColors } from '@/hooks/useColors';

export default function DebugInfoBtn() {
    const posthog = usePostHog();
    const colors = useColors();

    const env = process.env.APP_VARIANT || process.env.NODE_ENV;
    const debugInfo = `${Constants.expoConfig?.name} v${Constants.expoConfig?.version}-${env}`
        + `\nUID: ${posthog.getAnonymousId()}`;

    function copyDebugInfo() {
        void Clipboard.setStringAsync(debugInfo);
    }

    return <Pressable
        className="flex flex-row items-center gap-2 active:bg-slate-200 dark:active:bg-slate-800 p-4 rounded-lg"
        onPress={copyDebugInfo}>
        <Info size={20} color={colors.text}/>
        <Text className="text-slate-800 dark:text-slate-200">
            {debugInfo}
        </Text>
    </Pressable>;
}
