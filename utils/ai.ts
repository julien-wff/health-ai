import { ToolSet, UIMessage } from 'ai';
import { fetch as expoFetch } from 'expo/fetch';
import { z } from 'zod';
import { generateAPIUrl } from '@/utils/endpoints';


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

export const tools = {
    'get-daily-steps': {
        description: 'Get day-by-day walked steps count from the user.',
        parameters: z.object({
            startDate: z.string().optional().describe('Start date of the range to query, of the format yyyy-mm-dd. Exclusive'),
            endDate: z.string().optional().describe('End date of the range to query, of the format yyyy-mm-dd. Inclusive'),
        }).describe('Returns the steps count for each day in the range.'),
    },
    'get-daily-exercise': {
        description: 'Get day-by-day exercise / active moments from the user. They are classified by type (bike, run, sports and so on).',
        parameters: z.object({
            startDate: z.string().optional().describe('Start date of the range to query, of the format yyyy-mm-dd. Exclusive'),
            endDate: z.string().optional().describe('End date of the range to query, of the format yyyy-mm-dd. Inclusive'),
        }).describe('Returns each exercise that happened in the range, with its nature and duration.'),
    },
    'get-daily-sleep': {
        description: 'Get day-by-day sleep time from the user.',
        parameters: z.object({
            startDate: z.string().optional().describe('Start date of the range to query, of the format yyyy-mm-dd. Exclusive'),
            endDate: z.string().optional().describe('End date of the range to query, of the format yyyy-mm-dd. Inclusive'),
        }).describe('Returns the sleep time for each day in the range.'),
    },
    'display-steps': {
        description: 'Display a graph with the day-to-day steps of the user.',
        parameters: z.object({
            startDate: z.string().optional().describe('Start date of the range to display, of the format yyyy-mm-dd. Exclusive'),
            endDate: z.string().optional().describe('End date of the range to display, of the format yyyy-mm-dd. Inclusive'),
        }),
    },
    'display-exercise': {
        description: 'Display a graph with the day-to-day exercise of the user. All activities (bike, run, sports and so on) are mixed together.',
        parameters: z.object({
            startDate: z.string().optional().describe('Start date of the range to display, of the format yyyy-mm-dd. Exclusive'),
            endDate: z.string().optional().describe('End date of the range to display, of the format yyyy-mm-dd. Inclusive'),
        }),
    },
    'display-sleep': {
        description: 'Display a graph with the day-to-day sleep of the user.',
        parameters: z.object({
            startDate: z.string().optional().describe('Start date of the range to display, of the format yyyy-mm-dd. Exclusive'),
            endDate: z.string().optional().describe('End date of the range to display, of the format yyyy-mm-dd. Inclusive'),
        }),
    },
    'schedule-notification': {
        description: 'Schedule a notification which will be displayed to the user.',
        parameters: z.object({
            date: z.string().optional().describe('Date and time (hour and minutes), of the format YYYY-MM-DD hh:mm.'),
            title: z.string().optional().describe('The notification title to display.'),
            body: z.string().optional().describe('The notification message to display.'),
        }),
    },
    'reschedule-notification': {
        description: 'Reschedule a previous scheduled notification to another date.',
        parameters: z.object({
            identifier: z.string().optional().describe('The notification identifier.'),
            date: z.string().optional().describe('Date and time (hour and minutes), of the format YYYY-MM-DD hh:mm.'),
        }),
    },
    'get-notifications': {
        description: 'Get information about all scheduled notifications.',
        parameters: z.object({})
    },
    'cancel-notification': {
        description: 'Cancels a single scheduled notification.',
        parameters: z.object({
            identifier: z.string().optional().describe('The notification identifier.'),
        })
    }

} satisfies ToolSet;
