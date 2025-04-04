import { Dayjs } from 'dayjs';
import { useColors } from '@/hooks/useColors';
import { Text, View } from 'react-native';

interface NotificationWidgetProps {
    title: string,
    date: Dayjs,
}

export default function NotificationSuccessWidget({ title, date }: NotificationWidgetProps) {
    const colors = useColors();

    return <View className={`w-full h-15 flex flex-col justify-center border-2 border-blue-500 p-1 rounded`}>
        <Text>Notification successfully created on {date.format('DD MMM YYYY [at] HH:mm')}</Text>
    </View>;

}