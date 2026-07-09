import React from 'react';
import { View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
    withSequence,
    withDelay
} from 'react-native-reanimated';

export function QuotationsAPSkeleton() {
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

    const renderCard = (key: string, index: number) => {
        const itemOpacity = useSharedValue(0);

        React.useEffect(() => {
            itemOpacity.value = withDelay(
                index * 100,
                withTiming(1, { duration: 400 })
            );
        }, []);

        const fadeStyle = useAnimatedStyle(() => ({
            opacity: itemOpacity.value,
            transform: [
                {
                    translateY: withTiming(itemOpacity.value === 1 ? 0 : 20, { duration: 400 })
                }
            ]
        }));

        return (
            <Animated.View key={key} style={[fadeStyle]} className="mb-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                {/* Header: ID & Status */}
                <View className="flex-row justify-between items-center mb-3">
                    <Animated.View style={animatedStyle} className="h-4 w-32 bg-gray-200 rounded-md" />
                    <Animated.View style={animatedStyle} className="h-6 w-24 bg-gray-200 rounded-full" />
                </View>

                {/* Divider */}
                <View className="h-[1px] bg-gray-100 w-full mb-3" />

                {/* Content */}
                <View className="space-y-3">
                    <View className="flex-row items-center">
                        <Animated.View style={animatedStyle} className="h-8 w-8 bg-gray-200 rounded-full mr-3" />
                        <View className="flex-1">
                            <Animated.View style={animatedStyle} className="h-3 w-20 bg-gray-200 rounded mb-1" />
                            <Animated.View style={animatedStyle} className="h-4 w-40 bg-gray-200 rounded" />
                        </View>
                    </View>

                    <View className="flex-row items-center">
                        <Animated.View style={animatedStyle} className="h-8 w-8 bg-gray-200 rounded-full mr-3" />
                        <View className="flex-1">
                            <Animated.View style={animatedStyle} className="h-3 w-20 bg-gray-200 rounded mb-1" />
                            <Animated.View style={animatedStyle} className="h-4 w-40 bg-gray-200 rounded" />
                        </View>
                    </View>

                    <View className="flex-row items-center">
                        <Animated.View style={animatedStyle} className="h-8 w-8 bg-gray-200 rounded-full mr-3" />
                        <View className="flex-1">
                            <Animated.View style={animatedStyle} className="h-3 w-24 bg-gray-200 rounded mb-1" />
                            <Animated.View style={animatedStyle} className="h-4 w-32 bg-gray-200 rounded" />
                        </View>
                    </View>
                </View>
            </Animated.View>
        );
    };

    return (
        <View className="flex-1 w-full p-4">
            {[1, 2, 3].map((item, index) => renderCard(item.toString(), index))}
        </View>
    );
}
