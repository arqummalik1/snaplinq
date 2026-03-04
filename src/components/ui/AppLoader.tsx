import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    withRepeat, 
    withTiming, 
    withSequence,
    withSpring,
    FadeIn,
    FadeOut,
    interpolate
} from 'react-native-reanimated';
import { Logo } from './Logo';

const { width } = Dimensions.get('window');

export const AppLoader = () => {
    const rotation = useSharedValue(0);
    const scale = useSharedValue(1);
    const pulse = useSharedValue(0);

    useEffect(() => {
        rotation.value = withRepeat(
            withTiming(360, { duration: 2000 }),
            -1,
            false
        );
        scale.value = withRepeat(
            withSequence(
                withSpring(1.1),
                withSpring(1)
            ),
            -1,
            true
        );
        pulse.value = withRepeat(
            withTiming(1, { duration: 1500 }),
            -1,
            true
        );
    }, []);

    const logoStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: scale.value },
            { rotate: `${rotation.value}deg` }
        ],
    }));

    const ringStyle = useAnimatedStyle(() => ({
        opacity: interpolate(pulse.value, [0, 1], [0.3, 0]),
        transform: [{ scale: interpolate(pulse.value, [0, 1], [1, 1.8]) }],
    }));

    return (
        <Animated.View 
            entering={FadeIn.duration(400)}
            exiting={FadeOut.duration(400)}
            style={styles.container}
        >
            {/* Liquid Background Orbs */}
            <View style={[styles.orb, styles.orb1]} />
            <View style={[styles.orb, styles.orb2]} />

            <View style={styles.content}>
                <View style={styles.logoWrapper}>
                    <Animated.View style={[styles.ring, ringStyle]} />
                    <Animated.View style={[styles.logoContainer, logoStyle]}>
                        <Logo width={80} height={80} />
                    </Animated.View>
                </View>
                
                <Animated.View entering={FadeIn.delay(400)}>
                    <Text style={styles.title}>Snaplinq</Text>
                    <View style={styles.loadingBarContainer}>
                        <Animated.View style={styles.loadingBar} />
                    </View>
                    <Text style={styles.subtitle}>Initializing your vault...</Text>
                </Animated.View>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#0f172a',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoWrapper: {
        width: 150,
        height: 150,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
    },
    logoContainer: {
        width: 100,
        height: 100,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        shadowColor: '#10b981',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
    },
    ring: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: '#10b981',
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: 'white',
        letterSpacing: -1,
        textAlign: 'center',
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: 2,
        textAlign: 'center',
    },
    loadingBarContainer: {
        width: 120,
        height: 3,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 2,
        overflow: 'hidden',
        marginBottom: 15,
        alignSelf: 'center',
    },
    loadingBar: {
        width: '40%',
        height: '100%',
        backgroundColor: '#10b981',
        borderRadius: 2,
    },
    orb: {
        position: 'absolute',
        width: width * 1.5,
        height: width * 1.5,
        borderRadius: width,
        filter: 'blur(100px)',
    },
    orb1: {
        top: -width,
        right: -width / 2,
        backgroundColor: '#10b981',
        opacity: 0.08,
    },
    orb2: {
        bottom: -width,
        left: -width / 2,
        backgroundColor: '#6366f1',
        opacity: 0.08,
    },
});
