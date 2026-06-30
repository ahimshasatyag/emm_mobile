import React from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export function CsrListSkeleton() {
    return (
        <Animated.View 
            entering={FadeIn.duration(300)} 
            exiting={FadeOut.duration(300)}
            className="w-full"
        >
            {[1, 2, 3, 4].map((item) => (
                <View key={item} className="bg-white p-5 rounded-2xl mb-4 border border-gray-100 shadow-sm">
                    {/* Header */}
                    <View className="flex-row justify-between items-center mb-4">
                        <View className="h-5 w-32 bg-gray-200 rounded-lg" />
                        <View className="h-6 w-20 bg-gray-200 rounded-full" />
                    </View>
                    
                    {/* Content */}
                    <View className="space-y-3">
                        <View className="flex-row items-center">
                            <View className="h-4 w-4 bg-gray-200 rounded-full mr-3" />
                            <View className="h-4 w-40 bg-gray-200 rounded-lg" />
                        </View>
                        <View className="flex-row items-center">
                            <View className="h-4 w-4 bg-gray-200 rounded-full mr-3" />
                            <View className="h-4 w-48 bg-gray-200 rounded-lg" />
                        </View>
                        <View className="flex-row items-center">
                            <View className="h-4 w-4 bg-gray-200 rounded-full mr-3" />
                            <View className="h-4 w-32 bg-gray-200 rounded-lg" />
                        </View>
                    </View>
                </View>
            ))}
        </Animated.View>
    );
}
