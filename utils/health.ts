import { Permission, readRecords, ReadRecordsOptions, ReadRecordsResult } from 'react-native-health-connect';

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


export interface ReadHealthRecords {
    steps: ReadRecordsResult<'Steps'>;
    sleep: ReadRecordsResult<'SleepSession'>;
    exercise: ReadRecordsResult<'ExerciseSession'>;
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

    return { steps, sleep, exercise };
}
