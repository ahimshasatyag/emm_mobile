import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { Card, useTheme } from 'react-native-paper';

export function SalesReturSkeleton() {
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
        <Animated.View style={{ opacity: fadeAnim }} className="px-4 py-2 flex-1">
            {[1, 2, 3, 4, 5].map((item) => (
                <Card key={item} className="mb-3 rounded-xl shadow-sm" style={{ backgroundColor: colors.surface }}>
                    <Card.Content className="p-4">
                        <View className="flex-row justify-between items-center mb-3">
                            <View className="h-5 w-32 bg-gray-200 rounded-md" />
                            <View className="h-5 w-20 bg-gray-200 rounded-full" />
                        </View>
                        <View className="space-y-2">
                            <View className="flex-row items-center mb-2">
                                <View className="h-4 w-4 bg-gray-200 rounded-full mr-2" />
                                <View className="h-4 w-40 bg-gray-200 rounded-md" />
                            </View>
                            <View className="flex-row items-center">
                                <View className="h-4 w-4 bg-gray-200 rounded-full mr-2" />
                                <View className="h-4 w-24 bg-gray-200 rounded-md" />
                            </View>
                        </View>
                    </Card.Content>
                </Card>
            ))}
        </Animated.View>
    );
}
