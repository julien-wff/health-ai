import BaseChart from '@/components/chart/base/BaseChart';
import { useColors } from '@/hooks/useColors';
import { useHealthData } from '@/hooks/useHealthData';
import { filterCollectionRange } from '@/utils/health';
import { Dayjs } from 'dayjs';
import { useMemo } from 'react';

interface StepsChartProps {
    startDate: Dayjs,
    endDate: Dayjs,
}

/**
 * Renders a chart displaying daily step counts within a specified date range.
 *
 * The component filters step records to include only those between the provided start and end dates, extracts the daily step counts and corresponding weekday labels, and displays them in a bar chart using a predefined color scheme.
 *
 * @param startDate The inclusive start date for filtering step records.
 * @param endDate The inclusive end date for filtering step records.
 */
export default function StepsChart({ startDate, endDate }: StepsChartProps) {
    const colors = useColors();
    const { steps: stepsRecords } = useHealthData();

    const [ stepCount, weekLabel ] = useMemo((() => {
        const filteredRecords = filterCollectionRange(stepsRecords, startDate, endDate);

        return [
            [ ...filteredRecords.values() ].map(record => record.steps),
            [ ...filteredRecords.keys() ].map(date => date.format('ddd')),
        ];
    }), [ stepsRecords, startDate, endDate ]);

    return <BaseChart barColor={colors.green}
                      backgroundColor={colors.greenBackground}
                      values={stepCount}
                      labels={weekLabel}/>;
}
