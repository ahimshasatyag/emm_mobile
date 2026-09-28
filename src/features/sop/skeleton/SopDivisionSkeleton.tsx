import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { Card, useTheme } from 'react-native-paper';

export const SopDivisionSkeleton = () => {
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
            {/* Total SOP Card */}
            <Card className="mb-4 rounded-xl shadow-sm border border-gray-100" style={{ backgroundColor: colors.surface }}>
                <Card.Content className="items-center justify-center p-4">
                    <View className="h-4 w-32 bg-gray-200 rounded mb-3" />
                    <View className="h-8 w-16 bg-gray-200 rounded" />
                </Card.Content>
            </Card>

            {/* Division Cards */}
            {[1, 2, 3, 4, 5].map((item) => (
                <Card key={item} className="mb-3 rounded-xl shadow-sm border border-gray-100" style={{ backgroundColor: colors.surface }}>
                    <Card.Content className="flex-row justify-between items-center p-4">
                        <View className="h-5 w-32 bg-gray-200 rounded" />
                        <View className="h-6 w-12 bg-gray-200 rounded-full" />
                    </Card.Content>
                </Card>
            ))}
        </Animated.View>
    );
};
