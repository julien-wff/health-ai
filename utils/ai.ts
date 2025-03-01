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
            messages: messages.map(({ role, content }) => ({ role, content })),
        }),
    });

    return response.text();
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
        }),
    },
    'get-daily-exercise': {
        description: 'Get day-by-day exercise / active minutes from the user.',
        parameters: z.object({
            startDate: z.string().optional().describe('Start date of the range to query, of the format yyyy-mm-dd'),
            endDate: z.string().optional().describe('End date of the range to query, of the format yyyy-mm-dd'),
        }),
    },
} satisfies ToolSet;
