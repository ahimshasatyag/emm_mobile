import React from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export function ProductListSkeleton() {
    return (
        <Animated.View entering={FadeIn} exiting={FadeOut} className="flex-1 p-4">
            {[1, 2, 3, 4, 5].map((item) => (
                <View 
                    key={item} 
                    className="bg-white p-4 rounded-2xl mb-3 flex-row items-center"
                    style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }}
                >
                    <View className="w-12 h-12 bg-gray-200 rounded-full mr-4 animate-pulse" />
                    <View className="flex-1">
                        <View className="flex-row justify-between mb-2">
                            <View className="h-4 bg-gray-200 rounded-full w-2/3 animate-pulse" />
                            <View className="h-4 bg-gray-200 rounded-md w-16 animate-pulse" />
                        </View>
                        <View className="h-3 bg-gray-200 rounded-full w-1/2 animate-pulse" />
                    </View>
                </View>
            ))}
        </Animated.View>
    );
}
