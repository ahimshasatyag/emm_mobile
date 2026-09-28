import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { Card, useTheme } from 'react-native-paper';

export function LeadsSkeleton() {
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
        <Animated.View style={{ opacity: fadeAnim }} className="flex-1 p-4">
            {[1, 2, 3, 4, 5].map((item) => (
                <Card key={item} className="mb-3 rounded-2xl shadow-sm" style={{ backgroundColor: colors.surface }}>
                    <Card.Content className="p-4 flex-row items-center">
                        <View className="w-12 h-12 bg-gray-200 rounded-full mr-4" />
                        <View className="flex-1">
                            <View className="flex-row justify-between mb-2">
                                <View className="h-4 bg-gray-200 rounded-full w-2/3" />
                                <View className="h-4 bg-gray-200 rounded-md w-16" />
                            </View>
                            <View className="h-3 bg-gray-200 rounded-full w-1/2" />
                        </View>
                    </Card.Content>
                </Card>
            ))}
        </Animated.View>
    );
}
