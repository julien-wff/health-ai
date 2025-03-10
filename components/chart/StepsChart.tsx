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
