import { generateAPIUrl } from '@/utils/endpoints';
import { ToolSet, UIMessage } from 'ai';
import { fetch as expoFetch } from 'expo/fetch';
import { z } from 'zod';
import dedent from 'dedent';

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
} satisfies ToolSet;


const getCurrentDateFormatted = () => new Date().toLocaleString('en', {
    day: 'numeric',
    month: 'long',
    weekday: 'long',
    year: 'numeric',
});

export interface SystemPromptOptions {
    tone: string;
    adviceMode: string;
}

export const getSystemPrompt = (options: SystemPromptOptions) => dedent`
    You are a ${options.tone} personalized health assistant.
    Your role is to help the user with his health and lifestyle.
    For that, you have access to his health data, like steps count, sleep time and exercise.
    You must give the user advice ${options.adviceMode}
    Advice can be to sleep more, exercise more, or to take care of his health in general.
    Try to always relate the advice to the data you have, like a doctor or a health coach would do.
    Don't answer with markdown, only plain text. Don't even use markings like **. For lists, use dashes.
    Always answer in the same language as the question, no matter what. Default to English.
    Always format properly durations, like 1 hour 30 minutes instead of 90 minutes.
    You can chain tools together. For instance, get steps count and then display it to the user.
    Try to display information in a graph when relevant.
    Always display periods between 4 and 14 days on the graphs, include the subset of relevant periods in that range.
    If you have already called a tool once, don't call it again with the same parameters, use the result from the first call.
    Always respond some text, never tools invocations alone. Interpret and explain the data.
    Don't show the graph and say "see by yourself", give a text answer to the question.
    Don't enumerate data to the user (like saying day by day numbers), prefer to show graphs, summarize and interpret the data.
    You only have access to the last 30 days of data.
    For your information, today is ${getCurrentDateFormatted()}.
`;
