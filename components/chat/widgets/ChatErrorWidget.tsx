import { Text, TouchableOpacity, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { LinearGradient } from 'expo-linear-gradient';
import { ShieldX } from 'lucide-react-native';

interface ChatErrorWidgetProps {
    error: Error;
    onRetry?: () => void;
}

export default function ChatErrorWidget({ error, onRetry }: Readonly<ChatErrorWidgetProps>) {
    const colors = useColors();

    return <TouchableOpacity className="flex flex-row items-center justify-center gap-4 p-4"
                             activeOpacity={.7}
                             onPress={onRetry}>
        <LinearGradient colors={colors.redBackground}
            // Tailwind doesn't seem to work, especially on iOS
                        style={{ borderRadius: 8, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                        start={[ 0, 0 ]}
                        end={[ 1, 1 ]}/>

        <ShieldX size={32} className="w-6 h-6" color={colors.red}/>

        <View className="flex flex-1 justify-center">
            <Text className="text-slate-800 dark:text-slate-200">
                Error: {error.message}
            </Text>
            <Text className="text-slate-500 dark:text-slate-400">
                Click to retry.
            </Text>
        </View>
    </TouchableOpacity>;
}
