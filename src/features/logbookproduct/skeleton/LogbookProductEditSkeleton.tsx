import React from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export function LogbookProductEditSkeleton() {
    return (
        <Animated.View 
            entering={FadeIn.duration(400)} 
            exiting={FadeOut.duration(400)}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4"
        >
            <View className="space-y-4">
                <View>
                    <View className="h-4 w-1/4 bg-gray-200 rounded animate-pulse mb-2" />
                    <View className="h-12 w-full bg-gray-100 rounded-lg animate-pulse" />
                </View>
                <View>
                    <View className="h-4 w-1/3 bg-gray-200 rounded animate-pulse mb-2" />
                    <View className="h-12 w-full bg-gray-100 rounded-lg animate-pulse" />
                </View>
                <View>
                    <View className="h-4 w-1/4 bg-gray-200 rounded animate-pulse mb-2" />
                    <View className="h-12 w-full bg-gray-100 rounded-lg animate-pulse" />
                </View>

                <View className="h-px bg-gray-200 my-2" />

                <View>
                    <View className="h-4 w-1/4 bg-gray-200 rounded animate-pulse mb-2" />
                    <View className="h-24 w-full bg-gray-100 rounded-lg animate-pulse" />
                </View>
                <View>
                    <View className="h-4 w-1/4 bg-gray-200 rounded animate-pulse mb-2" />
                    <View className="h-24 w-full bg-gray-100 rounded-lg animate-pulse" />
                </View>
                <View>
                    <View className="h-4 w-1/4 bg-gray-200 rounded animate-pulse mb-2" />
                    <View className="h-24 w-full bg-gray-100 rounded-lg animate-pulse" />
                </View>
            </View>
            
            <View className="flex-row space-x-2 mt-6">
                <View className="flex-1 h-12 bg-gray-200 rounded-xl animate-pulse" />
                <View className="flex-1 h-12 bg-gray-200 rounded-xl animate-pulse" />
            </View>
        </Animated.View>
    );
}
