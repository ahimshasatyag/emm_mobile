import React from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { theme } from '../../../theme/theme';

export function ProductPriceLogSkeleton() {
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
        <Animated.View className="flex-1 pb-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
                <Animated.View 
                    key={item} 
                    style={[animatedStyle, {
                        shadowColor: theme.colors.primary,
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.05,
                        shadowRadius: 10,
                        elevation: 2,
                    }]}
                    className="bg-white rounded-2xl p-4 mb-4 border border-gray-100"
                >
                    <View className="flex-row justify-between items-start mb-3">
                        <View className="flex-1 pr-3">
                            <View className="h-5 bg-gray-200 rounded mb-2 w-3/4" />
                            <View className="h-5 bg-gray-200 rounded mb-2 w-1/2" />
                            <View className="flex-row items-center mb-1">
                                <View className="h-4 w-4 bg-gray-200 rounded-full mr-1.5" />
                                <View className="h-4 bg-gray-200 rounded w-1/3" />
                            </View>
                            <View className="flex-row items-center mt-1">
                                <View className="h-3 w-3 bg-gray-200 rounded-full mr-1" />
                                <View className="h-3 bg-gray-100 rounded w-1/2" />
                            </View>
                        </View>

                        <View className="bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-50 flex-row items-center">
                            <View className="h-3 w-3 bg-indigo-100 rounded-full mr-1" />
                            <View className="h-4 w-12 bg-indigo-100 rounded" />
                        </View>
                    </View>
                </Animated.View>
            ))}
        </Animated.View>
    );
}
