import type StepsChart from '@/components/chart/StepsChart';
import type ExerciseChart from '@/components/chart/ExerciseChart';
import type SleepChart from '@/components/chart/SleepChart';
import { Pressable, Text, View } from 'react-native';
import { useMemo, useState } from 'react';
import dayjs from 'dayjs';

interface GraphLoadBtnProps {
    chart: typeof StepsChart | typeof ExerciseChart | typeof SleepChart;
    chartName: string;
    noMargin?: boolean;
}

export default function ChartLoadBtn({ chart: Chart, noMargin, chartName }: GraphLoadBtnProps) {
    const [ load, setLoad ] = useState(false);

    const graphStartDate = useMemo(() => dayjs().add(-28, 'day'), []);
    const graphEndDate = useMemo(() => dayjs(), []);

    if (load) {
        return <Chart startDate={graphStartDate} endDate={graphEndDate} noMargin={noMargin}/>;
    }

    return <Pressable onPress={() => setLoad(true)}>
        <View className={`w-full h-48 flex items-center justify-center
                         rounded-xl bg-white dark:bg-slate-900 ${noMargin ? '' : 'my-2'}`}>
            <Text className="text-slate-800 dark:text-slate-200">Click to show {chartName} chart</Text>
        </View>
    </Pressable>;
}
