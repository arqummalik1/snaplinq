import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, Switch, Text, View } from 'react-native';
import { Button } from '../src/components/ui/Button';
import { Input } from '../src/components/ui/Input';
import { Logo } from '../src/components/ui/Logo';
import { useAuth } from '../src/context/AuthContext';
import { supabase } from '../src/lib/supabase';

export default function Login() {
    const router = useRouter();
    const { signInWithGoogle } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [keepLoggedIn, setKeepLoggedIn] = useState(true);

    const handleAuth = async () => {
        setLoading(true);
        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                Alert.alert("Check your email", "We sent you a confirmation link.");
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                router.replace('/');
            }
        } catch (e: any) {
            Alert.alert("Error", e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = async () => {
        try {
            await signInWithGoogle();
            // Redirect handled by auth state listener in index or _layout
        } catch (e: any) {
            Alert.alert("Google Sign-In Error", e.message);
        }
    };

    return (
        <View className="flex-1 bg-slate-50 dark:bg-slate-900 justify-center items-center p-6">
            <View className="w-full max-w-md bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700">

                {/* Logo */}
                <View className="items-center mb-8">
                    <Logo className="mb-4" width={80} height={80} />
                    <Text className="text-2xl font-bold text-slate-900 dark:text-white">
                        {isSignUp ? "Create Account" : "Welcome Back"}
                    </Text>
                    <Text className="text-slate-500 dark:text-slate-400 mt-1">
                        Sign in to access your Snaplinq
                    </Text>
                </View>

                {/* Google Button */}
                <Button variant="secondary" onPress={handleGoogle} className="mb-6 flex-row gap-3">
                    {/* Simple G Text for now, replace with SVG if possible */}
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
                        onChangeText={setEmail}
                        autoCapitalize="none"
                    />
                    <Input
                        label="Password"
                        placeholder="••••••••"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                {/* Keep me logged in */}
                {!isSignUp && (
                    <View className="flex-row items-center justify-between mb-6">
                        <Text className="text-slate-600 dark:text-slate-400">Keep me logged in</Text>
                        <Switch
                            value={keepLoggedIn}
                            onValueChange={setKeepLoggedIn}
                            trackColor={{ false: '#cbd5e1', true: '#34d399' }}
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
                    <Pressable onPress={() => setIsSignUp(!isSignUp)}>
                        <Text className="text-emerald-500 font-bold">
                            {isSignUp ? "Sign In" : "Sign Up"}
                        </Text>
                    </Pressable>
                </View>

            </View>
        </View>
    );
}
