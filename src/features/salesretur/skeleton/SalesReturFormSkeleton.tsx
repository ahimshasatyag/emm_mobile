import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { Card, useTheme } from 'react-native-paper';

export function SalesReturFormSkeleton() {
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
        <Animated.View style={{ opacity: fadeAnim }} className="flex-1 mt-2">
            <Card className="rounded-t-3xl shadow-sm border border-gray-100" style={{ backgroundColor: colors.surface }}>
                <Card.Content className="p-6">
                    <View className="mb-6">
                        <View className="h-5 w-32 bg-gray-200 rounded-md mb-2" />
                        <View className="h-12 w-full bg-gray-200 rounded-xl" />
                    </View>
                    <View className="mb-6">
                        <View className="h-5 w-32 bg-gray-200 rounded-md mb-2" />
                        <View className="h-12 w-full bg-gray-200 rounded-xl" />
                    </View>
                    <View className="mb-6">
                        <View className="h-5 w-32 bg-gray-200 rounded-md mb-2" />
                        <View className="h-12 w-full bg-gray-200 rounded-xl" />
                    </View>
                    
                    <View className="h-[1px] w-full bg-gray-200 my-4" />

                    <View className="mb-6 space-y-4">
                        {[1, 2, 3].map(item => (
                            <View key={item} className="flex-row items-center border border-gray-100 p-3 rounded-lg mb-4">
                                <View className="h-6 w-6 bg-gray-200 rounded mr-3" />
                                <View className="flex-1">
                                    <View className="h-4 w-3/4 bg-gray-200 rounded mb-2" />
                                    <View className="h-3 w-1/2 bg-gray-200 rounded" />
                                </View>
                            </View>
                        ))}
                    </View>
                </Card.Content>
            </Card>
        </Animated.View>
    );
}
