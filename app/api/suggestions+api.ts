import { google } from '@ai-sdk/google';
import { TextUIPart } from '@ai-sdk/ui-utils';
import { CoreMessage, generateText, GenerateTextResult, Output, ToolSet } from 'ai';
import dedent from 'dedent';
import { z } from 'zod';

const SYSTEM_PROMPT = dedent`
    You are generating conversation continuation suggestions for a health assistant dialogue.
    Your ONLY task is to create 3-5 short, natural response options that the user might say next.
    Each suggestion must be 2-8 words and sound like natural human speech.
    Base suggestions on the conversation context:
    
    If the assistant asked a question:
    - Provide direct answer options to that specific question
    - Include both affirmative and negative response options
    - Add follow-up question options when appropriate
    
    If the assistant made statements or gave advice:
    - Include options to ask for clarification or details
    - Suggest ways to request specific health advice (sleep, exercise, steps, etc.)
    - Add options to share personal experiences related to the topic
    - Include options to challenge or question the advice respectfully
    
    All suggestions should sound like something a real person would say in conversation.
    Never include explanations or anything outside the actual suggestions.
`;


export async function POST(req: Request) {
    const { messages } = await req.json() as { messages: (CoreMessage & { parts: TextUIPart[] })[] };

    let result: GenerateTextResult<ToolSet, string[]>;
    try {
        result = await generateText({
            model: google('gemini-2.0-flash-001'),
            messages,
            system: SYSTEM_PROMPT,
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
