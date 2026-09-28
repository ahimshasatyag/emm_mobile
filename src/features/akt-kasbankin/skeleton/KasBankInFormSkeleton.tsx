import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import { Card, useTheme } from 'react-native-paper';

export const KasBankInFormSkeleton = () => {
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
        <View className="p-4">
            <Animated.View style={{ opacity: opacityAnim }}>
                <Card
                    className="rounded-xl shadow-sm mb-4"
                    style={{
                        backgroundColor: colors.surface,
                    }}
                >
                    <Card.Content className="p-4">
                        <View className="h-6 bg-gray-200 rounded-md w-1/3 mb-4" />

                        {/* Bank */}
                        <View className="mb-4">
                            <View className="h-4 bg-gray-200 rounded-md w-1/4 mb-2" />
                            <View className="h-12 bg-gray-200 rounded-xl w-full" />
                        </View>

                        {/* Tipe & DP */}
                        <View className="mb-4 flex-row space-x-2">
                            <View className="flex-1 mr-2">
                                <View className="h-4 bg-gray-200 rounded-md w-1/3 mb-2" />
                                <View className="h-12 bg-gray-200 rounded-xl w-full" />
                            </View>
                            <View className="flex-1 ml-2 justify-center">
                                <View className="h-12 bg-gray-200 rounded-xl w-full mt-6" />
                            </View>
                        </View>

                        {/* Tanggal */}
                        <View className="mb-4">
                            <View className="h-4 bg-gray-200 rounded-md w-1/4 mb-2" />
                            <View className="h-12 bg-gray-200 rounded-xl w-full" />
                        </View>

                        {/* Total Amount */}
                        <View className="mb-4">
                            <View className="h-4 bg-gray-200 rounded-md w-1/4 mb-2" />
                            <View className="h-12 bg-gray-200 rounded-xl w-full" />
                        </View>

                        {/* Keterangan */}
                        <View className="mb-2">
                            <View className="h-4 bg-gray-200 rounded-md w-1/3 mb-2" />
                            <View className="h-24 bg-gray-200 rounded-xl w-full" />
                        </View>

                        {/* Details Section (Full card table) */}
                        <View className="mt-2 border-t border-gray-100 pt-2 -mx-4">
                            <View className="bg-white">
                                <View className="flex-row justify-between items-center p-4 bg-white border-b border-gray-100">
                                    <View className="h-5 bg-gray-200 rounded-md w-1/4" />
                                    <View className="h-8 bg-gray-200 rounded-lg w-20" />
                                </View>

                                {/* Table Header */}
                                <View className="flex-row bg-gray-50 py-3 px-4 border-y border-gray-200">
                                    <View className="flex-1">
                                        <View className="h-4 bg-gray-200 rounded-md w-1/3" />
                                    </View>
                                    <View className="w-[35%] items-end">
                                        <View className="h-4 bg-gray-200 rounded-md w-1/2" />
                                    </View>
                                </View>

                                {/* Table Body */}
                                {[1, 2].map((item, index) => (
                                    <View key={item} className={`flex-row py-3 px-4 items-center border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                                        <View className="flex-1 mr-2">
                                            <View className="h-4 bg-gray-200 rounded-md w-3/4" />
                                        </View>
                                        <View className="w-[35%] items-end">
                                            <View className="h-4 bg-gray-200 rounded-md w-2/3" />
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </Card.Content>
                </Card>
            </Animated.View>
        </View>
    );
};
