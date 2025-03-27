import { StorageChat } from '@/utils/chat';
import { UIMessage } from 'ai';
import { create } from 'zustand';
import type { AiProfile } from '@/hooks/useFeatureFlags';

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
    addOrUpdateChat: (id: string, messages: UIMessage[], title: string, agentMode: AiProfile) => void;
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
    setIsOnboarded: (isOnboarded: boolean) => set({ isOnboarded }),
    setHasDebugAccess: (hasDebugAccess: boolean) => set({ hasDebugAccess }),
    setHasPermissions: (hasPermissions: boolean) => set({ hasPermissions }),
    setRequireNewChat: (requireNewChat: boolean) => set({ requireNewChat }),
    setChats: (chats: StorageChat[]) => set({
        chats: chats.sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime()),
    }),
    addOrUpdateChat: (id, messages, title, agentMode) => set((state) => ({
        chats: [
            { id, messages, title, agentMode, lastUpdated: new Date() },
            ...state.chats.filter((chat) => chat.id !== id),
        ],
    })),
}) satisfies AppState);
