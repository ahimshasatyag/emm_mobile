import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ScrollView, View, RefreshControl, Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing, FadeIn, FadeOut } from 'react-native-reanimated';
import { theme } from '../../../theme/theme';
import { HomeHeader } from '../components/HomeHeader';
import { DashboardSkeleton } from '../skeleton/DashboardSkeleton';

export function Home3Screen() {
    const [isLoading, setIsLoading] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);

    const handleRefresh = useCallback(async () => {
        setIsLoading(true);
        try {
            // Mock refresh delay
            await new Promise(resolve => setTimeout(resolve, 800));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const initialize = async () => {
                setIsInitializing(true);
                try {
                    await handleRefresh();
                } finally {
                    if (isActive) {
                        setIsInitializing(false);
                    }
                }
            };

            initialize();

            return () => {
                isActive = false;
                setIsInitializing(true);
            };
        }, [handleRefresh])
    );

    // Animation Values for the entire screen
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(30);

    useEffect(() => {
        opacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.exp) });
        translateY.value = withTiming(0, { duration: 600, easing: Easing.out(Easing.exp) });
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: translateY.value }],
    }));

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <HomeHeader isLoading={isLoading} />

            <ScrollView
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} colors={[theme.colors.primary]} />
                }
            >
                <Animated.View style={animatedStyle}>
                    {(isLoading || isInitializing) ? (
                        <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>
                            <DashboardSkeleton />
                        </Animated.View>
                    ) : (
                        <Animated.View key="content" entering={FadeIn.duration(600)} style={{ padding: 16 }}>
                            {/* AR Report Section from 3.php */}
                            <View className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100">
                                <Text className="text-lg font-bold text-center mb-4 text-gray-800">AR REPORT</Text>
                                <View className="bg-gray-50 p-4 rounded-lg items-center justify-center min-h-[120px]">
                                    <Text className="text-gray-500 text-center">Tabel AR Report (Search by Date Range)</Text>
                                </View>
                            </View>

                            {/* Summary Cards from 3.php */}
                            <View className="flex-row justify-between mb-4">
                                <View className="bg-white rounded-xl p-4 flex-1 mr-2 shadow-sm border border-gray-100 items-center">
                                    <Text className="text-xs text-gray-500 uppercase font-bold mb-1">CSR</Text>
                                    <Text className="text-2xl font-bold text-gray-800">0</Text>
                                </View>
                                <View className="bg-white rounded-xl p-4 flex-1 mx-1 shadow-sm border border-gray-100 items-center">
                                    <Text className="text-xs text-gray-500 uppercase font-bold mb-1">CST</Text>
                                    <Text className="text-2xl font-bold text-gray-800">0</Text>
                                </View>
                                <View className="bg-white rounded-xl p-4 flex-1 ml-2 shadow-sm border border-gray-100 items-center">
                                    <Text className="text-xs text-gray-500 uppercase font-bold mb-1">LKT</Text>
                                    <Text className="text-2xl font-bold text-gray-800">0</Text>
                                </View>
                            </View>

                            {/* Teknisi Tanpa Jadwal from 3.php */}
                            <View className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100">
                                <Text className="text-md font-bold mb-3 text-gray-800">Teknisi Yang Tidak Ada Jadwal Kerja</Text>
                                <View className="bg-gray-50 p-4 rounded-lg items-center justify-center min-h-[100px]">
                                    <Text className="text-gray-500 text-center">Data Teknisi Kosong</Text>
                                </View>
                            </View>

                            {/* Jadwal LKT from 3.php */}
                            <View className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100">
                                <Text className="text-md font-bold mb-3 text-gray-800">Jadwal LKT Hari Ini</Text>
                                <View className="bg-gray-50 p-4 rounded-lg items-center justify-center min-h-[100px]">
                                    <Text className="text-gray-500 text-center">Data LKT Hari Ini</Text>
                                </View>
                            </View>
                        </Animated.View>
                    )}
                </Animated.View>
            </ScrollView>
        </View>
    );
}
