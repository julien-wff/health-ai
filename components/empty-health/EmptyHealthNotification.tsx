import { Text, View } from 'react-native';
import { TriangleAlert } from 'lucide-react-native';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';
import { useColors } from '@/hooks/useColors';
import { Link } from 'expo-router';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useHealthData } from '@/hooks/useHealthData';


export default function EmptyHealthNotification() {
    const colors = useColors();
    const { warningNotificationStatus, setWarningNotificationStatus } = useHealthData();

    const showProgress = useSharedValue(0);

    const pan = Gesture.Pan()
        .onChange(ev => {
            showProgress.value += ev.changeY / 25;
        })
        .onFinalize(ev => {
            // Movement downwards or progress > 40% will show the notification back
            const envValue = ev.velocityY >= -20 && showProgress.value > .4 ? 1 : 0;
            showProgress.value = withTiming(envValue, { duration: 300 });
            if (envValue === 0)
                runOnJS(setWarningNotificationStatus)('dismissed');
        });

    useEffect(() => {
        switch (warningNotificationStatus) {
            case 'shown':
                showProgress.value = 1;
                return;
            case 'show':
                showProgress.value = withDelay(1000, withTiming(1, { duration: 500 }));
                const t = setTimeout(() => {
                    setWarningNotificationStatus('shown');
                }, 1500);
                return () => clearTimeout(t);
            default:
                return;
        }
    }, []);

    const animatedStyles = useAnimatedStyle(() => ({
        opacity: showProgress.value,
        transform: [
            {
                translateY: Math.min(showProgress.value, 1) * 25,
            },
        ],
    }));

    if (warningNotificationStatus === 'dismissed')
        return <></>;

    return <GestureDetector gesture={pan}>
        <Animated.View className="w-full px-8 absolute top-12" style={animatedStyles}>
            <Link href="/troubleshoot">
                <View className={`flex flex-row gap-4 items-center p-4 rounded-lg border
                              bg-orange-100 border-orange-500 dark:bg-orange-900 dark:border-orange-400`}>
                    <TriangleAlert color={colors.orange} size={36}/>

                    <View className="flex-1">
                        <Text className="font-bold mb-1 text-slate-950 dark:text-slate-50">
                            Cannot load Health Data
                        </Text>
                        <Text className="text-slate-800 dark:text-slate-200">
                            Dataset is empty. Click to learn more.
                        </Text>
                    </View>
                </View>
            </Link>
        </Animated.View>
    </GestureDetector>;
}
