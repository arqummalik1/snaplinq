import { Eye, EyeOff } from 'lucide-react-native';
import React, { useState } from 'react';
import { Platform, Pressable, Text, TextInput, TextInputProps, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    className?: string;
    variant?: 'default' | 'dark';
}

export const Input = ({ label, error, className, onFocus, onBlur, variant = 'default', secureTextEntry, ...props }: InputProps) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleFocus = (e: any) => {
        setIsFocused(true);
        onFocus?.(e);
    };

    const handleBlur = (e: any) => {
        setIsFocused(false);
        onBlur?.(e);
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const borderStyle = useAnimatedStyle(() => ({
        borderColor: withTiming(
            error ? '#ef4444' : (isFocused ? '#FFB74D' : 'transparent'),
            { duration: 200 }
        ),
        borderWidth: 1.5,
    }));

    const isDarkVariant = variant === 'dark';
    const isSecureEntry = secureTextEntry && !isPasswordVisible;

    return (
        <View className="w-full mb-4">
            {label && (
                <Text className={`text-[13px] font-bold ${isDarkVariant ? 'text-zinc-500' : 'text-slate-500 dark:text-slate-400'} ml-1 mb-2 uppercase tracking-wider`}>
                    {label}
                </Text>
            )}
            <Animated.View
                style={[borderStyle]}
                className={`rounded-2xl ${isDarkVariant ? 'bg-[#09090B] border border-[#18181B]' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'} overflow-hidden shadow-sm`}
            >
                <View className="flex-row items-center">
                    <TextInput
                        placeholderTextColor={isDarkVariant ? "#52525B" : "#94a3b8"}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        secureTextEntry={isSecureEntry}
                        style={[{ minHeight: 56, flex: 1, paddingHorizontal: 16 }, (Platform.OS === 'web' ? { outlineStyle: 'none' } as any : {})]}
                        className={`w-full text-base ${isDarkVariant ? 'text-white' : 'text-slate-900 dark:text-white'} ${className}`}
                        {...props}
                    />
                    {secureTextEntry && (
                        <Pressable
                            onPress={togglePasswordVisibility}
                            style={{ paddingRight: 16 }}
                            hitSlop={8}
                        >
                            {isPasswordVisible ? (
                                <EyeOff size={20} color={isDarkVariant ? '#71717A' : '#94a3b8'} />
                            ) : (
                                <Eye size={20} color={isDarkVariant ? '#71717A' : '#94a3b8'} />
                            )}
                        </Pressable>
                    )}
                </View>
            </Animated.View>
            {error && (
                <Text className="text-red-500 text-xs mt-1.5 ml-1 font-medium">
                    {error}
                </Text>
            )}
        </View>
    );
};

