import BaseChart from '@/components/chart/base/BaseChart';
import { useAppState } from '@/hooks/useAppState';
import { useColors } from '@/hooks/useColors';
import { useMemo } from 'react';

interface StepsChartProps {
    startDate?: string, // yyyy-mm-dd
    endDate?: string, // yyyy-mm-dd
}

export default function StepsChart({ startDate, endDate }: StepsChartProps) {
    const colors = useColors();
    const { healthRecords } = useAppState();

    const [ stepCount, weekLabel ] = useMemo((() => {
        // Default: last 7 days
        const start = startDate ? new Date(startDate) : new Date(new Date().setDate(new Date().getDate() - 7));
        const end = endDate ? new Date(endDate) : new Date();

        const steps: number[] = [];
        const labels: string[] = [];

        for (const record of healthRecords?.steps ?? []) {
            if (new Date(record.startTime) < start || new Date(record.startTime) > end)
                continue;

            steps.push(record.count);
            labels.push(new Date(record.startTime).toLocaleDateString('en', { weekday: 'short' }));
        }

        return [ steps, labels ];
    }), [ healthRecords?.steps, startDate, endDate ]);

    return <BaseChart barColor={colors.green}
                      backgroundColor={colors.greenBackground}
                      values={stepCount}
                      labels={weekLabel}/>;
}
