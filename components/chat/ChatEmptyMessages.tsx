import { Text, View } from 'react-native';

export default function ChatEmptyMessages() {
    return <View className="flex flex-1 items-center justify-center">
        <Text className="text-center text-2xl font-bold text-slate-900 dark:text-slate-50">
            What can I help with?
        </Text>
    </View>;
}
