import { SafeAreaView } from 'react-native-safe-area-context';
import ViewHeaderWithBack from '@/components/common/ViewHeaderWithBack';

export default function AdvancedDebug() {
    return <SafeAreaView className="flex h-full gap-4 bg-slate-50 p-4 dark:bg-slate-950">
        <ViewHeaderWithBack>Advanced debug</ViewHeaderWithBack>
    </SafeAreaView>;
}
