import { LinearGradient } from 'expo-linear-gradient';
import { Search, X } from 'lucide-react-native';
import { Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface TopLiquidSearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    onClose: () => void;
    visible: boolean;
}

export const TopLiquidSearchBar = ({ value, onChangeText, onClose, visible }: TopLiquidSearchBarProps) => {
    const { isDark } = useTheme();

    if (!visible) return null;

    return (
        <View style={[styles.container, isDark && styles.containerDark]}>
            {/* 
               Liquid Glass Wrapper
               Matches user provided CSS:
               background: rgba(255,255,255,.08);
               backdrop-filter: blur(24px) saturate(180%);
               border: 1px solid rgba(255,255,255,.18);
               box-shadow: inset..., drop-shadow...
            */}
            <View style={[styles.glassWrapper, isDark && styles.glassWrapperDark]}>

                {/* Refraction Layer (Approximated with LinearGradient as Radial is complex in RN) */}
                <LinearGradient
                    colors={isDark
                        ? ['rgba(255,255,255,0.05)', 'transparent']
                        : ['rgba(255,255,255,0.35)', 'transparent']}
                    start={{ x: 0.3, y: 0.1 }}
                    end={{ x: 0.8, y: 0.8 }}
                    style={styles.glassRefraction}
                />

                {/* Sheen Layer (::after) */}
                <LinearGradient
                    colors={isDark
                        ? ['transparent', 'rgba(255,255,255,0.05)', 'transparent']
                        : ['transparent', 'rgba(255,255,255,0.25)', 'transparent']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }} // 120deg approximation
                    locations={[0.4, 0.5, 0.6]}
                    style={styles.glassSheen}
                />

                {/* Content */}
                <View style={styles.contentContainer}>
                    <Search size={20} color={isDark ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.9)'} />
                    <TextInput
                        style={[styles.glassInput, { color: isDark ? '#fff' : '#fff' }]} // Glass input usually white text on glass
                        placeholder="Search"
                        placeholderTextColor="rgba(255,255,255,0.6)"
                        value={value}
                        onChangeText={onChangeText}
                        autoFocus
                    />
                    <Pressable onPress={() => { onChangeText(''); onClose(); }} hitSlop={10}>
                        <X size={20} color="rgba(255,255,255,0.6)" />
                    </Pressable>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 140, // Cover the tall header
        zIndex: 100,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 24,
        paddingHorizontal: 16,
        // Background to hide the header beneath
        backgroundColor: Platform.select({
            web: 'rgba(255, 255, 255, 0.8)',
            default: '#fff'
        }),
    },
    containerDark: {
        backgroundColor: Platform.select({
            web: 'rgba(15, 23, 42, 0.8)',
            default: '#0f172a'
        }),
    },
    glassWrapper: {
        width: '100%',
        maxWidth: 600, // Allow wider on desktop
        height: 52, // Match logo size/touch target
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.18)',
        // Web styles
        ...(Platform.OS === 'web' ? {
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            transition: 'transform .15s ease',
        } : {
            // Native fallback
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.25,
            shadowRadius: 12,
            elevation: 10,
        }),
    } as any,
    glassWrapperDark: {
        backgroundColor: 'rgba(0,0,0,0.2)', // Slightly darker base for dark mode? Or keep standard?
        borderColor: 'rgba(255,255,255,0.1)',
    },
    glassRefraction: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.5,
    },
    glassSheen: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.6,
        // mixBlendMode: 'overlay' supported on web?
        ...(Platform.OS === 'web' ? { mixBlendMode: 'overlay' } : {}),
    } as any,
    contentContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    glassInput: {
        flex: 1,
        height: '100%',
        paddingHorizontal: 10,
        fontSize: 16,
        fontWeight: '500',
        letterSpacing: 0.3,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
        outlineStyle: 'none',
    } as any,
});
