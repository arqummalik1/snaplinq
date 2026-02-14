import { Image, ImageProps, useColorScheme } from 'react-native';

interface LogoProps extends Omit<ImageProps, 'source'> {
    className?: string;
    width?: number;
    height?: number;
}

export function Logo({ className, width = 120, height = 40, style, ...props }: LogoProps) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <Image
            source={require('../../../assets/images/icon.png')}
            style={[{ width, height, resizeMode: 'contain' }, style]}
            className={className}
            {...props}
        />
    );
}
