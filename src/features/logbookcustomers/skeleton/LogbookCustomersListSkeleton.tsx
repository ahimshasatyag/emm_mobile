import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { Card, useTheme } from 'react-native-paper';

export function LogbookCustomersListSkeleton() {
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
            <View className="space-y-3">
                {[1, 2, 3, 4, 5].map((item) => (
                    <Card
                        key={item}
                        className="rounded-xl shadow-sm border border-gray-100 mb-3"
                        style={{ backgroundColor: colors.surface }}
                    >
                        <Card.Content className="p-4">
                            <View className="flex-row justify-between items-start mb-2">
                                <View className="flex-1 mr-3">
                                    <View className="h-4 w-3/4 bg-gray-200 rounded mb-1" />
                                    <View className="h-3 w-1/2 bg-gray-200 rounded" />
                                </View>
                            </View>
                            <View className="h-px bg-gray-100 my-2" />
                            <View className="flex-row justify-between items-end">
                                <View className="flex-1">
                                    <View className="h-3 w-16 bg-gray-200 rounded mb-1" />
                                    <View className="h-4 w-24 bg-gray-200 rounded" />
                                </View>
                                <View className="flex-1 items-end">
                                    <View className="h-3 w-16 bg-gray-200 rounded mb-1" />
                                    <View className="h-4 w-24 bg-gray-200 rounded" />
                                </View>
                            </View>
                        </Card.Content>
                    </Card>
                ))}
            </View>
        </Animated.View>
    );
}
