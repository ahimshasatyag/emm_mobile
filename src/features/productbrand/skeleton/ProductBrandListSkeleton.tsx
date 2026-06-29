import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

export function ProductBrandListSkeleton() {
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
        <Animated.View style={animatedStyle} className="px-4">
            {[1, 2, 3, 4, 5].map((i) => (
                <View 
                    key={i} 
                    className="bg-white rounded-2xl p-4 mb-3 border border-gray-100 flex-row items-center justify-between"
                    style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }}
                >
                    <View className="flex-row items-center flex-1">
                        <View className="w-12 h-12 rounded-xl bg-gray-100 mr-4" />
                        <View className="flex-1">
                            <View className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                            <View className="h-3 bg-gray-100 rounded w-1/2" />
                        </View>
                    </View>
                    <View className="w-8 h-8 rounded-full bg-gray-100 ml-2" />
                </View>
            ))}
        </Animated.View>
    );
}
