import React from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export const TandaTerimaCustListSkeleton = () => {
    return (
        <Animated.View entering={FadeIn} exiting={FadeOut} className="flex-1">
            {[1, 2, 3, 4, 5].map((item) => (
                <View key={item} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-3">
                    <View className="flex-row justify-between mb-3">
                        <View className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
                        <View className="h-5 w-8 bg-gray-200 rounded animate-pulse" />
                    </View>
                    <View className="flex-row items-center mb-2">
                        <View className="h-4 w-4 bg-gray-200 rounded animate-pulse mr-2" />
                        <View className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                    </View>
                    <View className="flex-row items-center">
                        <View className="h-4 w-4 bg-gray-200 rounded animate-pulse mr-2" />
                        <View className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                    </View>
                </View>
            ))}
        </Animated.View>
    );
};
