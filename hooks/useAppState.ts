import { StorageChat } from '@/utils/chat';
import { UIMessage } from 'ai';
import { create } from 'zustand';

interface AppState {
    isOnboarded: boolean;
    setIsOnboarded: (isOnboarded: boolean) => void;
    hasDebugAccess: boolean;
    setHasDebugAccess: (hasDebugAccess: boolean) => void;
    hasPermissions: boolean;
    setHasPermissions: (hasPermissions: boolean) => void;
    chats: StorageChat[];
    setChats: (chats: StorageChat[]) => void;
    addOrUpdateChat: (id: string, messages: UIMessage[], title: string) => void;
}

/**
 * Global app state hook
 */
export const useAppState = create<AppState>((set) => ({
    isOnboarded: false,
    hasDebugAccess: false,
    hasPermissions: false,
    chats: [],
    setIsOnboarded: (isOnboarded: boolean) => set({ isOnboarded }),
    setHasDebugAccess: (hasDebugAccess: boolean) => set({ hasDebugAccess }),
    setHasPermissions: (hasPermissions: boolean) => set({ hasPermissions }),
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
