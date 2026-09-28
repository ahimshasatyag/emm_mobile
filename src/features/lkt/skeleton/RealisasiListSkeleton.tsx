import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { Card } from 'react-native-paper';

export function RealisasiListSkeleton() {
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
        <View className="flex-1">
            {[1, 2, 3].map((item) => (
                <Card key={item} style={{ backgroundColor: '#ffffff', marginBottom: 12, borderRadius: 12, borderWidth: 1, borderColor: '#f3f4f6' }} elevation={0}>
                    <Card.Content>
                        <Animated.View style={{ opacity: fadeAnim }}>
                            {/* Header: Codes & Status */}
                            <View className="flex-row justify-between items-start mb-3">
                                <View className="flex-1 mr-2">
                                    <View className="h-4 w-3/4 bg-gray-200 rounded mb-1" />
                                    <View className="h-3 w-1/2 bg-gray-200 rounded" />
                                </View>
                                <View className="h-5 w-16 bg-gray-200 rounded" />
                            </View>

                            {/* Info Grid */}
                            <View className="flex-row items-center mb-2">
                                <View className="flex-1 mr-2">
                                    <View className="h-3 w-full bg-gray-200 rounded" />
                                </View>
                                <View className="flex-1">
                                    <View className="h-3 w-full bg-gray-200 rounded" />
                                </View>
                            </View>

                            <View className="mb-3">
                                <View className="h-3 w-full bg-gray-200 rounded mb-1" />
                                <View className="h-3 w-2/3 bg-gray-200 rounded" />
                            </View>

                            {/* Footer Metrics */}
                            <View className="flex-row items-center justify-between border-t border-gray-100 pt-3">
                                <View className="flex-row">
                                    <View className="mr-8">
                                        <View className="h-2 w-10 bg-gray-200 rounded mb-1" />
                                        <View className="h-3 w-16 bg-gray-200 rounded" />
                                    </View>
                                    <View>
                                        <View className="h-2 w-10 bg-gray-200 rounded mb-1" />
                                        <View className="h-3 w-16 bg-gray-200 rounded" />
                                    </View>
                                </View>
                                <View className="h-5 w-16 bg-gray-200 rounded" />
                            </View>
                        </Animated.View>
                    </Card.Content>
                </Card>
            ))}
        </View>
    );
}
