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
    const { agentMode, goals, history } = requestBody;

    let systemPrompt: string;
    if (agentMode === 'introvert') {
        systemPrompt = getChatPrompt({
            tone: 'neutral and objective',
            advice: 'only when the user asks for it',
            diplomacy: 'diplomatic and careful, try to convince the user',
            goalsCreation: 'always ask the user a confirmation, don\'t force him',
            goals,
            history,
        });
    } else {
        systemPrompt = getChatPrompt({
            tone: 'friendly and encouraging',
            advice: 'even if the user is not asking for it, be proactive in giving advice and suggestions',
            diplomacy: 'pushy, almost forcing the user',
            goalsCreation: 'don\'t ask the user for confirmation, make it an ambitious challenge',
            goals,
            history,
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
