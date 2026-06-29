import React from 'react';
import { View, Animated } from 'react-native';

export function ProductPriceReqListSkeleton() {
    return (
        <View className="flex-1">
            {[1, 2, 3, 4, 5].map((item) => (
                <View key={item} className="bg-white rounded-xl p-4 mb-3 border border-gray-100 shadow-sm">
                    <View className="flex-row justify-between items-start mb-3">
                        <View className="flex-row items-center flex-1 mr-3">
                            <View className="w-10 h-10 rounded-full bg-gray-200 mr-3" />
                            <View className="flex-1">
                                <View className="h-4 bg-gray-200 rounded-md w-3/4 mb-2" />
                                <View className="h-3 bg-gray-200 rounded-md w-1/2" />
                            </View>
                        </View>
                        <View className="w-16 h-5 bg-gray-200 rounded-md" />
                    </View>
                    <View className="flex-row items-center mt-2 border-t border-gray-50 pt-3">
                        <View className="w-24 h-3 bg-gray-200 rounded-md" />
                    </View>
                </View>
            ))}
        </View>
    );
}
