import AsyncStorage from '@react-native-async-storage/async-storage';
import { GOALS } from '@/utils/storageKeys';
import dedent from 'dedent';
import superJson from 'superjson';
import { useAppState } from '@/hooks/useAppState';


export const POSSIBLE_GOAL_TYPES = [ 'sleep', 'steps', 'exercise', 'other' ] as const;
export type GoalType = typeof POSSIBLE_GOAL_TYPES[number];

export interface CreateGoalsParams {
    description: string;
    mustBeCompletedBy: Date | string | null;
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
    mustBeCompletedBy: Date | null;
}

/**
 * Retrieve goals from Async Storage
 * @returns List of all non-deleted goals
 */
export async function getGoalsFromStorage(): Promise<Goal[]> {
    const jsonGoals = await AsyncStorage.getItem(GOALS);
    return jsonGoals ? superJson.parse<Goal[]>(jsonGoals) : [];
}

/**
 * Save goals to Async Storage
 * @param goals List of goals to save
 */
export async function saveGoalsToStorage(goals: Goal[]) {
    await AsyncStorage.setItem(GOALS, superJson.stringify(goals));
}

export async function createGoalAndSave(newGoal: CreateGoalsParams): Promise<Goal> {
    const goals = useAppState.getState().goals;

    // Find the highest existing ID to avoid duplicates
    const highestId = goals.length > 0
        ? Math.max(...goals.map(goal => goal.id))
        : 0;

    const goal: Goal = {
        ...newGoal,
        id: highestId + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        mustBeCompletedBy: newGoal.mustBeCompletedBy ? new Date(newGoal.mustBeCompletedBy) : null,
        isCompleted: false,
        isDeleted: false,
    };

    await saveGoalsToStorage([ ...goals, goal ]);
    return goal;
}

export async function updateGoalAndSave(goalId: number, updatedGoal: Partial<EditGoalsParams>): Promise<Goal[] | null> {
    const goals = useAppState.getState().goals;

    const goalIndex = goals.findIndex(goal => goal.id === goalId);
    if (goalIndex === -1) {
        return null;
    }

    const updatedGoalData: Goal = {
        ...goals[goalIndex],
        ...updatedGoal,
        mustBeCompletedBy: updatedGoal.mustBeCompletedBy ? new Date(updatedGoal.mustBeCompletedBy) : goals[goalIndex].mustBeCompletedBy,
        updatedAt: new Date(),
    };

    const updatedGoals = [ ...goals.slice(0, goalIndex), updatedGoalData, ...goals.slice(goalIndex + 1) ];
    await saveGoalsToStorage(updatedGoals);
    return updatedGoals;
}

/**
 * Format a goal to give as context for the AI agent.
 * @param goal The goal to format.
 * @returns A string representation of the goal.
 */
export function formatGoalForAI(goal: Goal) {
    if (goal.isDeleted) {
        return `Goal ID: ${goal.id} (deleted)`;
    } else {
        return dedent`
            Goal ID: ${goal.id}
            Type: ${goal.type}
            Description: ${goal.description}
            Created At: ${goal.createdAt.toISOString()}
            Must be completed by: ${goal.mustBeCompletedBy ? goal.mustBeCompletedBy.toISOString() : 'No deadline'}
            Completed: ${goal.isCompleted ? 'Yes' : 'No'}
        `;
    }
}

/**
 * Format a list of goals to give as context for the AI agent.
 * Ignore deleted goals.
 * @param goals The list of goals to format.
 * @returns A string representation of the goals, each one separated by a blank line.
 */
export const formatGoalsForAI = (goals: Goal[]) => {
    if (goals.length === 0) {
        return 'No goals found.';
    }

    return goals
        .filter(goal => !goal.isDeleted)
        .map(formatGoalForAI)
        .join('\n\n');
};
