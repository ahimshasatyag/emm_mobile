import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { Card, useTheme } from 'react-native-paper';

export function CsrFormSkeleton() {
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
        <Animated.View style={{ opacity: fadeAnim }} className="flex-1">
            {/* SECTION: Product To Service Skeleton (Combined) */}
            <Card className="rounded-xl shadow-sm mb-4" style={{ backgroundColor: colors.surface }}>
                <Card.Content className="p-4">
                    <View className="h-6 w-40 bg-gray-200 rounded mb-4 border-b border-gray-100 pb-2" />
                    <View>
                        {/* Product Fields */}
                        <View className="mb-4">
                            <View className="h-4 w-24 bg-gray-200 rounded mb-2" />
                            <View className="h-12 w-full bg-gray-200 rounded-xl" />
                        </View>
                        <View className="mb-4">
                            <View className="h-4 w-32 bg-gray-200 rounded mb-2" />
                            <View className="h-12 w-full bg-gray-200 rounded-xl" />
                        </View>
                        <View className="mb-4">
                            <View className="h-4 w-28 bg-gray-200 rounded mb-2" />
                            <View className="h-12 w-full bg-gray-200 rounded-xl" />
                        </View>
                        <View className="mb-4 flex-row">
                            <View className="flex-1 mr-2">
                                <View className="h-4 w-20 bg-gray-200 rounded mb-2" />
                                <View className="h-12 w-full bg-gray-200 rounded-xl" />
                            </View>
                            <View className="flex-1 ml-2">
                                <View className="h-4 w-24 bg-gray-200 rounded mb-2" />
                                <View className="h-12 w-full bg-gray-200 rounded-xl" />
                            </View>
                        </View>
                        <View className="mb-4 flex-row">
                            <View className="flex-1 mr-2">
                                <View className="h-4 w-24 bg-gray-200 rounded mb-2" />
                                <View className="h-12 w-full bg-gray-200 rounded-xl" />
                            </View>
                            <View className="flex-1 ml-2">
                                <View className="h-4 w-24 bg-gray-200 rounded mb-2" />
                                <View className="h-12 w-full bg-gray-200 rounded-xl" />
                            </View>
                        </View>

                        {/* Customer Fields */}
                        <View className="mb-4">
                            <View className="h-4 w-32 bg-gray-200 rounded mb-2 mt-4" />
                            <View className="h-12 w-full bg-gray-200 rounded-xl" />
                        </View>
                        <View className="mb-4">
                            <View className="h-4 w-24 bg-gray-200 rounded mb-2" />
                            <View className="h-12 w-full bg-gray-200 rounded-xl" />
                        </View>
                        <View className="mb-4 flex-row">
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
                            <View className="h-12 w-full bg-gray-200 rounded-xl" />
                        </View>
                        <View className="mb-4">
                            <View className="h-4 w-32 bg-gray-200 rounded mb-2" />
                            <View className="h-12 w-full bg-gray-200 rounded-xl" />
                        </View>

                        {/* Laporan Kerusakan Fields */}
                        <View className="mb-4">
                            <View className="h-4 w-32 bg-gray-200 rounded mb-2 mt-4" />
                            <View className="h-28 w-full bg-gray-200 rounded-xl" />
                        </View>
                        <View className="mb-4">
                            <View className="h-4 w-16 bg-gray-200 rounded mb-2" />
                            <View className="h-24 w-24 bg-gray-200 rounded-xl" />
                        </View>
                    </View>
                </Card.Content>
            </Card>
        </Animated.View>
    );
}
