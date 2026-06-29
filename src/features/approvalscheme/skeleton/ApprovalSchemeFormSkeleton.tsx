import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';

export function ApprovalSchemeFormSkeleton() {
    const opacity = useSharedValue(0.5);

    useEffect(() => {
        opacity.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 800 }),
                withTiming(0.5, { duration: 800 })
            ),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <Animated.View style={animatedStyle}>
            <View className="bg-white p-5 rounded-3xl border border-gray-100 mb-6" style={{ elevation: 2 }}>
                {/* Nama Skema */}
                <View className="w-1/3 h-4 bg-gray-200 rounded mb-2" />
                <View className="w-full h-12 bg-gray-200 rounded-xl mb-4" />

                {/* Deskripsi */}
                <View className="w-1/4 h-4 bg-gray-200 rounded mb-2" />
                <View className="w-full h-24 bg-gray-200 rounded-xl mb-4" />

                {/* Approval Items (Rules) Dropdown */}
                <View className="w-1/3 h-4 bg-gray-200 rounded mb-2" />
                <View className="w-full h-12 bg-gray-200 rounded-xl mb-2" />
            </View>

            {/* Save Button */}
            <View className="w-full h-14 bg-gray-200 rounded-2xl" />
        </Animated.View>
    );
}
