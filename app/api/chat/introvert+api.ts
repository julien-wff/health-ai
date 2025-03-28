import { getSystemPrompt, tools } from '@/utils/ai';
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';


export async function POST(req: Request) {
    const { messages } = await req.json();

    const result = streamText({
        model: google('gemini-2.0-flash-001'),
        messages,
        system: getSystemPrompt({
            tone: 'neutral and objective',
            adviceMode: 'only when the user asks for it',
        }),
        tools,
    });

    return result.toDataStreamResponse();
}
