import { Text, View } from 'react-native';
import { TriangleAlert } from 'lucide-react-native';
import { useColors } from '@/hooks/useColors';
import { Link } from 'expo-router';
import { useHealthData } from '@/hooks/useHealthData';
import BaseNotification from '@/components/notification/BaseNotification';
import { useTracking } from '@/hooks/useTracking';


export default function EmptyHealthNotification() {
    const colors = useColors();
    const tracking = useTracking();
    const { warningNotificationStatus, setWarningNotificationStatus } = useHealthData();

    function handleDismiss() {
        tracking.event('notification_empty_health_dismissed');
        setWarningNotificationStatus('dismissed');
    }

    function handleShown() {
        tracking.event('notification_empty_health_show');
        setWarningNotificationStatus('shown');
    }

    if (warningNotificationStatus === 'dismissed')
        return <></>;

    return <BaseNotification showDelay={1000}
                             animateIn={warningNotificationStatus === 'show'}
                             onShown={handleShown}
                             onDismissed={handleDismiss}>
        <Link href="/troubleshoot">
            <View className={`flex flex-row gap-4 items-center p-4 rounded-lg border
                              bg-orange-100 border-orange-500 dark:bg-orange-900 dark:border-orange-400`}>
                <TriangleAlert color={colors.orange} size={36}/>

                <View className="flex-1">
                    <Text className="mb-1 font-bold text-slate-950 dark:text-slate-50">
                        Cannot load Health Data
                    </Text>
                    <Text className="text-slate-800 dark:text-slate-200">
                        Dataset is empty. Click to learn more.
                    </Text>
                </View>
            </View>
        </Link>
    </BaseNotification>;
}
