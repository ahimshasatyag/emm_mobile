import React from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

export function InventoryScheduleListSkeleton() {
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
        <View className="px-4 pb-24 flex-1">
            {[1, 2, 3, 4, 5, 6].map((item) => (
                <Animated.View
                    key={item}
                    style={pulseStyle}
                    className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-3"
                >
                    <View className="flex-row justify-between items-start mb-2">
                        <View className="flex-1 pr-2">
                            <View className="h-5 w-3/4 bg-gray-200 rounded mb-1" />
                            <View className="h-4 w-1/2 bg-gray-100 rounded mt-1" />
                        </View>
                    </View>

                    <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-gray-100">
                        <View className="flex-row items-center">
                            <View className="h-4 w-4 bg-gray-200 rounded mr-2" />
                            <View className="h-3 w-20 bg-gray-100 rounded" />
                        </View>

                        <View className="flex-row items-center bg-gray-50 px-2 py-1 rounded-lg">
                            <View className="h-4 w-4 bg-gray-200 rounded mr-2" />
                            <View className="h-3 w-16 bg-gray-200 rounded" />
                        </View>
                    </View>
                </Animated.View>
            ))}
        </View>
    );
}
