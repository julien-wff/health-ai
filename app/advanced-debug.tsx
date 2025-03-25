import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import ViewHeaderWithBack from '@/components/common/ViewHeaderWithBack';

export default function AdvancedDebug() {
    const router = useRouter();
    const colors = useColors();

    return <SafeAreaView className="flex h-full gap-4 bg-slate-50 p-4 dark:bg-slate-950">
        <ViewHeaderWithBack>Advanced debug</ViewHeaderWithBack>
    </SafeAreaView>;
}
