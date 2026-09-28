import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { Card, useTheme } from 'react-native-paper';

export function SOEditSkeleton() {
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

            {/* Main Content Skeleton */}
            <Card className="rounded-xl shadow-sm border border-gray-100" style={{ backgroundColor: colors.surface }}>
                <Card.Content className="p-4">
                    {/* Informasi Umum */}
                    <View className="h-4 w-32 bg-gray-200 rounded mb-6" />
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <View key={`umum-${item}`} className="mb-4">
                            <View className="h-4 w-24 bg-gray-200 rounded mb-2" />
                            <View className="h-11 w-full bg-gray-200 rounded-lg" />
                        </View>
                    ))}

                    {/* Opsi Biaya */}
                    <View className="h-4 w-32 bg-gray-200 rounded mb-6 mt-4" />
                    {[1, 2, 3].map((item) => (
                        <View key={`biaya-${item}`} className="mb-4">
                            <View className="h-4 w-24 bg-gray-200 rounded mb-2" />
                            <View className="flex-row flex-wrap gap-2">
                                <View className="h-10 w-24 bg-gray-200 rounded-lg" />
                                <View className="h-10 w-32 bg-gray-200 rounded-lg" />
                                <View className="h-10 w-40 bg-gray-200 rounded-lg" />
                            </View>
                        </View>
                    ))}

                    {/* Informasi Pembayaran */}
                    <View className="h-4 w-32 bg-gray-200 rounded mb-6 mt-4" />
                    {[1, 2, 3, 4].map((item) => (
                        <View key={`bayar-${item}`} className="mb-4">
                            <View className="h-4 w-24 bg-gray-200 rounded mb-2" />
                            <View className="h-11 w-full bg-gray-200 rounded-lg" />
                        </View>
                    ))}

                    {/* Informasi Tambahan */}
                    <View className="h-4 w-32 bg-gray-200 rounded mb-6 mt-4" />
                    {[1, 2, 3, 4, 5].map((item) => (
                        <View key={`tambahan-${item}`} className="mb-4">
                            <View className="h-4 w-24 bg-gray-200 rounded mb-2" />
                            <View className="h-11 w-full bg-gray-200 rounded-lg" />
                        </View>
                    ))}

                    {/* Items Table */}
                    <View className="h-10 w-full bg-gray-200 rounded-t-xl mt-4" />
                    <View className="h-16 w-full bg-gray-100 border-t border-white rounded-b-xl" />
                </Card.Content>
            </Card>

            {/* Extend Garansi Table Skeleton */}
            <Card className="rounded-xl shadow-sm border border-gray-100 mt-4" style={{ backgroundColor: colors.surface }}>
                <Card.Content className="p-4">
                    <View className="h-4 w-32 bg-gray-200 rounded mb-4" />
                    <View className="h-10 w-full bg-gray-200 rounded-t-xl" />
                    <View className="h-12 w-full bg-gray-100 border-t border-white rounded-b-xl" />
                </Card.Content>
            </Card>
        </Animated.View>
    );
}
