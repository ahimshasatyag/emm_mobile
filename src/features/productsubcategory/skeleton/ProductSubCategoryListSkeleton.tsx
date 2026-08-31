import React from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

export function ProductSubCategoryListSkeleton() {
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
            {[1, 2, 3, 4, 5].map((item) => (
                <Animated.View
                    key={item}
                    style={animatedStyle}
                    className="bg-white rounded-3xl p-4 mb-4 border border-gray-100 flex-row items-center shadow-sm"
                >
                    <View className="w-12 h-12 bg-gray-200 rounded-2xl mr-4" />
                    
                    <View className="flex-1">
                        <View className="w-24 h-3 bg-gray-200 rounded-full mb-2" />
                        <View className="w-48 h-4 bg-gray-200 rounded-full" />
                    </View>
                    
                    <View className="w-5 h-5 bg-gray-200 rounded-full" />
                </Animated.View>
            ))}
        </View>
    );
}
