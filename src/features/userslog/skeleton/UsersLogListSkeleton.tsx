import React from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

function SkeletonItem() {
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
        <Animated.View style={animatedStyle} className="bg-white p-4 rounded-2xl mb-4 border border-gray-100 shadow-sm">
            <View className="flex-row items-center mb-3">
                <View className="w-10 h-10 rounded-full bg-gray-200 mr-3" />
                <View className="flex-1">
                    <View className="h-4 w-32 bg-gray-200 rounded-md mb-2" />
                    <View className="h-3 w-24 bg-gray-200 rounded-md" />
                </View>
            </View>
            <View className="bg-gray-50 rounded-xl p-3">
                <View className="flex-row mb-3">
                    <View className="w-4 h-4 bg-gray-200 rounded-full mr-2" />
                    <View>
                        <View className="h-3 w-16 bg-gray-200 rounded-md mb-1.5" />
                        <View className="h-4 w-48 bg-gray-200 rounded-md" />
                    </View>
                </View>
                <View className="flex-row">
                    <View className="w-4 h-4 bg-gray-200 rounded-full mr-2" />
                    <View>
                        <View className="h-3 w-20 bg-gray-200 rounded-md mb-1.5" />
                        <View className="h-4 w-28 bg-gray-200 rounded-md" />
                    </View>
                </View>
            </View>
        </Animated.View>
    );
}

export function UsersLogListSkeleton() {
    return (
        <View className="px-6 pb-4">
            {[1, 2, 3, 4].map((item) => (
                <SkeletonItem key={item} />
            ))}
        </View>
    );
}
