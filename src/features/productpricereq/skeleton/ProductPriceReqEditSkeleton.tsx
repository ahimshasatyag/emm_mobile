import React from 'react';
import { View } from 'react-native';

export function ProductPriceReqEditSkeleton() {
    return (
        <View>
            <View
                className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-4"
                style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }}
            >
                {/* Status Section */}
                <View className="flex-row justify-end items-center mb-6 pb-4 border-b border-gray-100">
                    <View className="h-4 bg-gray-200 rounded-md w-20" />
                </View>

                {/* Product Field */}
                <View className="mb-4">
                    <View className="h-4 bg-gray-200 rounded-md w-24 mb-2" />
                    <View className="h-12 bg-gray-200 rounded-xl w-full" />
                </View>
            </View>
        </View>
    );
}
