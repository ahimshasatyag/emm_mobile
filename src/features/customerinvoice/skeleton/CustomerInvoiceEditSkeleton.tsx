import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { Card, useTheme } from 'react-native-paper';

export function CustomerInvoiceEditSkeleton() {
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
        <Animated.View style={{ opacity: fadeAnim }} className="flex-1 p-4 mb-8">
            <Card className="rounded-2xl shadow-sm overflow-hidden" style={{ backgroundColor: colors.surface }}>
                <Card.Content className="p-0">
                    {/* Header Info Skeleton */}
                    <View className="p-4 border-b border-gray-100">
                        <View className="w-1/3 h-5 bg-gray-200 rounded mb-3" />

                        <View className="space-y-3">
                            <View>
                                <View className="w-1/4 h-4 bg-gray-200 rounded mb-2" />
                                <View className="flex-row items-center">
                                    <View className="w-4 h-4 bg-gray-200 rounded" />
                                    <View className="w-2/3 h-4 bg-gray-200 rounded ml-2" />
                                </View>
                                <View className="flex-row mt-2 ml-6">
                                    <View className="w-3 h-3 bg-gray-200 rounded" />
                                    <View className="w-3/4 h-4 bg-gray-200 rounded ml-2" />
                                </View>
                            </View>

                            <View className="flex-row pt-2 border-t border-gray-50">
                                <View className="flex-1 pr-2">
                                    <View className="w-1/2 h-4 bg-gray-200 rounded mb-2" />
                                    <View className="flex-row items-center">
                                        <View className="w-4 h-4 bg-gray-200 rounded" />
                                        <View className="w-2/3 h-4 bg-gray-200 rounded ml-2" />
                                    </View>
                                </View>
                                <View className="flex-1">
                                    <View className="w-1/2 h-4 bg-gray-200 rounded mb-2" />
                                    <View className="flex-row items-center">
                                        <View className="w-4 h-4 bg-gray-200 rounded" />
                                        <View className="w-2/3 h-4 bg-gray-200 rounded ml-2" />
                                    </View>
                                </View>
                            </View>

                            <View className="flex-row pt-2 border-t border-gray-50">
                                <View className="flex-1 pr-2">
                                    <View className="w-1/2 h-4 bg-gray-200 rounded mb-2" />
                                    <View className="w-1/3 h-4 bg-gray-200 rounded" />
                                </View>
                                <View className="flex-1">
                                    <View className="w-1/2 h-4 bg-gray-200 rounded mb-2" />
                                    <View className="w-1/4 h-6 bg-gray-200 rounded" />
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Items Table Skeleton */}
                    <View className="border-b border-gray-100">
                        <View className="p-4 border-b border-gray-100 bg-gray-50">
                            <View className="w-1/4 h-5 bg-gray-200 rounded" />
                        </View>

                        <View className="py-4 px-4 space-y-4">
                            {[1, 2].map((item) => (
                                <View key={item} className="flex-row items-center border-b border-gray-50 pb-4">
                                    <View className="w-1/3 h-10 bg-gray-200 rounded" />
                                    <View className="w-1/6 h-5 bg-gray-200 rounded ml-4" />
                                    <View className="w-1/4 h-5 bg-gray-200 rounded ml-4" />
                                    <View className="w-1/4 h-5 bg-gray-200 rounded ml-auto" />
                                </View>
                            ))}
                        </View>

                        {/* Summary Skeleton */}
                        <View className="p-4 bg-gray-50 border-t border-gray-100 space-y-3">
                            <View className="flex-row justify-between">
                                <View className="w-1/4 h-4 bg-gray-200 rounded" />
                                <View className="w-1/4 h-4 bg-gray-200 rounded" />
                            </View>
                            <View className="flex-row justify-between pt-2 border-t border-gray-200">
                                <View className="w-1/4 h-5 bg-gray-200 rounded" />
                                <View className="w-1/3 h-5 bg-gray-200 rounded" />
                            </View>
                            <View className="flex-row justify-between">
                                <View className="w-1/4 h-5 bg-gray-200 rounded" />
                                <View className="w-1/3 h-5 bg-gray-200 rounded" />
                            </View>
                        </View>
                    </View>

                    {/* Payments Table Skeleton */}
                    <View>
                        <View className="p-4 border-b border-gray-100 bg-gray-50">
                            <View className="w-1/3 h-5 bg-gray-200 rounded" />
                        </View>

                        <View className="py-4 px-4 space-y-4">
                            {[1].map((item) => (
                                <View key={item} className="flex-row items-center border-b border-gray-50 pb-4">
                                    <View className="w-8 h-5 bg-gray-200 rounded" />
                                    <View className="w-1/4 h-5 bg-gray-200 rounded ml-4" />
                                    <View className="w-1/5 h-5 bg-gray-200 rounded ml-4" />
                                    <View className="w-1/4 h-5 bg-gray-200 rounded ml-auto" />
                                </View>
                            ))}
                        </View>
                    </View>
                </Card.Content>
            </Card>
        </Animated.View>
    );
}
