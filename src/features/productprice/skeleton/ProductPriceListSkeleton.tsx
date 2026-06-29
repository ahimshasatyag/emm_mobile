import React from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export function ProductPriceListSkeleton() {
    return (
        <Animated.View entering={FadeIn} exiting={FadeOut}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <View key={i} className="bg-white rounded-2xl p-4 mb-4 border border-gray-100 shadow-sm">
                    {/* Top Section */}
                    <View className="flex-row items-start mb-3">
                        <View className="w-12 h-12 rounded-xl bg-gray-200 mr-4 animate-pulse" />
                        <View className="flex-1">
                            <View className="flex-row justify-between items-start mb-2">
                                <View className="h-5 bg-gray-200 rounded w-1/2 animate-pulse" />
                                <View className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
                            </View>
                            <View className="h-3 bg-gray-200 rounded w-1/3 mb-2 animate-pulse" />
                            <View className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
                        </View>
                    </View>

                    {/* Bottom Section */}
                    <View className="bg-gray-50/50 rounded-xl p-2 border border-gray-100">
                        <View className="flex-row items-center justify-between mb-2">
                            <View className="flex-1 h-12 bg-gray-200 rounded-lg mr-2 animate-pulse" />
                            <View className="flex-1 h-12 bg-gray-200 rounded-lg animate-pulse" />
                        </View>
                        <View className="flex-row items-center justify-between">
                            <View className="flex-1 h-12 bg-gray-200 rounded-lg mr-2 animate-pulse" />
                            <View className="flex-1 h-12 bg-gray-200 rounded-lg animate-pulse" />
                        </View>
                    </View>
                </View>
            ))}
        </Animated.View>
    );
}
