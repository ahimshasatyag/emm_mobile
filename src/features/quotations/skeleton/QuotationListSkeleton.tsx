import React from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export function QuotationListSkeleton() {
    return (
        <Animated.View 
            entering={FadeIn.duration(400)}
            exiting={FadeOut.duration(400)}
            className="px-4 py-2 space-y-4"
        >
            {[1, 2, 3, 4, 5].map((item) => (
                <View key={item} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex-row justify-between items-center">
                    <View className="space-y-3 flex-1 mr-4">
                        <View className="h-4 bg-gray-200 rounded w-1/2" />
                        <View className="h-3 bg-gray-200 rounded w-1/3" />
                        <View className="h-3 bg-gray-200 rounded w-2/3" />
                    </View>
                    <View className="space-y-3 items-end">
                        <View className="h-5 bg-gray-200 rounded-full w-16" />
                        <View className="h-4 bg-gray-200 rounded w-20" />
                    </View>
                </View>
            ))}
        </Animated.View>
    );
}
