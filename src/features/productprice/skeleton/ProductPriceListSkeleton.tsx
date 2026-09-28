import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { Card, useTheme } from 'react-native-paper';

export function ProductPriceListSkeleton() {
    const theme = useTheme();
    const colors = theme.colors as any;
    const fadeAnim = useRef(new Animated.Value(0.4)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0.4,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [fadeAnim]);

    return (
        <Animated.View style={{ opacity: fadeAnim }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="rounded-2xl mb-4 border border-gray-100 shadow-sm" style={{ backgroundColor: colors.surface }}>
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
                </Card>
            ))}
        </Animated.View>
    );
}
