import React from 'react';
import { View } from 'react-native';

export const PaymentFormSkeleton = () => {
    return (
        <View className="p-4">

            {/* Form Card Skeleton */}
            <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">

                {/* Customer */}
                <View className="mb-4">
                    <View className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />
                    <View className="h-12 w-full bg-gray-200 rounded-xl animate-pulse" />
                </View>

                {/* Invoice */}
                <View className="mb-4">
                    <View className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-2" />
                    <View className="h-12 w-full bg-gray-200 rounded-xl animate-pulse" />
                </View>

                {/* Jumlah Invoice & Sisa Tagihan */}
                <View className="flex-row justify-between mb-4">
                    <View className="flex-1 mr-2">
                        <View className="h-4 w-28 bg-gray-200 rounded animate-pulse mb-2" />
                        <View className="h-12 w-full bg-gray-200 rounded-xl animate-pulse" />
                    </View>
                    <View className="flex-1 ml-2">
                        <View className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />
                        <View className="h-12 w-full bg-gray-200 rounded-xl animate-pulse" />
                    </View>
                </View>

                {/* Bank Tujuan */}
                <View className="mb-4">
                    <View className="h-4 w-28 bg-gray-200 rounded animate-pulse mb-2" />
                    <View className="h-12 w-full bg-gray-200 rounded-xl animate-pulse" />
                </View>

                <View className="h-px bg-gray-200 my-4" />

                {/* Riwayat Pembayaran Header */}
                <View className="flex-row justify-between items-center mb-4">
                    <View className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
                    <View className="h-8 w-20 bg-gray-200 rounded-lg animate-pulse" />
                </View>

                {/* Table Skeleton */}
                <View className="border border-gray-200 rounded-xl overflow-hidden">
                    {/* Table Header */}
                    <View className="flex-row bg-gray-100 p-3">
                        <View className="flex-1 h-4 bg-gray-300 rounded mx-1 animate-pulse" />
                        <View className="flex-1 h-4 bg-gray-300 rounded mx-1 animate-pulse" />
                        <View className="flex-1 h-4 bg-gray-300 rounded mx-1 animate-pulse" />
                        <View className="flex-1 h-4 bg-gray-300 rounded mx-1 animate-pulse" />
                    </View>
                    {/* Table Rows */}
                    {[1, 2].map((item) => (
                        <View key={item} className="flex-row p-4 border-b border-gray-100">
                            <View className="flex-1 h-3 bg-gray-200 rounded mx-1 animate-pulse" />
                            <View className="flex-1 h-3 bg-gray-200 rounded mx-1 animate-pulse" />
                            <View className="flex-1 h-3 bg-gray-200 rounded mx-1 animate-pulse" />
                            <View className="flex-1 h-3 bg-gray-200 rounded mx-1 animate-pulse" />
                        </View>
                    ))}
                    {/* Table Footer */}
                    <View className="flex-row justify-end p-3 bg-gray-50 border-t border-gray-200">
                        <View className="h-4 w-1/3 bg-gray-300 rounded animate-pulse" />
                    </View>
                </View>
            </View>

        </View>
    );
};
