import BaseChart from '@/components/chart/base/BaseChart';
import { useAppState } from '@/hooks/useAppState';
import { useColors } from '@/hooks/useColors';
import { filterRecordsForAI } from '@/utils/health';
import dayjs, { Dayjs } from 'dayjs';
import { useMemo } from 'react';

interface SleepChartProps {
    startDate?: string, // yyyy-mm-dd
    endDate?: string, // yyyy-mm-dd
}

export default function SleepChart({ startDate, endDate }: SleepChartProps) {
    const colors = useColors();
    const { healthRecords } = useAppState();

    const [ sleep, offset, labels, earliestHoursMinutes ] = useMemo(() => {
        const filteredRecords = filterRecordsForAI(healthRecords?.sleep ?? [], { startDate, endDate });

        const sleep: number[] = [];
        const offset: number[] = [];
        const offsetData: { start: Dayjs, stop: Dayjs, sameDay: boolean }[] = [];
        const labels: string[] = [];
        let earliestHoursMinutes = 2 * 60 * 24;

        for (const record of filteredRecords) {
            const startTime = dayjs(record.startTime);
            const endTime = dayjs(record.endTime);

            const sameDay = startTime.isSame(endTime, 'day');
            const startHourMinutes = startTime.hour() * 60 + startTime.minute() + (sameDay ? 24 * 60 : 0);
            if (startHourMinutes < earliestHoursMinutes)
                earliestHoursMinutes = startHourMinutes;

            sleep.push(endTime.diff(startTime, 'minute'));
            offsetData.push({ start: startTime, stop: endTime, sameDay });
            labels.push(endTime.format('ddd'));
        }

        for (const record of offsetData) {
            const startHourMinutes = record.start.hour() * 60 + record.start.minute() + (record.sameDay ? 24 * 60 : 0);
            offset.push(startHourMinutes - earliestHoursMinutes);
        }

        return [ sleep, offset, labels, earliestHoursMinutes ];
    }, [ healthRecords?.sleep, startDate, endDate ]);

    return <BaseChart barColor={colors.indigo}
                      scaleUnit="time"
                      backgroundColor={colors.indigoBackground}
                      values={sleep}
                      valuesOffset={offset}
                      reverse
                      scaleValueOffset={earliestHoursMinutes}
                      labels={labels}/>;
}
