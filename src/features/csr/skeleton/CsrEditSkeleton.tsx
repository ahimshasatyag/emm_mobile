import React from 'react';
import { View, ScrollView } from 'react-native';

export function CsrEditSkeleton() {
    return (
        <ScrollView className="flex-1 px-4 pt-4 mb-10" showsVerticalScrollIndicator={false}>
            <View className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
                {/* Header Status */}
                <View className="flex-row justify-between items-center border-b border-gray-100 pb-4 mb-4">
                    <View>
                        <View className="h-3 w-20 bg-gray-200 rounded mb-2 animate-pulse" />
                        <View className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                    </View>
                    <View className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
                </View>

                {/* SECTION: Customer */}
                <View className="h-6 w-32 bg-gray-200 rounded mb-4 animate-pulse border-b border-gray-100 pb-2" />

                <View className="mb-4">
                    <View className="h-4 w-28 bg-gray-200 rounded mb-2 animate-pulse" />
                    <View className="h-12 w-full bg-gray-200 rounded-xl animate-pulse" />
                </View>

                <View className="mb-4">
                    <View className="h-4 w-24 bg-gray-200 rounded mb-2 animate-pulse" />
                    <View className="h-12 w-full bg-gray-200 rounded-xl animate-pulse" />
                </View>

                <View className="mb-4 flex-row justify-between">
                    <View className="flex-1 mr-2">
                        <View className="h-4 w-24 bg-gray-200 rounded mb-2 animate-pulse" />
                        <View className="h-12 w-full bg-gray-200 rounded-xl animate-pulse" />
                    </View>
                    <View className="flex-1 ml-2">
                        <View className="h-4 w-24 bg-gray-200 rounded mb-2 animate-pulse" />
                        <View className="h-12 w-full bg-gray-200 rounded-xl animate-pulse" />
                    </View>
                </View>

                <View className="mb-4">
                    <View className="h-4 w-16 bg-gray-200 rounded mb-2 animate-pulse" />
                    <View className="flex-row items-center mt-1">
                        <View className="w-5 h-5 rounded-full bg-gray-200 mr-2 animate-pulse" />
                        <View className="h-4 w-20 bg-gray-200 rounded mr-8 animate-pulse" />
                        <View className="w-5 h-5 rounded-full bg-gray-200 mr-2 animate-pulse" />
                        <View className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                    </View>
                </View>

                <View className="mb-4">
                    <View className="h-4 w-32 bg-gray-200 rounded mb-2 animate-pulse" />
                    <View className="flex-row items-center mt-1">
                        <View className="w-5 h-5 rounded-full bg-gray-200 mr-2 animate-pulse" />
                        <View className="h-4 w-20 bg-gray-200 rounded mr-8 animate-pulse" />
                        <View className="w-5 h-5 rounded-full bg-gray-200 mr-2 animate-pulse" />
                        <View className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                    </View>
                </View>

                {/* SECTION: Laporan Kerusakan */}
                <View className="h-6 w-40 bg-gray-200 rounded mt-6 mb-4 animate-pulse border-b border-gray-100 pb-2" />
                <View className="mb-4">
                    <View className="h-4 w-32 bg-gray-200 rounded mb-2 mt-2 animate-pulse" />
                    <View className="h-32 w-full bg-gray-200 rounded-xl animate-pulse" />
                </View>
                <View className="mb-4">
                    <View className="h-4 w-16 bg-gray-200 rounded mb-2 animate-pulse" />
                    <View className="w-24 h-24 bg-gray-200 rounded-xl animate-pulse" />
                </View>

                {/* SECTION: Product To Service */}
                <View className="h-6 w-40 bg-gray-200 rounded mt-6 mb-4 animate-pulse border-b border-gray-100 pb-2" />

                {/* Info Box */}
                <View className="bg-blue-50 p-4 rounded-xl mb-4 space-y-3 border border-blue-100">
                    <View className="space-y-2 border-b border-blue-200 pb-3 mb-1">
                        {[1, 2, 3, 4].map(i => (
                            <View key={i} className="flex-row justify-between mb-2">
                                <View className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                                <View className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
                            </View>
                        ))}
                    </View>
                    <View className="space-y-2">
                        {[1, 2, 3].map(i => (
                            <View key={i} className="flex-row justify-between mb-2">
                                <View className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                                <View className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}
