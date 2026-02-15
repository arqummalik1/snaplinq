import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Home, Settings } from 'lucide-react-native';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface LiquidTabBarProps {
    state: any;
    descriptors: any;
    navigation: any;
}

export const LiquidTabBar = ({ state, descriptors, navigation }: LiquidTabBarProps) => {
    const { isDark } = useTheme();

    return (
        <View style={styles.container} pointerEvents="box-none">
            {/* Liquid Glass Wrapper with Gradient Border */}
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
                    {/* Refraction */}
                    <LinearGradient
                        colors={isDark
                            ? ['rgba(255,255,255,0.05)', 'transparent']
                            : ['rgba(255,255,255,0.4)', 'transparent']}
                        start={{ x: 0.3, y: 0.1 }}
                        end={{ x: 0.8, y: 0.8 }}
                        style={styles.glassRefraction}
                    />

                    {/* Sheen */}
                    <LinearGradient
                        colors={isDark
                            ? ['transparent', 'rgba(255,255,255,0.05)', 'transparent']
                            : ['transparent', 'rgba(255,255,255,0.3)', 'transparent']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        locations={[0.4, 0.5, 0.6]}
                        style={styles.glassSheen}
                    />

                    {/* Tab Content */}
                    <View style={styles.tabContent}>
                        {state.routes.map((route: any, index: number) => {
                            if (!['index', 'settings'].includes(route.name)) return null;

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

                            const Icon = route.name === 'index' ? Home : Settings;

                            return (
                                <Pressable
                                    key={route.key}
                                    onPress={onPress}
                                    style={styles.tab}
                                >
                                    {isFocused && (
                                        <View style={styles.glowContainer}>
                                            <View style={styles.glow} />
                                        </View>
                                    )}
                                    <Icon
                                        size={24}
                                        color={isFocused ? '#34d399' : (isDark ? 'rgba(255,255,255,0.5)' : '#64748b')}
                                        strokeWidth={isFocused ? 2.5 : 2}
                                    />
                                </Pressable>
                            );
                        })}
                    </View>
                </BlurView>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        alignItems: 'center',
        paddingHorizontal: 20,
        zIndex: 40,
    },
    borderWrapper: {
        width: '100%',
        maxWidth: 320,
        height: 64,
        borderRadius: 24,
        padding: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    glassBar: {
        flex: 1,
        width: '100%',
        borderRadius: 23, // Inner radius
        overflow: 'hidden',
    },
    glassRefraction: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.5,
    },
    glassSheen: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.6,
        ...(Platform.OS === 'web' ? { mixBlendMode: 'overlay' } : {}),
    } as any,
    tabContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    glowContainer: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        alignItems: 'center', justifyContent: 'center',
    },
    glow: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: 'rgba(52, 211, 153, 0.2)',
        transform: [{ scale: 1.2 }],
    }
});
