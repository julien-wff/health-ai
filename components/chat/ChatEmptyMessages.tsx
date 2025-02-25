import { Text, View } from 'react-native';

export default function ChatEmptyMessages() {
    return <View className="flex-1 flex items-center justify-center">
        <Text className="font-bold text-2xl text-center text-slate-900 dark:text-slate-50">
            What can I help with?
        </Text>
    </View>;
}
