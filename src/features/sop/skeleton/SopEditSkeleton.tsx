import React from 'react';
import { View, ScrollView } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export const SopEditSkeleton = () => {
    return (
        <Animated.View entering={FadeIn} exiting={FadeOut} className="flex-1 pb-10">
            <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
                    {/* Status Bar */}
                    <View className="flex-row justify-between items-center mb-4 pb-4 border-b border-gray-100">
                        <View className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                        <View className="h-6 w-24 bg-gray-200 rounded-full animate-pulse" />
                    </View>

                    {/* Divisi */}
                    <View className="mb-4">
                        <View className="h-4 w-16 bg-gray-200 rounded animate-pulse mb-2" />
                        <View className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
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
                        <View className="h-16 w-full bg-gray-200 rounded-lg animate-pulse" />
                    </View>

                    {/* History Table */}
                    <View className="mt-6 border-t border-gray-100 pt-6">
                        <View className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-3" />
                        <View className="-mx-4 -mb-4 border-t border-gray-200 bg-white rounded-b-xl overflow-hidden">
                            <View className="h-12 bg-gray-100 border-b border-gray-200 animate-pulse" />
                            <View className="h-14 bg-white border-b border-gray-100 animate-pulse" />
                            <View className="h-14 bg-white border-b border-gray-100 animate-pulse" />
                        </View>
                    </View>
            </View>
        </Animated.View>
    );
};
