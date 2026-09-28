import React, { useEffect, useRef } from 'react';
import { View, ScrollView, Animated } from 'react-native';
import { Card } from 'react-native-paper';

export function LktViewBastSkeleton() {
    const fadeAnim = useRef(new Animated.Value(0.4)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0.4,
                    duration: 1000,
                    useNativeDriver: true,
                })
            ])
        ).start();
    }, [fadeAnim]);

    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView className="flex-1 p-4">
                <Card style={{ backgroundColor: '#ffffff', borderRadius: 16, borderWidth: 1, borderColor: '#f3f4f6' }} elevation={0}>
                    <Card.Content>
                        <Animated.View style={{ opacity: fadeAnim }}>
                            <View className="items-center mb-6">
                                <View className="bg-gray-200 h-16 w-16 rounded-full mb-3" />
                                <View className="bg-gray-200 h-5 w-48 rounded mb-2" />
                                <View className="bg-gray-200 h-4 w-32 rounded" />
                            </View>

                            <View className="space-y-4">
                                {/* Info LKT */}
                                <View className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <View className="flex-row items-center mb-3">
                                        <View className="bg-gray-200 h-5 w-5 rounded-full mr-2" />
                                        <View className="bg-gray-200 h-4 w-24 rounded" />
                                    </View>

                                    <View className="space-y-3">
                                        <View className="flex-row justify-between">
                                            <View className="bg-gray-200 h-4 w-20 rounded" />
                                            <View className="bg-gray-200 h-4 w-32 rounded" />
                                        </View>
                                        <View className="flex-row justify-between">
                                            <View className="bg-gray-200 h-4 w-24 rounded" />
                                            <View className="bg-gray-200 h-4 w-28 rounded" />
                                        </View>
                                    </View>
                                </View>

                                {/* Input Fields */}
                                <View className="mt-4">
                                    <View className="bg-gray-200 h-4 w-20 rounded mb-2" />
                                    <View className="bg-gray-200 h-12 rounded-lg mb-4" />

                                    <View className="bg-gray-200 h-4 w-24 rounded mb-2" />
                                    <View className="bg-gray-200 h-12 rounded-lg" />
                                </View>

                                {/* Image Viewer */}
                                <View className="mt-6">
                                    <View className="bg-gray-200 h-4 w-32 rounded mb-2" />
                                    <View className="h-64 bg-gray-200 rounded-xl" />
                                </View>
                            </View>
                        </Animated.View>
                    </Card.Content>
                </Card>
            </ScrollView>

            <View className="p-4 bg-white border-t border-gray-100 flex-row space-x-3">
                <View className="bg-gray-300 h-12 rounded-xl flex-1" />
                <View className="bg-gray-300 h-12 rounded-xl flex-1" />
            </View>
        </View>
    );
}
