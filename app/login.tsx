import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
    FadeInDown,
    FadeInUp,
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
        <View className="flex-1 bg-[#f8fafc] dark:bg-[#0f172a] justify-center items-center p-6">
            {/* Ultra-Premium Ambient Background */}
            <Animated.View 
                entering={FadeInUp.delay(200).duration(1000)}
                style={[styles.orb, styles.orb1]} 
            />
            <Animated.View 
                entering={FadeInDown.delay(400).duration(1000)}
                style={[styles.orb, styles.orb2]} 
            />
            <View style={[styles.orb, styles.orb3]} />

            <Animated.View 
                entering={FadeInDown.springify().damping(15)}
                className="w-full max-w-md bg-white/80 dark:bg-slate-900/80 p-10 rounded-[48px] shadow-2xl border border-white/50 dark:border-slate-800/50 backdrop-blur-3xl"
                style={styles.cardShadow}
            >
                {/* Logo Section */}
                <Animated.View style={[styles.center, logoAnimatedStyle]} className="mb-10">
                    <Logo width={100} height={100} className="shadow-2xl" />
                    <Animated.Text 
                        entering={FadeInDown.delay(300)}
                        className="text-3xl font-black text-slate-900 dark:text-white mt-4 tracking-tighter"
                    >
                        Snaplinq
                    </Animated.Text>
                    <Text className="text-slate-500 dark:text-slate-400 font-medium tracking-wide uppercase text-[10px] mt-1">
                        Your Intelligent Link Vault
                    </Text>
                </Animated.View>

                {/* Form Context */}
                <View className="mb-8">
                    <Text className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        {isResettingPassword ? "Reset Access" : isSignUp ? "Get Started" : "Welcome Back"}
                    </Text>
                    <Text className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                        {isResettingPassword 
                            ? "We'll send a recovery link to your inbox." 
                            : isSignUp ? "Create an account to start curating your digital world." : "Sign in to access your curated collection."}
                    </Text>
                </View>

                {/* Authentication Options */}
                {!isResettingPassword && (
                    <View className="mb-8">
                        <Button 
                            variant="secondary" 
                            onPress={handleGoogle} 
                            className="w-full h-14 rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 shadow-sm"
                        >
                            <View className="flex-row items-center justify-center gap-3">
                                <Text className="text-lg">G</Text>
                                <Text className="font-bold text-slate-700 dark:text-slate-200">Continue with Google</Text>
                            </View>
                        </Button>

                        <View className="flex-row items-center my-8">
                            <View className="flex-1 h-[1px] bg-slate-100 dark:bg-slate-800" />
                            <Text className="mx-4 text-[10px] font-bold text-slate-400 uppercase tracking-[2px]">Or Email</Text>
                            <View className="flex-1 h-[1px] bg-slate-100 dark:bg-slate-800" />
                        </View>
                    </View>
                )}

                <View className="space-y-5">
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
                                    <Text className="text-emerald-500 font-bold text-[11px] uppercase tracking-wider">Forgot?</Text>
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

                {/* Actions */}
                <View className="mt-10">
                    <Button 
                        onPress={isResettingPassword ? handleForgotPassword : handleAuth} 
                        loading={loading}
                        className="h-14 rounded-2xl shadow-xl shadow-emerald-500/30"
                    >
                        {isResettingPassword ? "Send Recovery Link" : isSignUp ? "Create Account" : "Sign In"}
                    </Button>

                    {isResettingPassword && (
                        <Button 
                            variant="ghost" 
                            onPress={() => setIsResettingPassword(false)}
                            className="mt-4"
                        >
                            Back to Sign In
                        </Button>
                    )}
                </View>

                {/* Toggle Mode */}
                {!isResettingPassword && (
                    <View className="mt-8 flex-row justify-center items-center">
                        <Text className="text-slate-400 dark:text-slate-500 text-sm">
                            {isSignUp ? "Already a member?" : "New to Snaplinq?"}
                        </Text>
                        <Pressable 
                            onPress={() => {
                                setIsSignUp(!isSignUp);
                                logoScale.value = withSequence(withSpring(1.2), withSpring(1));
                            }}
                            className="ml-2"
                        >
                            <Text className="text-emerald-500 font-black text-sm">
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
        borderRadius: 999,
        filter: 'blur(100px)',
    },
    orb1: {
        top: -100,
        right: -100,
        width: 500,
        height: 500,
        backgroundColor: '#10b981',
        opacity: 0.15,
    },
    orb2: {
        bottom: -150,
        left: -150,
        width: 600,
        height: 600,
        backgroundColor: '#6366f1',
        opacity: 0.12,
    },
    orb3: {
        top: '20%',
        left: '10%',
        width: 300,
        height: 300,
        backgroundColor: '#f59e0b',
        opacity: 0.05,
    },
    cardShadow: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.1,
        shadowRadius: 40,
        elevation: 10,
    }
});
