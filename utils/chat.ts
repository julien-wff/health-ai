import { CHAT, chatKeyFromId } from '@/utils/storageKeys';
import asyncStorage from '@react-native-async-storage/async-storage';
import { UIMessage } from 'ai';
import superJson from 'superjson';
import type { AiProfile } from '@/hooks/useFeatureFlags';
import dayjs from 'dayjs';


/**
 * Extra data to send along each time the user sends a message to the chat.
 */
export interface ChatRequestBody {
    agentMode: AiProfile;
}


export interface StorageChat {
    id: string;
    title: string | null;
    lastUpdated: Date;
    messages: UIMessage[];
    agentMode: AiProfile;
    summary: string | null;
}

export async function getStorageChat(id: string) {
    const chat = await asyncStorage.getItem(chatKeyFromId(id));
    if (!chat)
        return null;

    return superJson.parse<StorageChat>(chat);
}


/**
 * Save a chat to AsyncStorage.
 * @param chat The chat to save. The lastUpdated date will be automatically updated.
 */
export async function saveStorageChat(chat: Omit<StorageChat, 'lastUpdated'>) {
    const storageChat: StorageChat = {
        ...chat,
        lastUpdated: new Date(),
    } satisfies StorageChat;

    await asyncStorage.setItem(chatKeyFromId(chat.id), superJson.stringify(storageChat));
}


/**
 * Get all stored chats from AsyncStorage in no particular order.
 */
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
