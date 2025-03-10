import BaseChart from '@/components/chart/base/BaseChart';
import { useColors } from '@/hooks/useColors';
import { useHealthData } from '@/hooks/useHealthData';
import { filterCollectionRange } from '@/utils/health';
import dayjs, { Dayjs } from 'dayjs';
import { Duration } from 'dayjs/plugin/duration';
import { useMemo } from 'react';

interface ExerciseChartProps {
    startDate: Dayjs,
    endDate: Dayjs,
}

/**
 * Renders a chart displaying aggregated daily exercise durations.
 *
 * The component filters and aggregates exercise records within the given date range,
 * converting the total duration for each day (starting from the day after the start date)
 * into active minutes. These active minutes and their corresponding day-of-week labels
 * are then passed to a base chart component for visualization.
 *
 * @param startDate - The beginning of the date range for which exercise data is aggregated. Aggregation starts from the day after this date.
 * @param endDate - The end of the date range for exercise data aggregation.
 */
export default function ExerciseChart({ startDate, endDate }: ExerciseChartProps) {
    const colors = useColors();
    const { exercise: exerciseRecords } = useHealthData();

    const [ stepCount, weekLabel ] = useMemo((() => {
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

    return <BaseChart barColor={colors.red}
                      backgroundColor={colors.redBackground}
                      values={stepCount}
                      labels={weekLabel}
                      scaleUnit="duration"/>;
}
