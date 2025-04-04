import { Dayjs } from 'dayjs';
import { useColors } from '@/hooks/useColors';
import { Text, View } from 'react-native';
import { useMemo } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { CircleCheck } from 'lucide-react-native';
import { vec } from '@shopify/react-native-skia';

interface NotificationWidgetProps {
    title: string,
    date: Dayjs,
}

export default function NotificationSuccessWidget({ title, date }: NotificationWidgetProps) {
    const colors = useColors();

    const formattedDate = useMemo(() => date.format('DD MMM YYYY [at] HH:mm'), [date]);

    return <View className={`w-full flex flex-row items-center p-1`}>
        <LinearGradient colors={colors.indigoBackground}
                        start={vec(0, 0)}
                        end={vec(1, 1)}
                        style={{ borderRadius: 12, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}/>
        <CircleCheck color={colors.blue}/>
        <Text className="flex-1 px-1">
            Notification <Text className={"font-bold"}>{ title }</Text> scheduled for {formattedDate}
        </Text>
    </View>;

}