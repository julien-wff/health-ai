import { Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import TroubleshootLayout from '@/components/troubleshoot/TroubleshootLayout';
import { useHealthData } from '@/hooks/useHealthData';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import TroubleshootingStep from '@/components/troubleshoot/TroubleshootingStep';
import { healthConnect } from '@/utils/health/android';

export default function TroubleshootAndroid() {
    const { empty } = useHealthData();
    const router = useRouter();
    const [ imageHeight, setImageHeight ] = useState(0);
    const colorScheme = useColorScheme();

    function openHealthConnect() {
        healthConnect!.openHealthConnectSettings();
    }

    useEffect(() => {
        if (!empty) router.back();
    }, [ empty ]);

    return <TroubleshootLayout>
        <View className="flex gap-2">
            <Text className="text-slate-800 dark:text-slate-200">
                <Text className="font-bold">Health Connect{' '}</Text>
                is the mandatory platform for
                <Text className="font-bold">{' '}Health AI{' '}</Text>
                to read your sleep, exercise, and steps provided by other apps.
            </Text>

            <Text className="text-slate-800 dark:text-slate-200">
                However, it doesn't contain any recent data. This means that the provider applications have not written
                their records to it.
            </Text>
        </View>

        <Image onLayout={ev => setImageHeight(ev.nativeEvent.layout.width * (282 / 600))}
               source={colorScheme === 'light'
                   ? require('@/assets/troubleshooting/health-connect-schema-light.png')
                   : require('@/assets/troubleshooting/health-connect-schema-dark.png')}
               contentFit="contain"
               style={{ width: '100%', height: imageHeight }}
               transition={300}
        />

        <Text className="text-slate-800 dark:text-slate-200">
            Please follow these instructions to check the synchronization.
        </Text>

        <TroubleshootingStep index={1} title="Verify the Health Connect integration">
            <Text className="text-slate-800 dark:text-slate-200">
                Go in your health tracking application (e.g. Samsung Health, Google Fit, etc.) settings and check if the
                integration with Health Connect is enabled.
            </Text>
        </TroubleshootingStep>

        <TroubleshootingStep index={2} title="Verify recent access on Health Connect">
            <Text className="text-slate-800 dark:text-slate-200">
                Open Health Connect with the button below and check that your health application has
                <Text className="font-bold">{' '}write{' '}</Text>
                permissions, and that it recently wrote data.
            </Text>
        </TroubleshootingStep>

        <TroubleshootingStep index={3} title="Look for data on Health Connect">
            <Text className="text-slate-800 dark:text-slate-200">
                On Health Connect, go to the Data and Access page. If you see
                <Text className="font-bold">{' '}no data</Text>,
                this means Health AI still cannot read it.
            </Text>
            <Text className="text-slate-800 dark:text-slate-200">
                Try refreshing the data in the provider application, or search on the web for synchronization issues
                with the specific application.
            </Text>
        </TroubleshootingStep>

        <TouchableOpacity className="mt-4 w-full p-4 bg-blue-500 dark:bg-blue-400 rounded-lg shadow"
                          activeOpacity={.8}
                          onPress={openHealthConnect}>
            <Text className="text-slate-50 dark:text-slate-950 text-center uppercase">Open Health Connect</Text>
        </TouchableOpacity>
    </TroubleshootLayout>;
}
