import React from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

export function UsersLevelFormSkeleton() {
    const opacity = useSharedValue(0.3);

    React.useEffect(() => {
        opacity.value = withRepeat(
            withTiming(0.7, { duration: 800 }),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <Animated.View style={animatedStyle} className="px-6 py-4">
            <View className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mb-6">
                <View className="mb-4">
                    <View className="h-4 w-24 bg-gray-200 rounded-md mb-2" />
                    <View className="h-12 w-full bg-gray-100 rounded-xl" />
                </View>
                <View>
                    <View className="h-4 w-24 bg-gray-200 rounded-md mb-2" />
                    <View className="h-12 w-full bg-gray-100 rounded-xl" />
                </View>
            </View>

            <View className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <View className="h-5 w-32 bg-gray-200 rounded-md mb-4" />
                {[1, 2, 3].map(i => (
                    <View key={i} className="mb-4 pb-4 border-b border-gray-100">
                        <View className="flex-row justify-between items-center mb-3">
                            <View className="h-4 w-40 bg-gray-200 rounded-md" />
                            <View className="h-4 w-12 bg-gray-200 rounded-md" />
                        </View>
                        <View className="flex-row justify-between">
                            {[1, 2, 3, 4].map(j => (
                                <View key={j} className="h-8 w-16 bg-gray-100 rounded-lg" />
                            ))}
                        </View>
                    </View>
                ))}
            </View>
        </Animated.View>
    );
}
