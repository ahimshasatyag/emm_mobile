import React from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export function ProductSubCategoryListSkeleton() {
    return (
        <Animated.View entering={FadeIn} exiting={FadeOut} className="px-4">
            {[1, 2, 3, 4, 5].map((i) => (
                <View key={i} className="bg-white rounded-3xl p-4 mb-4 border border-gray-100 flex-row items-center">
                    {/* Icon Skeleton */}
                    <View className="w-12 h-12 bg-gray-200 rounded-2xl mr-4" />
                    
                    {/* Text Skeleton */}
                    <View className="flex-1">
                        <View className="w-24 h-3 bg-gray-200 rounded-full mb-2" />
                        <View className="w-48 h-4 bg-gray-200 rounded-full" />
                    </View>
                    
                    {/* Chevron Skeleton */}
                    <View className="w-5 h-5 bg-gray-200 rounded-full" />
                </View>
            ))}
        </Animated.View>
    );
}
