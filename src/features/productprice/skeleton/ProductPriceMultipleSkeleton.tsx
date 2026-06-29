import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export function ProductPriceMultipleSkeleton() {
    const COL_WIDTH = {
        no: 40,
        name: 220,
        priceUpdate: 140,
        priceAgent: 140,
        kurs: 120,
        estimation: 140,
        delivery: 140
    };

    return (
        <Animated.View entering={FadeIn} exiting={FadeOut}>
            <View className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-6">
                <View className="mb-4">
                    <View className="w-48 h-6 bg-gray-200 rounded animate-pulse" />
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="border border-gray-200 rounded-2xl bg-white" contentContainerStyle={{ flexGrow: 1 }}>
                <View>
                    {/* Table Header */}
                    <View className="flex-row border-b border-gray-200 bg-gray-50 p-4 rounded-t-2xl">
                        <View className="border-r border-gray-200" style={{ width: COL_WIDTH.no, paddingRight: 8 }}><Text className="font-bold text-gray-700 text-xs pl-2 text-center">No</Text></View>
                        <View className="border-r border-gray-200" style={{ width: COL_WIDTH.name, paddingHorizontal: 8 }}><Text className="font-bold text-gray-700 text-xs pl-2">Product Name</Text></View>
                        <View className="border-r border-gray-200" style={{ width: COL_WIDTH.priceUpdate, paddingHorizontal: 8 }}><Text className="font-bold text-gray-700 text-xs pl-2">Price Update</Text></View>
                        <View className="border-r border-gray-200" style={{ width: COL_WIDTH.priceAgent, paddingHorizontal: 8 }}><Text className="font-bold text-gray-700 text-xs pl-2">Price Agent</Text></View>
                        <View className="border-r border-gray-200" style={{ width: COL_WIDTH.kurs, paddingHorizontal: 8 }}><Text className="font-bold text-gray-700 text-xs pl-2">Kurs</Text></View>
                        <View className="border-r border-gray-200" style={{ width: COL_WIDTH.estimation, paddingHorizontal: 8 }}><Text className="font-bold text-gray-700 text-xs pl-2">Estimation IDR</Text></View>
                        <View style={{ width: COL_WIDTH.delivery, paddingHorizontal: 8 }}><Text className="font-bold text-gray-700 text-xs pl-2">Delivery Term</Text></View>
                    </View>
                    
                    {/* Table Body (Skeleton Rows) */}
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <View key={item} className="flex-row border-b border-gray-100 p-4 items-center bg-white">
                            <View className="border-r border-gray-200 items-center justify-center" style={{ width: COL_WIDTH.no, paddingRight: 8 }}>
                                <View className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                            </View>
                            <View className="border-r border-gray-200 justify-center" style={{ width: COL_WIDTH.name, paddingHorizontal: 8 }}>
                                <View className="w-full h-4 bg-gray-200 rounded animate-pulse mb-2" />
                                <View className="w-3/4 h-3 bg-gray-200 rounded animate-pulse" />
                            </View>
                            <View className="border-r border-gray-200 justify-center" style={{ width: COL_WIDTH.priceUpdate, paddingHorizontal: 8 }}>
                                <View className="w-full h-10 bg-gray-100 rounded-lg animate-pulse" />
                            </View>
                            <View className="border-r border-gray-200 justify-center" style={{ width: COL_WIDTH.priceAgent, paddingHorizontal: 8 }}>
                                <View className="w-full h-10 bg-gray-100 rounded-lg animate-pulse" />
                            </View>
                            <View className="border-r border-gray-200 justify-center" style={{ width: COL_WIDTH.kurs, paddingHorizontal: 8 }}>
                                <View className="w-full h-10 bg-gray-100 rounded-lg animate-pulse" />
                            </View>
                            <View className="border-r border-gray-200 justify-center" style={{ width: COL_WIDTH.estimation, paddingHorizontal: 8 }}>
                                <View className="w-full h-10 bg-emerald-50 rounded-lg animate-pulse" />
                            </View>
                            <View className="justify-center" style={{ width: COL_WIDTH.delivery, paddingHorizontal: 8 }}>
                                <View className="w-full h-10 bg-gray-100 rounded-lg animate-pulse" />
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    </Animated.View>
    );
}
