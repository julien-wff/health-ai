import AsyncStorage from '@react-native-async-storage/async-storage';
import { GOALS } from '@/utils/storageKeys';
import dedent from 'dedent';


export type GoalType = 'sleep' | 'activity' | 'other';

export interface CreateGoalsParams {
    description: string;
    mustBeCompletedBy: Date | null;
    type: GoalType;
}

export interface EditGoalsParams extends CreateGoalsParams {
    isCompleted: boolean;
    isDeleted: boolean;
}

export interface Goal extends EditGoalsParams {
    id: number;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Retrieve goals from Async Storage
 * @returns List of all non-deleted goals
 */
export async function getGoalsFromStorage(): Promise<Goal[]> {
    const jsonGoals = await AsyncStorage.getItem(GOALS);
    const goals = jsonGoals ? JSON.parse(jsonGoals) : [];
    return goals.filter((goal: Goal) => !goal.isDeleted);
}

/**
 * Save goals to Async Storage
 * @param goals List of goals to save
 */
export async function saveGoalsToStorage(goals: Goal[]) {
    await AsyncStorage.setItem(GOALS, JSON.stringify(goals));
}

/**
 * Format a goal to give as context for the AI agent
 * @param goal The goal to format
 */
export const formatGoalForAI = (goal: Goal) => dedent`
    Goal ID: ${goal.id}
    Type: ${goal.type}
    Description: ${goal.description}
    Created At: ${goal.createdAt.toISOString()}
    Must be completed by: ${goal.mustBeCompletedBy ? goal.mustBeCompletedBy.toISOString() : 'No deadline'}
    Completed: ${goal.isCompleted ? 'Yes' : 'No'}
`;

/**
 * Format a list of goals to give as context for the AI agent
 * @param goals The list of goals to format
 */
export const formatGoalsForAI = (goals: Goal[]) => {
    if (goals.length === 0) {
        return 'No goals found.';
    }

    return goals.map(formatGoalForAI).join('\n\n');
};
