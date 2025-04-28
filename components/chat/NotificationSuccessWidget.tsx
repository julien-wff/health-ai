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
}

export default function NotificationSuccessWidget({ title, dates }: Readonly<NotificationWidgetProps>) {
    const colors = useColors();

    const formattedDates = useMemo(
        () => dates.map(d => d.format('DD MMM YYYY [at] HH:mm')).join(','),
        [ dates.length ],
    );

    return <View className="w-full flex flex-row items-center p-2 my-2">
        <LinearGradient colors={colors.blueBackground}
                        start={vec(0, 0)}
                        end={vec(1, 1)}
                        style={{ borderRadius: 12, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}/>
        <CircleCheck color={colors.blue} size={24}/>
        <Text className="flex-1 pl-2">
            Notification{dates.length > 1 ? 's' : ''} <Text className="font-bold">{title}</Text> scheduled
            for {formattedDates}
        </Text>
    </View>;
}
