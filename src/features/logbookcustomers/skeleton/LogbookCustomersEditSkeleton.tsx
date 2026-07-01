import React from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export function LogbookCustomersEditSkeleton() {
    return (
        <Animated.View 
            entering={FadeIn.duration(400)} 
            exiting={FadeOut.duration(400)}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4"
        >
            <View className="mb-5">
                <View className="h-4 w-1/4 bg-gray-200 rounded animate-pulse mb-2" />
                <View className="h-[42px] w-full bg-gray-100 rounded-lg animate-pulse" />
            </View>

            <View className="mb-5">
                <View className="h-4 w-1/4 bg-gray-200 rounded animate-pulse mb-2" />
                <View className="h-[42px] w-full bg-gray-100 rounded-lg animate-pulse" />
            </View>

            <View className="h-px bg-gray-200 mb-5" />

            <View className="mb-5">
                <View className="h-4 w-1/4 bg-gray-200 rounded animate-pulse mb-2" />
                <View className="h-24 w-full bg-gray-100 rounded-lg animate-pulse" />
            </View>

            <View className="mb-5">
                <View className="h-4 w-1/4 bg-gray-200 rounded animate-pulse mb-2" />
                <View className="h-24 w-full bg-gray-100 rounded-lg animate-pulse" />
            </View>

            <View className="mb-5">
                <View className="h-4 w-1/4 bg-gray-200 rounded animate-pulse mb-2" />
                <View className="h-24 w-full bg-gray-100 rounded-lg animate-pulse" />
            </View>
            
            <View className="mt-4 flex-row gap-4">
                <View className="flex-1 h-14 bg-gray-200 rounded-2xl animate-pulse" />
                <View className="flex-1 h-14 bg-gray-200 rounded-2xl animate-pulse" />
            </View>
        </Animated.View>
    );
}
