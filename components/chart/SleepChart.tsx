import BaseChart from '@/components/chart/base/BaseChart';
import { useColors } from '@/hooks/useColors';
import { useHealthData } from '@/hooks/useHealthData';
import { filterCollectionRange } from '@/utils/health';
import { Dayjs } from 'dayjs';
import { useMemo } from 'react';

interface SleepChartProps {
    startDate: Dayjs,
    endDate: Dayjs,
}

/**
 * Renders a sleep chart that visualizes sleep duration and time offsets.
 *
 * This component filters sleep records within the specified date range, computes each record’s sleep duration (in minutes), calculates offsets relative to the earliest sleep event (accounting for overnight spans), and generates labels based on the record end times. The derived data is passed to a BaseChart component for visualization.
 *
 * @param startDate - The start date defining the lower bound for filtering sleep records.
 * @param endDate - The end date defining the upper bound for filtering sleep records.
 * @returns A JSX element rendering the sleep chart.
 */
export default function SleepChart({ startDate, endDate }: SleepChartProps) {
    const colors = useColors();
    const { sleep: sleepRecords } = useHealthData();

    const [ sleep, offset, labels, earliestHoursMinutes ] = useMemo(() => {
        const filteredRecords = filterCollectionRange(sleepRecords, startDate, endDate);

        const sleep: number[] = [];
        const offset: number[] = [];
        const offsetData: { start: Dayjs, stop: Dayjs, sameDay: boolean }[] = [];
        const labels: string[] = [];
        let earliestHoursMinutes = 2 * 60 * 24;

        for (const [ startTime, record ] of filteredRecords.entries()) {
            const sameDay = startTime.isSame(record.endTime, 'day');
            const startHourMinutes = startTime.hour() * 60 + startTime.minute() + (sameDay ? 24 * 60 : 0);
            if (startHourMinutes < earliestHoursMinutes)
                earliestHoursMinutes = startHourMinutes;

            sleep.push(record.duration.asMinutes());
            offsetData.push({ start: startTime, stop: record.endTime, sameDay });
            labels.push(record.endTime.format('ddd'));
        }

        for (const record of offsetData) {
            const startHourMinutes = record.start.hour() * 60 + record.start.minute() + (record.sameDay ? 24 * 60 : 0);
            offset.push(startHourMinutes - earliestHoursMinutes);
        }

        return [ sleep, offset, labels, earliestHoursMinutes ];
    }, [ sleepRecords, startDate, endDate ]);

    return <BaseChart barColor={colors.indigo}
                      scaleUnit="time"
                      backgroundColor={colors.indigoBackground}
                      values={sleep}
                      valuesOffset={offset}
                      reverse
                      scaleValueOffset={earliestHoursMinutes}
                      labels={labels}/>;
}
