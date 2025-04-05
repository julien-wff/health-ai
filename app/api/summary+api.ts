import { google } from '@ai-sdk/google';
import { TextUIPart } from '@ai-sdk/ui-utils';
import { CoreMessage, generateText, GenerateTextResult, ToolSet } from 'ai';
import { getSummaryPrompt } from '@/utils/prompts';


export async function POST(req: Request) {
    const { messages } = await req.json() as { messages: (CoreMessage & { parts: TextUIPart[] })[] };
    messages.push({
        role: 'user',
        content: '<SYSTEM PROMPT>Now generate the summary</SYSTEM PROMPT>',
        parts: [ { type: 'text', text: 'Now generate the summary' } ],
    });

    let result: GenerateTextResult<ToolSet, never>;
    try {
        result = await generateText({
            model: google('gemini-2.0-flash-001'),
            messages,
            system: getSummaryPrompt(),
            maxTokens: 200,
        });
    } catch (e) {
        console.error(e);
        return new Response('Failed to generate summary', { status: 500 });
    }

    return new Response(result.text);
}
