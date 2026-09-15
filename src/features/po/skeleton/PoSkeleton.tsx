import React from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export function PoSkeleton() {
    return (
        <Animated.View 
            entering={FadeIn.duration(400)}
            exiting={FadeOut.duration(400)}
            className="px-4 py-2 space-y-4"
        >
            {[1, 2, 3, 4, 5].map((item) => (
                <View
                    key={item}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex-row justify-between items-start"
                >
                    <View className="space-y-3 flex-1 mr-4">
                        <View className="h-4 w-32 bg-gray-200 rounded-md" />
                        <View className="flex-row items-center space-x-2">
                            <View className="w-8 h-8 rounded-full bg-gray-200" />
                            <View className="h-4 w-48 bg-gray-200 rounded-md" />
                        </View>
                        <View className="h-4 w-24 bg-gray-200 rounded-md mt-2" />
                    </View>
                    <View className="space-y-3 items-end">
                        <View className="h-6 w-24 bg-gray-200 rounded-full" />
                    </View>
                </View>
            ))}
        </Animated.View>
    );
}
