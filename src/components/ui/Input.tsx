import React, { useState } from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';
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
                style={[borderStyle]}
                className="rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 overflow-hidden"
            >
                <TextInput
                    placeholderTextColor="#94a3b8"
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className={`w-full px-5 py-4 text-[16px] text-slate-900 dark:text-white ${className}`}
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
