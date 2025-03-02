import { StorageChat } from '@/utils/chat';
import { ReadHealthRecords } from '@/utils/health';
import { UIMessage } from 'ai';
import { create } from 'zustand';

interface AppState {
    isOnboarded: boolean;
    setIsOnboarded: (isOnboarded: boolean) => void;
    hasPermissions: boolean;
    setHasPermissions: (hasPermissions: boolean) => void;
    healthRecords: null | ReadHealthRecords;
    setHealthRecords: (healthRecords: ReadHealthRecords) => void;
    chats: StorageChat[];
    setChats: (chats: StorageChat[]) => void;
    addOrUpdateChat: (id: string, messages: UIMessage[], title: string) => void;
}

/**
 * Global app state hook
 */
export const useAppState = create<AppState>((set) => ({
    isOnboarded: false,
    hasPermissions: false,
    healthRecords: null,
    chats: [],
    setIsOnboarded: (isOnboarded: boolean) => set({ isOnboarded }),
    setHasPermissions: (hasPermissions: boolean) => set({ hasPermissions }),
    setHealthRecords: (healthRecords: ReadHealthRecords) => set({ healthRecords }),
    setChats: (chats: StorageChat[]) => set({
        chats: chats.sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime()),
    }),
    addOrUpdateChat: (id, messages, title) => set((state) => ({
        chats: [
            { id, messages, title, lastUpdated: new Date() },
            ...state.chats.filter((chat) => chat.id !== id),
        ],
    })),
}) satisfies AppState);
