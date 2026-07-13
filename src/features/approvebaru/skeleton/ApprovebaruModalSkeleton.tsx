import React from 'react';
import { View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
    withSequence,
} from 'react-native-reanimated';

export function ApprovebaruModalSkeleton() {
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

    const renderFieldRow = (key: number) => (
        <View key={key} className="mb-5">
            <View className="h-3 w-32 bg-gray-200 rounded-md mb-2" />
            <View className="h-3 w-48 bg-gray-200 rounded-md" />
        </View>
    );

    return (
        <Animated.View style={animatedStyle} className="flex-1 w-full">
            <View className="flex-row mx-[-8px] mb-6">
                <View className="flex-1 px-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(renderFieldRow)}
                </View>
                <View className="flex-1 px-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(renderFieldRow)}
                </View>
            </View>

            {/* Table Skeletons */}
            {[1, 2].map((table) => (
                <View key={table} className="mb-6">
                    <View className="flex-row items-center mb-3">
                        <View className="h-5 w-5 bg-gray-200 rounded-full mr-2" />
                        <View className="h-4 w-32 bg-gray-200 rounded-md" />
                    </View>
                    <View className="bg-white rounded-xl border border-gray-200 overflow-hidden p-4">
                        <View className="flex-row border-b border-gray-100 pb-3 mb-3 justify-between">
                            <View className="h-3 w-20 bg-gray-200 rounded-md" />
                            <View className="h-3 w-32 bg-gray-200 rounded-md" />
                            <View className="h-3 w-24 bg-gray-200 rounded-md" />
                        </View>
                        {[1, 2, 3].map((row) => (
                            <View key={row} className="flex-row justify-between mb-3 border-b border-gray-50 pb-2">
                                <View className="h-3 w-20 bg-gray-200 rounded-md" />
                                <View className="h-3 w-32 bg-gray-200 rounded-md" />
                                <View className="h-3 w-24 bg-gray-200 rounded-md" />
                            </View>
                        ))}
                    </View>
                </View>
            ))}
        </Animated.View>
    );
}
