import { useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    TextStyle,
    View
} from 'react-native';
import Animated, {
    FadeIn,
    FadeInDown,
    FadeInUp,
} from 'react-native-reanimated';
import { Button } from '../src/components/ui/Button';
import { Input } from '../src/components/ui/Input';
import { Logo } from '../src/components/ui/Logo';
import { useAuth } from '../src/context/AuthContext';
import { useToast } from '../src/context/ToastContext';
import { supabase } from '../src/lib/supabase';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const isMobile = SCREEN_WIDTH < 600;
const isSmallHeight = SCREEN_HEIGHT < 700;

// Premium color palette
const COLORS = {
    background: '#0A0A0B',
    card: '#111113',
    cardBorder: '#1C1C1E',
    primary: '#10B981',
    primaryGlow: 'rgba(16, 185, 129, 0.3)',
    text: '#FFFFFF',
    textSecondary: '#71717A',
    textMuted: '#52525B',
    googleBg: '#18181B',
    googleBorder: '#27272A',
    inputBg: '#09090B',
    inputBorder: '#18181B',
    error: '#EF4444',
} as const;

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

    const validate = () => {
        let isValid = true;
        if (!email.includes('@')) {
            setEmailError('Please enter a valid email');
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

        if (isSignUp && password !== confirmPassword) {
            showError("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            if (isSignUp) {
                const { error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (signUpError) throw signUpError;
                showSuccess('Account initialized! Please check your email.');
            } else {
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (signInError) throw signInError;
                showSuccess('Welcome back!');
                router.replace('/');
            }
        } catch (e: any) {
            showError(e.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
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

    const toggleMode = () => {
        setIsSignUp(!isSignUp);
        setEmailError('');
        setPasswordError('');
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <Animated.View
                    entering={FadeIn.duration(800)}
                    style={styles.contentContainer}
                >
                    {/* Logo Section */}
                    <Animated.View
                        entering={FadeInDown.springify().damping(20).delay(100)}
                        style={styles.logoSection}
                    >
                        <View style={styles.logoContainer}>
                            <View style={styles.logoGlow}>
                                <Logo width={isMobile ? 56 : 72} height={isMobile ? 56 : 72} />
                            </View>
                        </View>
                        <Text style={styles.brandName}>Snaplinq</Text>
                        <Text style={styles.tagline}>Your intelligent link vault</Text>
                    </Animated.View>

                    {/* Form Card */}
                    <Animated.View
                        entering={FadeInUp.springify().damping(20).delay(200)}
                        style={styles.formCard}
                    >
                        {/* Google Sign In - Premium Style */}
                        <Pressable
                            onPress={handleGoogle}
                            style={({ pressed }) => [
                                styles.googleButton,
                                pressed && styles.googleButtonPressed
                            ]}
                        >
                            <View style={styles.googleIconContainer}>
                                <Image
                                    source={require('../assets/logo/google.png')}
                                    style={{ width: 18, height: 18 }} // 25% smaller brand presence in button
                                    resizeMode="contain"
                                />
                            </View>
                            <Text style={styles.googleButtonText}>Continue with Google</Text>
                        </Pressable>

                        {/* Divider */}
                        <View style={styles.divider}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>or</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        {/* Input Fields */}
                        <View style={styles.inputContainer}>
                            <Input
                                variant="dark"
                                placeholder="Email address"
                                value={email}
                                onChangeText={(t) => { setEmail(t); setEmailError(''); }}
                                error={emailError}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                className="text-base"
                                style={styles.input}
                            />

                            <Input
                                variant="dark"
                                placeholder="Password"
                                value={password}
                                onChangeText={(t) => { setPassword(t); setPasswordError(''); }}
                                error={passwordError}
                                secureTextEntry
                                className="text-base"
                                style={styles.input}
                            />

                            {isSignUp && (
                                <Animated.View entering={FadeIn.duration(200)}>
                                    <Input
                                        variant="dark"
                                        placeholder="Confirm password"
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        secureTextEntry
                                        className="text-base"
                                        style={styles.input}
                                    />
                                </Animated.View>
                            )}

                            {!isSignUp && (
                                <View style={styles.rememberMeRow}>
                                    <View style={styles.rememberMeLeft}>
                                        <Pressable style={styles.checkboxSmall}>
                                            <View style={styles.checkboxInner} />
                                        </Pressable>
                                        <Text style={styles.rememberMeText}>Keep me signed in</Text>
                                    </View>
                                    <Pressable onPress={() => router.push('/reset-password')}>
                                        <Text style={styles.forgotPassword}>Forgot?</Text>
                                    </Pressable>
                                </View>
                            )}
                        </View>

                        {/* Action Button */}
                        <Button
                            variant="substantial"
                            size="xl"
                            onPress={handleAuth}
                            loading={loading}
                            icon={ArrowRight}
                            iconPosition="right"
                            className="w-full"
                        >
                            {isSignUp ? 'Create Account' : 'Sign In'}
                        </Button>
                    </Animated.View>

                    {/* Toggle Mode */}
                    <View style={styles.toggleContainer}>
                        <Text style={styles.toggleText}>
                            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                        </Text>
                        <Pressable onPress={toggleMode}>
                            <Text style={styles.toggleLink}>
                                {isSignUp ? 'Sign in' : 'Sign up'}
                            </Text>
                        </Pressable>
                    </View>

                    {/* Footer */}
                    <Animated.View
                        entering={FadeIn.delay(400)}
                        style={styles.footer}
                    >
                        <Text style={styles.footerText}>
                            By continuing, you agree to our Terms
                        </Text>
                    </Animated.View>
                </Animated.View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    keyboardView: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Math.max(SCREEN_WIDTH * 0.05, 16), // Fluid padding
        paddingVertical: 24,
    },
    logoSection: {
        alignItems: 'center',
        marginBottom: Math.max(SCREEN_HEIGHT * 0.04, 24), // Relative margin
    },
    logoContainer: {
        marginBottom: 16,
    },
    logoGlow: {
        padding: 20,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderRadius: 32,
        borderWidth: 1,
        borderColor: 'rgba(16, 185, 129, 0.2)',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 24,
    },
    brandName: {
        color: COLORS.text,
        fontSize: isMobile ? 32 : 40,
        fontWeight: '800',
        letterSpacing: -1,
        marginBottom: 4,
    },
    tagline: {
        color: COLORS.textSecondary,
        fontSize: isMobile ? 14 : 16,
        fontWeight: '500',
    },
    formCard: {
        width: '100%',
        maxWidth: 380, // Always constrain to mobile-like width
        backgroundColor: COLORS.card,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
        padding: 24,
        ...(Platform.OS === 'web' ? {
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        } : {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 25 },
            shadowOpacity: 0.5,
            shadowRadius: 50,
            elevation: 20,
        }),
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.googleBg,
        borderRadius: 16,
        height: 56,
        borderWidth: 1,
        borderColor: COLORS.googleBorder,
        gap: 12,
    },
    googleButtonPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }],
    },
    googleIconContainer: {
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    googleButtonText: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: '600',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.cardBorder,
    },
    dividerText: {
        color: COLORS.textMuted,
        fontSize: 12,
        fontWeight: '600',
        marginHorizontal: 16,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    inputContainer: {
        marginBottom: 20,
    },
    input: {
        backgroundColor: COLORS.inputBg,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.inputBorder,
        minHeight: 56,
    },
    actionButton: {
        borderRadius: 16,
        height: 56,
        backgroundColor: COLORS.primary,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 8,
    },
    rememberMeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: -8,
        marginBottom: 12,
        paddingHorizontal: 4,
    },
    rememberMeLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    checkboxSmall: {
        width: 14, // 25% smaller
        height: 14,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: COLORS.textMuted,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxInner: {
        width: 8,
        height: 8,
        borderRadius: 2,
        backgroundColor: COLORS.primary,
    },
    rememberMeText: {
        fontSize: 11,
        color: COLORS.textSecondary,
        fontWeight: '500',
    },
    forgotPassword: {
        fontSize: 12,
        color: COLORS.primary,
        fontWeight: '600',
    },
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
        gap: 6,
    },
    toggleText: {
        color: COLORS.textSecondary,
        fontSize: 14,
        fontWeight: '500',
    } as TextStyle,
    toggleLink: {
        color: COLORS.primary,
        fontSize: 14,
        fontWeight: '700',
    } as TextStyle,
    footer: {
        marginTop: 24,
        alignItems: 'center',
    },
    footerText: {
        color: COLORS.textMuted,
        fontSize: 12,
        fontWeight: '500',
    } as TextStyle,
});
