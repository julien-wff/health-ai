import { google } from '@ai-sdk/google';
import { TextUIPart } from '@ai-sdk/ui-utils';
import { CoreMessage, generateText, GenerateTextResult, Output, ToolSet } from 'ai';
import { z } from 'zod';
import { getSuggestionPrompt } from '@/utils/prompts';


export async function POST(req: Request) {
    const { messages } = await req.json() as { messages: (CoreMessage & { parts: TextUIPart[] })[] };

    let result: GenerateTextResult<ToolSet, string[]>;
    try {
        result = await generateText({
            model: google('gemini-2.0-flash-001'),
            messages,
            system: getSuggestionPrompt(),
            maxTokens: 500,
            experimental_output: Output.object({
                schema: z.array(z.string()),
            }),
        });
    } catch (e) {
        console.error(e);
        return new Response('Failed to generate suggestions', { status: 500 });
    }

    return new Response(result.text);
}
