import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { Card, useTheme } from 'react-native-paper';

export function SurveyFormSkeleton() {
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
        <Animated.View style={{ opacity: fadeAnim }} className="flex-1 space-y-4">
            <Card className="rounded-xl shadow-sm border border-gray-100" style={{ backgroundColor: colors.surface }}>
                <Card.Content className="p-4">
                    <View className="h-4 w-32 bg-gray-200 rounded mb-6" />
                    {[1, 2, 3, 4].map((item) => (
                        <View key={item} className="mb-4">
                            <View className="h-4 w-24 bg-gray-200 rounded mb-2" />
                            <View className="h-11 w-full bg-gray-200 rounded-lg" />
                        </View>
                    ))}
                    
                    <View className="h-4 w-32 bg-gray-200 rounded mb-6 mt-4" />
                    {[1, 2, 3, 4].map((item) => (
                        <View key={`pay-${item}`} className="mb-4">
                            <View className="h-4 w-24 bg-gray-200 rounded mb-2" />
                            <View className="h-11 w-full bg-gray-200 rounded-lg" />
                        </View>
                    ))}
                    
                    <View className="h-10 w-full bg-gray-200 rounded-t-xl mt-4" />
                    <View className="h-16 w-full bg-gray-100 border-t border-white rounded-b-xl" />
                </Card.Content>
            </Card>
        </Animated.View>
    );
}
