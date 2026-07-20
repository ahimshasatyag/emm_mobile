import React from 'react';
import { View, ScrollView } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export const SopListSkeleton = () => {
    return (
        <Animated.View entering={FadeIn} exiting={FadeOut} className="flex-1 pb-10">
            {[1, 2, 3, 4, 5].map((item) => (
                    <View key={item} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-3">
                        <View className="flex-row justify-between items-center mb-2">
                            <View className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                            <View className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
                        </View>
                        <View className="h-3 w-48 bg-gray-200 rounded animate-pulse" />
                    </View>
            ))}
        </Animated.View>
    );
};
