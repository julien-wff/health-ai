import BaseChart from '@/components/chart/base/BaseChart';
import { useAppState } from '@/hooks/useAppState';
import { useColors } from '@/hooks/useColors';
import { filterRecordsForAI } from '@/utils/health';
import dayjs from 'dayjs';
import { useMemo } from 'react';

interface StepsChartProps {
    startDate?: string, // yyyy-mm-dd
    endDate?: string, // yyyy-mm-dd
}

export default function StepsChart({ startDate, endDate }: StepsChartProps) {
    const colors = useColors();
    const { healthRecords } = useAppState();

    const [ stepCount, weekLabel ] = useMemo((() => {
        const filteredRecords = filterRecordsForAI(healthRecords?.steps ?? [], { startDate, endDate });
        const steps: number[] = [];
        const labels: string[] = [];

        for (const record of filteredRecords) {
            steps.push(record.count);
            labels.push(dayjs(record.startTime).format('ddd'));
        }

        return [ steps, labels ];
    }), [ healthRecords?.steps, startDate, endDate ]);

    return <BaseChart barColor={colors.green}
                      backgroundColor={colors.greenBackground}
                      values={stepCount}
                      labels={weekLabel}/>;
}
