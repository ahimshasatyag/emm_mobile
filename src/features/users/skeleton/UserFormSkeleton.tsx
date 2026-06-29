import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

export function UserFormSkeleton() {
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
                className="bg-white p-5 rounded-3xl border border-gray-100"
                style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }}
            >
                {/* TextInputs (Username, Password, Nama Lengkap) */}
                {[1, 2, 3].map((i) => (
                    <View key={i} className="mb-5">
                        <View className="w-24 h-4 bg-gray-200 rounded mb-2" />
                        <View className="w-full h-12 bg-gray-100 rounded-xl" />
                    </View>
                ))}

                {/* Level Akses */}
                <View className="mb-5">
                    <View className="w-24 h-4 bg-gray-200 rounded mb-2" />
                    <View className="flex-row flex-wrap gap-2">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <View key={i} className="w-20 h-8 bg-gray-100 rounded-full" />
                        ))}
                    </View>
                </View>

                {/* Status */}
                <View className="mb-2">
                    <View className="w-16 h-4 bg-gray-200 rounded mb-2" />
                    <View className="flex-row gap-4">
                        <View className="flex-1 h-12 bg-gray-100 rounded-xl" />
                        <View className="flex-1 h-12 bg-gray-100 rounded-xl" />
                    </View>
                </View>
            </View>

            {/* Save Button Skeleton */}
            <View className="mt-4">
                <View className="w-full h-14 bg-gray-200 rounded-xl" />
            </View>
        </Animated.View>
    );
}
