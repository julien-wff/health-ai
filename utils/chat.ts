import { CHAT, chatKeyFromId } from '@/utils/storageKeys';
import asyncStorage from '@react-native-async-storage/async-storage';
import { UIMessage } from 'ai';
import superJson from 'superjson';
import type { AiProfile } from '@/hooks/useFeatureFlags';
import dayjs from 'dayjs';

export interface StorageChat {
    id: string;
    title: string | null;
    lastUpdated: Date;
    messages: UIMessage[];
    agentMode: AiProfile;
}

export async function getStorageChat(id: string) {
    const chat = await asyncStorage.getItem(chatKeyFromId(id));
    if (!chat)
        return null;

    return superJson.parse<StorageChat>(chat);
}


export async function saveStorageChat(id: string, messages: UIMessage[], title: string | null, agentMode: AiProfile) {
    const chat: StorageChat = {
        id,
        title,
        messages,
        agentMode,
        lastUpdated: new Date(),
    } satisfies StorageChat;

    await asyncStorage.setItem(chatKeyFromId(id), superJson.stringify(chat));
}


export async function getStoredChats() {
    const keys = await asyncStorage.getAllKeys();
    const chats = await asyncStorage.multiGet(keys.filter(key => key.startsWith(CHAT)));

    return chats.map(
        ([ _, value ]) => superJson.parse<StorageChat>(value!),
    );
}


/**
 * Filter a chat list by including only chats that were last updated in the given range of days.
 * @param chats The list of chats to filter.
 * @param startDay The number of days ago to start filtering from (0 = today, 1 = yesterday, etc.). Inclusive.
 * @param endDay The number of days ago to stop filtering at (0 = today, 1 = yesterday, etc.). Exclusive.
 */
export const filterChatsByDaysRange = (chats: StorageChat[], startDay: number, endDay?: number) =>
    chats.filter((chat) => {
        const lastUpdated = dayjs(chat.lastUpdated);
        return lastUpdated.isBetween(dayjs().subtract(startDay, 'day'), dayjs().subtract(endDay || 1, 'day'), 'day', '[)');
    });


export const createChatSystemPrompt = (message: string) =>
    `<SYSTEM PROMPT, INVISIBLE TO THE USER> ${message} </SYSTEM PROMPT>`;

export const isChatSystemPrompt = (message: string) =>
    message.startsWith('<SYSTEM PROMPT') && message.endsWith('</SYSTEM PROMPT>');
