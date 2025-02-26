import { Image, ImageProps, useColorScheme } from 'react-native';

export default function ProjectIcon(props: ImageProps) {
    const colorScheme = useColorScheme();

    if (colorScheme === 'dark')
        return <Image source={require('@/assets/icons/splash-icon-dark.png')}
                      resizeMode="contain"
                      {...props}/>;
    else return <Image source={require('@/assets/icons/splash-icon.png')}
                       resizeMode="contain"
                       {...props}/>;
}
