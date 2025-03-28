import BaseChart from '@/components/chart/base/BaseChart';
import { useColors } from '@/hooks/useColors';
import { useHealthData } from '@/hooks/useHealthData';
import { filterCollectionRange } from '@/utils/health';
import { Dayjs } from 'dayjs';
import { useMemo } from 'react';
import { addToMapArray } from '@/utils/data-structures';

interface SleepChartProps {
    startDate: Dayjs,
    endDate: Dayjs,
    noMargin?: boolean,
}

export default function SleepChart({ startDate, endDate, noMargin }: SleepChartProps) {
    const colors = useColors();
    const { sleep: sleepRecords } = useHealthData();

    const [ sleep, offset, labels, earliestHoursMinutes ] = useMemo(() => {
        const filteredRecords = filterCollectionRange(sleepRecords, startDate, endDate);

        const sleep: Map<string, number[]> = new Map();
        const offset: Map<string, number[]> = new Map();
        const offsetData: { start: Dayjs, stop: Dayjs, sameDay: boolean }[] = [];
        const labels: string[] = [];
        let earliestHoursMinutes = 2 * 60 * 24;

        for (const [ startTime, record ] of filteredRecords.entries()) {
            const sameDay = startTime.isSame(record.endTime, 'day');
            const startHourMinutes = startTime.hour() * 60 + startTime.minute() + (sameDay ? 24 * 60 : 0);
            if (startHourMinutes < earliestHoursMinutes)
                earliestHoursMinutes = startHourMinutes;

            const newDay = addToMapArray(sleep, record.endTime.format('YYYY-MM-DD'), record.duration.asMinutes());
            offsetData.push({ start: startTime, stop: record.endTime, sameDay });
            if (newDay)
                labels.push(record.endTime.format('ddd'));
        }

        for (const record of offsetData) {
            const startHourMinutes = record.start.hour() * 60 + record.start.minute() + (record.sameDay ? 24 * 60 : 0);
            addToMapArray(offset, record.stop.format('YYYY-MM-DD'), startHourMinutes - earliestHoursMinutes);
        }

        return [
            [ ...sleep.values() ],
            [ ...offset.values() ],
            labels,
            earliestHoursMinutes,
        ];
    }, [ sleepRecords, startDate, endDate ]);

    return <BaseChart barColor={colors.indigo}
                      scaleUnit="time"
                      backgroundColor={colors.indigoBackground}
                      values={sleep}
                      valuesOffset={offset}
                      reverse
                      scaleValueOffset={earliestHoursMinutes}
                      labels={labels}
                      noMargin={noMargin}/>;
}
