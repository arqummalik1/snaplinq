import { Image, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export const Logo = ({ width = 40, height = 40, className }: { width?: number, height?: number, className?: string }) => {
    const { isDark } = useTheme();
    // Use require for assets
    const source = isDark
        ? require('../../../assets/logo/dark.png')
        : require('../../../assets/logo/light.png');

    return (
        <View className={`items-center justify-center ${className}`} style={{ width, height }}>
            <Image
                source={source}
                style={{ width, height }}
                resizeMode="contain"
            />
        </View>
    );
};
