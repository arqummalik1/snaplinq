import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
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

    const baseStyles = "flex-row items-center justify-center rounded-2xl overflow-hidden";

    const variants = {
        primary: "", // Handled by LinearGradient
        secondary: "bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700",
        ghost: "bg-transparent",
        danger: "bg-red-500/10 border border-red-500/20"
    };

    const sizes = {
        sm: "px-4 py-2",
        md: "px-6 py-3.5",
        lg: "px-8 py-4.5"
    };

    const textStyles = {
        primary: "text-white font-bold tracking-tight",
        secondary: "text-slate-700 dark:text-slate-200 font-semibold",
        ghost: "text-slate-500 dark:text-slate-400 font-medium",
        danger: "text-red-500 font-semibold"
    };

    const content = (
        <>
            {loading ? (
                <ActivityIndicator color={variant === 'primary' ? 'white' : (variant === 'danger' ? '#ef4444' : '#64748b')} />
            ) : (
                typeof children === 'string' ? (
                    <Text className={`${textStyles[variant]} text-center text-[15px]`}>
                        {children}
                    </Text>
                ) : (
                    children
                )
            )}
        </>
    );

    return (
        <AnimatedPressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={disabled || loading}
            style={[animatedStyle]}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-40' : ''} ${className}`}
        >
            {variant === 'primary' ? (
                <LinearGradient
                    colors={['#34d399', '#10b981']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFill}
                />
            ) : null}
            <View style={styles.contentContainer}>
                {content}
            </View>
        </AnimatedPressable>
    );
};

const styles = StyleSheet.create({
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    }
});
