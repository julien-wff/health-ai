import { DateRangeParams } from '@/utils/ai';
import { numberToExerciseType } from '@/utils/exerciseType';
import dayjs from 'dayjs';
import { checkInstalledApps } from 'expo-check-installed-apps';
import { Permission, readRecords, ReadRecordsOptions, RecordResult } from 'react-native-health-connect';

/**
 * Permissions required to read health records used by the AI
 */
export const REQUIRED_PERMISSIONS = [
    { recordType: 'Steps', accessType: 'read' },
    { recordType: 'SleepSession', accessType: 'read' },
    { recordType: 'ExerciseSession', accessType: 'read' },
] as Permission[];


/**
 * Check if all required permissions are granted
 * @param grantedPermissions Permissions currently granted
 * @returns True if all required permissions are granted
 */
export function hasAllRequiredPermissions(grantedPermissions: Permission[]) {
    const filteredGrantedPermissions = grantedPermissions.filter(
        grantedPermission => REQUIRED_PERMISSIONS.some(
            requiredPermission =>
                requiredPermission.recordType === grantedPermission.recordType
                && requiredPermission.accessType === grantedPermission.accessType,
        ),
    );

    return filteredGrantedPermissions.length === REQUIRED_PERMISSIONS.length;
}


export async function isHealthConnectInstalled() {
    const HEALTH_CONNECT_PACKAGE_NAME = 'com.google.android.apps.healthdata';
    const installed = await checkInstalledApps([ HEALTH_CONNECT_PACKAGE_NAME ]);
    return installed[HEALTH_CONNECT_PACKAGE_NAME];
}


export interface ReadHealthRecords {
    steps: RecordResult<'Steps'>[];
    sleep: RecordResult<'SleepSession'>[];
    exercise: RecordResult<'ExerciseSession'>[];
}


/**
 * Read health records for the last month.
 * Records are read in parallel for performance, but this method still takes a few hundred milliseconds.
 * @returns Health records for the last month
 */
export async function readHealthRecords(): Promise<ReadHealthRecords> {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const readOptions = {
        timeRangeFilter: {
            startTime: oneMonthAgo.toISOString(),
            operator: 'after',
        },
    } satisfies ReadRecordsOptions;

    const [ steps, sleep, exercise ] = await Promise.all([
        readRecords('Steps', readOptions),
        readRecords('SleepSession', readOptions),
        readRecords('ExerciseSession', readOptions),
    ]);

    return {
        steps: steps.records,
        sleep: sleep.records,
        exercise: exercise.records,
    };
}

export const dateRangeToDayJs = (range: DateRangeParams) => [
    range.startDate ? dayjs(range.startDate) : dayjs().subtract(7, 'day'),
    dayjs(range.endDate),
] as const;

export function filterRecordsForAI<T extends RecordResult<'Steps' | 'SleepSession' | 'ExerciseSession'>[]>(
    records: T,
    range: DateRangeParams,
): T {
    return records.filter(record =>
        dayjs(record.startTime).isBetween(
            ...dateRangeToDayJs(range),
            'day',
            '(]',
        ),
    ) as T;
}

export function formatRecordsForAI(records: RecordResult<'Steps' | 'SleepSession' | 'ExerciseSession'>[]) {
    if (records.length === 0)
        return '[]';

    if ('count' in records[0])
        return JSON.stringify(
            records.map(record => ({
                count: (record as RecordResult<'Steps'>).count,
                date: dayjs(record.startTime).format('YYYY-MM-DD'),
            })),
        );

    if ('exerciseType' in records[0])
        return JSON.stringify(
            records.map(record => ({
                durationMinutes: dayjs(record.endTime).diff(record.startTime, 'minute'),
                type: numberToExerciseType((record as RecordResult<'ExerciseSession'>).exerciseType),
                date: dayjs(record.startTime).format('YYYY-MM-DD'),
            })),
        );

    if ('stages' in records[0])
        return JSON.stringify(
            records.map(record => ({
                durationMinutes: dayjs(record.endTime).diff(record.startTime, 'minute'),
                startTime: dayjs(record.startTime).format('YYYY-MM-DD HH:mm'),
                endTime: dayjs(record.endTime).format('YYYY-MM-DD HH:mm'),
            })),
        );

    return '[]';
}
