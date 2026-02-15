import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface LiquidAlertProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
}

export const LiquidAlert = ({
    visible,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Delete",
    cancelText = "Cancel",
    loading = false
}: LiquidAlertProps) => {
    const { isDark } = useTheme();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                {/* Backdrop Blur */}
                {Platform.OS === 'web' ? (
                    <Pressable
                        style={[{
                            position: 'absolute',
                            top: 0, left: 0, right: 0, bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.3)',
                        }, { backdropFilter: 'blur(8px)' } as any]}
                        onPress={onClose}
                    />
                ) : (
                    <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill}>
                        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
                    </BlurView>
                )}

                {/* Liquid Glass Container */}
                <View style={[styles.glassWrapper, isDark && styles.glassWrapperDark]}>

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
                            : ['transparent', 'rgba(255,255,255,0.2)', 'transparent']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        locations={[0.4, 0.5, 0.6]}
                        style={styles.glassSheen}
                    />

                    {/* Content */}
                    <View style={styles.content}>
                        <Text style={[styles.title, { color: isDark ? '#fff' : '#1e293b' }]}>
                            {title}
                        </Text>
                        <Text style={[styles.message, { color: isDark ? '#cbd5e1' : '#475569' }]}>
                            {message}
                        </Text>

                        {/* Buttons */}
                        <View style={styles.buttonRow}>
                            <Pressable
                                onPress={onClose}
                                style={({ pressed }) => [styles.button, styles.cancelButton, pressed && { opacity: 0.7 }]}
                            >
                                <Text style={[styles.buttonText, { color: isDark ? '#cbd5e1' : '#475569' }]}>
                                    {cancelText}
                                </Text>
                            </Pressable>

                            <Pressable
                                onPress={onConfirm}
                                disabled={loading}
                                style={({ pressed }) => [styles.button, styles.confirmButton, pressed && { opacity: 0.8 }]}
                            >
                                <LinearGradient
                                    colors={['#ef4444', '#dc2626']}
                                    style={StyleSheet.absoluteFill}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 0, y: 1 }}
                                />
                                <Text style={[styles.buttonText, { color: 'white', fontWeight: '600' }]}>
                                    {loading ? "Deleting..." : confirmText}
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)', // Fallback if blur fails
    },
    glassWrapper: {
        width: '85%',
        maxWidth: 340,
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.6)', // More opaque for alert
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        ...(Platform.OS === 'web' ? {
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        } : {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
            elevation: 10,
        }),
    } as any,
    glassWrapperDark: {
        backgroundColor: 'rgba(30, 41, 59, 0.7)', // Dark semi-transparent
        borderColor: 'rgba(255,255,255,0.1)',
    },
    glassRefraction: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.5,
    },
    glassSheen: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.5,
        ...(Platform.OS === 'web' ? { mixBlendMode: 'overlay' } : {}),
    } as any,
    content: {
        padding: 24,
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 8,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    button: {
        flex: 1,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    cancelButton: {
        borderWidth: 1,
        borderColor: 'rgba(148, 163, 184, 0.3)',
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    confirmButton: {
        // Gradient handled by LinearGradient child
        shadowColor: "#ef4444",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
    }
});
