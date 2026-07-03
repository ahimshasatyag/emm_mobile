import React from 'react';
import { View } from 'react-native';

export function SOEditSkeleton() {
    return (
        <View className="flex-1 space-y-4">

            {/* Main Content Skeleton */}
            <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                {/* Informasi Umum */}
                <View className="h-4 w-32 bg-gray-200 rounded mb-6 animate-pulse" />
                {[1, 2, 3, 4, 5, 6].map((item) => (
                    <View key={`umum-${item}`} className="mb-4">
                        <View className="h-4 w-24 bg-gray-200 rounded mb-2 animate-pulse" />
                        <View className="h-11 w-full bg-gray-200 rounded-lg animate-pulse" />
                    </View>
                ))}

                {/* Opsi Biaya */}
                <View className="h-4 w-32 bg-gray-200 rounded mb-6 mt-4 animate-pulse" />
                {[1, 2, 3].map((item) => (
                    <View key={`biaya-${item}`} className="mb-4">
                        <View className="h-4 w-24 bg-gray-200 rounded mb-2 animate-pulse" />
                        <View className="flex-row flex-wrap gap-2">
                            <View className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse" />
                            <View className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse" />
                            <View className="h-10 w-40 bg-gray-200 rounded-lg animate-pulse" />
                        </View>
                    </View>
                ))}

                {/* Informasi Pembayaran */}
                <View className="h-4 w-32 bg-gray-200 rounded mb-6 mt-4 animate-pulse" />
                {[1, 2, 3, 4].map((item) => (
                    <View key={`bayar-${item}`} className="mb-4">
                        <View className="h-4 w-24 bg-gray-200 rounded mb-2 animate-pulse" />
                        <View className="h-11 w-full bg-gray-200 rounded-lg animate-pulse" />
                    </View>
                ))}

                {/* Informasi Tambahan */}
                <View className="h-4 w-32 bg-gray-200 rounded mb-6 mt-4 animate-pulse" />
                {[1, 2, 3, 4, 5].map((item) => (
                    <View key={`tambahan-${item}`} className="mb-4">
                        <View className="h-4 w-24 bg-gray-200 rounded mb-2 animate-pulse" />
                        <View className="h-11 w-full bg-gray-200 rounded-lg animate-pulse" />
                    </View>
                ))}

                {/* Items Table */}
                <View className="h-10 w-full bg-gray-200 rounded-t-xl animate-pulse mt-4" />
                <View className="h-16 w-full bg-gray-100 border-t border-white rounded-b-xl animate-pulse" />
            </View>

            {/* Extend Garansi Table Skeleton */}
            <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mt-4">
                <View className="h-4 w-32 bg-gray-200 rounded mb-4 animate-pulse" />
                <View className="h-10 w-full bg-gray-200 rounded-t-xl animate-pulse" />
                <View className="h-12 w-full bg-gray-100 border-t border-white rounded-b-xl animate-pulse" />
            </View>
        </View>
    );
}
