import ProjectIcon from '@/components/content/ProjectIcon';
import { View } from 'react-native';

export default function ChatDrawer() {
    return <View className="h-full bg-slate-50 dark:bg-slate-950">
        <View className="flex items-center justify-center my-4">
            <ProjectIcon className="w-24 h-24"/>
        </View>
    </View>;
}
