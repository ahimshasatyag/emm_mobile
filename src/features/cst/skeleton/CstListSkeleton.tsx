import React from 'react';
import { View } from 'react-native';

export function CstListSkeleton() {
    return (
        <View className="flex-1">
            {[1, 2, 3, 4, 5].map((item) => (
                <View key={item} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-3">
                    <View className="flex-row justify-between mb-3">
                        <View className="flex-1">
                            <View className="h-4 w-32 bg-gray-200 rounded mb-2 animate-pulse" />
                            <View className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                        </View>
                        <View className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
                    </View>
                    <View className="h-px bg-gray-100 my-2" />
                    <View className="flex-row justify-between">
                        <View className="flex-1">
                            <View className="h-3 w-16 bg-gray-200 rounded mb-1 animate-pulse" />
                            <View className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
                        </View>
                        <View className="flex-1">
                            <View className="h-3 w-16 bg-gray-200 rounded mb-1 animate-pulse" />
                            <View className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
                        </View>
                    </View>
                </View>
            ))}
        </View>
    );
}
