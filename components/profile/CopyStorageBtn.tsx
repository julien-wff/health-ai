import { Clipboard } from 'lucide-react-native';
import ProfileBtn from '@/components/profile/ProfileBtn';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as NativeClipboard from 'expo-clipboard';

export default function CopyStorageBtn() {
    async function handleCopy() {
        const keys = await AsyncStorage.getAllKeys();
        const result = await AsyncStorage.multiGet(keys);
        const data = Object.fromEntries(result);

        const formattedData = Object
            .keys(data)
            .reduce((acc, key) => {
                try {
                    acc[key] = JSON.parse(data[key]!);
                } catch (e) {
                    acc[key] = data[key]!;
                }
                return acc;
            }, {} as Record<string, string>);
        await NativeClipboard.setStringAsync(JSON.stringify(formattedData, null, 2));
    }

    return <ProfileBtn icon={Clipboard} separator onPress={handleCopy}>
        Copy storage content
    </ProfileBtn>;
}
