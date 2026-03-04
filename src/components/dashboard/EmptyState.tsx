import React from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeInUp, ZoomIn } from 'react-native-reanimated';
import { Button } from '../ui/Button';

interface EmptyStateProps {
    onAddPress: () => void;
}

export const EmptyState = ({ onAddPress }: EmptyStateProps) => {
    return (
        <View className="flex-1 items-center justify-center pt-32 pb-20 px-6">
            <Animated.View
                entering={ZoomIn.duration(600).delay(200)}
                className="w-24 h-24 bg-emerald-500/10 rounded-full items-center justify-center mb-6"
            >
                <View className="w-16 h-16 bg-emerald-500/20 rounded-full items-center justify-center">
                    <Text className="text-4xl text-emerald-500">✨</Text>
                </View>
            </Animated.View>

            <Animated.Text
                entering={FadeInUp.duration(600).delay(400)}
                className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-2 text-center"
            >
                Your Vault is Empty
            </Animated.Text>

            <Animated.Text
                entering={FadeInUp.duration(600).delay(600)}
                className="text-slate-500 dark:text-slate-400 text-center max-w-[280px] leading-relaxed mb-10"
            >
                Start building your collection by adding your favorite links and resources.
            </Animated.Text>

            <Animated.View entering={FadeInUp.duration(600).delay(800)}>
                <Button onPress={onAddPress} size="lg">
                    Add First Link
                </Button>
            </Animated.View>
        </View>
    );
};
