import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { Card, useTheme } from 'react-native-paper';

export function CekSerialNumberSkeleton() {
    const theme = useTheme();
    const colors = theme.colors as any;
    
    // Inisialisasi nilai opacity untuk animasi
    const opacityAnim = useRef(new Animated.Value(0.4)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 0.4,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [opacityAnim]);

    return (
        <Animated.View style={{ opacity: opacityAnim }}>
            {/* Product & Customer Info Skeletons */}
            {[1, 2].map((card) => (
                <Card key={card} className="rounded-xl shadow-sm mb-4" style={{ backgroundColor: colors.surface }}>
                    <Card.Content className="p-4">
                        <View className="h-5 w-1/2 bg-gray-200 rounded mb-4" />
                        <View className="space-y-3">
                            {[1, 2, 3, 4, 5].map((row) => (
                                <View key={row} className="flex-row items-start">
                                    <View className="w-[35%] pr-2">
                                        <View className="h-3 w-3/4 bg-gray-200 rounded" />
                                    </View>
                                    <View className="flex-1">
                                        <View className="h-3 w-full bg-gray-100 rounded" />
                                    </View>
                                </View>
                            ))}
                        </View>
                    </Card.Content>
                </Card>
            ))}

            <View className="mt-2 mb-3">
                <View className="h-5 w-1/3 bg-gray-200 rounded" />
            </View>

            {/* History Service Skeletons */}
            {[1, 2].map((item) => (
                <Card key={item} className="rounded-xl shadow-sm mb-3" style={{ backgroundColor: colors.surface }}>
                    <Card.Content className="p-4">
                        <View className="flex-row justify-between items-center border-b border-gray-100 pb-3 mb-3">
                            <View className="flex-row items-center">
                                <View className="w-8 h-8 rounded-full bg-gray-200 mr-3" />
                                <View>
                                    <View className="h-3 w-12 bg-gray-200 rounded mb-1" />
                                    <View className="h-4 w-24 bg-gray-200 rounded" />
                                </View>
                            </View>
                            <View className="items-end">
                                <View className="h-3 w-16 bg-gray-200 rounded mb-1" />
                                <View className="h-4 w-20 bg-gray-200 rounded" />
                            </View>
                        </View>
                        
                        <View className="space-y-2 mb-3">
                            <View className="h-3 w-3/4 bg-gray-200 rounded" />
                            <View className="h-3 w-1/2 bg-gray-200 rounded" />
                        </View>
                        
                        <View className="bg-gray-50 p-3 rounded-lg border border-gray-100 space-y-2 mt-2">
                            <View className="h-10 w-full bg-gray-200 rounded" />
                            <View className="h-10 w-full bg-gray-200 rounded" />
                        </View>
                    </Card.Content>
                </Card>
            ))}
        </Animated.View>
    );
}
