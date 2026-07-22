import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

export function InventoryEditSkeleton() {
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
            <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
                {[1, 2, 3].map((i) => (
                    <View key={i} className="mb-5">
                        <View className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
                        <View className="h-14 bg-gray-200 rounded-xl w-full" />
                    </View>
                ))}
            </View>
        </Animated.View>
    );
}
