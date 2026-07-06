import React from 'react';
import { View } from 'react-native';

export function SalesContractFormSkeleton() {
    return (
        <View className="flex-1">
            {/* Informasi SO */}
            <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
                <View className="w-32 h-5 bg-gray-200 rounded mb-4 animate-pulse" />
                <View className="mb-3">
                    <View className="w-20 h-3 bg-gray-200 rounded mb-2 animate-pulse" />
                    <View className="w-full h-10 bg-gray-200 rounded-lg animate-pulse" />
                </View>
                <View className="mb-3">
                    <View className="w-24 h-3 bg-gray-200 rounded mb-2 animate-pulse" />
                    <View className="w-full h-10 bg-gray-200 rounded-lg animate-pulse" />
                </View>
            </View>

            {/* Data Customer */}
            <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
                <View className="w-32 h-5 bg-gray-200 rounded mb-4 animate-pulse" />
                {[1, 2, 3].map((i) => (
                    <View key={i} className="mb-3">
                        <View className="w-24 h-3 bg-gray-200 rounded mb-2 animate-pulse" />
                        <View className="w-full h-10 bg-gray-200 rounded-lg animate-pulse" />
                    </View>
                ))}
            </View>

            {/* Kalkulasi */}
            <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
                <View className="w-24 h-5 bg-gray-200 rounded mb-4 animate-pulse" />
                {[1, 2, 3].map((i) => (
                    <View key={i} className="mb-3">
                        <View className="w-24 h-3 bg-gray-200 rounded mb-2 animate-pulse" />
                        <View className="w-full h-10 bg-gray-200 rounded-lg animate-pulse" />
                    </View>
                ))}
            </View>

            {/* Daftar Barang */}
            <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8">
                <View className="w-32 h-5 bg-gray-200 rounded mb-4 animate-pulse" />
                <View className="mb-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <View className="w-48 h-4 bg-gray-200 rounded mb-3 animate-pulse" />
                    <View className="flex-row justify-between">
                        <View>
                            <View className="w-16 h-3 bg-gray-200 rounded mb-2 animate-pulse" />
                            <View className="w-24 h-3 bg-gray-200 rounded animate-pulse" />
                        </View>
                        <View className="items-end">
                            <View className="w-16 h-3 bg-gray-200 rounded mb-2 animate-pulse" />
                            <View className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}
