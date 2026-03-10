import React, { useState } from 'react';
import { Platform, Text, TextInput, TextInputProps, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    className?: string;
    variant?: 'default' | 'dark';
}

export const Input = ({ label, error, className, onFocus, onBlur, variant = 'default', ...props }: InputProps) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (e: any) => {
        setIsFocused(true);
        onFocus?.(e);
    };

    const handleBlur = (e: any) => {
        setIsFocused(false);
        onBlur?.(e);
    };

    const borderStyle = useAnimatedStyle(() => ({
        borderColor: withTiming(
            error ? '#ef4444' : (isFocused ? '#FFB74D' : 'transparent'),
            { duration: 200 }
        ),
        borderWidth: 1.5,
    }));

    const isDarkVariant = variant === 'dark';

    return (
        <View className="w-full mb-4">
            {label && (
                <Text className={`text-[13px] font-bold ${isDarkVariant ? 'text-zinc-500' : 'text-slate-500 dark:text-slate-400'} ml-1 mb-2 uppercase tracking-wider`}>
                    {label}
                </Text>
            )}
            <Animated.View
                style={[borderStyle]}
                className={`rounded-full ${isDarkVariant ? 'bg-[#1C1C1E] border border-[#2C2C2E]' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'} overflow-hidden shadow-sm`}
            >
                <TextInput
                    placeholderTextColor={isDarkVariant ? "#555558" : "#94a3b8"}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    style={[{ minHeight: 80 }, (Platform.OS === 'web' ? { outlineStyle: 'none' } as any : {})]}
                    className={`w-full px-10 py-6 text-[20px] ${isDarkVariant ? 'text-white' : 'text-slate-900 dark:text-white'} ${className}`}
                    {...props}
                />
            </Animated.View>
            {error && (
                <Text className="text-red-500 text-xs mt-1.5 ml-1 font-medium">
                    {error}
                </Text>
            )}
        </View>
    );
};

