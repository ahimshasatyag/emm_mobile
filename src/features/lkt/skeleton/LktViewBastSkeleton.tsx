import React from 'react';
import { View, ScrollView } from 'react-native';
import Animated, { useAnimatedStyle, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

export function LktViewBastSkeleton() {
    const animatedStyle = useAnimatedStyle(() => ({
        opacity: withRepeat(
            withSequence(
                withTiming(0.5, { duration: 800 }),
                withTiming(1, { duration: 800 })
            ),
            -1,
            true
        ),
    }));

    return (
        <ScrollView className="flex-1" contentContainerStyle={{ padding: 12, paddingBottom: 100 }}>
            <Animated.View 
                style={[animatedStyle, {
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.05,
                    shadowRadius: 4,
                    elevation: 2,
                }]} 
                className="bg-white rounded-xl border border-gray-200 p-5"
            >
                <View className="mb-6 flex-row gap-2">
                    <View className="bg-emerald-100 rounded-lg h-[34px] w-[80px]" />
                </View>

                <View className="flex-col md:flex-row gap-4">
                    <View className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-200">
                        {/* No BAST */}
                        <View className="mb-4 flex-row items-center">
                            <View className="w-[100px]">
                                <View className="h-3 bg-gray-200 rounded w-16" />
                            </View>
                            <View className="w-2 mx-2" />
                            <View className="flex-1">
                                <View className="h-[46px] bg-white border border-gray-200 rounded-lg" />
                            </View>
                        </View>

                        {/* Tanggal BAST */}
                        <View className="flex-row items-center">
                            <View className="w-[100px]">
                                <View className="h-3 bg-gray-200 rounded w-20" />
                            </View>
                            <View className="w-2 mx-2" />
                            <View className="flex-1">
                                <View className="h-[42px] bg-white border border-gray-200 rounded-lg" />
                            </View>
                        </View>
                    </View>

                    <View className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-200 mt-4 md:mt-0">
                        {/* Nama Perusahaan */}
                        <View className="mb-4 flex-row">
                            <View className="w-[120px] mt-1">
                                <View className="h-3 bg-gray-200 rounded w-24" />
                            </View>
                            <View className="w-2 mx-2" />
                            <View className="flex-1">
                                <View className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                                <View className="h-3 bg-gray-200 rounded w-full" />
                            </View>
                        </View>

                        {/* Produk */}
                        <View className="flex-row">
                            <View className="w-[120px] mt-1">
                                <View className="h-3 bg-gray-200 rounded w-16" />
                            </View>
                            <View className="w-2 mx-2" />
                            <View className="flex-1">
                                <View className="h-4 bg-gray-200 rounded w-5/6" />
                            </View>
                        </View>
                    </View>
                </View>
            </Animated.View>
        </ScrollView>
    );
}
