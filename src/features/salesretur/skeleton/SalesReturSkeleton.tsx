import React from 'react';
import { View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

export function SalesReturSkeleton() {
    return (
        <Animated.View entering={FadeIn.duration(400)} className="px-4 py-2">
            {[1, 2, 3, 4, 5].map((item) => (
                <View key={item} className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100">
                    <View className="flex-row justify-between items-center mb-3">
                        <View className="h-5 w-32 bg-gray-200 rounded-md animate-pulse" />
                        <View className="h-5 w-20 bg-gray-200 rounded-full animate-pulse" />
                    </View>
                    <View className="space-y-2">
                        <View className="flex-row items-center">
                            <View className="h-4 w-4 bg-gray-200 rounded-full animate-pulse mr-2" />
                            <View className="h-4 w-40 bg-gray-200 rounded-md animate-pulse" />
                        </View>
                        <View className="flex-row items-center">
                            <View className="h-4 w-4 bg-gray-200 rounded-full animate-pulse mr-2" />
                            <View className="h-4 w-24 bg-gray-200 rounded-md animate-pulse" />
                        </View>
                    </View>
                </View>
            ))}
        </Animated.View>
    );
}
