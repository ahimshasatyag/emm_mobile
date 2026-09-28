import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { Card, useTheme } from 'react-native-paper';

export function QuotationListSkeleton() {
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
        <Animated.View style={{ opacity: fadeAnim }} className="px-4 py-2 space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
                <Card key={item} className="p-4 rounded-xl shadow-sm border border-gray-100 mb-4" style={{ backgroundColor: colors.surface }}>
                    <Card.Content className="flex-row justify-between items-center p-0">
                        <View className="space-y-3 flex-1 mr-4">
                            <View className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                            <View className="h-3 bg-gray-200 rounded w-1/3 mb-2" />
                            <View className="h-3 bg-gray-200 rounded w-2/3" />
                        </View>
                        <View className="space-y-3 items-end">
                            <View className="h-5 bg-gray-200 rounded-full w-16 mb-2" />
                            <View className="h-4 bg-gray-200 rounded w-20" />
                        </View>
                    </Card.Content>
                </Card>
            ))}
        </Animated.View>
    );
}
