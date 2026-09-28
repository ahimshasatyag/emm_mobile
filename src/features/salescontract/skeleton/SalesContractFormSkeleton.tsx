import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { Card, useTheme } from 'react-native-paper';

export function SalesContractFormSkeleton() {
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
            <Card className="rounded-xl shadow-sm border border-gray-100 mb-4" style={{ backgroundColor: colors.surface }}>
                <Card.Content className="p-4">
                    <View className="w-32 h-5 bg-gray-200 rounded mb-4" />
                    <View className="mb-3">
                        <View className="w-20 h-3 bg-gray-200 rounded mb-2" />
                        <View className="w-full h-10 bg-gray-200 rounded-lg" />
                    </View>
                    <View className="mb-3">
                        <View className="w-24 h-3 bg-gray-200 rounded mb-2" />
                        <View className="w-full h-10 bg-gray-200 rounded-lg" />
                    </View>
                </Card.Content>
            </Card>

            <Card className="rounded-xl shadow-sm border border-gray-100 mb-4" style={{ backgroundColor: colors.surface }}>
                <Card.Content className="p-4">
                    <View className="w-32 h-5 bg-gray-200 rounded mb-4" />
                    {[1, 2, 3].map((i) => (
                        <View key={i} className="mb-3">
                            <View className="w-24 h-3 bg-gray-200 rounded mb-2" />
                            <View className="w-full h-10 bg-gray-200 rounded-lg" />
                        </View>
                    ))}
                </Card.Content>
            </Card>

            <Card className="rounded-xl shadow-sm border border-gray-100 mb-4" style={{ backgroundColor: colors.surface }}>
                <Card.Content className="p-4">
                    <View className="w-24 h-5 bg-gray-200 rounded mb-4" />
                    {[1, 2, 3].map((i) => (
                        <View key={i} className="mb-3">
                            <View className="w-24 h-3 bg-gray-200 rounded mb-2" />
                            <View className="w-full h-10 bg-gray-200 rounded-lg" />
                        </View>
                    ))}
                </Card.Content>
            </Card>

            <Card className="rounded-xl shadow-sm border border-gray-100 mb-8" style={{ backgroundColor: colors.surface }}>
                <Card.Content className="p-4">
                    <View className="w-32 h-5 bg-gray-200 rounded mb-4" />
                    <View className="mb-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <View className="w-48 h-4 bg-gray-200 rounded mb-3" />
                        <View className="flex-row justify-between">
                            <View>
                                <View className="w-16 h-3 bg-gray-200 rounded mb-2" />
                                <View className="w-24 h-3 bg-gray-200 rounded" />
                            </View>
                            <View className="items-end">
                                <View className="w-16 h-3 bg-gray-200 rounded mb-2" />
                                <View className="w-24 h-4 bg-gray-200 rounded" />
                            </View>
                        </View>
                    </View>
                </Card.Content>
            </Card>
        </Animated.View>
    );
}
