import { readAndroidHealthRecords } from '@/utils/health/android';
import { readIosHealthRecords } from '@/utils/health/ios';
import dayjs, { Dayjs } from 'dayjs';
import { Duration } from 'dayjs/plugin/duration';
import { Platform } from 'react-native';
import * as Sentry from '@sentry/react-native';

export interface StepsData {
    steps: number;
}

export interface ExerciseData {
    endTime: Dayjs;
    duration: Duration;
    type: string;
}

export interface SleepData {
    endTime: Dayjs;
    duration: Duration;
}

export type StepsCollection = Map<Dayjs, StepsData>;
export type ExerciseCollection = Map<Dayjs, ExerciseData>;
export type SleepCollection = Map<Dayjs, SleepData>;

export type HealthRecord = StepsData | ExerciseData | SleepData;
export type HealthRecordsCollection = StepsCollection | ExerciseCollection | SleepCollection;

export interface HealthRecords {
    steps: StepsCollection;
    exercise: ExerciseCollection;
    sleep: SleepCollection;
}

/**
 * Platform-agnostic function to read health records
 */
export async function readHealthRecords(): Promise<HealthRecords> {
    Sentry.captureEvent({ event_id: 'health_read_records', level: 'info' });
    switch (Platform.OS) {
        case 'android':
            return readAndroidHealthRecords();
        case 'ios':
            return readIosHealthRecords();
        default:
            throw new Error(`Unsupported platform ${Platform.OS} for health records reading`);
    }
}

const DEFAULT_START_DATE = () => dayjs().subtract(7, 'day');
const DEFAULT_END_DATE = () => dayjs();

/**
 * Filter a collection of health records by date range
 * @param collection Collection of health records to filter
 * @param start Start date of the range, default is 7 days ago, exclusive
 * @param end End date of the range, default is today, inclusive
 */
export function filterCollectionRange<T extends Map<Dayjs, unknown>>(
    collection: T,
    start: Dayjs | Date | string = DEFAULT_START_DATE(),
    end: Dayjs | Date | string = DEFAULT_END_DATE()) {
    return new Map([ ...collection ].filter(
        ([ key ]) => key.isBetween(start, end, 'day', '(]'),
    )) as T;
}

export const parseRange = (start: Dayjs | Date | string, end: Dayjs | Date | string) => [
    start ? dayjs(start) : DEFAULT_START_DATE(),
    end ? dayjs(end) : DEFAULT_END_DATE(),
] as const;

/**
 * Format a collection of health records in a human-readable way
 * @param collection Collection of health records to format
 * @returns Array of formatted strings
 */
function formatStepsCollection(collection: StepsCollection) {
    if (Array.from(collection.values()).every(v => v.steps === 0)) {
        return [ 'No data available for the selected period. This is likely an error on the user end. Tell him.' ];
    }

    return Array.from(collection.entries()).map(([ key, value ]) =>
        `${key.format('YYYY-MM-DD')}: ${value.steps} steps`,
    );
}

/**
 * Format a collection of health records in a human-readable way
 * @param collection Collection of health records to format
 * @returns Array of formatted strings
 */
function formatExerciseCollection(collection: ExerciseCollection) {
    if (Array.from(collection.values()).every(v => v.duration.asMinutes() === 0)) {
        return [ 'No data available for the selected period. This is likely an error on the user end. Tell him.' ];
    }

    return Array.from(collection.entries()).map(([ key, value ]) =>
        `${key.format('YYYY-MM-DD')}: ${value.duration.format('H[h] mm[min]')} of ${value.type}`,
    );
}

/**
 * Format a collection of health records in a human-readable way
 * @param collection Collection of health records to format
 * @returns Array of formatted strings
 */
function formatSleepCollection(collection: SleepCollection) {
    if (Array.from(collection.values()).every(v => v.duration.asMinutes() === 0)) {
        return [ 'No data available for the selected period. This is likely an error on the user end. Tell him.' ];
    }

    return Array.from(collection.entries()).map(([ key, value ]) =>
        `${key.format('YYYY-MM-DD')}: ${value.duration.format('H[h] mm[min]')} of sleep, `
        + `from ${key.format('HH:mm')} to ${value.endTime.format('HH:mm')}`,
    );
}

/**
 * Format a collection of health records in a human-readable way
 * @param collection Collection of health records to format
 * @param type Type of health records to format ('steps', 'exercise', 'sleep')
 * @returns Array of formatted strings
 */
export function formatCollection(collection: HealthRecordsCollection, type: 'steps' | 'exercise' | 'sleep') {
    if (collection.size === 0) {
        return [ 'No data available for the selected period. This is likely an error on the user end. Tell him.' ];
    }

    switch (type) {
        case 'steps':
            return formatStepsCollection(collection as StepsCollection);
        case 'exercise':
            return formatExerciseCollection(collection as ExerciseCollection);
        case 'sleep':
            return formatSleepCollection(collection as SleepCollection);
    }
}
