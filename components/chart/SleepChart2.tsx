import BaseChart from '@/components/chart/base/BaseChart';
import { useColors } from '@/hooks/useColors';
import { useHealthData } from '@/hooks/useHealthData';
import { filterCollectionRange } from '@/utils/health';
import { Dayjs } from 'dayjs';
import { useMemo } from 'react';
import MultiBarBaseChart from '@/components/chart/base/MultiBarBaseChart';

interface SleepChartProps {
    startDate: Dayjs,
    endDate: Dayjs,
    noMargin?: boolean,
}

export default function SleepChart2({ startDate, endDate, noMargin }: SleepChartProps) {
    const colors = useColors();
    const { sleep: sleepRecords } = useHealthData();

    const [ sleep, offset, labels, earliestHoursMinutes ] = useMemo(() => {
        const filteredRecords = filterCollectionRange(sleepRecords, startDate, endDate);
        console.log("Filtered Sleep records: ", filteredRecords);


        const sleep: number[] = [];
        const offset: number[] = [];
        const offsetData: { start: Dayjs, stop: Dayjs, sameDay: boolean }[] = [];
        const labels: Dayjs[] = [];

        // The earliest is 2 days in minutes?
        // So, for each day we will plot
        let earliestHoursMinutes = 2 * 60 * 24;

        for (const [ startTime, record ] of filteredRecords.entries()) {
            // Check if a sleep record  started and finished same day
            const sameDay = startTime.isSame(record.endTime, 'day');

            // Compute the start time of sleep in minutes
            // If it stared and finished same day, we will add 1 day offset
            const startHourMinutes = startTime.hour() * 60 + startTime.minute() + (sameDay ? 24 * 60 : 0);

            if (startHourMinutes < earliestHoursMinutes)
                earliestHoursMinutes = startHourMinutes;

            sleep.push(record.duration.asMinutes());
            offsetData.push({ start: startTime, stop: record.endTime, sameDay });
            labels.push(record.endTime);
        }

        for (const record of offsetData) {
            const startHourMinutes = record.start.hour() * 60 + record.start.minute() + (record.sameDay ? 24 * 60 : 0);
            offset.push(startHourMinutes - earliestHoursMinutes);
        }

        // Group records by day
        let groupRowIndex: number = 0;
        const groupedSleep: number[][] = [];
        const groupedOffset: number[][] = [];
        const groupedLabels: string[] = [];

        // Initialize first element
        let labelIndex = 0;

        groupedSleep.push([sleep[labelIndex]]);
        groupedOffset.push([offset[labelIndex]]);
        groupedLabels.push(labels[labelIndex].format('ddd'));

        labelIndex++;

        while (labels.length > labelIndex) {
            // If the days are not the same, go to the next day
            if (!labels[labelIndex].isSame(labels[labelIndex - 1], 'day')) {
                groupedSleep.push([]);
                groupedOffset.push([]);
                groupedLabels.push(labels[labelIndex].format('ddd'));
                groupRowIndex++;
            }

            groupedSleep[groupRowIndex].push(sleep[labelIndex]);
            groupedOffset[groupRowIndex].push(offset[labelIndex]);

            labelIndex++;
        }


        console.log("Sleep: ", sleep);
        console.log("Offset: ", offset);
        console.log("Labels: ", labels);
        console.log("earliest: ", earliestHoursMinutes);

        console.log("Grouped sleep: ", groupedSleep);
        console.log("Grouped offset: ", groupedOffset);
        console.log("Grouped labels: ", groupedLabels);

        return [ groupedSleep, groupedOffset, groupedLabels, earliestHoursMinutes ];
    }, [ sleepRecords, startDate, endDate ]);

    return <MultiBarBaseChart barColor={colors.indigo}
                      scaleUnit="time"
                      backgroundColor={colors.indigoBackground}
                      values={sleep}
                      valuesOffset={offset}
                      reverse
                      scaleValueOffset={earliestHoursMinutes}
                      labels={labels}
                      noMargin={noMargin}/>;
}
