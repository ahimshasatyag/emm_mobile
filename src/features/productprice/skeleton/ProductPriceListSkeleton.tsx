import React from 'react';
import { View } from 'react-native';
import { Card, useTheme } from 'react-native-paper';
import Animated, { withRepeat, withSequence, withTiming, useAnimatedStyle } from 'react-native-reanimated';

export function ProductPriceListSkeleton() {
    const theme = useTheme();
    const colors = theme.colors as any;

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
            {[...Array(6)].map((_, i) => (
                <Animated.View 
                    key={i} 
                    style={[
                        pulseStyle,
                        { elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 }
                    ]}
                    className="bg-white rounded-2xl mb-4 border border-gray-100 shadow-sm"
                >
                    <Card.Content className="p-4">
                        {/* Top Section */}
                        <View className="flex-row items-start mb-3">
                            <View className="w-12 h-12 rounded-xl bg-gray-200 mr-4" />
                            <View className="flex-1">
                                <View className="flex-row justify-between items-start mb-2">
                                    <View className="h-5 bg-gray-200 rounded w-1/2" />
                                    <View className="h-4 bg-gray-200 rounded w-1/4" />
                                </View>
                                <View className="h-3 bg-gray-200 rounded w-1/3 mb-2" />
                                <View className="h-3 bg-gray-200 rounded w-1/2" />
                            </View>
                        </View>

                        {/* Bottom Section */}
                        <View className="bg-gray-50/50 rounded-xl p-2 border border-gray-100">
                            <View className="flex-row items-center justify-between mb-2">
                                <View className="flex-1 h-12 bg-gray-200 rounded-lg mr-2" />
                                <View className="flex-1 h-12 bg-gray-200 rounded-lg" />
                            </View>
                            <View className="flex-row items-center justify-between">
                                <View className="flex-1 h-12 bg-gray-200 rounded-lg mr-2" />
                                <View className="flex-1 h-12 bg-gray-200 rounded-lg" />
                            </View>
                        </View>
                    </Card.Content>
                </Animated.View>
            ))}
        </View>
    );
}
