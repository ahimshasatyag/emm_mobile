import React from 'react';
import { View, ScrollView } from 'react-native';

export function InventoryScheduleFormSkeleton() {
    return (
        <View className="flex-1 bg-gray-50 animate-pulse">
            <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
                <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
                    
                    <View className="mb-4">
                        <View className="bg-gray-200 h-4 w-24 rounded mb-2" />
                        <View className="bg-gray-100 h-12 w-full rounded-lg" />
                    </View>

                    <View className="mb-4">
                        <View className="bg-gray-200 h-4 w-24 rounded mb-2" />
                        <View className="bg-gray-100 h-12 w-full rounded-lg" />
                    </View>

                    <View className="mb-4">
                        <View className="bg-gray-200 h-4 w-32 rounded mb-2" />
                        <View className="bg-gray-100 h-24 w-full rounded-lg" />
                    </View>

                    <View className="mb-4">
                        <View className="bg-gray-200 h-4 w-24 rounded mb-2" />
                        <View className="bg-gray-100 h-12 w-full rounded-lg" />
                    </View>

                    <View className="mb-4">
                        <View className="bg-gray-200 h-4 w-24 rounded mb-2" />
                        <View className="bg-gray-100 h-12 w-full rounded-lg" />
                    </View>

                    <View className="mb-4">
                        <View className="bg-gray-200 h-4 w-32 rounded mb-2" />
                        <View className="flex-row">
                            <View className="bg-gray-100 h-6 w-20 rounded mr-2" />
                            <View className="bg-gray-100 h-6 w-20 rounded mr-2" />
                            <View className="bg-gray-100 h-6 w-20 rounded" />
                        </View>
                    </View>

                    <View className="mb-4">
                        <View className="bg-gray-200 h-4 w-24 rounded mb-2" />
                        <View className="bg-gray-100 h-12 w-full rounded-lg" />
                    </View>

                </View>
            </ScrollView>
        </View>
    );
}
