import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { Card, useTheme } from 'react-native-paper';

export function CsrListSkeleton() {
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
        <Animated.View style={{ opacity: fadeAnim }} className="w-full">
            {[1, 2, 3, 4].map((item) => (
                <Card key={item} className="rounded-2xl mb-4 shadow-sm" style={{ backgroundColor: colors.surface, borderColor: colors.outlineVariant }}>
                    <Card.Content className="p-5">
                        {/* Header */}
                        <View className="flex-row justify-between items-center mb-4">
                            <View className="h-5 w-32 bg-gray-200 rounded-lg" />
                            <View className="h-6 w-20 bg-gray-200 rounded-full" />
                        </View>
                        
                        {/* Content */}
                        <View className="space-y-3">
                            <View className="flex-row items-center">
                                <View className="h-4 w-4 bg-gray-200 rounded-full mr-3" />
                                <View className="h-4 w-40 bg-gray-200 rounded-lg" />
                            </View>
                            <View className="flex-row items-center">
                                <View className="h-4 w-4 bg-gray-200 rounded-full mr-3" />
                                <View className="h-4 w-48 bg-gray-200 rounded-lg" />
                            </View>
                            <View className="flex-row items-center">
                                <View className="h-4 w-4 bg-gray-200 rounded-full mr-3" />
                                <View className="h-4 w-32 bg-gray-200 rounded-lg" />
                            </View>
                        </View>
                    </Card.Content>
                </Card>
            ))}
        </Animated.View>
    );
}
