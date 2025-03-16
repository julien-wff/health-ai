import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function () {
    const router = useRouter();

    useEffect(() => {
        router.back();
    }, []);

    return <></>;
}
