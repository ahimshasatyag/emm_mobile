import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

export const TandaTerimaCustListSkeleton = () => {
    const opacityAnim = useRef(new Animated.Value(0.4)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 0.4,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [opacityAnim]);

    return (
        <View className="flex-1">
            {[1, 2, 3, 4, 5].map((item) => (
                <Animated.View key={item} style={{ opacity: opacityAnim }}>
                    <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-3">
                        <View className="flex-row justify-between mb-3">
                            <View className="h-5 w-48 bg-gray-200 rounded" />
                            <View className="h-5 w-8 bg-gray-200 rounded" />
                        </View>
                        <View className="flex-row items-center mb-2">
                            <View className="h-4 w-4 bg-gray-200 rounded mr-2" />
                            <View className="h-4 w-24 bg-gray-200 rounded" />
                        </View>
                        <View className="flex-row items-center">
                            <View className="h-4 w-4 bg-gray-200 rounded mr-2" />
                            <View className="h-4 w-32 bg-gray-200 rounded" />
                        </View>
                    </View>
                </Animated.View>
            ))}
        </View>
    );
};
