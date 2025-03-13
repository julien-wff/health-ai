import { ExerciseCollection, HealthRecords, SleepCollection, StepsCollection } from '@/utils/health/index';
import dayjs from 'dayjs';
import BrokenHealthKit, { type HealthInputOptions, type HealthValue } from 'react-native-health';
import { Platform } from 'react-native';

// React-native-health is not yet compatible with React Native 0.76
// See https://github.com/agencyenterprise/react-native-health/issues/399#issuecomment-2612353058
const AppleHealthKit = Platform.OS === 'ios'
    ? require('react-native').NativeModules.AppleHealthKit as typeof BrokenHealthKit
    : null;

if (AppleHealthKit)
    AppleHealthKit.Constants = BrokenHealthKit.Constants;

export { AppleHealthKit };

export const REQUIRED_PERMISSIONS = [
    AppleHealthKit?.Constants.Permissions.StepCount!,
    AppleHealthKit?.Constants.Permissions.Workout!,
    AppleHealthKit?.Constants.Permissions.SleepAnalysis!,
];


/**
 * Check if HealthKit is available on the device
 * @returns True if HealthKit is available
 */
export const isHealthKitAvailable = () => new Promise<boolean>((resolve, reject) => {
    AppleHealthKit!.isAvailable((err, available) => {
        if (err) {
            reject(err);
            return;
        }
        resolve(available);
    });
});


/**
 * Initialize HealthKit. This will prompt the user to grant permissions.
 * Note that we cannot see which permissions were granted or denied.
 */
export const initHealthKit = () => new Promise<HealthValue>((resolve, reject) => {
    AppleHealthKit!.initHealthKit({
        permissions: {
            read: REQUIRED_PERMISSIONS,
            write: [],
        },
    }, (err, results) => {
        if (err) {
            reject(err);
            return;
        }
        resolve(results);
    });
});


/**
 * Read health records for the last month.
 * Records are read in parallel for performance, but this method still takes a few hundred milliseconds.
 * @returns Health records for the last month
 */
export async function readIosHealthRecords(): Promise<HealthRecords> {
    const options = {
        startDate: dayjs().subtract(1, 'month').toISOString(),
    } satisfies HealthInputOptions;

    const [ steps, exercise, sleep ] = await Promise.all([
        readStepsCount(options),
        readWorkouts(options),
        readSleep(options),
    ]);

    return { steps, exercise, sleep };
}


/**
 * Read daily step counts for the last month
 * @param options Options for reading step counts, like time range
 * @returns Daily step counts for the last month
 */
const readStepsCount = (options: HealthInputOptions) => new Promise<StepsCollection>((resolve, reject) => {
    AppleHealthKit!.getDailyStepCountSamples(options, (err, steps) => {
        if (err) {
            reject(err);
            return;
        }

        const result: StepsCollection = new Map();
        const dailyStepTotals = new Map<string, number>();

        // Aggregate steps by date
        for (const step of steps) {
            const date = dayjs(step.startDate).startOf('day');
            const dateKey = date.format('YYYY-MM-DD');
            const currentSteps = dailyStepTotals.get(dateKey) || 0;
            dailyStepTotals.set(dateKey, currentSteps + step.value);
        }

        // Create the final map with dayjs keys
        for (const [ dateKey, totalSteps ] of dailyStepTotals) {
            const date = dayjs(dateKey);
            result.set(date, { steps: totalSteps });
        }

        resolve(result);
    });
});


/**
 * Read workout sessions for the last month
 * @param options Options for reading workout sessions, like time range
 * @returns Workout sessions for the last month
 */
const readWorkouts = (options: HealthInputOptions) => new Promise<ExerciseCollection>((resolve, reject) => {
    AppleHealthKit!.getSamples({
        ...options,
        type: AppleHealthKit!.Constants.Observers.Workout,
    }, (err, workouts) => {
        if (err) {
            reject(err);
            return;
        }

        // TODO: workout reading seems annoying to implement https://github.com/agencyenterprise/react-native-health/blob/master/docs/getSamples.md
        const result: ExerciseCollection = new Map();
        // for (const workout of workouts) {
        //     console.log(workout);
        //     const date = dayjs(workout.startDate);
        //     result.set(date, {
        //         type: workout.metadata,
        //     });
        // }

        resolve(result);
    });
});


/**
 * Read sleep sessions for the last month
 * @param options Options for reading sleep sessions, like time range
 * @returns Sleep sessions for the last month
 */
const readSleep = (options: HealthInputOptions) => new Promise<SleepCollection>((resolve, reject) => {
    AppleHealthKit!.getSleepSamples(options, (err, sessions) => {
        if (err) {
            reject(err);
            return;
        }

        const result: SleepCollection = new Map();
        const dailySleepData = new Map<string, { totalMinutes: number, lastEndTime: dayjs.Dayjs }>();

        // Aggregate sleep by date
        for (const session of sessions) {
            const date = dayjs(session.startDate).startOf('day');
            const dateKey = date.format('YYYY-MM-DD');
            const sessionDuration = dayjs(session.endDate).diff(dayjs(session.startDate), 'minute');

            const current = dailySleepData.get(dateKey);
            if (current) {
                current.totalMinutes += sessionDuration;
                // Keep the latest end time
                if (dayjs(session.endDate).isAfter(current.lastEndTime)) {
                    current.lastEndTime = dayjs(session.endDate);
                }
            } else {
                dailySleepData.set(dateKey, {
                    totalMinutes: sessionDuration,
                    lastEndTime: dayjs(session.endDate),
                });
            }
        }

        // Create the final map with dayjs keys
        for (const [ dateKey, data ] of dailySleepData) {
            const date = dayjs(dateKey);
            result.set(date, {
                endTime: data.lastEndTime,
                duration: dayjs.duration(data.totalMinutes, 'minute'),
            });
        }

        resolve(result);
    });
});
