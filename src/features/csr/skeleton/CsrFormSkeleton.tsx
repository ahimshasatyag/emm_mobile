import React from 'react';
import { View } from 'react-native';

export function CsrFormSkeleton() {
    return (
        <View className="flex-1">
            {/* SECTION: Customer Skeleton */}
            <View className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-4">
                <View className="h-5 w-24 bg-gray-200 rounded mb-4 animate-pulse border-b border-gray-100 pb-2" />
                <View className="space-y-3">
                    <View>
                        <View className="h-3 w-24 bg-gray-200 rounded mb-1 animate-pulse" />
                        <View className="h-10 w-full bg-gray-200 rounded-lg animate-pulse" />
                    </View>
                    <View>
                        <View className="h-3 w-24 bg-gray-200 rounded mb-1 animate-pulse" />
                        <View className="h-10 w-full bg-gray-200 rounded-lg animate-pulse" />
                    </View>
                    <View className="flex-row">
                        <View className="flex-1 mr-2">
                            <View className="h-3 w-20 bg-gray-200 rounded mb-1 animate-pulse" />
                            <View className="h-10 w-full bg-gray-200 rounded-lg animate-pulse" />
                        </View>
                        <View className="flex-1 ml-2">
                            <View className="h-3 w-20 bg-gray-200 rounded mb-1 animate-pulse" />
                            <View className="h-10 w-full bg-gray-200 rounded-lg animate-pulse" />
                        </View>
                    </View>
                </View>
            </View>

            {/* SECTION: Laporan Kerusakan Skeleton */}
            <View className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-4">
                <View className="h-5 w-32 bg-gray-200 rounded mb-4 animate-pulse border-b border-gray-100 pb-2" />
                <View className="space-y-3">
                    <View>
                        <View className="h-3 w-28 bg-gray-200 rounded mb-1 animate-pulse" />
                        <View className="h-24 w-full bg-gray-200 rounded-lg animate-pulse" />
                    </View>
                </View>
            </View>

            {/* SECTION: Product To Service Skeleton */}
            <View className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-4">
                <View className="h-5 w-36 bg-gray-200 rounded mb-4 animate-pulse border-b border-gray-100 pb-2" />
                <View className="space-y-3">
                    <View className="flex-row">
                        <View className="flex-1 mr-2">
                            <View className="h-3 w-24 bg-gray-200 rounded mb-1 animate-pulse" />
                            <View className="h-10 w-full bg-gray-200 rounded-lg animate-pulse" />
                        </View>
                        <View className="flex-1 ml-2">
                            <View className="h-3 w-24 bg-gray-200 rounded mb-1 animate-pulse" />
                            <View className="h-10 w-full bg-gray-200 rounded-lg animate-pulse" />
                        </View>
                    </View>
                    <View className="flex-row">
                        <View className="flex-1 mr-2">
                            <View className="h-3 w-24 bg-gray-200 rounded mb-1 animate-pulse" />
                            <View className="h-10 w-full bg-gray-200 rounded-lg animate-pulse" />
                        </View>
                        <View className="flex-1 ml-2">
                            <View className="h-3 w-24 bg-gray-200 rounded mb-1 animate-pulse" />
                            <View className="h-10 w-full bg-gray-200 rounded-lg animate-pulse" />
                        </View>
                    </View>
                    <View className="flex-row">
                        <View className="flex-1 mr-2">
                            <View className="h-3 w-24 bg-gray-200 rounded mb-1 animate-pulse" />
                            <View className="h-10 w-full bg-gray-200 rounded-lg animate-pulse" />
                        </View>
                        <View className="flex-1 ml-2">
                            <View className="h-3 w-24 bg-gray-200 rounded mb-1 animate-pulse" />
                            <View className="h-10 w-full bg-gray-200 rounded-lg animate-pulse" />
                        </View>
                    </View>
                    <View className="flex-row">
                        <View className="flex-1 mr-2">
                            <View className="h-3 w-24 bg-gray-200 rounded mb-1 animate-pulse" />
                            <View className="h-10 w-full bg-gray-200 rounded-lg animate-pulse" />
                        </View>
                        <View className="flex-1 ml-2">
                            <View className="h-3 w-24 bg-gray-200 rounded mb-1 animate-pulse" />
                            <View className="h-10 w-full bg-gray-200 rounded-lg animate-pulse" />
                        </View>
                    </View>
                    <View>
                        <View className="h-3 w-24 bg-gray-200 rounded mb-1 animate-pulse" />
                        <View className="h-10 w-full bg-gray-200 rounded-lg animate-pulse" />
                    </View>
                </View>
            </View>
        </View>
    );
}
