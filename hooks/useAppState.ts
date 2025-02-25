import { ReadHealthRecords } from '@/utils/health';
import { create } from 'zustand';

interface AppState {
    isOnboarded: boolean;
    setIsOnboarded: (isOnboarded: boolean) => void;
    hasPermissions: boolean;
    setHasPermissions: (hasPermissions: boolean) => void;
    healthRecords: null | ReadHealthRecords;
    setHealthRecords: (healthRecords: ReadHealthRecords) => void;
}

/**
 * Global app state hook
 */
export const useAppState = create<AppState>((set) => ({
    isOnboarded: false,
    hasPermissions: false,
    healthRecords: null,
    setIsOnboarded: (isOnboarded: boolean) => set({ isOnboarded }),
    setHasPermissions: (hasPermissions: boolean) => set({ hasPermissions }),
    setHealthRecords: (healthRecords: ReadHealthRecords) => set({ healthRecords }),
}) satisfies AppState);
