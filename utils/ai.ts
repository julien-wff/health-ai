import { ToolSet, UIMessage } from 'ai';
import { fetch as expoFetch } from 'expo/fetch';
import { z } from 'zod';
import { generateAPIUrl } from '@/utils/endpoints';
import { POSSIBLE_GOAL_TYPES } from '@/utils/goals';


async function callGenerationAPIWithChats(url: string, messages: UIMessage[], errorMessage?: string) {
    const response = await expoFetch(generateAPIUrl(url), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            messages: messages.map(({ role, content, parts }) => ({ role, content, parts })),
        }),
    });

    if (!response.ok)
        throw new Error(`Failed to generate ${errorMessage}`);

    return response.text().then(r => r.trim());
}


/**
 * Generate a short conversation title based on the messages.
 * @param messages Agent and user messages.
 */
export const generateConversationTitle = (messages: UIMessage[]) =>
    callGenerationAPIWithChats('/api/title', messages, 'conversation title');


/**
 * Generate a short conversation summary based on the messages.
 * @param messages Agent and user messages.
 */
export const generateConversationSummary = (messages: UIMessage[]) =>
    callGenerationAPIWithChats('/api/summary', messages, 'conversation summary');


export const generateConversationSuggestions = async (messages: UIMessage[]) =>
    callGenerationAPIWithChats('/api/suggestions', messages, 'conversation suggestions')
        .then(r => JSON.parse(r) as string[]);


export interface DateRangeParams {
    startDate?: string;
    endDate?: string;
}

export interface NotificationParams {
    title?: string;
    body?: string;
    date?: string;
}

export type ToolParameters<T extends keyof typeof tools> = z.infer<typeof tools[T]['parameters']>;

export const tools = {
    'get-health-data-and-visualize': {
        description: 'Get health data (steps count, exercise, sleep) and optionally show a graph of it on the user\'s chat.',
        parameters: z.object({
            dataType: z.enum([ 'steps', 'exercise', 'sleep' ]).describe('Type of health data to get.'),
            display: z.boolean().optional().default(false).describe('Whether to display a graph of the data in the chat.'),
            startDate: z.string().describe('Start date of the range to query, of the format yyyy-mm-dd. Exclusive'),
            endDate: z.string().describe('End date of the range to query, of the format yyyy-mm-dd. Inclusive'),
        }).describe('Returns the health data.'),
    },
    'schedule-notification': {
        description: 'Schedule one or multiple notifications which will be displayed to the user. Try to not schedule more than 7 days.',
        parameters: z.object({
            title: z.string().describe('The notification title to display.'),
            body: z.string().describe('The notification message to display.'),
            dateList: z.string().array().nonempty().describe('A list of the dates and time when the notification will be triggered, of the format YYYY-MM-DD hh:mm.'),
            userPrompt: z.string().optional().describe('The user\'s prompt to kickstart the conversation.'),
        }),
    },
    'reschedule-notification': {
        description: 'Reschedule a previous scheduled notification to another date.',
        parameters: z.object({
            identifier: z.string().describe('The notification identifier.'),
            date: z.string().describe('Date and time (hour and minutes), of the format YYYY-MM-DD hh:mm.'),
        }),
    },
    'get-notifications': {
        description: 'Get information about all scheduled notifications.',
        parameters: z.object({}),
    },
    'cancel-notification': {
        description: 'Cancels one or multiple scheduled notification.',
        parameters: z.object({
            identifiers: z.string().array().nonempty().describe('The notification identifiers.'),
        }),
    },
    'create-user-goal': {
        description: 'Create a new health-related goal for the user to reach.',
        parameters: z.object({
            description: z.string().describe('Description of the goal, what the user must achieve.'),
            type: z.enum(POSSIBLE_GOAL_TYPES).describe('Type of the goal.'),
            mustBeCompletedBy: z.string().describe('Expected date of completion of the goal by the user, in the format of a valid javascript date or datetime.'),
        }).describe('Returns the created goal, notably its ID.'),
    },
    'update-user-goal': {
        description: 'Update an existing health-related goal for the user. Only specify the fields you want to update.',
        parameters: z.object({
            id: z.number().min(0).describe('ID of the goal to update.'),
            description: z.string().optional().describe('Description of the goal, what the user must achieve.'),
            mustBeCompletedBy: z.string().optional().describe('Expected date of completion of the goal by the user, in the format of a valid javascript date or datetime.'),
            isCompleted: z.boolean().optional().describe('Whether you, AI, estimate that the goal is completed or not.'),
            isDeleted: z.boolean().optional().describe('True if the goal should be deleted. Cannot be undone.'),
        }),
    },
    'display-user-goal': {
        description: 'Display a widget with the goal information to the chat. Always try to use this tool call when talking about a specific goal.',
        parameters: z.object({
            id: z.number().min(0).describe('ID of the goal to display.'),
        }).describe('Returns the goal. Returns null if the goal is not found.'),
    },
} satisfies ToolSet;
