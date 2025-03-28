import { google } from '@ai-sdk/google';
import { TextUIPart } from '@ai-sdk/ui-utils';
import { CoreMessage, generateText, GenerateTextResult, ToolSet } from 'ai';
import dedent from 'dedent';

const SYSTEM_PROMPT = dedent`
    You are a personalized health assistant summarizing health-related conversations.
    Your ONE AND ONLY job is to generate short conversations summaries of the discussion between an AI agent and a user.
    The summary must be concise and informative, focusing on health topics, concerns, and advice discussed.
    Its length must be between 10 and 30 words. The less, the better.
    Avoid any markdown, only plain text.
`;


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
            system: SYSTEM_PROMPT,
            maxTokens: 200,
        });
    } catch (e) {
        console.error(e);
        return new Response('Failed to generate summary', { status: 500 });
    }

    return new Response(result.text);
}
