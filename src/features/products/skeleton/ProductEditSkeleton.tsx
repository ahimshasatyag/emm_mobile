import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

export function ProductEditSkeleton() {
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
            <View
                className="bg-white p-5 rounded-3xl border border-gray-100 mb-4"
                style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }}
            >
                {/* Photo Upload Skeleton */}
                <View className="mb-6 flex-row items-center justify-center">
                    <View className="w-32 h-32 bg-gray-200 rounded-2xl" />
                </View>

                {/* Input Fields Skeleton */}
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <View key={i} className="mb-4">
                        <View className="w-24 h-4 bg-gray-200 rounded mb-2" />
                        <View className="w-full h-12 bg-gray-100 rounded-xl" />
                    </View>
                ))}

                {/* Multiline Input Skeleton */}
                <View className="mb-4">
                    <View className="w-24 h-4 bg-gray-200 rounded mb-2" />
                    <View className="w-full h-24 bg-gray-100 rounded-xl" />
                </View>
            </View>
        </Animated.View>
    );
}
