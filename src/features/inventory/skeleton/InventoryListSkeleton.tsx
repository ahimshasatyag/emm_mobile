import React from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export function InventoryListSkeleton() {
    return (
        <Animated.View entering={FadeIn} exiting={FadeOut} className="px-3 pt-6 pb-20">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <View key={i} className="bg-white rounded-2xl p-4 mb-4 border border-gray-100 shadow-sm flex-row items-center">
                    <View className="w-12 h-12 rounded-xl bg-gray-200 mr-4 animate-pulse" />
                    <View className="flex-1">
                        <View className="flex-row justify-between items-start mb-2">
                            <View className="h-6 bg-gray-200 rounded w-1/2 animate-pulse" />
                            <View className="h-6 bg-gray-200 rounded-md w-1/4 animate-pulse" />
                        </View>
                        <View className="flex-row items-center mt-1 bg-gray-100 p-2 rounded-lg border border-gray-100 animate-pulse">
                            <View className="w-4 h-4 bg-gray-200 rounded mr-2" />
                            <View className="h-4 bg-gray-200 rounded w-1/2" />
                        </View>
                    </View>
                    <View className="w-8 h-8 rounded-full bg-gray-100 animate-pulse ml-3" />
                </View>
            ))}
        </Animated.View>
    );
}
