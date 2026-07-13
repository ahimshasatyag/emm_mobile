import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
    withDelay
} from 'react-native-reanimated';

export const ApprovebaruSkeleton = () => {
    const opacity = useSharedValue(0.3);

    useEffect(() => {
        opacity.value = withRepeat(
            withSequence(
                withTiming(0.7, { duration: 1000 }),
                withTiming(0.3, { duration: 1000 })
            ),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    const renderSkeletonRow = (key: number, delayMs: number = 0) => {
        const itemOpacity = useSharedValue(0.3);

        useEffect(() => {
            itemOpacity.value = withDelay(
                delayMs,
                withRepeat(
                    withSequence(
                        withTiming(0.7, { duration: 1000 }),
                        withTiming(0.3, { duration: 1000 })
                    ),
                    -1,
                    true
                )
            );
        }, [delayMs]);

        const rowAnimatedStyle = useAnimatedStyle(() => ({
            opacity: itemOpacity.value,
        }));

        return (
            <Animated.View
                key={key}
                className="bg-white rounded-xl mb-4 border border-gray-100 p-4"
                style={[{
                    elevation: 2,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.05,
                    shadowRadius: 10
                }, rowAnimatedStyle]}
            >
                {/* Top line */}
                <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-row items-center flex-1">
                        <View className="h-10 w-10 bg-gray-200 rounded-full mr-3" />
                        <View className="flex-1 justify-center">
                            <View className="h-4 w-32 bg-gray-200 rounded-md" />
                        </View>
                    </View>
                    <View className="h-7 w-20 bg-gray-200 rounded-full" />
                </View>

                {/* Description */}
                <View className="h-4 w-full bg-gray-200 rounded-md mb-2" />
                <View className="h-4 w-2/3 bg-gray-200 rounded-md mb-4" />

                {/* Actions */}
                <View className="flex-row justify-end pt-3 border-t border-gray-100 space-x-2">
                    <View className="h-[38px] w-[76px] bg-gray-200 rounded-lg" />
                    <View className="h-[38px] w-[90px] bg-gray-200 rounded-lg ml-2" />
                    <View className="h-[38px] w-[100px] bg-gray-200 rounded-lg ml-2" />
                </View>
            </Animated.View>
        );
    };

    return (
        <View className="flex-1 bg-[#f9fafb] p-4">
            <Animated.View style={animatedStyle} className="mb-4">
            </Animated.View>
            {[1, 2, 3, 4, 5].map((item, index) => renderSkeletonRow(item, index * 100))}
        </View>
    );
};
