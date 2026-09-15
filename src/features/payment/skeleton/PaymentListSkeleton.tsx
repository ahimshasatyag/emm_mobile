import React from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export const PaymentListSkeleton = () => {
    return (
        <Animated.View 
            entering={FadeIn.duration(400)}
            exiting={FadeOut.duration(400)}
            className="flex-1"
        >
            {[1, 2, 3, 4, 5].map((item) => (
                <View key={item} className="bg-white rounded-xl p-4 mb-3 border border-gray-100 shadow-sm flex-row justify-between items-start">
                    <View className="space-y-2 flex-1 mr-4">
                        <View className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                        <View className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                        <View className="h-3 w-20 bg-gray-200 rounded animate-pulse mt-4" />
                        <View className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
                    </View>
                    <View className="items-end space-y-2">
                        <View className="h-6 w-16 bg-gray-200 rounded-md animate-pulse mb-4" />
                        <View className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                        <View className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
                    </View>
                </View>
            ))}
        </Animated.View>
    );
};
