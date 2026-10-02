import React from 'react';
import { View } from 'react-native';
import Animated, { withRepeat, withSequence, withTiming, useAnimatedStyle } from 'react-native-reanimated';

export function EmployeeDivisiListSkeleton() {
    const pulseStyle = useAnimatedStyle(() => ({
        opacity: withRepeat(
            withSequence(
                withTiming(0.4, { duration: 800 }),
                withTiming(1, { duration: 800 })
            ),
            -1,
            true
        ),
    }));

    return (
        <View className="px-6 pt-2 pb-24">
            {[1, 2, 3, 4, 5, 6].map((item) => (
                <Animated.View
                    key={item}
                    style={[
                        pulseStyle,
                        { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 15, elevation: 2 }
                    ]}
                    className="bg-white rounded-2xl p-4 mb-4 border border-gray-100"
                >
                    <View className="flex-row items-center">
                        {/* Icon Skeleton */}
                        <View className="w-12 h-12 rounded-full bg-gray-200 mr-4" />
                        
                        <View className="flex-1">
                            {/* Title Skeleton */}
                            <View className="h-5 bg-gray-200 rounded-md w-3/4 mb-2" />
                            {/* Subtitle Skeleton */}
                            <View className="h-4 bg-gray-200 rounded-md w-1/2" />
                        </View>

                        {/* Arrow Skeleton */}
                        <View className="w-8 h-8 rounded-full bg-gray-50 ml-2 border border-gray-100" />
                    </View>
                </Animated.View>
            ))}
        </View>
    );
}
