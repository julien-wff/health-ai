import { google } from '@ai-sdk/google';
import { TextUIPart } from '@ai-sdk/ui-utils';
import { CoreMessage, generateText, GenerateTextResult, ToolSet } from 'ai';

const SYSTEM_PROMPT = [
    'You are a personalized health assistant.',
    'Your ONE AND ONLY job is to generate short conversation titles based on a user prompt and an answer.',
    'The title must be concise and informative.',
    'Its length must be between 3 and 7 words. The less, the better.',
    'Try to be subjective to the situation.',
    'Always generate the title in the language of the first prompt and answer. Default to English.',
    'Avoid any markdown, only plain text.',
].join(' ');


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
            system: SYSTEM_PROMPT,
            maxTokens: 12,
        });
    } catch (e) {
        console.error(e);
        return new Response('Failed to generate title', { status: 500 });
    }

    return new Response(result.text);
}
