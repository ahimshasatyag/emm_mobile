import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { Card, useTheme } from 'react-native-paper';

export function CsrEditSkeleton() {
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
        <Animated.View style={{ opacity: fadeAnim }} className="flex-1 mb-10">
            <Card className="rounded-xl shadow-sm mb-6" style={{ backgroundColor: colors.surface }}>
                <Card.Content className="p-4">
                    {/* Header Status */}
                    <View className="flex-row justify-between items-center border-b border-gray-100 pb-4 mb-4">
                        <View>
                            <View className="h-3 w-20 bg-gray-200 rounded mb-2" />
                            <View className="h-6 w-32 bg-gray-200 rounded" />
                        </View>
                        <View className="h-6 w-16 bg-gray-200 rounded-full" />
                    </View>

                    {/* SECTION: Customer */}
                    <View className="h-6 w-32 bg-gray-200 rounded mb-4 border-b border-gray-100 pb-2" />

                    <View className="mb-4">
                        <View className="h-4 w-28 bg-gray-200 rounded mb-2" />
                        <View className="h-12 w-full bg-gray-200 rounded-xl" />
                    </View>

                    <View className="mb-4">
                        <View className="h-4 w-24 bg-gray-200 rounded mb-2" />
                        <View className="h-12 w-full bg-gray-200 rounded-xl" />
                    </View>

                    <View className="mb-4 flex-row justify-between">
                        <View className="flex-1 mr-2">
                            <View className="h-4 w-24 bg-gray-200 rounded mb-2" />
                            <View className="h-12 w-full bg-gray-200 rounded-xl" />
                        </View>
                        <View className="flex-1 ml-2">
                            <View className="h-4 w-24 bg-gray-200 rounded mb-2" />
                            <View className="h-12 w-full bg-gray-200 rounded-xl" />
                        </View>
                    </View>

                    <View className="mb-4">
                        <View className="h-4 w-16 bg-gray-200 rounded mb-2" />
                        <View className="flex-row items-center mt-1">
                            <View className="w-5 h-5 rounded-full bg-gray-200 mr-2" />
                            <View className="h-4 w-20 bg-gray-200 rounded mr-8" />
                            <View className="w-5 h-5 rounded-full bg-gray-200 mr-2" />
                            <View className="h-4 w-20 bg-gray-200 rounded" />
                        </View>
                    </View>

                    <View className="mb-4">
                        <View className="h-4 w-32 bg-gray-200 rounded mb-2" />
                        <View className="flex-row items-center mt-1">
                            <View className="w-5 h-5 rounded-full bg-gray-200 mr-2" />
                            <View className="h-4 w-20 bg-gray-200 rounded mr-8" />
                            <View className="w-5 h-5 rounded-full bg-gray-200 mr-2" />
                            <View className="h-4 w-20 bg-gray-200 rounded" />
                        </View>
                    </View>

                    {/* SECTION: Laporan Kerusakan */}
                    <View className="h-6 w-40 bg-gray-200 rounded mt-6 mb-4 border-b border-gray-100 pb-2" />
                    <View className="mb-4">
                        <View className="h-4 w-32 bg-gray-200 rounded mb-2 mt-2" />
                        <View className="h-32 w-full bg-gray-200 rounded-xl" />
                    </View>
                    <View className="mb-4">
                        <View className="h-4 w-16 bg-gray-200 rounded mb-2" />
                        <View className="w-24 h-24 bg-gray-200 rounded-xl" />
                    </View>

                    {/* SECTION: Product To Service */}
                    <View className="h-6 w-40 bg-gray-200 rounded mt-6 mb-4 border-b border-gray-100 pb-2" />

                    {/* Info Box */}
                    <View className="bg-blue-50 p-4 rounded-xl mb-4 space-y-3 border border-blue-100">
                        <View className="space-y-2 border-b border-blue-200 pb-3 mb-1">
                            {[1, 2, 3, 4].map(i => (
                                <View key={i} className="flex-row justify-between mb-2">
                                    <View className="h-3 w-24 bg-gray-200 rounded" />
                                    <View className="h-3 w-32 bg-gray-200 rounded" />
                                </View>
                            ))}
                        </View>
                        <View className="space-y-2">
                            {[1, 2, 3].map(i => (
                                <View key={i} className="flex-row justify-between mb-2">
                                    <View className="h-3 w-24 bg-gray-200 rounded" />
                                    <View className="h-3 w-32 bg-gray-200 rounded" />
                                </View>
                            ))}
                        </View>
                    </View>
                </Card.Content>
            </Card>
        </Animated.View>
    );
}
