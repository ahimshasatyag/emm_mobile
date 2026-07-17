import React from 'react';
import { View } from 'react-native';

export const PaymentListSkeleton = () => {
    return (
        <View className="flex-1">
            {[1, 2, 3, 4, 5].map((item) => (
                <View key={item} className="bg-white rounded-xl p-4 mb-3 border border-gray-100 shadow-sm">
                    <View className="flex-row justify-between items-start mb-2">
                        <View className="space-y-2">
                            <View className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                            <View className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                        </View>
                        <View className="h-6 w-16 bg-gray-200 rounded-md animate-pulse" />
                    </View>
                    <View className="border-t border-gray-50 pt-3 mt-1 flex-row justify-between items-center">
                        <View className="space-y-2">
                            <View className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                            <View className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
                        </View>
                        <View className="items-end space-y-2">
                            <View className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                            <View className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
                        </View>
                    </View>
                </View>
            ))}
        </View>
    );
};
