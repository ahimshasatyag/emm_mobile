import React from 'react';
import { View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
    withSequence,
} from 'react-native-reanimated';

export function QuotationsAPEditSkeleton() {
    const opacity = useSharedValue(0.3);

    React.useEffect(() => {
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
        <View className="flex-1 bg-white">
            <View className="p-4 space-y-4">
                {/* Form Fields */}
                <View className="space-y-2">
                    <Animated.View style={animatedStyle} className="h-4 w-32 bg-gray-200 rounded" />
                    <Animated.View style={animatedStyle} className="h-12 w-full bg-gray-200 rounded-xl" />
                </View>

                <View className="space-y-2">
                    <Animated.View style={animatedStyle} className="h-4 w-40 bg-gray-200 rounded" />
                    <Animated.View style={animatedStyle} className="h-12 w-full bg-gray-200 rounded-xl" />
                </View>

                <View className="space-y-2">
                    <Animated.View style={animatedStyle} className="h-4 w-24 bg-gray-200 rounded" />
                    <Animated.View style={animatedStyle} className="h-12 w-full bg-gray-200 rounded-xl" />
                </View>

                <View className="space-y-2 pt-4">
                    <Animated.View style={animatedStyle} className="h-4 w-32 bg-gray-200 rounded" />
                    <Animated.View style={animatedStyle} className="h-32 w-full bg-gray-200 rounded-xl" />
                </View>

                <View className="flex-row space-x-4 pt-6">
                    <Animated.View style={animatedStyle} className="flex-1 h-12 bg-gray-200 rounded-xl" />
                    <Animated.View style={animatedStyle} className="flex-1 h-12 bg-gray-200 rounded-xl" />
                </View>
            </View>
        </View>
    );
}
