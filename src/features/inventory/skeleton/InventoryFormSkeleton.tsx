import React from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export function InventoryFormSkeleton() {
    return (
        <Animated.View entering={FadeIn} exiting={FadeOut}>
            <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
                {[1, 2, 3].map((i) => (
                    <View key={i} className="mb-5">
                        <View className="h-4 bg-gray-200 rounded w-1/3 mb-3 animate-pulse" />
                        <View className="h-14 bg-gray-200 rounded-xl w-full animate-pulse" />
                    </View>
                ))}
            </View>


            <View className="flex-row space-x-3 mt-4">
                <View className="flex-1 h-14 bg-gray-200 rounded-2xl animate-pulse" />
                <View className="flex-1 h-14 bg-gray-200 rounded-2xl animate-pulse" />
            </View>
        </Animated.View>
    );
}
