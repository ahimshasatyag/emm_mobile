import React from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

export function QuotationListSkeleton() {
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
        <Animated.View className="flex-1 px-4 py-2">
            {[1, 2, 3, 4, 5].map((item) => (
                <Animated.View 
                    key={item} 
                    style={[animatedStyle, {
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.05,
                        shadowRadius: 4,
                        elevation: 2,
                    }]}
                    className="bg-white rounded-2xl border border-gray-100 mb-4 overflow-hidden"
                >
                    <View className="p-4">
                        <View className="flex-row justify-between items-start mb-3">
                            <View className="flex-1">
                                <View className="flex-row items-center space-x-2 mb-2">
                                    <View className="w-4 h-4 rounded-full bg-gray-200" />
                                    <View className="h-5 bg-gray-200 rounded w-2/3" />
                                </View>
                                <View className="flex-row items-center space-x-2 mt-1">
                                    <View className="w-3 h-3 rounded-full bg-gray-200" />
                                    <View className="h-3 bg-gray-200 rounded w-1/3" />
                                </View>
                            </View>
                            <View className="px-2.5 py-1 rounded-full bg-gray-100 w-20 h-6" />
                        </View>

                        <View className="bg-gray-50 p-3 rounded-lg mb-3">
                            <View className="flex-row items-center space-x-2 mb-2">
                                <View className="w-3.5 h-3.5 rounded-full bg-gray-200" />
                                <View className="h-4 bg-gray-200 rounded w-3/4" />
                            </View>
                            <View className="h-3 bg-gray-200 rounded w-1/2 ml-6" />
                        </View>

                        <View className="flex-row justify-between items-end border-t border-gray-100 pt-3">
                            <View>
                                <View className="h-2.5 bg-gray-200 rounded w-10 mb-1.5" />
                                <View className="h-4 bg-gray-200 rounded w-24" />
                            </View>
                            <View className="items-end">
                                <View className="h-2.5 bg-gray-200 rounded w-12 mb-1.5" />
                                <View className="h-4 bg-gray-200 rounded w-10" />
                            </View>
                        </View>
                    </View>
                </Animated.View>
            ))}
        </Animated.View>
    );
}
