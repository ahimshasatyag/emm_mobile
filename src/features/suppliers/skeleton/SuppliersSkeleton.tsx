import React from 'react';
import { View } from 'react-native';

export function SuppliersSkeleton() {
    return (
        <View className="flex-1 bg-gray-50 animate-pulse">
            <View className="flex-1 pb-24">
                <View className="px-4">
                    {[1, 2, 3, 4, 5].map((item) => (
                        <View
                            key={item}
                            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-3"
                        >
                            <View className="flex-row justify-between items-start mb-3">
                                <View className="flex-1">
                                    <View className="bg-gray-200 h-4 w-32 rounded mb-2" />
                                    <View className="bg-gray-100 h-3 w-48 rounded" />
                                </View>
                                <View className="bg-gray-200 h-5 w-16 rounded-full" />
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
}
