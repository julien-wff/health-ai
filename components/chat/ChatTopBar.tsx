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

    return <View className="w-full h-16 flex flex-row items-center justify-between">
        <TouchableOpacity onPress={onOpen}
                          className="h-16 w-16 flex items-center justify-center"
                          activeOpacity={.9}>
            <Menu size={30} color={colors.text}/>
        </TouchableOpacity>

        <Text className="font-bold text-lg text-center flex-1 text-slate-900 dark:text-slate-50" numberOfLines={1}>
            {text || 'New Chat'}
        </Text>

        <TouchableOpacity onPress={onNew}
                          className="h-16 w-16 flex items-center justify-center"
                          activeOpacity={.9}>
            <BadgePlus size={30} color={colors.text}/>
        </TouchableOpacity>
    </View>;
}
