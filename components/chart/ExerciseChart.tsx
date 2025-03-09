import BaseChart from '@/components/chart/base/BaseChart';
import { useAppState } from '@/hooks/useAppState';
import { useColors } from '@/hooks/useColors';
import { dateRangeToDayJs, filterRecordsForAI } from '@/utils/health/android';
import dayjs from 'dayjs';
import { useMemo } from 'react';

interface ExerciseChartProps {
    startDate?: string, // yyyy-mm-dd
    endDate?: string, // yyyy-mm-dd
}

export default function ExerciseChart({ startDate, endDate }: ExerciseChartProps) {
    const colors = useColors();
    const { healthRecords } = useAppState();

    const [ stepCount, weekLabel ] = useMemo((() => {
        // Default: last 7 days
        const [ start, end ] = dateRangeToDayJs({ startDate, endDate });
        const filteredRecords = filterRecordsForAI(healthRecords?.exercise ?? [], { startDate, endDate });

        const aggregatedData = new Map<string, number>();

        // Populate map with 0
        for (let i = start.add(1, 'day'); i <= end; i = i.add(1, 'day')) {
            aggregatedData.set(i.format('YYYY-MM-DD'), 0);
        }

        // Aggregate exercise data
        for (const record of filteredRecords) {
            const duration = dayjs(record.endTime).diff(record.startTime, 'minute');
            const date = dayjs(record.startTime).format('YYYY-MM-DD');
            aggregatedData.set(date, (aggregatedData.get(date) ?? 0) + duration);
        }

        // Convert map to arrays
        const activeMinutes = Array.from(aggregatedData.values());
        const labels = Array.from(aggregatedData.keys()).map(date => dayjs(date).format('ddd'));

        return [ activeMinutes, labels ];
    }), [ healthRecords?.exercise, startDate, endDate ]);

    return <BaseChart barColor={colors.red}
                      backgroundColor={colors.redBackground}
                      values={stepCount}
                      labels={weekLabel}
                      scaleUnit="duration"/>;
}
