import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { Card, useTheme } from 'react-native-paper';

export function ProductPriceEditSkeleton() {
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
                <Card.Content className="p-6">
                    <View className="mb-5">
                        <View className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                        <View className="h-14 bg-gray-200 rounded-xl w-full" />
                    </View>
                    <View className="mb-5">
                        <View className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                        <View className="h-14 bg-gray-200 rounded-xl w-full" />
                    </View>
                    <View className="mb-5">
                        <View className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                        <View className="h-14 bg-gray-200 rounded-xl w-full" />
                    </View>
                    
                    <View className="flex-row mb-5 gap-4">
                        <View className="flex-1">
                            <View className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                            <View className="h-14 bg-gray-200 rounded-xl w-full" />
                        </View>
                        <View className="flex-1">
                            <View className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
                            <View className="h-14 bg-gray-200 rounded-xl w-full" />
                        </View>
                    </View>

                    <View className="flex-row mb-5 gap-4">
                        <View className="flex-1">
                            <View className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                            <View className="h-14 bg-gray-200 rounded-xl w-full" />
                        </View>
                        <View className="flex-1">
                            <View className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                            <View className="h-14 bg-gray-200 rounded-xl w-full" />
                        </View>
                    </View>

                    <View className="mb-5">
                        <View className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                        <View className="h-14 bg-gray-200 rounded-xl w-full" />
                    </View>

                    <View className="h-4 bg-gray-200 rounded w-1/4 mb-4 mt-2" />
                    <View className="border border-gray-100 rounded-xl h-24 bg-gray-50" />
                </Card.Content>
            </Card>

            <View className="flex-row space-x-3 gap-3 mb-6">
                <View className="flex-1 h-14 bg-gray-200 rounded-2xl" />
                <View className="flex-1 h-14 bg-gray-200 rounded-2xl" />
            </View>
            
            <Card className="rounded-3xl shadow-sm border border-gray-100" style={{ backgroundColor: colors.surface }}>
                <Card.Content className="p-6">
                    <View className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
                    <View className="border border-gray-100 rounded-xl h-24 bg-gray-50" />
                </Card.Content>
            </Card>
        </Animated.View>
    );
}
