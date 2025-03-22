import { Pressable, Text, View } from 'react-native';
import { CircleCheck } from 'lucide-react-native';
import { useColors } from '@/hooks/useColors';
import { useHealthData } from '@/hooks/useHealthData';
import BaseNotification from '@/components/notification/BaseNotification';
import { useEffect } from 'react';


export default function HealthDataFoundNotification() {
    const colors = useColors();
    const { setWarningNotificationStatus } = useHealthData();

    useEffect(() => {
        return () => setWarningNotificationStatus(null);
    }, []);

    return <BaseNotification onDismissed={() => setWarningNotificationStatus(null)} showDelay={500}>
        <Pressable onPress={() => setWarningNotificationStatus(null)}>
            <View className={`flex flex-row gap-4 items-center p-4 rounded-lg border
                              bg-green-100 border-green-500 dark:bg-green-900 dark:border-green-400`}>
                <CircleCheck color={colors.green} size={36}/>

                <View className="flex-1">
                    <Text className="mb-1 font-bold text-slate-950 dark:text-slate-50">
                        Health data loaded successfully
                    </Text>
                    <Text className="text-slate-800 dark:text-slate-200">
                        Health records are now available for the AI.
                    </Text>
                </View>
            </View>
        </Pressable>
    </BaseNotification>;
}
