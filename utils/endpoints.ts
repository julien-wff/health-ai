import Constants from 'expo-constants';

export const generateAPIUrl = (relativePath: string) => {
    const path = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;

    if (process.env.NODE_ENV === 'development') {
        const origin = `http://${Constants.expoConfig?.hostUri}`;
        return origin.concat(path);
    }

    return (process?.env?.EXPO_PUBLIC_API_BASE_URL ?? 'https://aau-25-health-ai.expo.app').concat(path);
};
