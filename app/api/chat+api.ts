import { tools } from '@/utils/ai';
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

const SYSTEM_PROMPT = [
    'You are a personalized health assistant.',
    'Don\'t answer with markdown, only plain text. Don\'t even use markings like **.',
    'Always answer in the same language as the question, no matter what. Default to English.',
    'You can chain tools together. For instance, get steps count and then display it to the user.',
    'Try to display information in a graph when relevant.',
    'Always display periods between 4 and 14 days on the graphs, include the subset of relevant periods in that range.',
    'If you have already called a tool once, don\'t call it again with the same parameters, use the result from the first call.',
    'Always respond some text, never tools invocations alone. Interpret and explain the data.',
    'Don\'t show the graph and say "see by yourself", give a text answer to the question.',
    'Don\'t enumerate data to the user (like saying day by day numbers), prefer to show graphs, summarize and interpret the data.',
    'You only have access to the last 30 days of data.',
].join(' ');


export async function POST(req: Request) {
    const { messages } = await req.json();

    const currentDateFormatted = new Date().toLocaleString('en', {
        day: 'numeric',
        month: 'long',
        weekday: 'long',
        year: 'numeric',
    });

    const result = streamText({
        model: google('gemini-2.0-flash-001'),
        messages,
        system: SYSTEM_PROMPT + ` For your information, today is ${currentDateFormatted}.`,
        tools,
    });

    return result.toDataStreamResponse();
}
