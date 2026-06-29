import React from 'react';
import { View } from 'react-native';

export function ProductPriceReqFormSkeleton() {
    return (
        <View className="p-4">
            <View className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm mb-4">
                <View className="h-4 bg-gray-200 rounded-md w-1/3 mb-4" />
                <View className="h-12 bg-gray-200 rounded-xl w-full mb-6" />

            </View>
        </View>
    );
}
