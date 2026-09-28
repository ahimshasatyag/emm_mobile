import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { Card, useTheme } from 'react-native-paper';

export function ProductPriceFormSkeleton() {
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
            <Card className="rounded-3xl shadow-sm border border-gray-100 mb-6" style={{ backgroundColor: colors.surface }}>
                <Card.Content className="p-5">
                    <View className="flex-row justify-between items-center mb-4">
                        <View className="h-6 bg-gray-200 rounded w-1/3" />
                        <View className="h-10 bg-gray-200 rounded-full w-36" />
                    </View>

                    <View className="border border-gray-200 rounded-2xl bg-white overflow-hidden">
                        <View className="flex-row border-b border-gray-200 bg-gray-50 p-4">
                            <View className="h-4 bg-gray-200 rounded w-24 mr-8" />
                            <View className="h-4 bg-gray-200 rounded w-20 mr-8" />
                            <View className="h-4 bg-gray-200 rounded w-20 mr-8" />
                            <View className="h-4 bg-gray-200 rounded w-20" />
                        </View>

                        {[1, 2].map((i) => (
                            <View key={i} className="flex-row border-b border-gray-100 p-4 items-center">
                                <View className="h-10 bg-gray-200 rounded-lg w-40 mr-4" />
                                <View className="h-10 bg-gray-200 rounded-lg w-28 mr-4" />
                                <View className="h-10 bg-gray-200 rounded-lg w-28 mr-4" />
                                <View className="h-10 bg-gray-200 rounded-lg w-28 mr-4" />
                                <View className="h-8 bg-gray-200 rounded-full w-8" />
                            </View>
                        ))}
                    </View>
                </Card.Content>
            </Card>

            <View className="h-14 bg-gray-200 rounded-2xl w-full mb-8" />
        </Animated.View>
    );
}
