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
        <Animated.View style={animatedStyle} className="bg-white p-4 rounded-2xl mb-4 flex-row items-center border border-gray-100 shadow-sm">
            <View className="w-12 h-12 rounded-full bg-gray-200 mr-4" />
            <View className="flex-1">
                <View className="h-4 w-32 bg-gray-200 rounded-md mb-2" />
                <View className="h-3 w-16 bg-gray-200 rounded-md" />
            </View>
            <View className="w-6 h-6 rounded-full bg-gray-100" />
        </Animated.View>
    );
}

export function UsersLevelListSkeleton() {
    return (
        <View className="px-6 pb-4">
            {[1, 2, 3, 4, 5].map((item) => (
                <SkeletonItem key={item} />
            ))}
        </View>
    );
}
