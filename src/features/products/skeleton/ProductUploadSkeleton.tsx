import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, withRepeat, withTiming, useSharedValue } from 'react-native-reanimated';

export function ProductUploadSkeleton() {
    const opacity = useSharedValue(0.4);

    useEffect(() => {
        opacity.value = withRepeat(withTiming(0.8, { duration: 800 }), -1, true);
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <View className="px-4">
            {[1, 2, 3, 4, 5].map((item) => (
                <View key={item} className="p-4 rounded-xl mb-3 border border-gray-100 bg-white shadow-sm">
                    <View className="flex-row justify-between mb-3">
                        <Animated.View style={animatedStyle} className="h-5 bg-gray-200 rounded-md w-1/3" />
                        <Animated.View style={animatedStyle} className="h-5 bg-gray-200 rounded-full w-5" />
                    </View>
                    <Animated.View style={animatedStyle} className="h-6 bg-gray-200 rounded-md w-3/4 mb-3" />
                    <View className="flex-row mb-3">
                        <Animated.View style={animatedStyle} className="h-4 bg-gray-200 rounded-md w-1/4 mr-2" />
                        <Animated.View style={animatedStyle} className="h-4 bg-gray-200 rounded-md w-1/4 mr-2" />
                        <Animated.View style={animatedStyle} className="h-4 bg-gray-200 rounded-md w-1/4" />
                    </View>
                    <Animated.View style={animatedStyle} className="h-10 bg-gray-200 rounded-md w-full" />
                </View>
            ))}
        </View>
    );
}
