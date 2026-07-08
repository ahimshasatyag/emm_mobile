import React from 'react';
import { View } from 'react-native';

export function LeadsEditSkeleton() {
    return (
        <View className="animate-pulse">
            {/* Form Fields Card */}
            <View className="bg-white rounded-3xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
                <View className="p-6">
                <View className="mb-4">
                    <View className="bg-gray-200 h-4 w-24 rounded mb-2" />
                    <View className="bg-gray-100 h-12 w-full rounded-xl" />
                </View>
                <View className="mb-4">
                    <View className="bg-gray-200 h-4 w-32 rounded mb-2" />
                    <View className="bg-gray-100 h-24 w-full rounded-xl" />
                </View>
                <View className="mb-4">
                    <View className="bg-gray-200 h-4 w-16 rounded mb-2" />
                    <View className="bg-gray-100 h-24 w-full rounded-xl" />
                </View>
                <View className="mb-4">
                    <View className="bg-gray-200 h-4 w-16 rounded mb-2" />
                    <View className="bg-gray-100 h-12 w-full rounded-xl" />
                </View>
                </View>

                {/* Tabs Card */}
                <View className="flex-row bg-white border-y border-gray-100 px-2 pt-2">
                    <View className="flex-1 h-12 bg-gray-200 rounded-t-xl mr-2" />
                    <View className="flex-1 h-12 bg-gray-100 rounded-t-xl" />
                </View>
                <View className="p-4">
                    <View className="flex-row justify-between mb-4 items-center">
                        <View className="bg-gray-200 h-5 w-32 rounded" />
                        <View className="bg-gray-200 h-8 w-32 rounded-lg" />
                    </View>
                    <View className="bg-white border border-gray-100 rounded-2xl overflow-hidden mb-4">
                        <View className="bg-gray-100 h-10 w-full" />
                        <View className="bg-gray-50 h-12 w-full border-t border-gray-100" />
                        <View className="bg-gray-50 h-12 w-full border-t border-gray-100" />
                    </View>
                    <View className="p-4 rounded-2xl flex-row justify-between items-center border bg-gray-50 border-gray-200">
                        <View className="bg-gray-200 h-4 w-20 rounded" />
                        <View className="bg-gray-200 h-6 w-32 rounded" />
                    </View>
                </View>
            </View>
        </View>
    );
}
