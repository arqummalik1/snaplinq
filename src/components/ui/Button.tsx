import * as Haptics from 'expo-haptics';
import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

interface ButtonProps {
    onPress: () => void;
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    className?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Button = ({
    onPress,
    children,
    variant = 'primary',
    size = 'md',
    disabled,
    loading,
    className
}: ButtonProps) => {
    const scale = useSharedValue(1);

    const handlePressIn = () => {
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
            console.error("Button Press Error:", e);
        }
    };

    const variants = {
        primary: "bg-emerald-500 shadow-lg shadow-emerald-500/30",
        secondary: "bg-white/80 dark:bg-slate-800/80 border border-white/40 dark:border-slate-700/40 backdrop-blur-xl shadow-sm",
        ghost: "bg-transparent",
        danger: "bg-red-500/10 border border-red-500/20"
    };

    const sizes = {
        sm: "px-4 py-2",
        md: "px-6 py-4",
        lg: "px-8 py-5",
    };

    const textStyles = {
        primary: "text-white font-black uppercase tracking-[1.5px] text-[12px]",
        secondary: "text-slate-700 dark:text-slate-200 font-bold tracking-tight",
        ghost: "text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]",
        danger: "text-red-500 font-black uppercase tracking-widest text-[11px]"
    };

    const content = (
        <View className="flex-row items-center justify-center gap-2">
            {loading ? (
                <ActivityIndicator size="small" color={variant === 'primary' ? 'white' : (variant === 'danger' ? '#ef4444' : '#64748b')} />
            ) : (
                typeof children === 'string' ? (
                    <Text className={`${textStyles[variant]} text-center`}>
                        {children}
                    </Text>
                ) : (
                    children
                )
            )}
        </View>
    );

    return (
        <AnimatedPressable
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={disabled || loading}
            style={[animatedStyle]}
            className={`flex-row items-center justify-center rounded-[20px] overflow-hidden ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-40' : ''} ${className}`}
        >
            {content}
        </AnimatedPressable>
    );
};


