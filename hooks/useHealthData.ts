import { ExerciseCollection, HealthRecords, SleepCollection, StepsCollection } from '@/utils/health';
import { create } from 'zustand';


export interface HealthDataState {
    loaded: boolean;
    steps: StepsCollection;
    exercise: ExerciseCollection;
    sleep: SleepCollection;
    setHealthRecords: (records: HealthRecords) => void;
}

export const useHealthData = create<HealthDataState>(set => ({
    loaded: false,
    steps: new Map(),
    exercise: new Map(),
    sleep: new Map(),
    setHealthRecords: (records: HealthRecords) => set({
        loaded: true,
        steps: records.steps,
        exercise: records.exercise,
        sleep: records.sleep,
    }),
}));
