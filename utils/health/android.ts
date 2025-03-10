import { numberToExerciseType } from '@/utils/health/androidExerciseType';
import { ExerciseData, HealthRecords, SleepData, StepsData } from '@/utils/health/index';
import dayjs, { Dayjs } from 'dayjs';
import { checkInstalledApps } from 'expo-check-installed-apps';
import { Permission, readRecords, ReadRecordsOptions } from 'react-native-health-connect';

/**
 * Permissions required to read health records used by the AI
 */
export const REQUIRED_PERMISSIONS = [
    { recordType: 'Steps', accessType: 'read' },
    { recordType: 'SleepSession', accessType: 'read' },
    { recordType: 'ExerciseSession', accessType: 'read' },
] as Permission[];


/**
 * Verifies that all health record permissions required by the app are granted.
 *
 * This function checks whether the provided list includes each of the permissions defined in REQUIRED_PERMISSIONS
 * by comparing both the record type and access type. It returns true only if every required permission is present.
 *
 * @param grantedPermissions - The list of permissions that have been granted.
 * @returns True if all required permissions are granted; otherwise, false.
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


/**
 * Checks if the Health Connect app is installed on the device.
 *
 * This asynchronous function queries the system for the Health Connect package 
 * by checking for the package name 'com.google.android.apps.healthdata'. 
 * It returns a promise that resolves to true if the app is installed, false otherwise.
 *
 * @returns A promise that resolves to true if Health Connect is installed, otherwise false.
 */
export async function isHealthConnectInstalled() {
    const HEALTH_CONNECT_PACKAGE_NAME = 'com.google.android.apps.healthdata';
    const installed = await checkInstalledApps([ HEALTH_CONNECT_PACKAGE_NAME ]);
    return installed[HEALTH_CONNECT_PACKAGE_NAME];
}


/**
 * Retrieves health records for the last 7 days.
 *
 * This asynchronous function concurrently reads health records for steps, sleep sessions, and exercise sessions
 * using a common time range filter. Each record set is transformed into a Map with the record's start time as the key:
 * - Steps records: Each entry includes the step count.
 * - Sleep records: Each entry contains the session's end time and computed duration.
 * - Exercise records: Each entry contains the session's end time, computed duration, and an exercise type converted
 *   from a numeric representation.
 *
 * @returns An object containing maps of steps, sleep, and exercise records keyed by their start time.
 */
export async function readAndroidHealthRecords(): Promise<HealthRecords> {
    const readOptions = {
        timeRangeFilter: {
            startTime: dayjs().subtract(7, 'day').toISOString(),
            operator: 'after',
        },
    } satisfies ReadRecordsOptions;

    const [ steps, sleep, exercise ] = await Promise.all([
        readRecords('Steps', readOptions),
        readRecords('SleepSession', readOptions),
        readRecords('ExerciseSession', readOptions),
    ]);

    return {
        steps: new Map<Dayjs, StepsData>(steps.records.map(r => [
            dayjs(r.startTime),
            {
                steps: r.count,
            },
        ])),
        sleep: new Map<Dayjs, SleepData>(sleep.records.map(r => [
            dayjs(r.startTime),
            {
                endTime: dayjs(r.endTime),
                duration: dayjs.duration(dayjs(r.endTime).diff(dayjs(r.startTime))),
            },
        ])),
        exercise: new Map<Dayjs, ExerciseData>(exercise.records.map(r => [
            dayjs(r.startTime),
            {
                endTime: dayjs(r.endTime),
                duration: dayjs.duration(dayjs(r.endTime).diff(dayjs(r.startTime))),
                type: numberToExerciseType(r.exerciseType),
            },
        ])),
    };
}
