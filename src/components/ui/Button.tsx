import * as Haptics from 'expo-haptics';
import { LucideIcon } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

interface ButtonProps {
    onPress: () => void;
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    disabled?: boolean;
    loading?: boolean;
    className?: string;
    icon?: LucideIcon;
    iconPosition?: 'left' | 'right';
    accessibilityLabel?: string;
    accessibilityHint?: string;
    style?: any;
    fluid?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Button = ({
    onPress,
    children,
    variant = 'primary',
    size = 'md',
    disabled,
    loading,
    className,
    icon: Icon,
    iconPosition = 'right',
    accessibilityLabel,
    accessibilityHint,
    ...props
}: ButtonProps) => {
    const scale = useSharedValue(1);

    const handlePressIn = () => {
        if (disabled || loading) return;
        scale.value = withSpring(0.96);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1);
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePress = () => {
        if (disabled || loading) return;
        try {
            onPress();
        } catch (e: any) {
            console.error('Button Press Error:', e);
        }
    };

    const variants = {
        primary: 'bg-emerald-500 shadow-lg shadow-emerald-500/30',
        secondary: 'bg-zinc-800 border border-zinc-700 shadow-sm',
        accent: 'bg-emerald-500 shadow-lg shadow-emerald-500/30',
        substantial: 'bg-emerald-500 shadow-2xl shadow-emerald-500/40', // Premium feel
        ghost: 'bg-transparent',
        danger: 'bg-red-500/10 border border-red-500/20',
    };

    const sizes = {
        sm: 'px-4 py-2',
        md: 'px-6 py-3',
        lg: 'px-10 py-5',
        xl: 'px-12 py-7', // Cinematic / Substantial
    };

    const textStyles = {
        primary: 'text-white font-bold text-[15px]',
        secondary: 'text-zinc-200 font-semibold text-[15px]',
        accent: 'text-white font-bold text-[16px]',
        substantial: 'text-white font-black text-[20px] tracking-tight',
        ghost: 'text-slate-500 dark:text-slate-400 font-semibold text-[14px]',
        danger: 'text-red-500 font-bold text-[14px]',
    };

    const content = (
        <View className="flex-row items-center justify-center gap-2">
            {loading ? (
                <ActivityIndicator
                    size="small"
                    color={variant === 'accent' ? 'black' : variant === 'primary' ? 'white' : '#64748b'}
                />
            ) : (
                <>
                    {Icon && iconPosition === 'left' && <Icon size={18} color={variant === 'accent' ? 'white' : 'white'} />}
                    {typeof children === 'string' ? (
                        <Text className={`${textStyles[variant]} text-center`}>{children}</Text>
                    ) : (
                        children
                    )}
                    {Icon && iconPosition === 'right' && <Icon size={18} color={variant === 'accent' ? 'white' : 'white'} />}
                </>
            )}
        </View>
    );

    const accentStyle = variant === 'accent' ? { backgroundColor: '#10B981' } : {};

    return (
        <AnimatedPressable
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={disabled || loading}
            style={[animatedStyle, accentStyle, props.style]}
            className={`flex-row items-center justify-center rounded-2xl overflow-hidden ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-40' : ''} ${className}`}
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel || (typeof children === 'string' ? children : undefined)}
            accessibilityHint={accessibilityHint}
            accessibilityState={{ disabled: !!(disabled || loading), busy: !!loading }}
        >
            {content}
        </AnimatedPressable>
    );
};


