import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Button } from '../src/components/ui/Button';
import { Input } from '../src/components/ui/Input';
import { Logo } from '../src/components/ui/Logo';
import { useToast } from '../src/context/ToastContext';
import { supabase } from '../src/lib/supabase';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const isSmallHeight = SCREEN_HEIGHT < 700;

const COLORS = {
    background: '#0A0A0B',
    card: '#111113',
    cardBorder: '#1C1C1E',
    primary: '#10B981',
    text: '#FFFFFF',
    textSecondary: '#71717A',
    textMuted: '#52525B',
};

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
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
            <View style={styles.content}>
                <View style={styles.logoSection}>
                    <View style={styles.logoGlow}>
                        <Logo width={isSmallHeight ? 48 : 64} height={isSmallHeight ? 48 : 64} />
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.title}>New Password</Text>
                    <Text style={styles.subtitle}>
                        Enter your new secure password
                    </Text>

                    <View style={styles.inputContainer}>
                        <Input
                            variant="dark"
                            label="New Password"
                            placeholder="Enter new password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                        <Input
                            variant="dark"
                            label="Confirm Password"
                            placeholder="Confirm new password"
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
    },
    content: {
        paddingHorizontal: 24,
        alignItems: 'center',
    },
    logoSection: {
        marginBottom: 24,
    },
    logoGlow: {
        padding: 16,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(16, 185, 129, 0.2)',
    },
    card: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: COLORS.card,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
        padding: 24,
    },
    title: {
        color: COLORS.text,
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        color: COLORS.textSecondary,
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 24,
    },
    inputContainer: {
        marginBottom: 24,
    },
});
