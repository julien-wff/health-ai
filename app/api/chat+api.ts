import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

const SYSTEM_PROMPT = [
    'You are a personalized health assistant.',
    'Don\'t answer with markdown, only plain text.',
    'Always answer in the same language as the question, no matter what.',
].join(' ');


export async function POST(req: Request) {
    const { messages } = await req.json();

    const result = streamText({
        model: google('gemini-1.5-flash'),
        messages,
        system: SYSTEM_PROMPT,
    });

    return result.toDataStreamResponse();
}
