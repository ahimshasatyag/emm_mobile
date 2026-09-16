import React from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export const KasBankInListSkeleton = () => {
    return (
        <Animated.View 
            entering={FadeIn.duration(400)}
            exiting={FadeOut.duration(400)}
            className="px-4 py-2 space-y-4"
        >
            {[1, 2, 3, 4, 5].map((item) => (
                <View key={item} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <View className="flex-row justify-between items-start mb-2">
                        <View className="flex-1 mr-4">
                            <View className="h-5 bg-gray-200 rounded-md w-3/4 mb-2 animate-pulse" />
                            <View className="h-3 bg-gray-200 rounded-md w-1/2 animate-pulse" />
                        </View>
                    </View>
                    <View className="border-t border-gray-50 pt-3 mt-1 flex-row justify-between items-center">
                        <View className="flex-1">
                            <View className="h-3 bg-gray-200 rounded-md w-1/3 mb-1 animate-pulse" />
                            <View className="h-4 bg-gray-200 rounded-md w-2/3 animate-pulse" />
                        </View>
                        <View className="items-end flex-1">
                            <View className="h-3 bg-gray-200 rounded-md w-1/2 mb-1 animate-pulse" />
                            <View className="h-4 bg-gray-200 rounded-md w-2/3 animate-pulse" />
                        </View>
                    </View>
                </View>
            ))}
        </Animated.View>
    );
};
