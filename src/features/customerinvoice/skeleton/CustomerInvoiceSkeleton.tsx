import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { Card, useTheme } from 'react-native-paper';

export function CustomerInvoiceSkeleton() {
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
        <Animated.View style={{ opacity: fadeAnim }} className="flex-1 px-4 pt-4 pb-20">
            {[1, 2, 3, 4, 5].map((item) => (
                <Card key={item} className="rounded-2xl mb-4 shadow-sm" style={{ backgroundColor: colors.surface }}>
                    <Card.Content className="p-4">
                        {/* Header */}
                        <View className="flex-row justify-between items-start mb-3">
                            <View className="flex-row items-center flex-1">
                                <View className="w-10 h-10 rounded-full bg-gray-200 mr-3" />
                                <View className="flex-1">
                                    <View className="h-3 w-24 bg-gray-200 rounded-md mb-1.5" />
                                    <View className="h-4 w-3/4 bg-gray-200 rounded-md" />
                                </View>
                            </View>
                            <View className="h-6 w-16 bg-gray-200 rounded-full" />
                        </View>

                        {/* Middle Box */}
                        <View className="flex-row mb-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
                            <View className="flex-1">
                                <View className="h-3 w-20 bg-gray-200 rounded-md mb-1.5" />
                                <View className="h-3 w-16 bg-gray-200 rounded-md" />
                            </View>
                            <View className="flex-1">
                                <View className="h-3 w-24 bg-gray-200 rounded-md mb-1.5" />
                                <View className="h-3 w-12 bg-gray-200 rounded-md" />
                            </View>
                        </View>

                        {/* Footer */}
                        <View className="flex-row justify-between items-end border-t border-gray-100 pt-3">
                            <View>
                                <View className="h-3 w-10 bg-gray-200 rounded-md mb-1.5" />
                                <View className="h-4 w-28 bg-gray-200 rounded-md" />
                            </View>
                            <View className="items-end">
                                <View className="h-3 w-12 bg-gray-200 rounded-md mb-1.5" />
                                <View className="h-4 w-28 bg-gray-200 rounded-md" />
                            </View>
                        </View>
                    </Card.Content>
                </Card>
            ))}
        </Animated.View>
    );
}
