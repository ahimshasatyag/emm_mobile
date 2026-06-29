import React from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

export function CustomerFormSkeleton() {
    const animatedStyle = useAnimatedStyle(() => ({
        opacity: withRepeat(
            withSequence(
                withTiming(0.5, { duration: 800 }),
                withTiming(1, { duration: 800 })
            ),
            -1,
            true
        ),
    }));

    return (
        <View className="flex-1 p-5">
            <Animated.View style={animatedStyle} className="bg-white p-5 rounded-3xl mb-6">
                {/* Checkboxes Skeleton */}
                <View className="flex-row justify-between mb-6">
                    <View className="w-1/4 h-5 bg-gray-200 rounded" />
                    <View className="w-1/4 h-5 bg-gray-200 rounded" />
                    <View className="w-1/4 h-5 bg-gray-200 rounded" />
                </View>

                {/* Form Fields Skeleton */}
                {[1, 2, 3, 4, 5, 6].map((item) => (
                    <View key={item} className="mb-4">
                        <View className="w-1/3 h-4 bg-gray-200 rounded mb-2" />
                        <View className="w-full h-12 bg-gray-200 rounded-xl" />
                    </View>
                ))}
            </Animated.View>

            {/* Button Skeleton */}
            <Animated.View style={animatedStyle} className="w-full h-14 bg-gray-300 rounded-2xl" />
        </View>
    );
}
