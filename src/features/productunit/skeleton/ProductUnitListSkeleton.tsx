import React from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export function ProductUnitListSkeleton() {
    return (
        <Animated.View entering={FadeIn} exiting={FadeOut} className="px-6 pt-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <View key={i} className="bg-white rounded-2xl p-4 mb-3 border border-gray-100 shadow-sm flex-row items-center">
                    <View className="w-12 h-12 rounded-xl bg-gray-200 mr-4 animate-pulse" />
                    <View className="flex-1 justify-center">
                        <View className="h-4 bg-gray-200 rounded w-2/3 mb-2 animate-pulse" />
                        <View className="h-3 bg-gray-200 rounded w-1/3 animate-pulse" />
                    </View>
                    <View className="w-5 h-5 rounded bg-gray-200 animate-pulse ml-4" />
                </View>
            ))}
        </Animated.View>
    );
}
