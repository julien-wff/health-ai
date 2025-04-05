import { tools } from '@/utils/ai';
import { google } from '@ai-sdk/google';
import { type CoreMessage, streamText } from 'ai';
import type { ChatRequestBody } from '@/utils/chat';
import { getChatPrompt } from '@/utils/prompts';


interface RequestJson {
    messages: CoreMessage[];
    requestBody: ChatRequestBody;
}

export async function POST(req: Request) {
    const { messages, requestBody } = await req.json() as RequestJson;
    const { agentMode } = requestBody;

    let systemPrompt: string;
    if (agentMode === 'introvert') {
        systemPrompt = getChatPrompt({
            tone: 'neutral and objective',
            adviceMode: 'only when the user asks for it',
        });
    } else {
        systemPrompt = getChatPrompt({
            tone: 'friendly and encouraging',
            adviceMode: 'even if the user is not asking for it, be proactive in giving advice and suggestions',
        });
    }

    const result = streamText({
        model: google('gemini-2.0-flash'),
        messages,
        system: systemPrompt,
        tools,
    });

    return result.toDataStreamResponse();
}
