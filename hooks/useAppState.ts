import { StorageChat } from '@/utils/chat';
import { create } from 'zustand';
import { Goal } from '@/utils/goals';

interface AppState {
    isOnboarded: boolean;
    setIsOnboarded: (isOnboarded: boolean) => void;
    hasDebugAccess: boolean;
    setHasDebugAccess: (hasDebugAccess: boolean) => void;
    hasPermissions: boolean;
    setHasPermissions: (hasPermissions: boolean) => void;
    requireNewChat: boolean;
    setRequireNewChat: (requireNewChat: boolean) => void;
    chats: StorageChat[];
    setChats: (chats: StorageChat[]) => void;
    addOrUpdateChat: (chat: Omit<StorageChat, 'lastUpdated'>) => void;
    goals: Goal[];
    setGoals: (goals: Goal[]) => void;
}

/**
 * Global app state hook
 */
export const useAppState = create<AppState>((set) => ({
    isOnboarded: false,
    hasDebugAccess: false,
    hasPermissions: false,
    requireNewChat: false,
    chats: [],
    goals: [],
    setIsOnboarded: (isOnboarded: boolean) => set({ isOnboarded }),
    setHasDebugAccess: (hasDebugAccess: boolean) => set({ hasDebugAccess }),
    setHasPermissions: (hasPermissions: boolean) => set({ hasPermissions }),
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
    setGoals: (goals: Goal[]) => set({
        goals: [ ...goals ].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()),
    }),
}) satisfies AppState);
