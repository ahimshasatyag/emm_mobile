import React from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export function CekSerialNumberSkeleton() {
    return (
        <Animated.View entering={FadeIn.duration(400)} exiting={FadeOut.duration(400)}>
            {/* Product & Customer Info Skeletons */}
            {[1, 2].map((card) => (
                <View key={card} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-4">
                    <View className="h-5 w-1/2 bg-gray-200 rounded animate-pulse mb-4" />
                    <View className="space-y-3">
                        {[1, 2, 3, 4, 5].map((row) => (
                            <View key={row} className="flex-row items-start">
                                <View className="w-[35%] pr-2">
                                    <View className="h-3 w-3/4 bg-gray-200 rounded animate-pulse" />
                                </View>
                                <View className="flex-1">
                                    <View className="h-3 w-full bg-gray-100 rounded animate-pulse" />
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            ))}

            <View className="mt-2 mb-3">
                <View className="h-5 w-1/3 bg-gray-200 rounded animate-pulse" />
            </View>

            {/* History Service Skeletons */}
            {[1, 2].map((item) => (
                <View key={item} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-3">
                    <View className="flex-row justify-between items-center border-b border-gray-100 pb-3 mb-3">
                        <View className="flex-row items-center">
                            <View className="w-8 h-8 rounded-full bg-gray-200 animate-pulse mr-3" />
                            <View>
                                <View className="h-3 w-12 bg-gray-200 rounded animate-pulse mb-1" />
                                <View className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                            </View>
                        </View>
                        <View className="items-end">
                            <View className="h-3 w-16 bg-gray-200 rounded animate-pulse mb-1" />
                            <View className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                        </View>
                    </View>
                    
                    <View className="space-y-2 mb-3">
                        <View className="h-3 w-3/4 bg-gray-200 rounded animate-pulse" />
                        <View className="h-3 w-1/2 bg-gray-200 rounded animate-pulse" />
                    </View>
                    
                    <View className="bg-gray-50 p-3 rounded-lg border border-gray-100 space-y-2 mt-2">
                        <View className="h-10 w-full bg-gray-200 rounded animate-pulse" />
                        <View className="h-10 w-full bg-gray-200 rounded animate-pulse" />
                    </View>
                </View>
            ))}
        </Animated.View>
    );
}
