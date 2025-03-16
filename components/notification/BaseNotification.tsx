import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { type ReactNode, useEffect } from 'react';

interface BaseNotificationProps {
    animateIn?: boolean;
    onShown?: () => void;
    onDismissed?: () => void;
    children?: ReactNode;
    showDelay?: number;
}

export default function BaseNotification({
                                             animateIn,
                                             onShown,
                                             onDismissed,
                                             children,
                                             showDelay,
                                         }: BaseNotificationProps) {
    const showProgress = useSharedValue(0);

    const pan = Gesture.Pan()
        .onChange(ev => {
            showProgress.value += ev.changeY / 25;
        })
        .onFinalize(ev => {
            // Movement downwards or progress > 40% will show the notification back
            const envValue = ev.velocityY >= -20 && showProgress.value > .4 ? 1 : 0;
            showProgress.value = withTiming(envValue, { duration: 300 });
            if (envValue === 0 && onDismissed) {
                runOnJS(onDismissed)();
            }
        });

    useEffect(() => {
        if (animateIn) {
            showProgress.value = withDelay(showDelay ?? 0, withTiming(1, { duration: 500 }));
            const t = setTimeout(() => {
                onShown?.();
            }, 1500);
            return () => clearTimeout(t);
        } else {
            showProgress.value = 1;
            onShown?.();
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

    return <GestureDetector gesture={pan}>
        <Animated.View className="w-full px-8 absolute top-12" style={animatedStyles}>
            {children}
        </Animated.View>
    </GestureDetector>;
}
