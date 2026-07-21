import React from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

export function CustomerEditSkeleton() {
    const animatedStyle = useAnimatedStyle(() => ({
        opacity: withRepeat(
            withSequence(
                withTiming(0.5, { duration: 800 }),
                withTiming(1, { duration: 800 })
            ),
            -1,
            true
        ),
    }));

    return (
        <View className="flex-1 pt-2">
            {/* Main Info Skeleton */}
            <Animated.View style={animatedStyle} className="bg-white p-5 rounded-3xl border border-gray-100 mb-6" style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }}>

                {/* Form Fields */}
                {[1, 2, 3, 4, 5, 6].map((item) => (
                    <View key={item} className="mb-4">
                        <View className="w-1/4 h-4 bg-gray-200 rounded mb-2" />
                        <View className="w-full h-12 bg-gray-200 rounded-xl" />
                    </View>
                ))}

                {/* Contact Persons Skeleton (now inside Main Info) */}
                <View className="mt-4 pt-4 border-t border-gray-100">
                    <View className="flex-row justify-between items-center mb-4">
                        <View className="w-1/3 h-5 bg-gray-200 rounded" />
                        <View className="w-20 h-8 bg-gray-200 rounded-lg" />
                    </View>

                    <View className="p-4 border border-gray-100 rounded-2xl bg-gray-50">
                        <View className="w-full h-10 bg-gray-200 rounded-lg mb-3" />
                        <View className="w-full h-10 bg-gray-200 rounded-lg" />
                    </View>
                </View>
            </Animated.View>

            {/* Bottom Actions Skeleton */}
            <Animated.View style={animatedStyle} className="flex-row gap-3 mb-6">
                <View className="flex-1 h-14 bg-gray-300 rounded-2xl" />
                <View className="flex-1 h-14 bg-gray-300 rounded-2xl" />
            </Animated.View>
        </View>
    );
}
