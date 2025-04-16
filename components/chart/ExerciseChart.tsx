import BaseChart from '@/components/chart/base/BaseChart';
import { useColors } from '@/hooks/useColors';
import { useHealthData } from '@/hooks/useHealthData';
import { filterCollectionRange } from '@/utils/health';
import dayjs, { Dayjs } from 'dayjs';
import { Duration } from 'dayjs/plugin/duration';
import { useMemo } from 'react';
import dedent from 'dedent';

interface ExerciseChartProps {
    startDate: Dayjs,
    endDate: Dayjs,
    noMargin?: boolean,
}

export default function ExerciseChart({ startDate, endDate, noMargin }: ExerciseChartProps) {
    const colors = useColors();
    const { exercise: exerciseRecords } = useHealthData();

    const [ formattedExercise, weekLabel ] = useMemo((() => {
        // Default: last 7 days
        const filteredRecords = filterCollectionRange(exerciseRecords, startDate, endDate);

        const aggregatedData = new Map<string, Duration>();

        // Populate map with 0
        for (let i = startDate.add(1, 'day'); i <= endDate; i = i.add(1, 'day')) {
            aggregatedData.set(i.format('YYYY-MM-DD'), dayjs.duration(0));
        }

        // Aggregate exercise data
        for (const [ recordStartTime, record ] of filteredRecords.entries()) {
            const recordKey = recordStartTime.format('YYYY-MM-DD');
            aggregatedData.set(
                recordKey,
                aggregatedData.get(recordKey)?.add(record.duration) ?? record.duration,
            );
        }

        // Convert map to arrays
        const activeMinutes = Array.from(aggregatedData.values()).map(d => d.asMinutes());
        const labels = Array.from(aggregatedData.keys()).map(date => dayjs(date).format('ddd'));

        return [ activeMinutes, labels ];
    }), [ exerciseRecords, startDate, endDate ]);

    const emptyDataText = useMemo(() => dedent`
        No exercise records found from ${startDate.format('MMMM D')} to ${endDate.format('MMMM D')}.
        Please check your health data provider.
    `, [ startDate, endDate ]);

    return <BaseChart barColor={colors.red}
                      backgroundColor={colors.redBackground}
                      values={formattedExercise}
                      labels={weekLabel}
                      scaleUnit="duration"
                      noMargin={noMargin}
                      emptyDataText={emptyDataText}/>;
}
