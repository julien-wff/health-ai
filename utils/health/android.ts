import { numberToExerciseType } from '@/utils/health/androidExerciseType';
import { ExerciseData, HealthRecords, SleepData, StepsData } from '@/utils/health/index';
import dayjs, { Dayjs } from 'dayjs';
import { checkInstalledApps } from 'expo-check-installed-apps';
import type {
    Permission,
    ReadRecordsOptions,
    ReadRecordsResult,
    RecordResult,
    RecordType,
} from 'react-native-health-connect';
import { Platform } from 'react-native';


/**
 * Return the react-native-health-connect module if the platform is Android
 * because if imported on iOS, it will make a build error.
 */
export const healthConnect = Platform.OS === 'android'
    ? require('react-native-health-connect')
    : null;

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
 * Aggregates steps data by day
 * @param stepsRecords Array of step records from Health Connect
 * @returns Map with dates as keys and aggregated step counts as values
 */
function aggregateStepsByDay(stepsRecords: ReadRecordsResult<'Steps'>['records']): Map<Dayjs, StepsData> {
    const dailySteps = new Map<string, number>();

    // Create entries for the last 30 days with 0 steps
    for (let i = 30; i > 0; i--) {
        const date = dayjs().subtract(i, 'days');
        const dateStr = date.format('YYYY-MM-DD');
        dailySteps.set(dateStr, 0);
    }

    // Group and sum steps by date string
    stepsRecords.forEach(record => {
        const dateStr = dayjs(record.startTime).format('YYYY-MM-DD');
        dailySteps.set(dateStr, (dailySteps.get(dateStr) ?? 0) + record.count);
    });

    // Convert to the required Map<Dayjs, StepsData> format
    const result = new Map<Dayjs, StepsData>();
    dailySteps.forEach((steps, dateStr) => {
        result.set(dayjs(dateStr), { steps });
    });

    return result;
}

const RECORDS_READ_OPTIONS = {
    timeRangeFilter: {
        startTime: dayjs().subtract(1, 'month').toISOString(),
        operator: 'after',
    },
    pageSize: 4000,
} satisfies ReadRecordsOptions;


/**
 * Read health records from Health Connect accounting for pagination
 * @param record The type of record to read
 * @returns All records from the last month
 */
async function readHealthRecords<T extends RecordType>(record: T): Promise<RecordResult<T>[]> {
    let records: RecordResult<T>[] = [];
    let pageToken: string | undefined = undefined;

    do {
        const result: ReadRecordsResult<T> = await healthConnect!.readRecords(record, {
            ...RECORDS_READ_OPTIONS,
            pageToken,
        });
        records = records.concat(result.records);
        pageToken = result.pageToken;
    } while (pageToken);

    return records;
}


/**
 * Read health records for the last month.
 * Records are read in parallel for performance, but this method still takes a few hundred milliseconds.
 * @returns Health records for the last month
 */
export async function readAndroidHealthRecords(): Promise<HealthRecords> {

    const [ steps, sleep, exercise ] = await Promise.all([
        readHealthRecords('Steps'),
        readHealthRecords('SleepSession'),
        readHealthRecords('ExerciseSession'),
    ]);

    return {
        steps: aggregateStepsByDay(steps),
        sleep: new Map<Dayjs, SleepData>(sleep.map(r => [
            dayjs(r.startTime),
            {
                endTime: dayjs(r.endTime),
                duration: dayjs.duration(dayjs(r.endTime).diff(dayjs(r.startTime))),
            },
        ])),
        exercise: new Map<Dayjs, ExerciseData>(exercise.map(r => [
            dayjs(r.startTime),
            {
                endTime: dayjs(r.endTime),
                duration: dayjs.duration(dayjs(r.endTime).diff(dayjs(r.startTime))),
                type: numberToExerciseType(r.exerciseType),
            },
        ])),
    };
}
