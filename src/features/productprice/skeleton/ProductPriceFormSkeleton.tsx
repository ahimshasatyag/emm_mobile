import React from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export function ProductPriceFormSkeleton() {
    return (
        <Animated.View entering={FadeIn} exiting={FadeOut}>
            <View className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-6">
                <View className="flex-row justify-between items-center mb-4">
                    <View className="h-6 bg-gray-200 rounded w-1/3 animate-pulse" />
                    <View className="h-10 bg-gray-200 rounded-full w-36 animate-pulse" />
                </View>

                <View className="border border-gray-200 rounded-2xl bg-white overflow-hidden">
                    <View className="flex-row border-b border-gray-200 bg-gray-50 p-4">
                        <View className="h-4 bg-gray-200 rounded w-24 mr-8 animate-pulse" />
                        <View className="h-4 bg-gray-200 rounded w-20 mr-8 animate-pulse" />
                        <View className="h-4 bg-gray-200 rounded w-20 mr-8 animate-pulse" />
                        <View className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
                    </View>

                    {[1, 2].map((i) => (
                        <View key={i} className="flex-row border-b border-gray-100 p-4 items-center">
                            <View className="h-10 bg-gray-200 rounded-lg w-40 mr-4 animate-pulse" />
                            <View className="h-10 bg-gray-200 rounded-lg w-28 mr-4 animate-pulse" />
                            <View className="h-10 bg-gray-200 rounded-lg w-28 mr-4 animate-pulse" />
                            <View className="h-10 bg-gray-200 rounded-lg w-28 mr-4 animate-pulse" />
                            <View className="h-8 bg-gray-200 rounded-full w-8 animate-pulse" />
                        </View>
                    ))}
                </View>
            </View>

            <View className="h-14 bg-gray-200 rounded-2xl w-full mb-8 animate-pulse" />
        </Animated.View>
    );
}
