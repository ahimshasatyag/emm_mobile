import React from 'react';
import { View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
    withSequence,
} from 'react-native-reanimated';

export function ApproveModalSkeleton() {
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
        <Animated.View style={animatedStyle} className="flex-1 w-full">

            {/* Detail Invoice Skeleton */}
            <View className="mb-4">
                <View className="h-3 w-32 bg-gray-200 rounded-md mb-2" />
                <View className="bg-white p-4 rounded-xl border border-gray-200 mb-3">
                    {[1, 2, 3, 4, 5].map((item) => (
                        <View key={item} className="flex-row justify-between mb-3">
                            <View className="h-3 w-24 bg-gray-200 rounded-md" />
                            <View className="h-3 w-32 bg-gray-200 rounded-md" />
                        </View>
                    ))}
                </View>
            </View>

            {/* Table Skeletons */}
            {[1, 2].map((table) => (
                <View key={table} className="mb-4">
                    <View className="h-3 w-24 bg-gray-200 rounded-md mb-2" />
                    <View className="bg-white rounded-xl border border-gray-200 overflow-hidden p-3">
                        <View className="flex-row border-b border-gray-100 pb-3 mb-3">
                            {[1, 2, 3, 4].map((col) => (
                                <View key={col} className="h-3 w-16 bg-gray-200 rounded-md mr-4" />
                            ))}
                        </View>
                        {[1, 2].map((row) => (
                            <View key={row} className="flex-row mb-3">
                                {[1, 2, 3, 4].map((col) => (
                                    <View key={col} className="h-3 w-16 bg-gray-200 rounded-md mr-4" />
                                ))}
                            </View>
                        ))}
                    </View>
                </View>
            ))}

        </Animated.View>
    );
}
