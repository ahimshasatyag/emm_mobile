import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { Card, useTheme } from 'react-native-paper';

export const SopEditSkeleton = () => {
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
                    {/* Status Bar */}
                    <View className="flex-row justify-between items-center mb-4 pb-4 border-b border-gray-100">
                        <View className="h-4 w-24 bg-gray-200 rounded" />
                        <View className="h-6 w-24 bg-gray-200 rounded-full" />
                    </View>

                    {/* Divisi */}
                    <View className="mb-4">
                        <View className="h-4 w-16 bg-gray-200 rounded mb-2" />
                        <View className="h-5 w-32 bg-gray-200 rounded" />
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
                        <View className="h-16 w-full bg-gray-200 rounded-lg" />
                    </View>

                    {/* History Table */}
                    <View className="mt-6 border-t border-gray-100 pt-6">
                        <View className="h-5 w-32 bg-gray-200 rounded mb-3" />
                        <View className="-mx-4 -mb-4 border-t border-gray-200 bg-white rounded-b-xl overflow-hidden">
                            <View className="h-12 bg-gray-100 border-b border-gray-200" />
                            <View className="h-14 bg-white border-b border-gray-100" />
                            <View className="h-14 bg-white border-b border-gray-100" />
                        </View>
                    </View>
                </Card.Content>
            </Card>
        </Animated.View>
    );
};
