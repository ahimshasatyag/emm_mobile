import React from 'react';
import { View } from 'react-native';

export function ProductFormSkeleton() {
    return (
        <View className="flex-1">
            <View className="mb-6 flex-row">
                <View className="w-24 h-24 bg-gray-200 rounded-xl mr-4 animate-pulse" />
                <View className="flex-1 justify-center">
                    <View className="h-4 w-32 bg-gray-200 rounded mb-2 animate-pulse" />
                    <View className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                </View>
            </View>

            {[1, 2, 3, 4].map((item) => (
                <View key={item} className="mb-4">
                    <View className="h-4 w-24 bg-gray-200 rounded mb-2 animate-pulse" />
                    <View className="h-12 w-full bg-gray-200 rounded-xl animate-pulse" />
                </View>
            ))}
            
            <View className="mb-4 flex-row gap-4">
                <View className="flex-1">
                    <View className="h-4 w-24 bg-gray-200 rounded mb-2 animate-pulse" />
                    <View className="h-12 w-full bg-gray-200 rounded-xl animate-pulse" />
                </View>
                <View className="flex-1">
                    <View className="h-4 w-24 bg-gray-200 rounded mb-2 animate-pulse" />
                    <View className="h-12 w-full bg-gray-200 rounded-xl animate-pulse" />
                </View>
            </View>
            
            <View className="mb-4">
                <View className="h-4 w-24 bg-gray-200 rounded mb-2 animate-pulse" />
                <View className="h-24 w-full bg-gray-200 rounded-xl animate-pulse" />
            </View>
        </View>
    );
}
