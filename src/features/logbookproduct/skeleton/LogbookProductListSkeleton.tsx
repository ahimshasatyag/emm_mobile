import React from 'react';
import { View } from 'react-native';

export function LogbookProductListSkeleton() {
    return (
        <View className="flex-1 bg-gray-50 p-4">
            <View className="space-y-3">
                {[1, 2, 3, 4, 5].map((item) => (
                    <View key={item} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-3">
                        <View className="flex-row justify-between items-start mb-2">
                            <View className="flex-1 mr-3">
                                <View className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-1" />
                                <View className="h-3 w-1/2 bg-gray-200 rounded animate-pulse" />
                            </View>
                        </View>
                        <View className="h-px bg-gray-100 my-2" />
                        <View className="flex-row justify-between items-end">
                            <View className="flex-1">
                                <View className="h-3 w-16 bg-gray-200 rounded animate-pulse mb-1" />
                                <View className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                            </View>
                            <View className="flex-1 items-end">
                                <View className="h-3 w-16 bg-gray-200 rounded animate-pulse mb-1" />
                                <View className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                            </View>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
}
