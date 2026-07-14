import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, withSequence } from 'react-native-reanimated';

export const DoSkeleton = () => {
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

    const renderCard = (key: number) => (
        <Animated.View key={key} style={animatedStyle} className="bg-white rounded-xl mb-4 border border-gray-100 p-4 shadow-sm">
            <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1">
                    <View className="h-5 w-32 bg-gray-200 rounded-md mb-2" />
                    <View className="h-4 w-24 bg-gray-200 rounded-md" />
                </View>
                <View className="h-6 w-20 bg-gray-200 rounded-full" />
            </View>
            <View className="h-4 w-48 bg-gray-200 rounded-md mb-2" />
            <View className="h-4 w-32 bg-gray-200 rounded-md" />
        </Animated.View>
    );

    return (
        <View className="flex-1">
            {[1, 2, 3, 4, 5].map((item) => renderCard(item))}
        </View>
    );
};
