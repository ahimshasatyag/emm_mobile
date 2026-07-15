import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';

export const CustomerInvoiceSkeleton = () => {
    const opacity = useSharedValue(0.3);

    useEffect(() => {
        opacity.value = withRepeat(
            withSequence(
                withTiming(0.7, { duration: 800 }),
                withTiming(0.3, { duration: 800 })
            ),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <View className="px-4 py-2">
            {[1, 2, 3, 4, 5].map((item) => (
                <View key={item} className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100">
                    <View className="flex-row justify-between items-center mb-3">
                        <Animated.View style={animatedStyle} className="h-4 w-32 bg-gray-200 rounded-md" />
                        <Animated.View style={animatedStyle} className="h-6 w-20 bg-gray-200 rounded-full" />
                    </View>
                    <Animated.View style={animatedStyle} className="h-5 w-48 bg-gray-200 rounded-md mb-3" />
                    <View className="flex-row justify-between items-end mt-4">
                        <View>
                            <Animated.View style={animatedStyle} className="h-3 w-20 bg-gray-200 rounded-md mb-2" />
                            <Animated.View style={animatedStyle} className="h-4 w-28 bg-gray-200 rounded-md" />
                        </View>
                        <Animated.View style={animatedStyle} className="h-8 w-8 bg-gray-200 rounded-full" />
                    </View>
                </View>
            ))}
        </View>
    );
};
