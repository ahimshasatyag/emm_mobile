import React from 'react';
import { View } from 'react-native';

export function QuotationFormSkeleton() {
    return (
        <View className="flex-1">
            <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <View className="h-4 w-32 bg-gray-200 rounded mb-6 animate-pulse" />
                
                {[1, 2, 3, 4, 5].map((item) => (
                    <View key={item} className="mb-4">
                        <View className="h-4 w-24 bg-gray-200 rounded mb-2 animate-pulse" />
                        <View className="h-12 w-full bg-gray-200 rounded-lg animate-pulse" />
                    </View>
                ))}

                <View className="h-4 w-32 bg-gray-200 rounded mb-6 mt-4 animate-pulse" />
                
                {[1, 2, 3].map((item) => (
                    <View key={`radio-${item}`} className="mb-4">
                        <View className="h-4 w-24 bg-gray-200 rounded mb-2 animate-pulse" />
                        <View className="flex-row flex-wrap gap-2">
                            <View className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse" />
                            <View className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse" />
                            <View className="h-10 w-40 bg-gray-200 rounded-lg animate-pulse" />
                        </View>
                    </View>
                ))}

                <View className="h-4 w-32 bg-gray-200 rounded mb-6 mt-4 animate-pulse" />
                
                <View className="mb-4">
                    <View className="h-4 w-24 bg-gray-200 rounded mb-2 animate-pulse" />
                    <View className="h-12 w-full bg-gray-200 rounded-lg animate-pulse" />
                </View>

                <View className="mt-4 mb-2 flex-row justify-end">
                    <View className="h-9 w-24 bg-gray-200 rounded-lg animate-pulse" />
                </View>
                
                <View className="h-10 w-full bg-gray-200 rounded-t-xl animate-pulse" />
                <View className="h-16 w-full bg-gray-100 border-t border-white rounded-b-xl animate-pulse" />
            </View>
        </View>
    );
}
