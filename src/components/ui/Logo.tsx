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
            source={isDark
                ? require('../../../assets/images/logo-dark.png')
                : require('../../../assets/images/logo-light.png')
            }
            style={[{ width, height, resizeMode: 'contain' }, style]}
            className={className}
            {...props}
        />
    );
}
