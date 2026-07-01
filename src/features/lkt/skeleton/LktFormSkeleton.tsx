import React from 'react';
import { View } from 'react-native';

export function LktFormSkeleton() {
    return (
        <View className="flex-1 bg-gray-50 p-4 space-y-4 mt-6">
            {/* Header / Info Skeleton */}
            <View className="bg-white p-4 rounded-xl border border-gray-200">
                <View className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-3" />
                <View className="h-4 w-1/2 bg-gray-200 rounded animate-pulse mb-2" />
                <View className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
            </View>

            {/* Form Fields Skeleton */}
            <View className="bg-white p-4 rounded-xl border border-gray-200 space-y-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <View key={i}>
                        <View className="h-4 w-1/3 bg-gray-200 rounded animate-pulse mb-2" />
                        <View className="h-12 w-full bg-gray-200 rounded-lg animate-pulse" />
                    </View>
                ))}
            </View>

            {/* Button Skeleton */}
            <View className="flex-row space-x-2 pt-4">
                <View className="flex-1 h-12 bg-gray-200 rounded-xl animate-pulse" />
                <View className="flex-1 h-12 bg-gray-200 rounded-xl animate-pulse" />
            </View>
        </View>
    );
}
