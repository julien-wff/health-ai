import { StorageChat } from '@/utils/chat';
import { create } from 'zustand';

interface AppState {
    isOnboarded: boolean;
    setIsOnboarded: (isOnboarded: boolean) => void;
    hasDebugAccess: boolean;
    setHasDebugAccess: (hasDebugAccess: boolean) => void;
    hasHealthPermissions: boolean;
    setHasHealthPermissions: (hasHealthPermissions: boolean) => void;
    hasNotificationPermissions: boolean;
    setHasNotificationPermissions: (hasNotificationPermissions: boolean) => void;
    requireNewChat: boolean;
    setRequireNewChat: (requireNewChat: boolean) => void;
    chats: StorageChat[];
    setChats: (chats: StorageChat[]) => void;
    addOrUpdateChat: (chat: Omit<StorageChat, 'lastUpdated'>) => void;
}

/**
 * Global app state hook
 */
export const useAppState = create<AppState>((set) => ({
    isOnboarded: false,
    hasDebugAccess: false,
    hasHealthPermissions: false,
    hasNotificationPermissions: false,
    requireNewChat: false,
    chats: [],
    setIsOnboarded: (isOnboarded: boolean) => set({ isOnboarded }),
    setHasDebugAccess: (hasDebugAccess: boolean) => set({ hasDebugAccess }),
    setHasHealthPermissions: (hasHealthPermissions: boolean) => set({ hasHealthPermissions }),
    setHasNotificationPermissions: (hasNotificationPermissions: boolean) => set({ hasNotificationPermissions }),
    setRequireNewChat: (requireNewChat: boolean) => set({ requireNewChat }),
    setChats: (chats: StorageChat[]) => set({
        chats: chats.sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime()),
    }),
    addOrUpdateChat: chat => set((state) => ({
        chats: [
            { ...chat, lastUpdated: new Date() },
            ...state.chats.filter((c) => c.id !== chat.id),
        ],
    })),
}) satisfies AppState);
