import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { Button } from '../src/components/ui/Button';
import { Input } from '../src/components/ui/Input';
import { Logo } from '../src/components/ui/Logo';
import { useToast } from '../src/context/ToastContext';
import { supabase } from '../src/lib/supabase';

export default function ResetPassword() {
    const router = useRouter();
    const { success, error: showError } = useToast();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleUpdatePassword = async () => {
        if (!password || password.length < 6) {
            showError("Password must be at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            showError("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password: password,
            });

            if (error) throw error;

            success("Password updated successfully! You can now sign in.");
            router.replace('/login');
        } catch (e: any) {
            console.error("Update Password Error:", e);
            showError(e.message || "Failed to update password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-slate-50 dark:bg-slate-900 justify-center items-center p-6">
            <View className="w-full max-w-md bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700">
                <View className="items-center mb-8">
                    <Logo className="mb-4" width={90} height={90} />
                    <Text className="text-2xl font-bold text-slate-900 dark:text-white">
                        New Password
                    </Text>
                    <Text className="text-slate-500 dark:text-slate-400 mt-1 text-center">
                        Enter your new secure password
                    </Text>
                </View>

                <View className="space-y-4 mb-6">
                    <Input
                        label="New Password"
                        placeholder="••••••••"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                    <Input
                        label="Confirm New Password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                    />
                </View>

                <Button onPress={handleUpdatePassword} loading={loading}>
                    Update Password
                </Button>
            </View>
        </View>
    );
}
