import { Compass, Home } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';

interface LiquidTabBarProps {
    state: any;
    descriptors: any;
    navigation: any;
}

const TAB_WIDTH = 70;

export const LiquidTabBar = ({ state, descriptors, navigation }: LiquidTabBarProps) => {
    const { isDark } = useTheme();
    
    // Filter routes to exclude settings and explore as requested
    const filteredRoutes = state.routes.filter((r: any) => r.name !== 'settings' && r.name !== 'explore');
    const activeIndex = filteredRoutes.findIndex((r: any) => r.name === state.routes[state.index].name);

    return (
        <View style={styles.container} pointerEvents="box-none">
            <View style={styles.floatingBar}>
                {filteredRoutes.map((route: any, index: number) => {
                    const isFocused = activeIndex === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    const getIcon = (name: string) => {
                        switch (name) {
                            case 'index': return Home;
                            case 'explore': return Compass;
                            default: return Home;
                        }
                    };

                    const Icon = getIcon(route.name);

                    return (
                        <TabItem 
                            key={route.key}
                            isFocused={isFocused}
                            onPress={onPress}
                            Icon={Icon}
                            isDark={isDark}
                        />
                    );
                })}
            </View>
        </View>
    );
};

const TabItem = ({ isFocused, onPress, Icon, isDark }: any) => {
    const scale = useSharedValue(1);
    const activeValue = useSharedValue(isFocused ? 1 : 0);

    useEffect(() => {
        activeValue.value = withSpring(isFocused ? 1 : 0, { damping: 12 });
    }, [isFocused]);

    const animatedIconStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { scale: interpolate(activeValue.value, [0, 1], [1, 1.2]) },
                { translateY: interpolate(activeValue.value, [0, 1], [0, -2]) }
            ],
            opacity: interpolate(activeValue.value, [0, 1], [0.5, 1]),
        };
    });

    const glowStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(activeValue.value, [0, 1], [0, 0.6]),
            transform: [{ scale: interpolate(activeValue.value, [0, 1], [0.5, 1.5]) }],
        };
    });

    return (
        <Pressable
            onPress={onPress}
            onPressIn={() => { scale.value = withTiming(0.85); }}
            onPressOut={() => { scale.value = withSpring(1); }}
            style={styles.tab}
        >
            <Animated.View style={[styles.glow, glowStyle, { backgroundColor: '#10b981' }]} />
            <Animated.View style={animatedIconStyle}>
                <Icon
                    size={26}
                    color={isFocused ? '#10b981' : (isDark ? '#94a3b8' : '#64748b')}
                    strokeWidth={isFocused ? 2.5 : 2}
                />
            </Animated.View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 45 : 30,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 1000,
    },
    floatingBar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 25,
        paddingHorizontal: 25,
        paddingVertical: 12,
    },
    tab: {
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    glow: {
        position: 'absolute',
        width: 35,
        height: 35,
        borderRadius: 18,
        filter: 'blur(10px)',
    }
});
