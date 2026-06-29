import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';

export function SettingListSkeleton() {
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
        <Animated.View style={animatedStyle} className="px-6">
            {[1, 2, 3, 4, 5].map((item) => (
                <View key={item} className="bg-white p-4 rounded-2xl mb-4 flex-row items-center justify-between border border-gray-100">
                    <View className="flex-row items-center flex-1">
                        <View className="w-12 h-12 rounded-full bg-gray-200 mr-4" />
                        <View className="flex-1">
                            <View className="w-3/4 h-5 bg-gray-200 rounded mb-2" />
                            <View className="w-1/2 h-4 bg-gray-200 rounded" />
                        </View>
                    </View>
                    <View className="w-5 h-5 rounded-full bg-gray-200" />
                </View>
            ))}
        </Animated.View>
    );
}
