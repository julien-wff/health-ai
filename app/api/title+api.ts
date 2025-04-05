import { google } from '@ai-sdk/google';
import { TextUIPart } from '@ai-sdk/ui-utils';
import { CoreMessage, generateText, GenerateTextResult, ToolSet } from 'ai';
import { getTitlePrompt } from '@/utils/prompts';


export async function POST(req: Request) {
    const { messages } = await req.json() as { messages: (CoreMessage & { parts: TextUIPart[] })[] };
    messages.push({
        role: 'user',
        content: 'Now generate the title',
        parts: [ { type: 'text', text: 'Now generate the title' } ],
    });

    let result: GenerateTextResult<ToolSet, never>;
    try {
        result = await generateText({
            model: google('gemini-2.0-flash-001'),
            messages,
            system: getTitlePrompt(),
            maxTokens: 12,
        });
    } catch (e) {
        console.error(e);
        return new Response('Failed to generate title', { status: 500 });
    }

    return new Response(result.text);
}
