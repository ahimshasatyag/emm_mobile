import React from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export function RealisasiListSkeleton() {
    return (
        <Animated.View 
            entering={FadeIn.duration(400)} 
            exiting={FadeOut.duration(400)}
            className="flex-1"
        >
            {[1, 2, 3].map((item) => (
                <View key={item} className="bg-white p-4 rounded-xl mb-3 border border-gray-200 shadow-sm">
                    {/* Header: Codes & Status */}
                    <View className="flex-row justify-between items-start mb-3">
                        <View className="flex-1 mr-2">
                            <View className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-1" />
                            <View className="h-3 w-1/2 bg-gray-200 rounded animate-pulse" />
                        </View>
                        <View className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
                    </View>

                    {/* Info Grid */}
                    <View className="flex-row items-center mb-2">
                        <View className="flex-1 mr-2">
                            <View className="h-3 w-full bg-gray-200 rounded animate-pulse" />
                        </View>
                        <View className="flex-1">
                            <View className="h-3 w-full bg-gray-200 rounded animate-pulse" />
                        </View>
                    </View>

                    <View className="mb-3">
                        <View className="h-3 w-full bg-gray-200 rounded animate-pulse mb-1" />
                        <View className="h-3 w-2/3 bg-gray-200 rounded animate-pulse" />
                    </View>

                    {/* Footer Metrics */}
                    <View className="flex-row items-center justify-between border-t border-gray-100 pt-3">
                        <View className="flex-row">
                            <View className="mr-8">
                                <View className="h-2 w-10 bg-gray-200 rounded animate-pulse mb-1" />
                                <View className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                            </View>
                            <View>
                                <View className="h-2 w-10 bg-gray-200 rounded animate-pulse mb-1" />
                                <View className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                            </View>
                        </View>
                        <View className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
                    </View>
                </View>
            ))}
        </Animated.View>
    );
}
