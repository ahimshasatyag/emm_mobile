import React from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export function RealisasiEditSkeleton() {
    return (
        <Animated.View 
            entering={FadeIn.duration(400)} 
            exiting={FadeOut.duration(400)}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4"
        >
            {/* Header Skeleton */}
            <View className="mb-4">
                    <View className="h-6 w-1/2 bg-gray-200 rounded animate-pulse mb-2" />
                    <View className="h-4 w-1/3 bg-gray-200 rounded animate-pulse" />
                </View>

                {/* Form Fields Skeleton */}
                <View className="space-y-4 mt-4">
                    <View>
                        <View className="h-4 w-1/4 bg-gray-200 rounded animate-pulse mb-2" />
                        <View className="h-20 w-full bg-gray-100 rounded-lg animate-pulse" />
                    </View>
                    <View>
                        <View className="h-4 w-1/4 bg-gray-200 rounded animate-pulse mb-2" />
                        <View className="h-10 w-full bg-gray-100 rounded-lg animate-pulse" />
                    </View>
                    <View className="flex-row space-x-3">
                        <View className="flex-1">
                            <View className="h-4 w-1/2 bg-gray-200 rounded animate-pulse mb-2" />
                            <View className="h-10 w-full bg-gray-100 rounded-lg animate-pulse" />
                        </View>
                        <View className="flex-1">
                            <View className="h-4 w-1/2 bg-gray-200 rounded animate-pulse mb-2" />
                            <View className="h-10 w-full bg-gray-100 rounded-lg animate-pulse" />
                        </View>
                    </View>
                    <View className="flex-row space-x-3 mt-4">
                        <View className="flex-1">
                            <View className="h-4 w-1/2 bg-gray-200 rounded animate-pulse mb-2" />
                            <View className="h-10 w-full bg-gray-100 rounded-lg animate-pulse" />
                        </View>
                        <View className="flex-1">
                            <View className="h-4 w-1/2 bg-gray-200 rounded animate-pulse mb-2" />
                            <View className="h-10 w-full bg-gray-100 rounded-lg animate-pulse" />
                        </View>
                    </View>
                </View>

                {/* Parts Table Skeleton */}
                <View className="mt-6 border border-gray-200 rounded">
                    <View className="h-10 bg-gray-100 animate-pulse border-b border-gray-200" />
                    <View className="h-12 bg-gray-50 animate-pulse border-b border-gray-200" />
                    <View className="h-12 bg-gray-50 animate-pulse border-b border-gray-200" />
                </View>
        </Animated.View>
    );
}
