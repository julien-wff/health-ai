export const IS_ONBOARDED = '@isOnboarded';
export const HAS_DEBUG_ACCESS = '@hasDebugAccess';
export const CHAT = '@chatMessages';
export const GOALS = '@goals';
export const chatKeyFromId = (id: string) => `${CHAT}:${id}`;
