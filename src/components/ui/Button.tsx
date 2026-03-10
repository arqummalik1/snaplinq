import * as Haptics from 'expo-haptics';
import { LucideIcon } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

interface ButtonProps {
    onPress: () => void;
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    className?: string;
    icon?: LucideIcon;
    iconPosition?: 'left' | 'right';
    accessibilityLabel?: string;
    accessibilityHint?: string;
    style?: any;
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
        accent: 'shadow-xl shadow-gold-500/20',
        ghost: 'bg-transparent',
        danger: 'bg-red-500/10 border border-red-500/20',
    };

    const sizes = {
        sm: 'px-6 py-3',
        md: 'px-10 py-5',
        lg: 'px-14 py-8', // Substantially taller and wider for premium feel
    };

    const textStyles = {
        primary: 'text-white font-black uppercase tracking-[1.5px] text-[14px]',
        secondary: 'text-zinc-200 font-bold tracking-tight text-[17px]',
        accent: 'text-black font-black text-[20px] tracking-tight', // Larger and bolder
        ghost: 'text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[12px]',
        danger: 'text-red-500 font-black uppercase tracking-widest text-[12px]',
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
                    {Icon && iconPosition === 'left' && <Icon size={20} color={variant === 'accent' ? 'black' : 'white'} />}
                    {typeof children === 'string' ? (
                        <Text className={`${textStyles[variant]} text-center`}>{children}</Text>
                    ) : (
                        children
                    )}
                    {Icon && iconPosition === 'right' && <Icon size={20} color={variant === 'accent' ? 'black' : 'white'} />}
                </>
            )}
        </View>
    );

    const accentStyle = variant === 'accent' ? { backgroundColor: '#FFB74D' } : {};

    return (
        <AnimatedPressable
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={disabled || loading}
            style={[animatedStyle, accentStyle, props.style]}
            className={`flex-row items-center justify-center rounded-full overflow-hidden ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-40' : ''} ${className}`}
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel || (typeof children === 'string' ? children : undefined)}
            accessibilityHint={accessibilityHint}
            accessibilityState={{ disabled: !!(disabled || loading), busy: !!loading }}
        >
            {content}
        </AnimatedPressable>
    );
};


