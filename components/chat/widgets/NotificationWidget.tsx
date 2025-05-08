import { Dayjs } from 'dayjs';
import { useColors } from '@/hooks/useColors';
import { Text, View } from 'react-native';
import { useMemo } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { CircleCheck } from 'lucide-react-native';
import { vec } from '@shopify/react-native-skia';

interface NotificationWidgetProps {
    title: string,
    dates: Dayjs[],
    type: 'schedule' | 'cancel' | 'reschedule'
}

export default function NotificationWidget({ title, dates, type }: Readonly<NotificationWidgetProps>) {
    const colors = useColors();

    const formattedDates = useMemo(
        () => dates.map(d => d.format('MMM DD [at] HH:mm')).join(', '),
        [ dates ],
    );

    const description: string = useMemo(
        () => {
            switch (type) {
                case 'schedule':
                    return `Notification${dates.length > 1 ? 's' : ''} '${title}' scheduled to ${formattedDates}`;
                case 'cancel':
                    return `Notifications cancelled.`;
                case 'reschedule':
                    return `Notification rescheduled to ${formattedDates}.`;
            }
        },
        [ type, title, formattedDates, dates.length ],
    );

    return <View className="w-full flex flex-row items-center p-2 my-2">
        <LinearGradient colors={colors.blueBackground}
                        start={vec(0, 0)}
                        end={vec(1, 1)}
                        style={{ borderRadius: 12, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}/>
        <CircleCheck color={colors.blue} size={24}/>
        <Text className="flex-1 pl-2 text-slate-800 dark:text-slate-200">
            {description}
        </Text>
    </View>;
}
