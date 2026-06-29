import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

export function UserListSkeleton() {
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
        <Animated.View style={animatedStyle} className="px-6 pt-4">
            {[1, 2, 3, 4, 5].map((i) => (
                <View 
                    key={i} 
                    className="bg-white rounded-2xl p-4 mb-4 flex-row items-center border border-gray-100"
                    style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 }}
                >
                    <View className="w-12 h-12 rounded-full bg-gray-200 mr-4" />
                    <View className="flex-1">
                        <View className="flex-row justify-between mb-2">
                            <View className="w-32 h-4 bg-gray-200 rounded" />
                            <View className="w-12 h-4 bg-gray-200 rounded-full" />
                        </View>
                        <View className="w-24 h-3 bg-gray-200 rounded" />
                    </View>
                </View>
            ))}
        </Animated.View>
    );
}
