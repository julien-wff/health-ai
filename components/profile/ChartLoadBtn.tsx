import type StepsChart from '@/components/chart/StepsChart';
import type ExerciseChart from '@/components/chart/ExerciseChart';
import type SleepChart from '@/components/chart/SleepChart';
import { Pressable, Text, View } from 'react-native';
import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { LinearGradient } from 'expo-linear-gradient';
import type { Gradient } from '@/hooks/useColors';
import { vec } from '@shopify/react-native-skia';

interface ChartLoadBtnProps {
    chart: typeof StepsChart | typeof ExerciseChart | typeof SleepChart;
    chartName: string;
    noMargin?: boolean;
    gradient: Gradient;
}

export default function ChartLoadBtn({ chart: Chart, noMargin, chartName, gradient }: ChartLoadBtnProps) {
    const [ load, setLoad ] = useState(false);

    const chartStartDate = useMemo(() => dayjs().add(-28, 'day'), []);
    const chartEndDate = useMemo(() => dayjs(), []);

    if (load) {
        return <Chart startDate={chartStartDate} endDate={chartEndDate} noMargin={noMargin}/>;
    }

    return <Pressable onPress={() => setLoad(true)}>
        <View className={`w-full h-48 flex items-center justify-center rounded-xl ${noMargin ? '' : 'my-2'}`}>
            <LinearGradient colors={gradient}
                            start={vec(0, 0)}
                            end={vec(1, 1)}
                            style={{ borderRadius: 12, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}/>
            <Text className="text-slate-800 dark:text-slate-200">Click to show {chartName} chart</Text>
        </View>
    </Pressable>;
}
