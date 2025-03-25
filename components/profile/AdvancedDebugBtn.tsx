import ProfileBtn from '@/components/profile/ProfileBtn';
import { Bug } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function AdvancedDebugBtn() {
    const router = useRouter();
    return <ProfileBtn icon={Bug} separator onPress={() => router.push('/advanced-debug')}>
        Advanced debug menu
    </ProfileBtn>;
}
