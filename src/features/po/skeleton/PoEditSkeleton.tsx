import React from 'react';
import { View, ScrollView } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
    withSequence,
} from 'react-native-reanimated';

export function PoEditSkeleton() {
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
        <Animated.View style={animatedStyle}>

            {/* Main detail card skeleton */}
            <View className="bg-white rounded-3xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
                <View className="p-6">
                    <View className="space-y-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                            <View key={item} className="flex-row items-center">
                                <View className="h-4 w-24 bg-gray-200 rounded-md mr-4" />
                                <View className="h-4 w-4 bg-gray-200 rounded-md mr-4" />
                                <View className="h-4 flex-1 bg-gray-200 rounded-md" />
                            </View>
                        ))}
                    </View>
                </View>

                {/* Tabs skeleton */}
                <View className="flex-row bg-white border-t border-gray-100 px-2 pt-2">
                    <View className="flex-1 py-3 items-center border-b-2 border-gray-200">
                        <View className="h-4 w-28 bg-gray-200 rounded-md" />
                    </View>
                    <View className="flex-1 py-3 items-center border-b-2 border-transparent">
                        <View className="h-4 w-40 bg-gray-200 rounded-md" />
                    </View>
                </View>

                {/* Content area skeleton */}
                <View className="bg-white min-h-[150px] pb-4">
                    <View className="p-4 pt-4">
                        <View className="mt-4 mb-6">
                            <View className="flex-row justify-between items-center mb-3 px-1">
                                <View className="h-4 w-32 bg-gray-200 rounded-md" />
                            </View>

                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <View className="bg-white rounded-xl border border-gray-200 overflow-hidden min-w-[1050px]">
                                    <View className="flex-row bg-gray-50 p-3 border-b border-gray-200">
                                        <View className="h-3 w-20 bg-gray-200 rounded-md mr-12" />
                                        <View className="h-3 w-24 bg-gray-200 rounded-md mr-16" />
                                        <View className="h-3 w-32 bg-gray-200 rounded-md mr-16" />
                                        <View className="h-3 w-32 bg-gray-200 rounded-md mr-16" />
                                        <View className="h-3 w-20 bg-gray-200 rounded-md mr-12" />
                                        <View className="h-3 w-16 bg-gray-200 rounded-md mr-8" />
                                        <View className="h-3 w-24 bg-gray-200 rounded-md" />
                                    </View>
                                    {[1, 2, 3].map((row) => (
                                        <View key={row} className="flex-col border-b border-gray-100">
                                            <View className="flex-row p-3 items-center">
                                                <View className="h-4 w-20 bg-gray-200 rounded-md mr-12" />
                                                <View className="h-4 w-24 bg-gray-200 rounded-md mr-16" />
                                                <View className="h-4 w-32 bg-gray-200 rounded-md mr-16" />
                                                <View className="h-4 w-32 bg-gray-200 rounded-md mr-16" />
                                                <View className="h-4 w-20 bg-gray-200 rounded-md mr-12" />
                                                <View className="h-4 w-16 bg-gray-200 rounded-md mr-8" />
                                                <View className="h-4 w-24 bg-gray-200 rounded-md" />
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                </View>
            </View>
        </Animated.View>
    );
}
