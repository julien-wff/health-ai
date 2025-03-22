import { Canvas, Circle } from '@shopify/react-native-skia';
import React, { useEffect } from 'react';
import { useSharedValue, withDelay, withRepeat, withTiming } from 'react-native-reanimated';
import { withSequence } from 'react-native-reanimated/src';

interface AnimatedLoadingIconProps {
    size: number;
    color: string;
    duration?: number;
}

export default React.memo(AnimatedLoadingIcon);

function AnimatedLoadingIcon({ size, color, duration: inputDuration }: AnimatedLoadingIconProps) {
    const r = size / 8;
    const duration = inputDuration ?? 500;

    const c1y = useSharedValue(size / 2);
    const c2y = useSharedValue(size / 2);
    const c3y = useSharedValue(size / 2);

    useEffect(() => {
        const upDownAnimation = () => withRepeat(
            withSequence(
                withTiming(size / 2 - r, { duration }),
                withTiming(size / 2 + r, { duration }),
            ),
            -1,
            true,
        );
        c1y.value = upDownAnimation();
        c2y.value = withDelay(duration * (1 / 5), upDownAnimation());
        c3y.value = withDelay(duration * (2 / 5), upDownAnimation());
    }, []);

    return <Canvas className="h-full w-full" style={{ width: size, height: size }}>
        <Circle r={r} cx={r} cy={c1y} color={color}/>
        <Circle r={r} cx={size / 2} cy={c2y} color={color}/>
        <Circle r={r} cx={size - r} cy={c3y} color={color}/>
    </Canvas>;
}
