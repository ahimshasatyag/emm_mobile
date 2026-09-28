import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { Card, useTheme } from 'react-native-paper';

export function InventoryScheduleFormSkeleton() {
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
        <Animated.View style={{ opacity: fadeAnim }} className="flex-1 px-4 pt-4">
            <Card className="rounded-xl shadow-sm border border-gray-100 mb-4" style={{ backgroundColor: colors.surface }}>
                <Card.Content className="p-4">
                    <View className="mb-4">
                        <View className="bg-gray-200 h-4 w-24 rounded mb-2" />
                        <View className="bg-gray-100 h-12 w-full rounded-lg" />
                    </View>

                    <View className="mb-4">
                        <View className="bg-gray-200 h-4 w-24 rounded mb-2" />
                        <View className="bg-gray-100 h-12 w-full rounded-lg" />
                    </View>

                    <View className="mb-4">
                        <View className="bg-gray-200 h-4 w-32 rounded mb-2" />
                        <View className="bg-gray-100 h-24 w-full rounded-lg" />
                    </View>

                    <View className="mb-4">
                        <View className="bg-gray-200 h-4 w-24 rounded mb-2" />
                        <View className="bg-gray-100 h-12 w-full rounded-lg" />
                    </View>

                    <View className="mb-4">
                        <View className="bg-gray-200 h-4 w-24 rounded mb-2" />
                        <View className="bg-gray-100 h-12 w-full rounded-lg" />
                    </View>

                    <View className="mb-4">
                        <View className="bg-gray-200 h-4 w-32 rounded mb-2" />
                        <View className="flex-row">
                            <View className="bg-gray-100 h-6 w-20 rounded mr-2" />
                            <View className="bg-gray-100 h-6 w-20 rounded mr-2" />
                            <View className="bg-gray-100 h-6 w-20 rounded" />
                        </View>
                    </View>

                    <View className="mb-4">
                        <View className="bg-gray-200 h-4 w-24 rounded mb-2" />
                        <View className="bg-gray-100 h-12 w-full rounded-lg" />
                    </View>
                </Card.Content>
            </Card>
        </Animated.View>
    );
}
