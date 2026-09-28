import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { Card, useTheme } from 'react-native-paper';

export const SopFormSkeleton = () => {
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
        <Animated.View style={{ opacity: fadeAnim }} className="flex-1 pb-10">
            <Card className="mb-4 rounded-xl shadow-sm border border-gray-100" style={{ backgroundColor: colors.surface }}>
                <Card.Content className="p-4">
                    {/* Divisi */}
                    <View className="mb-4">
                        <View className="h-4 w-16 bg-gray-200 rounded mb-2" />
                        <View className="h-12 w-full bg-gray-200 rounded-lg" />
                    </View>

                    {/* No Document */}
                    <View className="mb-4">
                        <View className="h-4 w-24 bg-gray-200 rounded mb-2" />
                        <View className="h-12 w-full bg-gray-200 rounded-lg" />
                    </View>

                    {/* Nama Document */}
                    <View className="mb-4">
                        <View className="h-4 w-28 bg-gray-200 rounded mb-2" />
                        <View className="h-12 w-full bg-gray-200 rounded-lg" />
                    </View>

                    {/* File PDF */}
                    <View className="mb-2">
                        <View className="h-4 w-20 bg-gray-200 rounded mb-2" />
                        <View className="h-32 w-full bg-gray-200 rounded-lg border-2 border-dashed border-gray-300" />
                    </View>
                </Card.Content>
            </Card>
        </Animated.View>
    );
};
