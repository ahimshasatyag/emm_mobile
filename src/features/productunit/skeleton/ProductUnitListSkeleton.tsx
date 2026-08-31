import React from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

export function ProductUnitListSkeleton() {
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
        <View className="px-6 pt-4">
            {[1, 2, 3, 4, 5].map((item) => (
                <Animated.View
                    key={item}
                    style={animatedStyle}
                    className="bg-white rounded-2xl p-4 mb-3 border border-gray-100 shadow-sm flex-row items-center"
                >
                    <View className="w-12 h-12 rounded-xl bg-gray-200 mr-4" />
                    <View className="flex-1 justify-center">
                        <View className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
                        <View className="h-3 bg-gray-200 rounded w-1/3" />
                    </View>
                    <View className="w-5 h-5 rounded bg-gray-200 ml-4" />
                </Animated.View>
            ))}
        </View>
    );
}
