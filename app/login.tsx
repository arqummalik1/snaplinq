import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Switch, Text, View } from 'react-native';
import { Button } from '../src/components/ui/Button';
import { Input } from '../src/components/ui/Input';
import { Logo } from '../src/components/ui/Logo';
import { useAuth } from '../src/context/AuthContext';
import { useToast } from '../src/context/ToastContext';
import { supabase } from '../src/lib/supabase';

export default function Login() {
    const router = useRouter();
    const { signInWithGoogle } = useAuth();
    const { success, error: showError } = useToast();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [keepLoggedIn, setKeepLoggedIn] = useState(true);

    // Validation functions
    const validateEmail = (email: string): { valid: boolean; message: string } => {
        const trimmedEmail = email.trim();
        
        if (!trimmedEmail) {
            return { valid: false, message: "Email is required." };
        }
        
        // Check for spaces in email
        if (trimmedEmail.includes(' ')) {
            return { valid: false, message: "Email cannot contain spaces." };
        }
        
        // Strict email regex
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
        
        if (!emailRegex.test(trimmedEmail)) {
            return { valid: false, message: "Please enter a valid email address." };
        }
        
        return { valid: true, message: "" };
    };

    const validatePassword = (password: string): { valid: boolean; message: string } => {
        if (!password) {
            return { valid: false, message: "Password is required." };
        }
        
        if (password.length < 6) {
            return { valid: false, message: "Password must be at least 6 characters." };
        }
        
        return { valid: true, message: "" };
    };

    const handleAuth = async () => {
        // Trim email to remove leading/trailing spaces
        const trimmedEmail = email.trim().toLowerCase();
        
        // Validate email
        const emailValidation = validateEmail(trimmedEmail);
        if (!emailValidation.valid) {
            showError(emailValidation.message);
            return;
        }

        // Validate password
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
            showError(passwordValidation.message);
            return;
        }

        // Validate password confirmation for signup
        if (isSignUp) {
            if (password !== confirmPassword) {
                showError("Passwords do not match.");
                return;
            }
            
            if (confirmPassword.length === 0) {
                showError("Please confirm your password.");
                return;
            }
        }

        setLoading(true);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({ 
                    email: trimmedEmail, 
                    password,
                    options: {
                        data: {}
                    }
                });
                
                if (error) {
                    // Handle specific signup errors
                    switch (error.message.toLowerCase()) {
                        case 'user already registered':
                        case 'email rate limit exceeded':
                            showError("An account with this email already exists.");
                            break;
                        case 'invalid email':
                            showError("Please enter a valid email address.");
                            break;
                        case 'password too short':
                            showError("Password must be at least 6 characters.");
                            break;
                        default:
                            showError(error.message || "Signup failed. Please try again.");
                    }
                    return;
                }
                
                success("Account created! Please check your email to verify your account.");
                // Switch to login mode after successful signup
                setIsSignUp(false);
                setPassword('');
                setConfirmPassword('');
            } else {
                const { error } = await supabase.auth.signInWithPassword({ 
                    email: trimmedEmail, 
                    password
                });
                
                if (error) {
                    // Handle specific signin errors
                    const errorMessage = error.message.toLowerCase();
                    
                    if (errorMessage.includes('invalid') || errorMessage.includes('credentials')) {
                        showError("Invalid email or password. Please try again.");
                    } else if (errorMessage.includes('email not confirmed')) {
                        showError("Please verify your email first. Check your inbox for the confirmation link.");
                    } else if (errorMessage.includes('rate limit')) {
                        showError("Too many attempts. Please wait a moment and try again.");
                    } else {
                        showError(error.message || "Login failed. Please try again.");
                    }
                    return;
                }
                
                success("Welcome back!");
                router.replace('/');
            }
        } catch (e: any) {
            // Catch any unexpected errors
            console.error("Auth Error:", e);
            showError("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = async () => {
        try {
            await signInWithGoogle();
        } catch (e: any) {
            // Handle Google sign-in errors specifically
            const errorMessage = e.message?.toLowerCase() || '';
            
            if (errorMessage.includes('play services')) {
                showError("Google Play Services not available. Please try again.");
            } else if (errorMessage.includes('cancelled') || errorMessage.includes('cancel')) {
                // User cancelled - don't show error
                return;
            } else {
                showError(e.message || "Google Sign-In failed. Please try again.");
            }
        }
    };

    // Reset form when switching between sign in and sign up
    const toggleMode = () => {
        setIsSignUp(!isSignUp);
        setPassword('');
        setConfirmPassword('');
    };

    return (
        <View className="flex-1 bg-slate-50 dark:bg-slate-900 justify-center items-center p-6">
            <View className="w-full max-w-md bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700">

                {/* Logo */}
                <View className="items-center mb-8">
                    <Logo className="mb-4" width={90} height={90} />
                    <Text className="text-2xl font-bold text-slate-900 dark:text-white">
                        {isSignUp ? "Create Account" : "Welcome Back"}
                    </Text>
                    <Text className="text-slate-500 dark:text-slate-400 mt-1 text-center">
                        {isSignUp 
                            ? "Sign up to start organizing your links" 
                            : "Sign in to access your Snaplinq"
                        }
                    </Text>
                </View>

                {/* Google Button */}
                <Button variant="secondary" onPress={handleGoogle} className="mb-6 flex-row gap-3">
                    <Text className="font-bold text-lg text-slate-700 dark:text-slate-200">G</Text>
                    <Text>Continue with Google</Text>
                </Button>

                <View className="flex-row items-center mb-6">
                    <View className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                    <Text className="mx-4 text-slate-400 text-xs uppercase">Or continue with email</Text>
                    <View className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                </View>

                <View className="space-y-4 mb-6">
                    <Input
                        label="Email"
                        placeholder="you@example.com"
                        value={email}
                        onChangeText={(text) => {
                            // Automatically trim spaces and convert to lowercase
                            setEmail(text);
                        }}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="email-address"
                    />
                    <Input
                        label="Password"
                        placeholder="••••••••"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                    
                    {/* Password confirmation for signup */}
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

                {/* Keep me logged in */}
                {!isSignUp && (
                    <View className="flex-row items-center justify-between mb-6">
                        <Text className="text-slate-600 dark:text-slate-400">Keep me logged in</Text>
                        <Switch
                            value={keepLoggedIn}
                            onValueChange={setKeepLoggedIn}
                            trackColor={{ false: '#cbd5e1', true: '#10b981' }}
                        />
                    </View>
                )}

                <Button onPress={handleAuth} loading={loading}>
                    {isSignUp ? "Sign Up" : "Sign In"}
                </Button>

                <View className="mt-6 flex-row justify-center">
                    <Text className="text-slate-500 dark:text-slate-400">
                        {isSignUp ? "Already have an account? " : "Don't have an account? "}
                    </Text>
                    <Pressable onPress={toggleMode}>
                        <Text className="text-emerald-500 font-bold">
                            {isSignUp ? "Sign In" : "Sign Up"}
                        </Text>
                    </Pressable>
                </View>

            </View>
        </View>
    );
}
