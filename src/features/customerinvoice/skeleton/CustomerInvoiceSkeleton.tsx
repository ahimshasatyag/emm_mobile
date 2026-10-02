import React from 'react';
import { View } from 'react-native';
import Animated, { withRepeat, withSequence, withTiming, useAnimatedStyle } from 'react-native-reanimated';

export function CustomerInvoiceSkeleton() {
    const pulseStyle = useAnimatedStyle(() => ({
        opacity: withRepeat(
            withSequence(
                withTiming(0.4, { duration: 800 }),
                withTiming(1, { duration: 800 })
            ),
            -1,
            true
        ),
    }));

    return (
        <View className="flex-1 px-4 pt-4 pb-20">
            {[1, 2, 3, 4, 5].map((item) => (
                <Animated.View
                    key={item}
                    style={[
                        pulseStyle,
                        { elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 }
                    ]}
                    className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100"
                >
                    {/* Header */}
                    <View className="flex-row justify-between items-start mb-3">
                        <View className="flex-row items-center flex-1">
                            <View className="w-10 h-10 rounded-full bg-blue-50 mr-3" />
                            <View className="flex-1">
                                <View className="h-3 w-20 bg-gray-200 rounded-md mb-1.5" />
                                <View className="h-4 w-3/4 bg-gray-200 rounded-md mt-0.5" />
                            </View>
                        </View>
                        <View className="h-6 w-16 bg-gray-200 rounded-full" />
                    </View>

                    {/* Middle Box */}
                    <View className="flex-row mb-3 bg-gray-50 rounded-xl p-3">
                        <View className="flex-1">
                            <View className="flex-row items-center mb-1.5">
                                <View className="w-3.5 h-3.5 rounded bg-gray-200 mr-2" />
                                <View className="h-3 w-20 bg-gray-200 rounded-md" />
                            </View>
                            <View className="flex-row items-center">
                                <View className="w-3.5 h-3.5 rounded bg-gray-200 mr-2" />
                                <View className="h-3 w-24 bg-gray-200 rounded-md" />
                            </View>
                        </View>
                        <View className="flex-1">
                            <View className="flex-row items-center mb-1.5">
                                <View className="w-3.5 h-3.5 rounded bg-gray-200 mr-2" />
                                <View className="h-3 w-24 bg-gray-200 rounded-md" />
                            </View>
                            <View className="flex-row items-center">
                                <View className="w-3.5 h-3.5 rounded bg-gray-200 mr-2" />
                                <View className="h-3 w-12 bg-gray-200 rounded-md" />
                            </View>
                        </View>
                    </View>

                    {/* Footer */}
                    <View className="flex-row justify-between items-end border-t border-gray-100 pt-3">
                        <View>
                            <View className="h-2.5 w-10 bg-gray-200 rounded-md mb-1.5" />
                            <View className="h-4 w-28 bg-gray-200 rounded-md" />
                        </View>
                        <View className="items-end">
                            <View className="h-2.5 w-12 bg-gray-200 rounded-md mb-1.5" />
                            <View className="h-4 w-28 bg-gray-200 rounded-md" />
                        </View>
                    </View>
                </Animated.View>
            ))}
        </View>
    );
}
