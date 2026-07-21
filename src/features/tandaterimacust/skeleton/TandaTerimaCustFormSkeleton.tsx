import React from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export const TandaTerimaCustFormSkeleton = () => {
    return (
        <Animated.View entering={FadeIn.duration(300)} exiting={FadeOut.duration(300)}>
            <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">

                {/* Field Customer */}
                <View className="mb-4">
                    <View className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-1.5" />
                    <View className="h-[50px] w-full bg-gray-100 rounded-lg animate-pulse" />
                </View>

                {/* Field Tanggal */}
                <View className="mb-4">
                    <View className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-1.5" />
                    <View className="h-[50px] w-full bg-gray-100 rounded-lg animate-pulse" />
                </View>

                {/* Field Keterangan */}
                <View className="mb-4">
                    <View className="h-4 w-28 bg-gray-200 rounded animate-pulse mb-1.5" />
                    <View className="h-[50px] w-full bg-gray-100 rounded-lg animate-pulse" />
                </View>

                {/* File Section */}
                <View className="mt-2 border-t border-gray-100 pt-2 -mx-4 px-4">
                    <View className="flex-row justify-between items-center mb-4 mt-2">
                        <View className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                        <View className="h-8 w-28 bg-gray-200 rounded animate-pulse" />
                    </View>
                    {[1, 2].map(i => (
                        <View key={i} className="h-16 w-full bg-gray-100 rounded-lg animate-pulse mb-3" />
                    ))}
                </View>
            </View>
        </Animated.View>
    );
};
