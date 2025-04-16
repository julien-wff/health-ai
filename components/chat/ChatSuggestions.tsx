import { InteractionManager, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useEffect, useRef } from 'react';

interface ChatSuggestionsProps {
    suggestions: string[];
    onSuggestionPress?: (suggestion: string) => void;
}

export default function ChatSuggestions({ suggestions, onSuggestionPress }: Readonly<ChatSuggestionsProps>) {
    // Reset scroll position to the start when suggestions change
    const scrollViewRef = useRef<ScrollView>(null);

    useEffect(() => {
        InteractionManager.runAfterInteractions(() => {
            scrollViewRef.current?.scrollTo({ x: 0, animated: false });
        });
    }, [ suggestions ]);

    return <ScrollView horizontal showsHorizontalScrollIndicator={false} ref={scrollViewRef}>
        <View className="mb-1 flex flex-row gap-2 p-2 h-14">
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
