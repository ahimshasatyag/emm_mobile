import React from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

export function QuotationsAPSkeleton() {
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
        <View className="px-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
                <Animated.View 
                    key={item} 
                    style={[animatedStyle]}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4"
                >
                    <View className="flex-row justify-between items-start">
                        <View className="flex-1 mr-3">
                            <View className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
                            <View className="flex-row items-center mt-1">
                                <View className="w-3.5 h-3.5 rounded bg-gray-200 mr-1.5" />
                                <View className="h-3 bg-gray-200 rounded w-24" />
                            </View>
                        </View>
                        <View className="h-7 w-24 bg-gray-100 rounded-full" />
                    </View>
                </Animated.View>
            ))}
        </View>
    );
}
