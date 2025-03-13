import { Text, useColorScheme, View } from 'react-native';
import TroubleshootLayout from '@/components/troubleshoot/TroubleshootLayout';
import { useHealthData } from '@/hooks/useHealthData';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import TroubleshootingStepTitle from '@/components/troubleshoot/TroubleshootingStepTitle';

export default function TroubleshootAndroid() {
    const { empty } = useHealthData();
    const router = useRouter();
    const [ imageHeight, setImageHeight ] = useState(0);
    const colorScheme = useColorScheme();

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
            Please follow these instructions to check the synchronization:
        </Text>

        <TroubleshootingStepTitle index={1} title="Verify the Health Connect integration"/>
        <TroubleshootingStepTitle index={2} title="Verify recent access on Health Connect"/>
        <TroubleshootingStepTitle index={3} title="Look for data on Health Connect"/>
    </TroubleshootLayout>;
}
