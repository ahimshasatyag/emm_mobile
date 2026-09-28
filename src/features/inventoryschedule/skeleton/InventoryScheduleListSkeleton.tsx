import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { Card, useTheme } from 'react-native-paper';

export function InventoryScheduleListSkeleton() {
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
        <Animated.View style={{ opacity: fadeAnim }} className="flex-1 pb-24">
            <View className="px-4">
                {[1, 2, 3, 4, 5].map((item) => (
                    <Card key={item} className="mb-3 rounded-xl shadow-sm border border-gray-100" style={{ backgroundColor: colors.surface }}>
                        <Card.Content className="p-4">
                            <View className="flex-row justify-between items-start mb-3">
                                <View className="flex-1">
                                    <View className="bg-gray-200 h-4 w-40 rounded mb-2" />
                                    <View className="bg-gray-100 h-3 w-32 rounded mb-2" />
                                    <View className="bg-gray-100 h-3 w-48 rounded" />
                                </View>
                                <View className="bg-gray-200 h-5 w-20 rounded-full" />
                            </View>
                        </Card.Content>
                    </Card>
                ))}
            </View>
        </Animated.View>
    );
}
