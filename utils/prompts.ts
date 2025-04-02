import dedent from 'dedent';

const getCurrentDateFormatted = () => new Date().toLocaleString('en', {
    day: 'numeric',
    month: 'long',
    weekday: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
});

const addDateToPrompt = (prompt: string) => dedent`
    ${prompt}
    For information, the current datetime is: ${getCurrentDateFormatted()}
`;

const SUGGESTION_PROMPT = dedent`
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

export const getSuggestionPrompt = () => addDateToPrompt(SUGGESTION_PROMPT);
