import { generateAPIUrl } from '@/utils/endpoints';
import { ToolSet, UIMessage } from 'ai';
import { fetch as expoFetch } from 'expo/fetch';
import { z } from 'zod';

export async function generateConversationTitle(messages: UIMessage[]) {
    const response = await expoFetch(generateAPIUrl('/api/title'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            messages: messages.map(({ role, content, parts }) => ({ role, content, parts })),
        }),
    });

    if (!response.ok)
        throw new Error('Failed to generate conversation title');

    return response.text().then(r => r.trim());
}

export interface DateRangeParams {
    startDate?: string;
    endDate?: string;
}

export const tools = {
    'get-daily-steps': {
        description: 'Get day-by-day walked steps count from the user.',
        parameters: z.object({
            startDate: z.string().optional().describe('Start date of the range to query, of the format yyyy-mm-dd'),
            endDate: z.string().optional().describe('End date of the range to query, of the format yyyy-mm-dd'),
        }).describe('Returns the steps count for each day in the range.'),
    },
    'get-daily-exercise': {
        description: 'Get day-by-day exercise / active moments from the user. They are classified by type (bike, run, sports and so on).',
        parameters: z.object({
            startDate: z.string().optional().describe('Start date of the range to query, of the format yyyy-mm-dd'),
            endDate: z.string().optional().describe('End date of the range to query, of the format yyyy-mm-dd'),
        }).describe('Returns each exercise that happened in the range, with its nature and duration.'),
    },
    'get-daily-sleep': {
        description: 'Get day-by-day sleep time from the user.',
        parameters: z.object({
            startDate: z.string().optional().describe('Start date of the range to query, of the format yyyy-mm-dd'),
            endDate: z.string().optional().describe('End date of the range to query, of the format yyyy-mm-dd'),
        }).describe('Returns the sleep time for each day in the range.'),
    },
    'display-steps': {
        description: 'Display a graph with the day-to-day steps of the user.',
        parameters: z.object({
            startDate: z.string().optional().describe('Start date of the range to display, of the format yyyy-mm-dd'),
            endDate: z.string().optional().describe('End date of the range to display, of the format yyyy-mm-dd'),
        }),
    },
    'display-exercise': {
        description: 'Display a graph with the day-to-day exercise of the user. All activities (bike, run, sports and so on) are mixed together.',
        parameters: z.object({
            startDate: z.string().optional().describe('Start date of the range to display, of the format yyyy-mm-dd'),
            endDate: z.string().optional().describe('End date of the range to display, of the format yyyy-mm-dd'),
        }),
    },
    'display-sleep': {
        description: 'Display a graph with the day-to-day sleep of the user.',
        parameters: z.object({
            startDate: z.string().optional().describe('Start date of the range to display, of the format yyyy-mm-dd'),
            endDate: z.string().optional().describe('End date of the range to display, of the format yyyy-mm-dd'),
        }),
    },
} satisfies ToolSet;
