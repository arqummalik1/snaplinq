import React, { useEffect } from 'react';
import { DimensionValue, View, ViewStyle } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

interface SkeletonProps {
    width?: DimensionValue;
    height?: DimensionValue;
    borderRadius?: number;
    style?: ViewStyle;
    className?: string;
}

export const Skeleton = ({ width, height, borderRadius = 8, style, className }: SkeletonProps) => {
    const opacity = useSharedValue(0.3);

    useEffect(() => {
        opacity.value = withRepeat(
            withSequence(
                withTiming(0.7, { duration: 800 }),
                withTiming(0.3, { duration: 800 })
            ),
            -1,
            true
        );
    }, [opacity]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <Animated.View
            style={[
                {
                    width,
                    height,
                    borderRadius,
                    backgroundColor: '#e2e8f0', // slate-200
                },
                style,
                animatedStyle,
            ]}
            className={className}
        />
    );
};

export const LinkItemSkeleton = () => (
    <View className="items-center w-[84px] sm:w-[100px] mb-6">
        <Skeleton
            width={68}
            height={68}
            borderRadius={22}
            style={{ marginBottom: 8 }}
            className="sm:w-[84px] sm:h-[84px] sm:rounded-[28px]"
        />
        <Skeleton width={60} height={12} borderRadius={4} />
    </View>
);
