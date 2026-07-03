import React from 'react';
import { View, ScrollView } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export function SurveyListSkeleton() {
    return (
        <Animated.View entering={FadeIn} exiting={FadeOut} className="flex-1">
            <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
                {[1, 2, 3, 4, 5].map((i) => (
                    <View key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-3">
                        <View className="flex-row justify-between mb-3">
                            <View>
                                <View className="w-20 h-3 bg-gray-200 rounded mb-2 animate-pulse" />
                                <View className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
                            </View>
                            <View className="w-24 h-6 bg-gray-200 rounded-full animate-pulse" />
                        </View>
                        <View className="space-y-2 mb-3">
                            <View className="w-40 h-4 bg-gray-200 rounded animate-pulse" />
                            <View className="w-48 h-4 bg-gray-200 rounded animate-pulse" />
                            <View className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
                        </View>
                        <View className="pt-3 border-t border-gray-50 flex-row justify-between">
                            <View className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
                            <View className="w-6 h-6 bg-gray-200 rounded-full animate-pulse" />
                        </View>
                    </View>
                ))}
            </ScrollView>
        </Animated.View>
    );
}
