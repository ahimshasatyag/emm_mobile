import React from 'react';
import { View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
    withSequence,
} from 'react-native-reanimated';

export function QuotationsAPFormSkeleton() {
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
        <View className="flex-1 bg-gray-50">
            <View className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
                <View className="p-4 space-y-4">
                    {/* Supplier */}
                    <View className="space-y-2">
                        <Animated.View style={animatedStyle} className="h-4 w-20 bg-gray-200 rounded" />
                        <Animated.View style={animatedStyle} className="h-12 w-full bg-gray-200 rounded-xl" />
                    </View>

                    {/* Supplier Reference */}
                    <View className="space-y-2">
                        <Animated.View style={animatedStyle} className="h-4 w-32 bg-gray-200 rounded" />
                        <Animated.View style={animatedStyle} className="h-12 w-full bg-gray-200 rounded-xl" />
                    </View>

                    {/* Mata Uang */}
                    <View className="space-y-2">
                        <Animated.View style={animatedStyle} className="h-4 w-24 bg-gray-200 rounded" />
                        <Animated.View style={animatedStyle} className="h-12 w-full bg-gray-200 rounded-xl" />
                    </View>

                    {/* Order Date */}
                    <View className="space-y-2">
                        <Animated.View style={animatedStyle} className="h-4 w-24 bg-gray-200 rounded" />
                        <Animated.View style={animatedStyle} className="h-12 w-full bg-gray-200 rounded-xl" />
                    </View>

                    {/* Destination Warehouse */}
                    <View className="space-y-2">
                        <Animated.View style={animatedStyle} className="h-4 w-40 bg-gray-200 rounded" />
                        <Animated.View style={animatedStyle} className="h-12 w-full bg-gray-200 rounded-xl" />
                    </View>

                    {/* Notes */}
                    <View className="space-y-2">
                        <Animated.View style={animatedStyle} className="h-4 w-16 bg-gray-200 rounded" />
                        <Animated.View style={animatedStyle} className="h-24 w-full bg-gray-200 rounded-xl" />
                    </View>
                </View>

                {/* Tabs */}
                <View className="flex-row bg-white border-t border-gray-100 px-2 pt-2 pb-2">
                    <View className="flex-1 py-3 items-center">
                        <Animated.View style={animatedStyle} className="h-4 w-24 bg-gray-200 rounded" />
                    </View>
                    <View className="flex-1 py-3 items-center">
                        <Animated.View style={animatedStyle} className="h-4 w-40 bg-gray-200 rounded" />
                    </View>
                </View>
            </View>
        </View>
    );
}
