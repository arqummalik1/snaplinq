import { useRouter } from 'expo-router';
import { ArrowRight, Chrome } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    Pressable,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Animated, {
    FadeInDown,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import { Button } from '../src/components/ui/Button';
import { Input } from '../src/components/ui/Input';
import { Logo } from '../src/components/ui/Logo';
import { useAuth } from '../src/context/AuthContext';
import { useToast } from '../src/context/ToastContext';

const GOLD = '#FFB74D';
const BUTTON_HEIGHT = 90; // Premium substantial height
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isMobile = SCREEN_WIDTH < 600;

export default function Login() {
    const router = useRouter();
    const { signInWithGoogle } = useAuth();
    const { success: showSuccess, error: showError } = useToast();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [isResettingPassword, setIsResettingPassword] = useState(false);
    const [keepLoggedIn, setKeepLoggedIn] = useState(true);

    // Toggle Animation
    const toggleValue = useSharedValue(keepLoggedIn ? 1 : 0);

    useEffect(() => {
        toggleValue.value = withSpring(keepLoggedIn ? 1 : 0, { damping: 20, stiffness: 120 });
    }, [keepLoggedIn]);

    const toggleCircleStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: toggleValue.value * 22 }],
        backgroundColor: '#FFFFFF',
    }));

    const toggleBgStyle = useAnimatedStyle(() => ({
        backgroundColor: withTiming(keepLoggedIn ? GOLD : '#3A3A3C'),
    }));

    const validate = () => {
        let isValid = true;
        if (!email.includes('@')) {
            setEmailError('Please enter a valid email address');
            isValid = false;
        } else {
            setEmailError('');
        }
        if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            isValid = false;
        } else {
            setPasswordError('');
        }
        return isValid;
    };

    const handleAuth = async () => {
        if (!validate()) return;

        setLoading(true);
        // Simulate premium auth experience
        setTimeout(() => {
            setLoading(false);
            showSuccess('Welcome back, Arch-viz Master!');
            router.replace('/');
        }, 2000);
    };

    const handleGoogle = async () => {
        setLoading(true);
        try {
            await signInWithGoogle();
        } catch (e: any) {
            showError('Sign-in failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Animated.View
                entering={FadeInDown.springify().damping(25).stiffness(120)}
                style={styles.card}
            >
                {/* Header: Visual Identity */}
                <View style={styles.header}>
                    <View style={styles.logoWrapper}>
                        <Logo width={72} height={72} />
                    </View>
                    <Text style={styles.brandName}>Snaplinq</Text>
                    <Text style={styles.tagline}>Intelligent knowledge orchestration</Text>
                </View>

                {/* Authentication: Tier 1 (Social) */}
                {!isResettingPassword && (
                    <View style={styles.socialStack}>
                        <Pressable
                            onPress={handleGoogle}
                            style={({ pressed }) => [
                                styles.googleBtn,
                                pressed && { opacity: 0.8, transform: [{ scale: 0.99 }] }
                            ]}
                        >
                            <Chrome size={24} color="white" />
                            <Text style={styles.googleBtnText}>Continue with Google</Text>
                        </Pressable>

                        <View style={styles.separatorRow}>
                            <View style={styles.line} />
                            <Text style={styles.separatorText}>Secure Login</Text>
                            <View style={styles.line} />
                        </View>
                    </View>
                )}

                {/* Authentication: Tier 2 (Traditional) */}
                <View style={styles.inputStack}>
                    <Input
                        variant="dark"
                        placeholder="Organization Email"
                        value={email}
                        onChangeText={(t) => { setEmail(t); setEmailError(''); }}
                        error={emailError}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        style={styles.premiumPill}
                    />

                    {!isResettingPassword && (
                        <Input
                            variant="dark"
                            placeholder="Cloud Password"
                            value={password}
                            onChangeText={(t) => { setPassword(t); setPasswordError(''); }}
                            error={passwordError}
                            secureTextEntry
                            style={styles.premiumPill}
                        />
                    )}

                    {isSignUp && (
                        <Input
                            variant="dark"
                            placeholder="Confirm Authentication Key"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            style={styles.premiumPill}
                        />
                    )}
                </View>

                {/* Experience Settings */}
                {!isResettingPassword && !isSignUp && (
                    <View style={styles.utilityRow}>
                        <View className="flex-row items-center gap-3">
                            <Pressable onPress={() => setKeepLoggedIn(!keepLoggedIn)}>
                                <Animated.View style={[styles.switchBg, toggleBgStyle]}>
                                    <Animated.View style={[styles.switchDot, toggleCircleStyle]} />
                                </Animated.View>
                            </Pressable>
                            <Text style={styles.utilityText}>Stay authenticated</Text>
                        </View>
                        <Pressable onPress={() => setIsResettingPassword(true)}>
                            <Text style={styles.recoveryText}>Recover Key</Text>
                        </Pressable>
                    </View>
                )}

                {/* Primary Interaction */}
                <View style={styles.actionStack}>
                    <Button
                        variant="accent"
                        size="lg"
                        onPress={handleAuth}
                        loading={loading}
                        icon={ArrowRight}
                        iconPosition="right"
                        style={styles.masterActionBtn}
                    >
                        {isResettingPassword ? 'Reset Access' : isSignUp ? 'Initialize Account' : 'Authenticate'}
                    </Button>

                    <View style={styles.navigationFooter}>
                        <Text style={styles.navQuietText}>
                            {isSignUp ? 'Domain member?' : "New to the network?"}
                        </Text>
                        <Pressable onPress={() => { setIsSignUp(!isSignUp); setIsResettingPassword(false); }}>
                            <Text style={styles.navBoldLink}>
                                {isSignUp ? 'Sign in' : 'Request Access'}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
        padding: isMobile ? 12 : 24,
    },
    card: {
        width: isMobile ? '100.5%' : '100%',
        maxWidth: 680,
        backgroundColor: '#0A0A0B',
        paddingHorizontal: isMobile ? 24 : 80,
        paddingVertical: isMobile ? 64 : 100,
        borderRadius: isMobile ? 48 : 72,
        borderWidth: 1,
        borderColor: '#1A1A1C',
        shadowColor: "#FFB74D",
        shadowOffset: { width: 0, height: 40 },
        shadowOpacity: 0.1,
        shadowRadius: 60,
        elevation: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 64,
    },
    logoWrapper: {
        marginBottom: 32,
        padding: 28,
        backgroundColor: '#111113',
        borderRadius: 44,
        borderWidth: 1,
        borderColor: '#222225',
    },
    brandName: {
        color: '#FFFFFF',
        fontSize: isMobile ? 44 : 64,
        fontWeight: '900',
        letterSpacing: -2,
        marginBottom: 10,
    },
    tagline: {
        color: '#666666',
        fontSize: isMobile ? 16 : 20,
        fontWeight: '500',
        textAlign: 'center',
        maxWidth: 320,
    },
    socialStack: {
        marginBottom: 48,
    },
    googleBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#111113',
        borderRadius: 100,
        height: 72,
        borderWidth: 1,
        borderColor: '#1C1C1E',
        gap: 16,
    },
    googleBtnText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
    },
    separatorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 48,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#131315',
    },
    separatorText: {
        marginHorizontal: 24,
        color: '#333333',
        fontSize: 12,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 3,
    },
    inputStack: {
        gap: 20,
        marginBottom: 40,
    },
    premiumPill: {
        borderRadius: 100,
        minHeight: 88,
        backgroundColor: '#0D0D0F',
        borderWidth: 1,
        borderColor: '#1C1C1E',
    },
    masterActionBtn: {
        borderRadius: 100,
        height: 84, // Refined height for premium balance (prev 96 was slightly too aggressive)
        width: '100%',
        backgroundColor: GOLD,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        shadowColor: GOLD,
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.3,
        shadowRadius: 24,
        elevation: 10,
    },
    utilityRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 56,
        paddingHorizontal: 16,
    },
    utilityText: {
        color: '#888888',
        fontSize: 16,
        fontWeight: '500',
    },
    switchBg: {
        width: 48, // 25% Shrunk
        height: 26, // 25% Shrunk
        borderRadius: 100,
        padding: 4,
    },
    switchDot: {
        width: 18,
        height: 18,
        borderRadius: 100,
    },
    recoveryText: {
        color: '#555555',
        fontSize: 15,
        fontWeight: '700',
    },
    actionStack: {
        gap: 32,
    },
    navigationFooter: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    navQuietText: {
        color: '#555555',
        fontSize: 16,
        fontWeight: '500',
    },
    navBoldLink: {
        color: GOLD,
        fontSize: 16,
        fontWeight: '800',
    }
});
