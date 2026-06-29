import React from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

export function CustomerListSkeleton() {
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
        <View className="flex-1 p-4 bg-gray-50">

            {/* List Items Skeletons */}
            {[1, 2, 3, 4, 5].map((item) => (
                <Animated.View
                    key={item}
                    style={animatedStyle}
                    className="bg-white p-4 rounded-xl mb-3 shadow-sm"
                >
                    <View className="flex-row justify-between mb-2">
                        <View className="w-1/3 h-5 bg-gray-200 rounded" />
                        <View className="w-1/4 h-4 bg-gray-200 rounded" />
                    </View>
                    <View className="w-2/3 h-6 bg-gray-200 rounded mb-2" />
                    <View className="w-1/2 h-4 bg-gray-200 rounded mb-3" />
                    <View className="flex-row justify-between pt-2 border-t border-gray-100">
                        <View className="w-1/3 h-4 bg-gray-200 rounded" />
                        <View className="w-1/4 h-4 bg-gray-200 rounded" />
                    </View>
                </Animated.View>
            ))}
        </View>
    );
}
