import { ExerciseCollection, HealthRecords, SleepCollection, StepsCollection } from '@/utils/health';
import { create } from 'zustand';


export type WarningNotificationStatus = null | 'show' | 'shown' | 'dismissed';

export interface HealthDataState {
    loaded: boolean;
    empty: boolean;
    warningNotificationStatus: WarningNotificationStatus;
    steps: StepsCollection;
    exercise: ExerciseCollection;
    sleep: SleepCollection;
    setHealthRecords: (records: HealthRecords) => void;
    setWarningNotificationStatus: (status: WarningNotificationStatus) => void;
}

export const useHealthData = create<HealthDataState>(set => ({
    loaded: false,
    empty: true,
    steps: new Map(),
    warningNotificationStatus: null,
    exercise: new Map(),
    sleep: new Map(),
    setHealthRecords: (records: HealthRecords) => set({
        loaded: true,
        empty: records.steps.size === 0 && records.exercise.size === 0 && records.sleep.size === 0,
        steps: records.steps,
        exercise: records.exercise,
        sleep: records.sleep,
    }),
    setWarningNotificationStatus: status => set({ warningNotificationStatus: status }),
}));
