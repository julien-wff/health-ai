import BaseChart from '@/components/chart/base/BaseChart';
import { useColors } from '@/hooks/useColors';
import { useHealthData } from '@/hooks/useHealthData';
import { filterCollectionRange } from '@/utils/health';
import { Dayjs } from 'dayjs';
import { useMemo } from 'react';
import dedent from 'dedent';

interface StepsChartProps {
    startDate: Dayjs,
    endDate: Dayjs,
    noMargin?: boolean,
}

export default function StepsChart({ startDate, endDate, noMargin }: StepsChartProps) {
    const colors = useColors();
    const { steps: stepsRecords } = useHealthData();

    const [ stepCount, weekLabel ] = useMemo((() => {
        const filteredRecords = filterCollectionRange(stepsRecords, startDate, endDate);

        return [
            [ ...filteredRecords.values() ].map(record => record.steps),
            [ ...filteredRecords.keys() ].map(date => date.format('ddd')),
        ];
    }), [ stepsRecords, startDate, endDate ]);

    const emptyDataText = useMemo(() => dedent`
        No steps count found from ${startDate.format('MMMM D')} to ${endDate.format('MMMM D')}.
        Please check your health data provider.
    `, [ startDate, endDate ]);

    return <BaseChart barColor={colors.green}
                      backgroundColor={colors.greenBackground}
                      values={stepCount}
                      labels={weekLabel}
                      noMargin={noMargin}
                      emptyDataText={emptyDataText}/>;
}
