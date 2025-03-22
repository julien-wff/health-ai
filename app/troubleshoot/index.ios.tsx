import TroubleshootingStep from '@/components/troubleshoot/TroubleshootingStep';
import TroubleshootLayout from '@/components/troubleshoot/TroubleshootLayout';
import { Linking, Text, TouchableOpacity } from 'react-native';

export default function TroubleshootIos() {
    function openAppleHealth() {
        void Linking.openURL('x-apple-health://');
    }

    function openAppSettings() {
        void Linking.openSettings();
    }

    return <TroubleshootLayout>
        <Text className="text-slate-800 dark:text-slate-200">
            To access your health record,
            <Text className="font-bold">{' '}Health AI{' '}</Text>
            reads data from the
            <Text className="font-bold">{' '}Apple Health App</Text>.
        </Text>

        <Text className="text-slate-800 dark:text-slate-200">
            However, Apple Health hasn't returned any recent data. Please follow these instructions to check the
            synchronization.
        </Text>

        <TroubleshootingStep title="Check permissions on Apple Health" index={1}>
            <Text className="text-slate-800 dark:text-slate-200">
                Open the
                <Text className="font-bold">{' '}Apple Health App</Text>
                , go to
                <Text className="font-bold">{' '}Profile {'>'} Privacy {'>'} Apps{' '}</Text>
                and check that
                <Text className="font-bold">{' '}Health AI{' '}</Text>
                has all permissions checked.
            </Text>

            <Text className="mt-2 text-slate-800 dark:text-slate-200">
                This screen should automatically disappear if the synchronization becomes successful.
            </Text>

            <TouchableOpacity className="mt-2 w-full rounded-lg bg-blue-500 p-4 shadow dark:bg-blue-400"
                              activeOpacity={.8}
                              onPress={openAppleHealth}>
                <Text className="text-center uppercase text-slate-50 dark:text-slate-950">Open Apple Health</Text>

            </TouchableOpacity>
        </TroubleshootingStep>

        <TroubleshootingStep title="Reinstall Health AI" index={2}>
            <Text className="text-slate-800 dark:text-slate-200">
                Uninstall and reinstall Health AI, so the permissions are reset.
            </Text>

            <TouchableOpacity className="mt-2 w-full rounded-lg bg-blue-500 p-4 shadow dark:bg-blue-400"
                              activeOpacity={.8}
                              onPress={openAppSettings}>
                <Text className="text-center uppercase text-slate-50 dark:text-slate-950">Open App Settings</Text>
            </TouchableOpacity>
        </TroubleshootingStep>
    </TroubleshootLayout>;
}
