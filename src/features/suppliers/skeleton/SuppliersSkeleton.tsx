import React from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export function SuppliersSkeleton() {
    return (
        <Animated.View 
            entering={FadeIn.duration(400)}
            exiting={FadeOut.duration(400)}
            className="px-4 py-2"
        >
            {[1, 2, 3, 4, 5].map((item) => (
                <View
                    key={item}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4"
                >
                    <View className="p-4 flex-row items-center">
                        <View className="w-12 h-12 rounded-full bg-gray-200 justify-center items-center mr-3" />
                        <View className="flex-1">
                            <View className="flex-row justify-between items-start mb-1">
                                <View className="h-4 w-32 bg-gray-200 rounded flex-1 mr-2" />
                                <View className="h-4 w-16 bg-gray-200 rounded ml-2" />
                            </View>
                            <View className="flex-row items-center mt-2">
                                <View className="h-3 w-3 bg-gray-200 rounded-full mr-1" />
                                <View className="h-3 w-48 bg-gray-100 rounded flex-1" />
                            </View>
                        </View>
                    </View>
                </View>
            ))}
        </Animated.View>
    );
}
