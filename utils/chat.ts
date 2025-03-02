import { CHAT, chatKeyFromId } from '@/utils/storageKeys';
import asyncStorage from '@react-native-async-storage/async-storage';
import { UIMessage } from 'ai';
import superJson from 'superjson';

export interface StorageChat {
    id: string;
    title: string | null;
    lastUpdated: Date;
    messages: UIMessage[];
}

export async function getStorageChat(id: string) {
    const chat = await asyncStorage.getItem(chatKeyFromId(id));
    if (!chat)
        return null;

    return superJson.parse<StorageChat>(chat);
}


export async function saveStorageChat(id: string, messages: UIMessage[], title: string | null) {
    const chat: StorageChat = {
        id,
        title,
        messages,
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
