import { LinearGradient } from 'expo-linear-gradient';
import { Plus } from 'lucide-react-native';
import { Platform, Pressable, StyleSheet, View, ViewStyle } from 'react-native';

interface FloatingActionButtonProps {
    onPress: () => void;
    style?: ViewStyle;
}

export const FloatingActionButton = ({ onPress, style }: FloatingActionButtonProps) => {
    return (
        <View style={[styles.container, style]} pointerEvents="box-none">
            <Pressable
                onPress={onPress}
                style={({ pressed }) => [
                    styles.button,
                    pressed && styles.pressed
                ]}
            >
                <LinearGradient
                    colors={['#34d399', '#10b981', '#059669']} // Emerald gradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradient}
                >
                    {/* Glass Shine Effect */}
                    <View style={styles.shine} />

                    <Plus size={32} color="white" strokeWidth={2.5} />
                </LinearGradient>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 24, // Default, can be overridden
        right: 24,
        zIndex: 50,
        ...Platform.select({
            web: { position: 'fixed' as any }
        })
    },
    button: {
        width: 64,
        height: 64,
        borderRadius: 32,
        shadowColor: '#10b981',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    pressed: {
        transform: [{ scale: 0.92 }],
        opacity: 0.9
    },
    gradient: {
        flex: 1,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.2)',
        overflow: 'hidden',
        ...(Platform.OS === 'web' ? { backdropFilter: 'blur(10px)' } : {}),
    } as any,
    shine: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 32,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        transform: [{ scaleX: 1.5 }, { translateY: -5 }]
    }
});
