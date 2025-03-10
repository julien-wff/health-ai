import { readAndroidHealthRecords } from '@/utils/health/android';
import dayjs, { Dayjs } from 'dayjs';
import { Duration } from 'dayjs/plugin/duration';
import { Platform } from 'react-native';

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
 * Reads health records based on the current platform.
 *
 * On Android, this function retrieves the records by delegating to {@link readAndroidHealthRecords}. For other platforms, it throws an error.
 *
 * @returns A promise that resolves to the health records for the current platform.
 *
 * @throws {Error} If the current platform is unsupported.
 */
export async function readHealthRecords(): Promise<HealthRecords> {
    switch (Platform.OS) {
        case 'android':
            return readAndroidHealthRecords();
        default:
            throw new Error('Unsupported platform');
    }
}

const DEFAULT_START_DATE = () => dayjs().subtract(7, 'day');
const DEFAULT_END_DATE = () => dayjs();

/**
 * Filters a Map of health records by a specified date range.
 *
 * Returns a new Map that includes only the records with keys (dates) that fall within the range (start, end], where the start is exclusive and the end is inclusive.
 * If no dates are provided, the function defaults to using 7 days ago for the start and today for the end.
 *
 * @param collection - A Map of health records keyed by Dayjs instances representing the record dates.
 * @param start - The exclusive start of the date range. Defaults to 7 days ago.
 * @param end - The inclusive end of the date range. Defaults to today.
 *
 * @returns A new Map containing the health records within the specified date range.
 */
export function filterCollectionRange<T extends HealthRecord>(
    collection: Map<Dayjs, T>,
    start: Dayjs | Date | string = DEFAULT_START_DATE(),
    end: Dayjs | Date | string = DEFAULT_END_DATE()) {
    return new Map<Dayjs, T>([ ...collection ].filter(
        ([ key ]) => key.isBetween(start, end, 'day', '(]'),
    ));
}

export const parseRange = (start: Dayjs | Date | string, end: Dayjs | Date | string) => [
    start ? dayjs(start) : DEFAULT_START_DATE(),
    end ? dayjs(end) : DEFAULT_END_DATE(),
] as const;

/**
 * Formats a StepsCollection into an array of human-readable strings.
 *
 * Each entry in the collection is transformed into a string in the format "YYYY-MM-DD: X steps",
 * where the date is formatted using the "YYYY-MM-DD" pattern and X represents the number of steps recorded.
 *
 * @param collection - A collection mapping dates to their corresponding steps data.
 * @returns An array of strings, each representing a formatted record from the collection.
 */
function formatStepsCollection(collection: StepsCollection) {
    return Array.from(collection.entries()).map(([ key, value ]) =>
        `${key.format('YYYY-MM-DD')}: ${value.steps} steps`,
    );
}

/**
 * Converts a Map of exercise records into human-readable strings.
 *
 * For each exercise record, this function formats the key as a date string (YYYY-MM-DD), the duration as hours and minutes,
 * and appends the type of exercise.
 *
 * @param collection - A map of exercise records keyed by Dayjs date objects.
 * @returns An array of formatted strings representing each exercise record.
 */
function formatExerciseCollection(collection: ExerciseCollection) {
    return Array.from(collection.entries()).map(([ key, value ]) =>
        `${key.format('YYYY-MM-DD')}: ${value.duration.format('H[h] mm[min]')} of ${value.type}`,
    );
}

/**
 * Formats a collection of sleep records into an array of human-readable strings.
 *
 * Each formatted string includes the record's date (formatted as "YYYY-MM-DD") followed by the sleep duration
 * formatted as "H[h] mm[min]" of sleep.
 *
 * @param collection - A map of dates to sleep data, where each date can be formatted and each sleep data includes
 * a duration that can be formatted.
 * @returns An array of formatted strings representing the sleep records.
 */
function formatSleepCollection(collection: SleepCollection) {
    return Array.from(collection.entries()).map(([ key, value ]) =>
        `${key.format('YYYY-MM-DD')}: ${value.duration.format('H[h] mm[min]')} of sleep`,
    );
}

/**
 * Format a collection of health records in a human-readable way
 * @param collection Collection of health records to format
 * @param type Type of health records to format ('steps', 'exercise', 'sleep')
 * @returns Array of formatted strings
 */
export function formatCollection(collection: StepsCollection, type: 'steps'): string[];
export function formatCollection(collection: ExerciseCollection, type: 'exercise'): string[];
export function formatCollection(collection: SleepCollection, type: 'sleep'): string[]
/**
 * Formats a health records collection into an array of human-readable strings.
 *
 * Delegates to a type-specific formatting function based on the provided record type:
 * - "steps": Uses the steps formatter.
 * - "exercise": Uses the exercise formatter.
 * - "sleep": Uses the sleep formatter.
 *
 * @param collection - The collection of health records to be formatted.
 * @param type - The type of records contained in the collection, which determines the formatting strategy.
 * @returns An array of formatted strings representing the health records.
 */
export function formatCollection(collection: HealthRecordsCollection, type: 'steps' | 'exercise' | 'sleep') {
    switch (type) {
        case 'steps':
            return formatStepsCollection(collection as StepsCollection);
        case 'exercise':
            return formatExerciseCollection(collection as ExerciseCollection);
        case 'sleep':
            return formatSleepCollection(collection as SleepCollection);
    }
}
