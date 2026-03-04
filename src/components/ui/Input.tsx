import React, { useState } from 'react';
import { Platform, Text, TextInput, TextInputProps, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    className?: string;
}

export const Input = ({ label, error, className, onFocus, onBlur, ...props }: InputProps) => {
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
            error ? '#ef4444' : (isFocused ? '#10b981' : 'transparent'),
            { duration: 200 }
        ),
        borderWidth: 1.5,
    }));

    return (
        <View className="w-full mb-4">
            {label && (
                <Text className="text-[13px] font-bold text-slate-500 dark:text-slate-400 ml-1 mb-1.5 uppercase tracking-wider">
                    {label}
                </Text>
            )}
            <Animated.View
                style={[borderStyle, { backgroundColor: 'transparent' }]}
                className="rounded-xl sm:rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm"
            >
                <TextInput
                    placeholderTextColor="#94a3b8"
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    style={[{ minHeight: 48 }, (Platform.OS === 'web' ? { outlineStyle: 'none' } as any : {})]}
                    className={`w-full px-4 sm:px-5 py-3 sm:py-4 text-[15px] sm:text-[16px] text-slate-900 dark:text-white ${className}`}
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
