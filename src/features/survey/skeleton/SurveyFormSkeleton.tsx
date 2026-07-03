import React from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export function SurveyFormSkeleton() {
    return (
        <Animated.View entering={FadeIn} exiting={FadeOut} className="flex-1">
            <View className="flex-1 space-y-4">
                <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <View className="h-4 w-32 bg-gray-200 rounded mb-6 animate-pulse" />
                    {[1, 2, 3, 4].map((item) => (
                        <View key={item} className="mb-4">
                            <View className="h-4 w-24 bg-gray-200 rounded mb-2 animate-pulse" />
                            <View className="h-11 w-full bg-gray-200 rounded-lg animate-pulse" />
                        </View>
                    ))}
                    
                    <View className="h-4 w-32 bg-gray-200 rounded mb-6 mt-4 animate-pulse" />
                    {[1, 2, 3, 4].map((item) => (
                        <View key={`pay-${item}`} className="mb-4">
                            <View className="h-4 w-24 bg-gray-200 rounded mb-2 animate-pulse" />
                            <View className="h-11 w-full bg-gray-200 rounded-lg animate-pulse" />
                        </View>
                    ))}
                    
                    <View className="h-10 w-full bg-gray-200 rounded-t-xl animate-pulse mt-4" />
                    <View className="h-16 w-full bg-gray-100 border-t border-white rounded-b-xl animate-pulse" />
                </View>
            </View>
        </Animated.View>
    );
}
