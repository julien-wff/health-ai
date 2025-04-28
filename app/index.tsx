import { Pressable, Text } from 'react-native';
import { useState } from 'react';

export default function Index() {
    const [ isPressed, setIsPressed ] = useState(false);

    return <Pressable className="flex-1 items-center justify-center"
                      onPress={() => setIsPressed(true)}>
        {isPressed && <Text className="text-xl text-slate-900 dark:text-slate-100">
            Loading Health AI, please wait...
        </Text>}
    </Pressable>;
}
