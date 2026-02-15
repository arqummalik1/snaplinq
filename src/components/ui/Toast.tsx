import { AlertCircle, CheckCircle, Info, X } from 'lucide-react-native';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    type: ToastType;
    onHide: () => void;
}

export const Toast = ({ message, type, onHide }: ToastProps) => {

    const bgColors = {
        success: 'bg-emerald-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
    };

    const icons = {
        success: <CheckCircle size={20} color="white" />,
        error: <AlertCircle size={20} color="white" />,
        info: <Info size={20} color="white" />,
    };

    return (
        <Animated.View
            entering={FadeInUp.springify().damping(15)}
            exiting={FadeOutUp}
            className={`flex-row items-center px-4 py-3 rounded-full shadow-lg mb-3 mx-4 max-w-sm ${bgColors[type]}`}
        >
            <View className="mr-3">
                {icons[type]}
            </View>
            <Text className="text-white font-medium text-sm mr-2 flex-1 shadow-sm">
                {message}
            </Text>
            <Pressable onPress={onHide} className="p-1 rounded-full active:bg-white/20">
                <X size={16} color="white" />
            </Pressable>
        </Animated.View>
    );
};
