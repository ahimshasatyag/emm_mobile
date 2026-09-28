import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { Card, useTheme } from 'react-native-paper';

export const AssestSkeleton = () => {
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
        <View className="gap-3 px-4 py-2">
            {[1, 2, 3].map((item) => (
                <Animated.View key={item} style={{ opacity: fadeAnim }}>
                    <Card
                        className="rounded-xl shadow-sm border border-gray-100"
                        style={{
                            backgroundColor: colors.surface,
                        }}
                    >
                        <Card.Content className="p-4">
                            <View className="flex-row justify-between items-start mb-2">
                                <View className="flex-1 mr-2">
                                    {/* Title Placeholder */}
                                    <View className="h-5 w-40 bg-gray-200 rounded mb-2" />
                                    {/* Category Placeholder with Icon Simulation */}
                                    <View className="flex-row items-center">
                                        <View className="h-3 w-3 bg-gray-200 rounded-sm mr-2" />
                                        <View className="h-3 w-24 bg-gray-200 rounded" />
                                    </View>
                                </View>
                                {/* Badge Placeholder */}
                                <View className="h-5 w-16 bg-gray-200 rounded-full" />
                            </View>
                        </Card.Content>
                    </Card>
                </Animated.View>
            ))}
        </View>
    );
};
