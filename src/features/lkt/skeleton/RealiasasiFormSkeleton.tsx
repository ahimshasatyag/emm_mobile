import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { Card } from 'react-native-paper';

export function RealiasasiFormSkeleton() {
    const fadeAnim = useRef(new Animated.Value(0.5)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0.5,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [fadeAnim]);

    return (
        <Animated.View style={{ opacity: fadeAnim }}>
            <Card className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4">
                <Card.Content>
                    {/* Header Skeleton */}
                    <View className="mb-4">
                        <View className="h-6 w-1/2 bg-gray-200 rounded mb-2" />
                        <View className="h-4 w-1/3 bg-gray-200 rounded" />
                    </View>

                    {/* Form Fields Skeleton */}
                    <View className="space-y-4 mt-4">
                        <View>
                            <View className="h-4 w-1/4 bg-gray-200 rounded mb-2" />
                            <View className="h-20 w-full bg-gray-100 rounded-lg" />
                        </View>
                        <View>
                            <View className="h-4 w-1/4 bg-gray-200 rounded mb-2" />
                            <View className="h-10 w-full bg-gray-100 rounded-lg" />
                        </View>
                        <View className="flex-row space-x-3">
                            <View className="flex-1">
                                <View className="h-4 w-1/2 bg-gray-200 rounded mb-2" />
                                <View className="h-10 w-full bg-gray-100 rounded-lg" />
                            </View>
                            <View className="flex-1">
                                <View className="h-4 w-1/2 bg-gray-200 rounded mb-2" />
                                <View className="h-10 w-full bg-gray-100 rounded-lg" />
                            </View>
                        </View>
                        <View className="flex-row space-x-3 mt-4">
                            <View className="flex-1">
                                <View className="h-4 w-1/2 bg-gray-200 rounded mb-2" />
                                <View className="h-10 w-full bg-gray-100 rounded-lg" />
                            </View>
                            <View className="flex-1">
                                <View className="h-4 w-1/2 bg-gray-200 rounded mb-2" />
                                <View className="h-10 w-full bg-gray-100 rounded-lg" />
                            </View>
                        </View>
                    </View>
                </Card.Content>
            </Card>
        </Animated.View>
    );
}
