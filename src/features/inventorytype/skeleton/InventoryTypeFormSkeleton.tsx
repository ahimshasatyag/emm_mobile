import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';

export function InventoryTypeFormSkeleton() {
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
        <View className="bg-white p-5 rounded-3xl border border-gray-100" style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }}>
            <Animated.View style={animatedStyle}>
                <View className="mb-5">
                    <View className="w-1/3 h-4 bg-gray-200 rounded mb-2" />
                    <View className="w-full h-12 bg-gray-200 rounded-xl" />
                </View>
            </Animated.View>
        </View>
    );
}
