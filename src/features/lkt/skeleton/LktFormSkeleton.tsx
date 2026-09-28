import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { Card } from 'react-native-paper';

export function LktFormSkeleton() {
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
        <View className="flex-1 bg-gray-50 p-4 space-y-4 mt-6">
            <Animated.View style={{ opacity: fadeAnim }}>
                {/* Header / Info Skeleton */}
                <Card style={{ backgroundColor: '#ffffff', marginBottom: 16, borderRadius: 12, borderWidth: 1, borderColor: '#f3f4f6' }} elevation={0}>
                    <Card.Content>
                        <View className="h-6 w-3/4 bg-gray-200 rounded mb-3" />
                        <View className="h-4 w-1/2 bg-gray-200 rounded mb-2" />
                        <View className="h-4 w-2/3 bg-gray-200 rounded" />
                    </Card.Content>
                </Card>

                {/* Form Fields Skeleton */}
                <Card style={{ backgroundColor: '#ffffff', borderRadius: 12, borderWidth: 1, borderColor: '#f3f4f6' }} elevation={0}>
                    <Card.Content className="space-y-4">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <View key={i}>
                                <View className="h-4 w-1/3 bg-gray-200 rounded mb-2" />
                                <View className="h-12 w-full bg-gray-200 rounded-lg" />
                            </View>
                        ))}
                    </Card.Content>
                </Card>
            </Animated.View>
        </View>
    );
}
