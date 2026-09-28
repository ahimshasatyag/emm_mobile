import React, { useEffect, useRef } from 'react';
import { View, Animated, ScrollView } from 'react-native';
import { Card, useTheme } from 'react-native-paper';

export function SurveyListSkeleton() {
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
        <Animated.View style={{ opacity: fadeAnim }} className="flex-1">
            <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
                {[1, 2, 3, 4, 5].map((i) => (
                    <Card key={i} className="mb-3 rounded-xl shadow-sm border border-gray-100" style={{ backgroundColor: colors.surface }}>
                        <Card.Content className="p-4">
                            <View className="flex-row justify-between mb-3">
                                <View>
                                    <View className="w-20 h-3 bg-gray-200 rounded mb-2" />
                                    <View className="w-32 h-4 bg-gray-200 rounded" />
                                </View>
                                <View className="w-24 h-6 bg-gray-200 rounded-full" />
                            </View>
                            <View className="space-y-2 mb-3">
                                <View className="w-40 h-4 bg-gray-200 rounded" />
                                <View className="w-48 h-4 bg-gray-200 rounded" />
                                <View className="w-24 h-4 bg-gray-200 rounded" />
                            </View>
                            <View className="pt-3 border-t border-gray-50 flex-row justify-between">
                                <View className="w-32 h-4 bg-gray-200 rounded" />
                                <View className="w-6 h-6 bg-gray-200 rounded-full" />
                            </View>
                        </Card.Content>
                    </Card>
                ))}
            </ScrollView>
        </Animated.View>
    );
}
