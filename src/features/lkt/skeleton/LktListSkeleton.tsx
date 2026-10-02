import React from 'react';
import { View } from 'react-native';
import { Card } from 'react-native-paper';
import Animated, { withRepeat, withSequence, withTiming, useAnimatedStyle } from 'react-native-reanimated';

export function LktListSkeleton() {
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
        <View className="px-6 pb-20 pt-6">
            {[...Array(5)].map((_, i) => (
                <Animated.View 
                    key={i}
                    style={[
                        pulseStyle,
                        { elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 }
                    ]}
                    className="bg-white rounded-2xl mb-4 border border-gray-100 shadow-sm"
                >
                    <Card.Content className="p-4">
                        {/* Header (lkt_code, cst_code, start_date vs status) */}
                        <View className="flex-row justify-between items-start mb-2">
                            <View className="flex-1 mr-3">
                                <View className="h-4 w-3/4 bg-gray-200 rounded mb-1" />
                                <View className="h-3 w-1/2 bg-gray-200 rounded mb-1" />
                                <View className="h-3 w-2/3 bg-gray-200 rounded" />
                            </View>
                            <View className="h-5 w-16 bg-gray-200 rounded-md" />
                        </View>

                        <View className="h-px bg-gray-100 my-2" />

                        {/* Customer & Keterangan */}
                        <View className="flex-row justify-between items-end mb-2">
                            <View className="flex-1">
                                <View className="h-3 w-16 bg-gray-200 rounded mb-1" />
                                <View className="h-4 w-24 bg-gray-200 rounded" />
                            </View>
                            <View className="flex-1 items-end">
                                <View className="h-3 w-16 bg-gray-200 rounded mb-1" />
                                <View className="h-4 w-24 bg-gray-200 rounded" />
                            </View>
                        </View>

                        <View className="h-px bg-gray-100 my-2" />

                        {/* Grid Fields (4 rows of 2 columns) */}
                        <View className="flex-row flex-wrap">
                            <View className="w-1/2 mb-3">
                                <View className="h-3 w-16 bg-gray-200 rounded mb-1" />
                                <View className="h-4 w-20 bg-gray-200 rounded" />
                            </View>
                            <View className="w-1/2 mb-3 pl-2">
                                <View className="h-3 w-24 bg-gray-200 rounded mb-1" />
                                <View className="h-4 w-20 bg-gray-200 rounded" />
                            </View>
                            
                            <View className="w-1/2 mb-3">
                                <View className="h-3 w-20 bg-gray-200 rounded mb-1" />
                                <View className="h-4 w-24 bg-gray-200 rounded" />
                            </View>
                            <View className="w-1/2 mb-3 pl-2">
                                <View className="h-3 w-24 bg-gray-200 rounded mb-1" />
                                <View className="h-4 w-24 bg-gray-200 rounded" />
                            </View>

                            <View className="w-1/2 mb-3">
                                <View className="h-3 w-24 bg-gray-200 rounded mb-1" />
                                <View className="h-4 w-16 bg-gray-200 rounded" />
                            </View>
                            <View className="w-1/2 mb-3 pl-2">
                                <View className="h-3 w-20 bg-gray-200 rounded mb-1" />
                                <View className="h-4 w-16 bg-gray-200 rounded" />
                            </View>

                            <View className="w-1/2">
                                <View className="h-3 w-12 bg-gray-200 rounded mb-1" />
                                <View className="h-4 w-16 bg-gray-200 rounded" />
                            </View>
                            <View className="w-1/2 pl-2">
                                <View className="h-3 w-12 bg-gray-200 rounded mb-1" />
                                <View className="h-4 w-10 bg-gray-200 rounded" />
                            </View>
                        </View>
                    </Card.Content>
                </Animated.View>
            ))}
        </View>
    );
}
