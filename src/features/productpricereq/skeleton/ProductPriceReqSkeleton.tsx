import React from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

export function ProductPriceReqListSkeleton() {
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
        <Animated.View className="flex-1">
            {[1, 2, 3, 4, 5, 6].map((item) => (
                <Animated.View
                    key={item}
                    style={[animatedStyle, {
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.05,
                        shadowRadius: 4,
                        elevation: 2,
                    }]}
                    className="bg-white rounded-xl p-4 mb-3 border border-gray-100"
                >
                    <View className="flex-row justify-between items-start mb-3">
                        <View className="flex-row items-center flex-1 mr-3">
                            <View className="w-10 h-10 rounded-full bg-gray-200 mr-3" />
                            <View className="flex-1">
                                <View className="h-5 bg-gray-200 rounded mb-2 w-3/4" />
                                <View className="h-4 bg-gray-100 rounded w-1/2" />
                            </View>
                        </View>
                        <View className="w-16 h-6 bg-gray-200 rounded-md" />
                    </View>
                    <View className="flex-row items-center mt-2 border-t border-gray-50 pt-3">
                        <View className="h-4 w-4 bg-gray-200 rounded-full mr-1.5" />
                        <View className="h-4 bg-gray-100 rounded w-24" />
                    </View>
                </Animated.View>
            ))}
        </Animated.View>
    );
}
