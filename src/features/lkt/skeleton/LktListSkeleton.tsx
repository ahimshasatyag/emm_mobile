import React from 'react';
import { View } from 'react-native';

export function LktListSkeleton() {
    return (
        <View className="flex-1 bg-gray-50">
            {/* List Skeleton */}
            <View className="space-y-3">
                {[1, 2, 3, 4, 5].map((item) => (
                    <View key={item} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-3">
                        {/* Header (lkt_code, cst_code, start_date vs status) */}
                        <View className="flex-row justify-between items-start mb-2">
                            <View className="flex-1 mr-3">
                                <View className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-1" />
                                <View className="h-3 w-1/2 bg-gray-200 rounded animate-pulse mb-1" />
                                <View className="h-3 w-2/3 bg-gray-200 rounded animate-pulse" />
                            </View>
                            <View className="h-5 w-16 bg-gray-200 rounded-md animate-pulse" />
                        </View>

                        <View className="h-px bg-gray-100 my-2" />

                        {/* Customer & Keterangan */}
                        <View className="flex-row justify-between items-end mb-2">
                            <View className="flex-1">
                                <View className="h-3 w-16 bg-gray-200 rounded animate-pulse mb-1" />
                                <View className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                            </View>
                            <View className="flex-1 items-end">
                                <View className="h-3 w-16 bg-gray-200 rounded animate-pulse mb-1" />
                                <View className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                            </View>
                        </View>

                        <View className="h-px bg-gray-100 my-2" />

                        {/* Grid Fields (4 rows of 2 columns) */}
                        <View className="flex-row flex-wrap">
                            <View className="w-1/2 mb-3">
                                <View className="h-3 w-16 bg-gray-200 rounded animate-pulse mb-1" />
                                <View className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                            </View>
                            <View className="w-1/2 mb-3 pl-2">
                                <View className="h-3 w-24 bg-gray-200 rounded animate-pulse mb-1" />
                                <View className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                            </View>
                            
                            <View className="w-1/2 mb-3">
                                <View className="h-3 w-20 bg-gray-200 rounded animate-pulse mb-1" />
                                <View className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                            </View>
                            <View className="w-1/2 mb-3 pl-2">
                                <View className="h-3 w-24 bg-gray-200 rounded animate-pulse mb-1" />
                                <View className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                            </View>

                            <View className="w-1/2 mb-3">
                                <View className="h-3 w-24 bg-gray-200 rounded animate-pulse mb-1" />
                                <View className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                            </View>
                            <View className="w-1/2 mb-3 pl-2">
                                <View className="h-3 w-20 bg-gray-200 rounded animate-pulse mb-1" />
                                <View className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                            </View>

                            <View className="w-1/2">
                                <View className="h-3 w-12 bg-gray-200 rounded animate-pulse mb-1" />
                                <View className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                            </View>
                            <View className="w-1/2 pl-2">
                                <View className="h-3 w-12 bg-gray-200 rounded animate-pulse mb-1" />
                                <View className="h-4 w-10 bg-gray-200 rounded animate-pulse" />
                            </View>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
}
