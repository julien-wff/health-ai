import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface ChatSuggestionsProps {
    suggestions: string[];
    onSuggestionPress?: (suggestion: string) => void;
}

export default function ChatSuggestions({ suggestions, onSuggestionPress }: Readonly<ChatSuggestionsProps>) {
    return <ScrollView horizontal>
        <View className="mb-2 flex flex-row gap-2 p-2">
            {suggestions.map((suggestion) =>
                <TouchableOpacity key={suggestion}
                                  activeOpacity={.75}
                                  onPress={() => onSuggestionPress?.(suggestion)}
                                  className="rounded-full border border-green-400 dark:border-green-500 bg-green-100 dark:bg-green-900 px-4 py-2">
                    <Text className="text-slate-800 dark:text-green-200">{suggestion}</Text>
                </TouchableOpacity>)}
        </View>
    </ScrollView>;
}
