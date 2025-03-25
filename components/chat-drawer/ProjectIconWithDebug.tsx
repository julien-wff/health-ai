import ProjectIcon from '@/components/content/ProjectIcon';
import { Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useAppState } from '@/hooks/useAppState';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { HAS_DEBUG_ACCESS } from '@/utils/storageKeys';

export default function ProjectIconWithDebug() {
    const { hasDebugAccess, setHasDebugAccess } = useAppState();
    const {
        setItem: setHasDebugAccessStorage,
        removeItem: removeHasDebugAccessStorage,
    } = useAsyncStorage(HAS_DEBUG_ACCESS);

    /**
     * If the icon has been pressed for more than 10 second, grant access to the advanced debug menu.
     */
    function toggleDebugAccess() {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        const newAccess = !hasDebugAccess;
        setHasDebugAccess(newAccess);
        if (newAccess) {
            void setHasDebugAccessStorage('1');
        } else {
            void removeHasDebugAccessStorage();
        }
    }

    return <Pressable delayLongPress={10000} onLongPress={toggleDebugAccess}>
        <ProjectIcon className="h-24 w-24"/>
    </Pressable>;
}
