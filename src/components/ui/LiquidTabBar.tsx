import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Compass, Home, Settings } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Platform, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';

interface LiquidTabBarProps {
    state: any;
    descriptors: any;
    navigation: any;
}

const TAB_WIDTH = 80;

export const LiquidTabBar = ({ state, descriptors, navigation }: LiquidTabBarProps) => {
    const { isDark } = useTheme();
    const { width: windowWidth } = useWindowDimensions();
    
    // Shared value for tracking the active index with animation
    const activeIndex = useSharedValue(state.index);

    useEffect(() => {
        activeIndex.value = withSpring(state.index, {
            damping: 15,
            stiffness: 120,
        });
    }, [state.index]);

    const indicatorStyle = useAnimatedStyle(() => {
        const routesCount = state.routes.length;
        const totalWidth = Math.min(windowWidth - 40, routesCount * TAB_WIDTH);
        const itemWidth = totalWidth / routesCount;
        
        return {
            transform: [{ translateX: activeIndex.value * itemWidth }],
            width: itemWidth,
        };
    });

    return (
        <View style={styles.container} pointerEvents="box-none">
            <View style={[styles.wrapper, { maxWidth: state.routes.length * TAB_WIDTH }]}>
                <LinearGradient
                    colors={isDark
                        ? ['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']
                        : ['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.4)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.borderWrapper}
                >
                    <BlurView
                        intensity={Platform.OS === 'ios' ? 80 : 100}
                        tint={isDark ? 'dark' : 'light'}
                        style={styles.glassBar}
                    >
                        {/* Animated Indicator Background */}
                        <Animated.View style={[styles.activeIndicator, indicatorStyle]}>
                            <LinearGradient
                                colors={['#34d399', '#10b981']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.indicatorGradient}
                            />
                        </Animated.View>

                        {/* Tab Content */}
                        <View style={styles.tabContent}>
                            {state.routes.map((route: any, index: number) => {
                                const { options } = descriptors[route.key];
                                const isFocused = state.index === index;

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

                                // Map route names to icons
                                const getIcon = (name: string) => {
                                    switch (name) {
                                        case 'index': return Home;
                                        case 'explore': return Compass;
                                        case 'settings': return Settings;
                                        default: return Home;
                                    }
                                };

                                const Icon = getIcon(route.name);

                                return (
                                    <Pressable
                                        key={route.key}
                                        onPress={onPress}
                                        style={styles.tab}
                                        android_ripple={{ color: 'rgba(52, 211, 153, 0.1)', borderless: true }}
                                    >
                                        <Icon
                                            size={22}
                                            color={isFocused ? '#ffffff' : (isDark ? 'rgba(255,255,255,0.5)' : '#64748b')}
                                            strokeWidth={isFocused ? 2.5 : 2}
                                        />
                                    </Pressable>
                                );
                            })}
                        </View>
                    </BlurView>
                </LinearGradient>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 40 : 25,
        left: 0,
        right: 0,
        alignItems: 'center',
        paddingHorizontal: 20,
        zIndex: 100,
    },
    wrapper: {
        width: '100%',
        height: 64,
        borderRadius: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 8,
    },
    borderWrapper: {
        flex: 1,
        borderRadius: 24,
        padding: 1,
    },
    glassBar: {
        flex: 1,
        borderRadius: 23,
        overflow: 'hidden',
        flexDirection: 'row',
    },
    activeIndicator: {
        position: 'absolute',
        top: 8,
        bottom: 8,
        left: 0,
        paddingHorizontal: 8,
        zIndex: 0,
    },
    indicatorGradient: {
        flex: 1,
        borderRadius: 16,
        shadowColor: "#10b981",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    tabContent: {
        flex: 1,
        flexDirection: 'row',
        zIndex: 1,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});
