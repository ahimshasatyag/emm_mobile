import React from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut, withRepeat, withSequence, withTiming, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

export function BrosurSkeleton() {
    const opacity = useSharedValue(0.5);

    React.useEffect(() => {
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
        opacity: opacity.value
    }));

    return (
        <Animated.View entering={FadeIn.duration(400)} exiting={FadeOut.duration(300)}>
            {/* Header info skeleton */}
            <View className="flex-row justify-between mb-4 mt-2">
                <Animated.View style={animatedStyle} className="h-10 w-24 bg-gray-200 rounded-lg" />
                <Animated.View style={animatedStyle} className="h-10 w-28 bg-gray-200 rounded-lg" />
            </View>

            {/* Table Rows skeleton */}
            <View className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                <View className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex-row">
                    <Animated.View style={animatedStyle} className="h-4 flex-1 bg-gray-300 rounded mr-4" />
                    <Animated.View style={animatedStyle} className="h-4 w-12 bg-gray-300 rounded" />
                </View>
                
                {[1, 2, 3].map((i, idx) => (
                    <View key={i} className={`px-4 py-4 flex-row items-center ${idx < 2 ? 'border-b border-gray-100' : ''}`}>
                        <Animated.View style={animatedStyle} className="h-10 flex-1 bg-gray-200 rounded-lg mr-4" />
                        <Animated.View style={animatedStyle} className="h-10 w-12 bg-gray-200 rounded-lg" />
                    </View>
                ))}
            </View>
        </Animated.View>
    );
}
