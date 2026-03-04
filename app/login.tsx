import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
    FadeIn,
    FadeInDown,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import { Button } from '../src/components/ui/Button';
import { Input } from '../src/components/ui/Input';
import { Logo } from '../src/components/ui/Logo';
import { useAuth } from '../src/context/AuthContext';
import { useToast } from '../src/context/ToastContext';
import { supabase } from '../src/lib/supabase';

const { width, height } = Dimensions.get('window');

export default function Login() {
    const router = useRouter();
    const { signInWithGoogle } = useAuth();
    const { success, error: showError } = useToast();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [isResettingPassword, setIsResettingPassword] = useState(false);
    const [keepLoggedIn, setKeepLoggedIn] = useState(true);

    // Animations
    const logoScale = useSharedValue(1);
    const floatValue = useSharedValue(0);

    useEffect(() => {
        floatValue.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 2000 }),
                withTiming(0, { duration: 2000 })
            ),
            -1,
            true
        );
    }, []);

    const logoAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateY: floatValue.value * -10 },
                { scale: logoScale.value }
            ]
        };
    });

    // Validation functions
    const validateEmail = (email: string): { valid: boolean; message: string } => {
        const trimmedEmail = email.trim();
        if (!trimmedEmail) return { valid: false, message: "Email is required." };
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
        if (!emailRegex.test(trimmedEmail)) return { valid: false, message: "Please enter a valid email address." };
        return { valid: true, message: "" };
    };

    const validatePassword = (password: string): { valid: boolean; message: string } => {
        if (!password) return { valid: false, message: "Password is required." };
        if (password.length < 6) return { valid: false, message: "Password must be at least 6 characters." };
        return { valid: true, message: "" };
    };

    const handleForgotPassword = async () => {
        const trimmedEmail = email.trim().toLowerCase();
        const emailValidation = validateEmail(trimmedEmail);
        if (!emailValidation.valid) {
            showError(emailValidation.message);
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
                redirectTo: `${typeof window !== 'undefined' ? window.location.origin : 'snaplinq://'}/reset-password`,
            });
            if (error) throw error;
            success("Password reset email sent! Please check your inbox.");
            setIsResettingPassword(false);
        } catch (e: any) {
            showError(e.message || "Failed to send reset email. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleAuth = async () => {
        const trimmedEmail = email.trim().toLowerCase();
        const emailValidation = validateEmail(trimmedEmail);
        if (!emailValidation.valid) {
            showError(emailValidation.message);
            return;
        }

        if (!isResettingPassword) {
            const passwordValidation = validatePassword(password);
            if (!passwordValidation.valid) {
                showError(passwordValidation.message);
                return;
            }
        }

        if (isSignUp) {
            if (password !== confirmPassword) {
                showError("Passwords do not match.");
                return;
            }
        }

        setLoading(true);
        try {
            if (isSignUp) {
                const { data, error } = await supabase.auth.signUp({
                    email: trimmedEmail,
                    password,
                    options: { data: { full_name: '' } }
                });
                if (error) throw error;
                if (data?.session) {
                    success("Welcome to Snaplinq!");
                    router.replace('/');
                } else {
                    success("Account created! Please check your email.");
                    setIsSignUp(false);
                }
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email: trimmedEmail, password });
                if (error) throw error;
                success("Welcome back!");
                router.replace('/');
            }
        } catch (e: any) {
            showError(e.message || "Authentication failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = async () => {
        try {
            await signInWithGoogle();
        } catch (e: any) {
            if (!e.message?.toLowerCase().includes('cancel')) {
                showError(e.message || "Google Sign-In failed.");
            }
        }
    };

    return (
        <View className="flex-1 bg-[#f8fafc] dark:bg-[#020617] justify-center items-center p-4">
            {/* Ultra-Premium Web Ambient Background */}
            <Animated.View
                entering={FadeIn.duration(1500)}
                style={[styles.orb, styles.orb1]}
            />
            <Animated.View
                entering={FadeIn.duration(1500).delay(200)}
                style={[styles.orb, styles.orb2]}
            />
            <Animated.View
                entering={FadeIn.duration(1500).delay(400)}
                style={[styles.orb, styles.orb3]}
            />

            <Animated.View
                entering={FadeInDown.springify().damping(18).stiffness(100)}
                className="w-full max-w-[440px] bg-white/80 dark:bg-slate-900/80 p-6 sm:p-10 rounded-[32px] sm:rounded-[48px] shadow-2xl border border-white/50 dark:border-slate-800/50 backdrop-blur-3xl"
                style={styles.cardShadow}
            >
                {/* Logo & Brand Header */}
                <View className="items-center mb-10">
                    <Animated.View style={logoAnimatedStyle}>
                        <View className="bg-white dark:bg-slate-800 p-5 sm:p-6 rounded-[24px] sm:rounded-[32px] shadow-2xl shadow-emerald-500/20 border border-slate-100 dark:border-slate-700">
                            <Logo width={56} height={56} />
                        </View>
                    </Animated.View>
                    <Text className="text-[42px] font-black text-slate-900 dark:text-white mt-8 tracking-[-2px] leading-tight">
                        Snaplinq
                    </Text>
                    <Text className="text-slate-500 dark:text-slate-400 font-bold tracking-[3px] uppercase text-[10px] mt-2">
                        Intelligent Link Vault
                    </Text>
                </View>

                {/* Authentication Form Context */}
                <View className="mb-10">
                    <Text className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                        {isResettingPassword ? "Recover" : isSignUp ? "Create" : "Welcome"}
                    </Text>
                    <Text className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                        {isResettingPassword
                            ? "Enter your email to reset access."
                            : isSignUp ? "Join the elite circle of link curators." : "Sign in to your private collection."}
                    </Text>
                </View>

                {/* Google Auth Integration */}
                {!isResettingPassword && (
                    <View className="mb-10">
                        <Button
                            variant="secondary"
                            onPress={handleGoogle}
                            className="w-full h-16 rounded-[24px] bg-white dark:bg-slate-800"
                        >
                            <View className="flex-row items-center justify-center gap-4">
                                <Text className="text-xl">G</Text>
                                <Text className="font-bold text-slate-700 dark:text-slate-200 tracking-tight">Continue with Google</Text>
                            </View>
                        </Button>

                        <View className="flex-row items-center my-10 px-4">
                            <View className="flex-1 h-[1px] bg-slate-200 dark:bg-slate-800" />
                            <Text className="mx-6 text-[10px] font-black text-slate-400 uppercase tracking-[4px]">OR</Text>
                            <View className="flex-1 h-[1px] bg-slate-200 dark:bg-slate-800" />
                        </View>
                    </View>
                )}

                <View className="space-y-6">
                    <Input
                        label="Email Address"
                        placeholder="name@example.com"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />

                    {!isResettingPassword && (
                        <View>
                            <Input
                                label="Password"
                                placeholder="••••••••"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                            {!isSignUp && (
                                <Pressable
                                    onPress={() => setIsResettingPassword(true)}
                                    className="absolute right-0 top-0"
                                >
                                    <Text className="text-emerald-500 font-black text-[10px] uppercase tracking-widest">Forgot?</Text>
                                </Pressable>
                            )}
                        </View>
                    )}

                    {isSignUp && (
                        <Input
                            label="Confirm Password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                        />
                    )}
                </View>

                {/* Primary Actions */}
                <View className="mt-12">
                    <Button
                        onPress={isResettingPassword ? handleForgotPassword : handleAuth}
                        loading={loading}
                        className="h-16 rounded-[24px] shadow-2xl shadow-emerald-500/40"
                    >
                        {isResettingPassword ? "Send Recovery Link" : isSignUp ? "Initialize Account" : "Enter Vault"}
                    </Button>

                    {isResettingPassword && (
                        <Button
                            variant="ghost"
                            onPress={() => setIsResettingPassword(false)}
                            className="mt-6"
                        >
                            Return to Entry
                        </Button>
                    )}
                </View>

                {/* Mode Switcher */}
                {!isResettingPassword && (
                    <View className="mt-10 flex-row justify-center items-center">
                        <Text className="text-slate-400 dark:text-slate-500 font-medium">
                            {isSignUp ? "Member already?" : "New curator?"}
                        </Text>
                        <Pressable
                            onPress={() => {
                                setIsSignUp(!isSignUp);
                                logoScale.value = withSequence(withSpring(1.2), withSpring(1));
                            }}
                            className="ml-3"
                        >
                            <Text className="text-emerald-500 font-black tracking-tight">
                                {isSignUp ? "Sign In" : "Join Now"}
                            </Text>
                        </Pressable>
                    </View>
                )}
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    center: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    orb: {
        position: 'absolute',
        borderRadius: 9999,
        filter: 'blur(120px)',
    },
    orb1: {
        top: -200,
        right: -100,
        width: 800,
        height: 800,
        backgroundColor: '#10b981',
        opacity: 0.12,
    },
    orb2: {
        bottom: -300,
        left: -200,
        width: 900,
        height: 900,
        backgroundColor: '#6366f1',
        opacity: 0.1,
    },
    orb3: {
        top: '15%',
        left: '-10%',
        width: 400,
        height: 400,
        backgroundColor: '#f59e0b',
        opacity: 0.04,
    },
    cardShadow: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 40 },
        shadowOpacity: 0.15,
        shadowRadius: 60,
        elevation: 20,
    }
});
