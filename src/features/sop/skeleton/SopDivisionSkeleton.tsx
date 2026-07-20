import React from 'react';
import { View, ScrollView } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export const SopDivisionSkeleton = () => {
    return (
        <Animated.View entering={FadeIn} exiting={FadeOut} className="flex-1 pb-10">
            {/* Total SOP Card */}
                <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4 items-center justify-center">
                    <View className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-3" />
                    <View className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
                </View>

                {/* Division Cards */}
                {[1, 2, 3, 4, 5].map((item) => (
                    <View key={item} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-3 flex-row justify-between items-center">
                        <View className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                        <View className="h-6 w-12 bg-gray-200 rounded-full animate-pulse" />
                    </View>
            ))}
        </Animated.View>
    );
};
