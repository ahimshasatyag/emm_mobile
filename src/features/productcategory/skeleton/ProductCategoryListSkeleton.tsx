import React from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export function ProductCategoryListSkeleton() {
    return (
        <Animated.View 
            entering={FadeIn.duration(400)}
            exiting={FadeOut.duration(300)}
            className="flex-1 w-full px-4"
        >
            {[1, 2, 3, 4, 5].map((item) => (
                <View 
                    key={item} 
                    className="bg-white p-4 rounded-2xl mb-3 flex-row items-center w-full"
                    style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }}
                >
                    <View className="w-12 h-12 bg-gray-200 rounded-full mr-4" />
                    <View className="flex-1">
                        <View className="flex-row items-center justify-between mb-2">
                            <View className="h-4 bg-gray-200 rounded w-1/2" />
                            <View className="h-6 bg-gray-200 rounded-md w-16" />
                        </View>
                        <View className="h-3 bg-gray-200 rounded w-1/3" />
                    </View>
                </View>
            ))}
        </Animated.View>
    );
}
