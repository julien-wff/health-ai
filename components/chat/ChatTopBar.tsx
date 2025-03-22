import { useColors } from '@/hooks/useColors';
import { BadgePlus, Menu } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

interface ChatTopBarProps {
    onOpen: () => void;
    onNew: () => void;
    text?: string | null;
}

export default function ChatTopBar({ onOpen, onNew, text }: ChatTopBarProps) {
    const colors = useColors();

    return <View className="flex h-16 w-full flex-row items-center justify-between">
        <TouchableOpacity onPress={onOpen}
                          className="flex h-16 w-16 items-center justify-center"
                          activeOpacity={.9}>
            <Menu size={30} color={colors.text}/>
        </TouchableOpacity>

        <Text className="flex-1 text-center text-lg font-bold text-slate-900 dark:text-slate-50" numberOfLines={1}>
            {text || 'New Chat'}
        </Text>

        <TouchableOpacity onPress={onNew}
                          className="flex h-16 w-16 items-center justify-center"
                          activeOpacity={.9}>
            <BadgePlus size={30} color={colors.text}/>
        </TouchableOpacity>
    </View>;
}
