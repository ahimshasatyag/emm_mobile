import React from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export function ProductPriceEditSkeleton() {
    return (
        <Animated.View entering={FadeIn} exiting={FadeOut}>
            <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
                <View className="mb-5">
                    <View className="h-4 bg-gray-200 rounded w-1/3 mb-2 animate-pulse" />
                    <View className="h-14 bg-gray-200 rounded-xl w-full animate-pulse" />
                </View>
                <View className="mb-5">
                    <View className="h-4 bg-gray-200 rounded w-1/3 mb-2 animate-pulse" />
                    <View className="h-14 bg-gray-200 rounded-xl w-full animate-pulse" />
                </View>
                <View className="mb-5">
                    <View className="h-4 bg-gray-200 rounded w-1/4 mb-2 animate-pulse" />
                    <View className="h-14 bg-gray-200 rounded-xl w-full animate-pulse" />
                </View>
                
                <View className="flex-row mb-5 gap-4">
                    <View className="flex-1">
                        <View className="h-4 bg-gray-200 rounded w-1/2 mb-2 animate-pulse" />
                        <View className="h-14 bg-gray-200 rounded-xl w-full animate-pulse" />
                    </View>
                    <View className="flex-1">
                        <View className="h-4 bg-gray-200 rounded w-2/3 mb-2 animate-pulse" />
                        <View className="h-14 bg-gray-200 rounded-xl w-full animate-pulse" />
                    </View>
                </View>

                <View className="flex-row mb-5 gap-4">
                    <View className="flex-1">
                        <View className="h-4 bg-gray-200 rounded w-1/2 mb-2 animate-pulse" />
                        <View className="h-14 bg-gray-200 rounded-xl w-full animate-pulse" />
                    </View>
                    <View className="flex-1">
                        <View className="h-4 bg-gray-200 rounded w-1/2 mb-2 animate-pulse" />
                        <View className="h-14 bg-gray-200 rounded-xl w-full animate-pulse" />
                    </View>
                </View>

                <View className="mb-5">
                    <View className="h-4 bg-gray-200 rounded w-1/3 mb-2 animate-pulse" />
                    <View className="h-14 bg-gray-200 rounded-xl w-full animate-pulse" />
                </View>

                <View className="h-4 bg-gray-200 rounded w-1/4 mb-4 mt-2 animate-pulse" />
                <View className="border border-gray-100 rounded-xl h-24 bg-gray-50 animate-pulse" />
            </View>

            <View className="flex-row space-x-3 gap-3 mb-6">
                <View className="flex-1 h-14 bg-gray-200 rounded-2xl animate-pulse" />
                <View className="flex-1 h-14 bg-gray-200 rounded-2xl animate-pulse" />
            </View>
            
            <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <View className="h-4 bg-gray-200 rounded w-1/3 mb-4 animate-pulse" />
                <View className="border border-gray-100 rounded-xl h-24 bg-gray-50 animate-pulse" />
            </View>
        </Animated.View>
    );
}
