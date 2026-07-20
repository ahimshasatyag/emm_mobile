import React from 'react';
import { View, ScrollView } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export const SopFormSkeleton = () => {
    return (
        <Animated.View entering={FadeIn} exiting={FadeOut} className="flex-1 pb-10">
            <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
                    {/* Divisi */}
                    <View className="mb-4">
                        <View className="h-4 w-16 bg-gray-200 rounded animate-pulse mb-2" />
                        <View className="h-12 w-full bg-gray-200 rounded-lg animate-pulse" />
                    </View>

                    {/* No Document */}
                    <View className="mb-4">
                        <View className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />
                        <View className="h-12 w-full bg-gray-200 rounded-lg animate-pulse" />
                    </View>

                    {/* Nama Document */}
                    <View className="mb-4">
                        <View className="h-4 w-28 bg-gray-200 rounded animate-pulse mb-2" />
                        <View className="h-12 w-full bg-gray-200 rounded-lg animate-pulse" />
                    </View>

                    {/* File PDF */}
                    <View className="mb-2">
                        <View className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-2" />
                        <View className="h-32 w-full bg-gray-200 rounded-lg animate-pulse border-2 border-dashed border-gray-300" />
                    </View>
            </View>
        </Animated.View>
    );
};
