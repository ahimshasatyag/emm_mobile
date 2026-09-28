import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import { Card, useTheme } from 'react-native-paper';

export const KasBankInListSkeleton = () => {
    const theme = useTheme();
    const colors = theme.colors as any;
    
    // 🌟 Inisialisasi nilai opacity untuk animasi
    const opacityAnim = useRef(new Animated.Value(0.4)).current;

    useEffect(() => {
        // 🌟 Jalankan loop animasi di Native Thread secara terus-menerus
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true, // Wajib true agar super ringan!
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
        <View className="gap-3 px-4 py-2">
            {[1, 2, 3, 4, 5].map((i) => (
                <Animated.View key={i} style={{ opacity: opacityAnim }}>
                    <Card
                        className="rounded-xl shadow-sm border border-gray-100"
                        style={{
                            backgroundColor: colors.surface,
                        }}
                    >
                        <Card.Content className="p-4">
                            <View className="flex-row justify-between items-start mb-2">
                                <View className="flex-1 mr-4">
                                    <View className="h-5 bg-gray-200 rounded-md w-3/4 mb-2" />
                                    <View className="h-3 bg-gray-200 rounded-md w-1/2" />
                                </View>
                            </View>
                            <View className="border-t border-gray-50 pt-3 mt-1 flex-row justify-between items-center">
                                <View className="flex-1">
                                    <View className="h-3 bg-gray-200 rounded-md w-1/3 mb-1" />
                                    <View className="h-4 bg-gray-200 rounded-md w-2/3" />
                                </View>
                                <View className="items-end flex-1">
                                    <View className="h-3 bg-gray-200 rounded-md w-1/2 mb-1" />
                                    <View className="h-4 bg-gray-200 rounded-md w-2/3" />
                                </View>
                            </View>
                        </Card.Content>
                    </Card>
                </Animated.View>
            ))}
        </View>
    );
};
