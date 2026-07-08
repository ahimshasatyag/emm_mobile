import React from 'react';
import { View } from 'react-native';

export function PurchaseRequisitionListPRSkeleton() {
    return (
        <View className="flex-1 bg-gray-50 animate-pulse">
            <View className="flex-1 pb-24">
                {/* List Items Skeleton */}
                <View className="px-4">
                    {[1, 2, 3, 4, 5].map((item) => (
                        <View 
                            key={item} 
                            className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex-row mb-3"
                        >
                            {/* Checkbox Skeleton */}
                            <View className="w-12 items-center justify-center bg-gray-50 border-r border-gray-100">
                                <View className="w-6 h-6 rounded bg-gray-200" />
                            </View>
                            
                            {/* Card Content Skeleton */}
                            <View className="flex-1 p-3">
                                <View className="flex-row justify-between items-start mb-2">
                                    <View className="flex-1">
                                        <View className="h-3 w-24 bg-gray-200 rounded mb-2" />
                                        <View className="h-4 w-48 bg-gray-200 rounded" />
                                    </View>
                                </View>
                                <View className="flex-row mt-2 items-center">
                                    <View className="flex-1">
                                        <View className="h-3 w-16 bg-gray-200 rounded mb-1.5" />
                                        <View className="h-3 w-20 bg-gray-200 rounded" />
                                    </View>
                                    <View className="flex-1 items-center">
                                        <View className="h-3 w-12 bg-gray-200 rounded mb-1.5" />
                                        <View className="h-3 w-6 bg-gray-200 rounded" />
                                    </View>
                                    <View className="flex-1 items-end">
                                        <View className="h-3 w-12 bg-gray-200 rounded mb-1.5" />
                                        <View className="h-6 w-16 bg-gray-200 rounded" />
                                    </View>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
}
