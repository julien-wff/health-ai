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


/**
 * Check if Health Connect is installed on the device
 * @returns True if Health Connect is installed
 */
export async function isHealthConnectInstalled() {
    const HEALTH_CONNECT_PACKAGE_NAME = 'com.google.android.apps.healthdata';
    const installed = await checkInstalledApps([ HEALTH_CONNECT_PACKAGE_NAME ]);
    return installed[HEALTH_CONNECT_PACKAGE_NAME];
}


/**
 * Read health records for the last month.
 * Records are read in parallel for performance, but this method still takes a few hundred milliseconds.
 * @returns Health records for the last month
 */
export async function readAndroidHealthRecords(): Promise<HealthRecords> {
    const readOptions = {
        timeRangeFilter: {
            startTime: dayjs().subtract(1, 'month').toISOString(),
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
