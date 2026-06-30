import React from 'react';
import { View } from 'react-native';

export function CstEditSkeleton() {
    return (
        <View className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            {/* Action Buttons Skeleton */}
            <View className="flex-row items-center mb-2 space-x-2">
                <View className="h-8 w-20 bg-gray-200 rounded-lg animate-pulse" />
            </View>

            {/* Header Status Skeleton */}
            <View className="mb-2">
                <View className="h-6 w-48 bg-gray-200 rounded mb-2 animate-pulse" />
                <View className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
            </View>

            {/* SECTION: Customer Skeleton */}
            <View className="mt-2">
                <View className="h-5 w-24 bg-gray-200 rounded mb-4 animate-pulse border-b border-gray-100 pb-2" />
                <View className="space-y-3">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <View key={item} className="flex-row">
                            <View className="h-3 w-1/3 bg-gray-200 rounded animate-pulse mr-4" />
                            <View className="h-3 flex-1 bg-gray-200 rounded animate-pulse" />
                        </View>
                    ))}
                </View>
            </View>

            {/* SECTION: Laporan Kerusakan Skeleton */}
            <View className="mt-6">
                <View className="h-5 w-40 bg-gray-200 rounded mb-4 animate-pulse border-b border-gray-100 pb-2" />
                <View className="space-y-4">
                    <View>
                        <View className="h-3 w-32 bg-gray-200 rounded mb-2 animate-pulse" />
                        <View className="h-16 w-full bg-gray-100 rounded-lg border border-gray-100 animate-pulse" />
                    </View>
                    <View>
                        <View className="h-3 w-16 bg-gray-200 rounded mb-2 animate-pulse" />
                        <View className="h-32 w-full bg-gray-100 rounded-lg border border-gray-200 animate-pulse" />
                    </View>
                </View>
            </View>

            {/* SECTION: Product To Service Skeleton */}
            <View className="mt-6">
                <View className="h-5 w-36 bg-gray-200 rounded mb-4 animate-pulse border-b border-gray-100 pb-2" />
                <View className="space-y-3">
                    {[1, 2, 3, 4, 5, 6, 7].map((item) => (
                        <View key={item} className="flex-row">
                            <View className="h-3 w-1/3 bg-gray-200 rounded animate-pulse mr-4" />
                            <View className="h-3 flex-1 bg-gray-200 rounded animate-pulse" />
                        </View>
                    ))}
                </View>
            </View>

            {/* SECTION: Tabs Skeleton */}
            <View className="flex-row space-x-2 mt-6">
                <View className="flex-1 h-12 bg-gray-200 rounded-lg animate-pulse" />
                <View className="flex-1 h-12 bg-gray-200 rounded-lg animate-pulse" />
            </View>

            {/* Tab Content Skeleton */}
            <View className="bg-gray-100 min-h-[150px] rounded-xl border border-gray-100 mt-2 animate-pulse" />
        </View>
    );
}
