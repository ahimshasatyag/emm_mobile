import React from 'react';
import { View } from 'react-native';

export function SalesReturEditSkeleton() {
    return (
        <View className="flex-1 bg-white rounded-t-3xl mt-2 p-6 shadow-sm border border-gray-100">
            <View className="mb-6">
                <View className="h-5 w-32 bg-gray-200 rounded-md animate-pulse mb-2" />
                <View className="h-12 w-full bg-gray-200 rounded-xl animate-pulse" />
            </View>
            <View className="mb-6">
                <View className="h-5 w-32 bg-gray-200 rounded-md animate-pulse mb-2" />
                <View className="h-12 w-full bg-gray-200 rounded-xl animate-pulse" />
            </View>
            <View className="mb-6">
                <View className="h-5 w-32 bg-gray-200 rounded-md animate-pulse mb-2" />
                <View className="h-12 w-full bg-gray-200 rounded-xl animate-pulse" />
            </View>
            
            <View className="h-[1px] w-full bg-gray-200 my-4" />

            <View className="mb-6 space-y-4">
                {[1, 2, 3].map(item => (
                    <View key={item} className="flex-row items-center border border-gray-100 p-3 rounded-lg">
                        <View className="h-6 w-6 bg-gray-200 rounded mr-3 animate-pulse" />
                        <View className="flex-1">
                            <View className="h-4 w-3/4 bg-gray-200 rounded mb-2 animate-pulse" />
                            <View className="h-3 w-1/2 bg-gray-200 rounded animate-pulse" />
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
}
