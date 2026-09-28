import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { Card, useTheme } from 'react-native-paper';

export function CstEditSkeleton() {
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
            <Card className="rounded-2xl shadow-sm mb-6" style={{ backgroundColor: colors.surface }}>
                <Card.Content className="p-5 space-y-4">
                    {/* Action Buttons Skeleton */}
                    <View className="flex-row items-center mb-2 space-x-2">
                        <View className="h-8 w-20 bg-gray-200 rounded-lg" />
                    </View>

                    {/* Header Status Skeleton */}
                    <View className="mb-2">
                        <View className="h-6 w-48 bg-gray-200 rounded mb-2" />
                        <View className="h-4 w-32 bg-gray-200 rounded" />
                    </View>

                    {/* SECTION: Customer Skeleton */}
                    <View className="mt-2">
                        <View className="h-5 w-24 bg-gray-200 rounded mb-4 border-b border-gray-100 pb-2" />
                        <View className="space-y-3">
                            {[1, 2, 3, 4, 5, 6].map((item) => (
                                <View key={item} className="flex-row">
                                    <View className="h-3 w-1/3 bg-gray-200 rounded mr-4" />
                                    <View className="h-3 flex-1 bg-gray-200 rounded" />
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* SECTION: Laporan Kerusakan Skeleton */}
                    <View className="mt-6">
                        <View className="h-5 w-40 bg-gray-200 rounded mb-4 border-b border-gray-100 pb-2" />
                        <View className="space-y-4">
                            <View>
                                <View className="h-3 w-32 bg-gray-200 rounded mb-2" />
                                <View className="h-16 w-full bg-gray-100 rounded-lg border border-gray-100" />
                            </View>
                            <View>
                                <View className="h-3 w-16 bg-gray-200 rounded mb-2" />
                                <View className="h-32 w-full bg-gray-100 rounded-lg border border-gray-200" />
                            </View>
                        </View>
                    </View>

                    {/* SECTION: Product To Service Skeleton */}
                    <View className="mt-6">
                        <View className="h-5 w-36 bg-gray-200 rounded mb-4 border-b border-gray-100 pb-2" />
                        <View className="space-y-3">
                            {[1, 2, 3, 4, 5, 6, 7].map((item) => (
                                <View key={item} className="flex-row">
                                    <View className="h-3 w-1/3 bg-gray-200 rounded mr-4" />
                                    <View className="h-3 flex-1 bg-gray-200 rounded" />
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* SECTION: Tabs Skeleton */}
                    <View className="flex-row space-x-2 mt-6">
                        <View className="flex-1 h-12 bg-gray-200 rounded-lg" />
                        <View className="flex-1 h-12 bg-gray-200 rounded-lg" />
                    </View>

                    {/* Tab Content Skeleton */}
                    <View className="bg-gray-100 min-h-[150px] rounded-xl border border-gray-100 mt-2" />
                </Card.Content>
            </Card>
        </Animated.View>
    );
}
