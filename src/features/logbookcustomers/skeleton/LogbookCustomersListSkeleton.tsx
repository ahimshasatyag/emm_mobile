import React from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

export function LogbookCustomersListSkeleton() {
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
        <View className="px-4 pt-2 pb-24 flex-1">
            {[1, 2, 3, 4, 5, 6].map((item) => (
                <Animated.View
                    key={item}
                    style={pulseStyle}
                    className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-3"
                >
                    <View className="flex-row justify-between items-start mb-2">
                        <View className="flex-1 mr-3">
                            <View className="h-4 w-3/4 bg-gray-200 rounded mb-1" />
                            <View className="h-3 w-1/3 bg-gray-100 rounded mt-0.5" />
                        </View>
                    </View>

                    <View className="h-px bg-gray-100 my-2" />

                    <View className="flex-row justify-between items-end">
                        <View className="flex-1">
                            <View className="h-2 w-16 bg-gray-100 rounded mb-1" />
                            <View className="h-3 w-20 bg-gray-200 rounded" />
                        </View>
                        <View className="flex-1 items-end">
                            <View className="h-2 w-8 bg-gray-100 rounded mb-1" />
                            <View className="h-3 w-24 bg-gray-200 rounded" />
                        </View>
                    </View>
                </Animated.View>
            ))}
        </View>
    );
}
