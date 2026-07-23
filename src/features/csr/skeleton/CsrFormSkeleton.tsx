import React from 'react';
import { View } from 'react-native';

export function CsrFormSkeleton() {
    return (
        <View className="flex-1">
            {/* SECTION: Product To Service Skeleton (Combined) */}
            <View className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-4">
                <View className="h-6 w-40 bg-gray-200 rounded mb-4 animate-pulse border-b border-gray-100 pb-2" />
                <View>
                    {/* Product Fields */}
                    <View className="mb-4">
                        <View className="h-4 w-24 bg-gray-200 rounded mb-2 animate-pulse" />
                        <View className="h-12 w-full bg-gray-200 rounded-xl animate-pulse" />
                    </View>
                    <View className="mb-4">
                        <View className="h-4 w-32 bg-gray-200 rounded mb-2 animate-pulse" />
                        <View className="h-12 w-full bg-gray-200 rounded-xl animate-pulse" />
                    </View>
                    <View className="mb-4">
                        <View className="h-4 w-28 bg-gray-200 rounded mb-2 animate-pulse" />
                        <View className="h-12 w-full bg-gray-200 rounded-xl animate-pulse" />
                    </View>
                    <View className="mb-4 flex-row">
                        <View className="flex-1 mr-2">
                            <View className="h-4 w-20 bg-gray-200 rounded mb-2 animate-pulse" />
                            <View className="h-12 w-full bg-gray-200 rounded-xl animate-pulse" />
                        </View>
                        <View className="flex-1 ml-2">
                            <View className="h-4 w-24 bg-gray-200 rounded mb-2 animate-pulse" />
                            <View className="h-12 w-full bg-gray-200 rounded-xl animate-pulse" />
                        </View>
                    </View>
                    <View className="mb-4 flex-row">
                        <View className="flex-1 mr-2">
                            <View className="h-4 w-24 bg-gray-200 rounded mb-2 animate-pulse" />
                            <View className="h-12 w-full bg-gray-200 rounded-xl animate-pulse" />
                        </View>
                        <View className="flex-1 ml-2">
                            <View className="h-4 w-24 bg-gray-200 rounded mb-2 animate-pulse" />
                            <View className="h-12 w-full bg-gray-200 rounded-xl animate-pulse" />
                        </View>
                    </View>

                    {/* Customer Fields */}
                    <View className="mb-4">
                        <View className="h-4 w-32 bg-gray-200 rounded mb-2 animate-pulse mt-4" />
                        <View className="h-12 w-full bg-gray-200 rounded-xl animate-pulse" />
                    </View>
                    <View className="mb-4">
                        <View className="h-4 w-24 bg-gray-200 rounded mb-2 animate-pulse" />
                        <View className="h-12 w-full bg-gray-200 rounded-xl animate-pulse" />
                    </View>
                    <View className="mb-4 flex-row">
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
                        <View className="h-12 w-full bg-gray-200 rounded-xl animate-pulse" />
                    </View>
                    <View className="mb-4">
                        <View className="h-4 w-32 bg-gray-200 rounded mb-2 animate-pulse" />
                        <View className="h-12 w-full bg-gray-200 rounded-xl animate-pulse" />
                    </View>

                    {/* Laporan Kerusakan Fields */}
                    <View className="mb-4">
                        <View className="h-4 w-32 bg-gray-200 rounded mb-2 animate-pulse mt-4" />
                        <View className="h-28 w-full bg-gray-200 rounded-xl animate-pulse" />
                    </View>
                    <View className="mb-4">
                        <View className="h-4 w-16 bg-gray-200 rounded mb-2 animate-pulse" />
                        <View className="h-24 w-24 bg-gray-200 rounded-xl animate-pulse" />
                    </View>
                </View>
            </View>
        </View>
    );
}
