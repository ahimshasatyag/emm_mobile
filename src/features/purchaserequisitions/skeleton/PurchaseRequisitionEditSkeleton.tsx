import React from 'react';
import { View, ScrollView } from 'react-native';

export function PurchaseRequisitionEditSkeleton() {
    return (
        <View className="flex-1 bg-gray-50 animate-pulse">
            <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
                <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
                    {/* Header Section */}
                    <View className="mb-4">
                        <View className="bg-gray-200 h-4 w-24 rounded mb-2" />
                        <View className="bg-gray-100 h-12 w-full rounded-xl" />
                    </View>

                    <View className="flex-row justify-between mb-2">
                        <View className="flex-1 mr-2">
                            <View className="bg-gray-200 h-4 w-32 rounded mb-2" />
                            <View className="bg-gray-100 h-12 w-full rounded-xl" />
                        </View>
                        <View className="flex-1 ml-2">
                            <View className="bg-gray-200 h-4 w-20 rounded mb-2" />
                            <View className="bg-gray-100 h-12 w-full rounded-xl" />
                        </View>
                    </View>

                    <View className="h-px bg-gray-200 my-4" />

                    {/* Products List Header */}
                    <View className="flex-row justify-between items-center mb-4">
                        <View className="bg-gray-200 h-5 w-28 rounded" />
                    </View>

                    {/* Products Table */}
                    <View className="mb-4 bg-white border border-gray-100 rounded-2xl overflow-hidden">
                        <View className="flex-row bg-gray-50 p-3 border-b border-gray-100">
                            <View className="bg-gray-200 h-4 w-20 rounded" />
                            <View className="bg-gray-200 h-4 w-8 rounded ml-auto" />
                        </View>
                        <View className="p-3 border-b border-gray-50 flex-row justify-between items-center">
                            <View>
                                <View className="bg-gray-200 h-4 w-24 rounded mb-1" />
                                <View className="bg-gray-100 h-3 w-32 rounded" />
                            </View>
                            <View className="bg-gray-200 h-4 w-6 rounded" />
                        </View>
                        <View className="p-3 border-b border-gray-50 flex-row justify-between items-center">
                            <View>
                                <View className="bg-gray-200 h-4 w-20 rounded mb-1" />
                                <View className="bg-gray-100 h-3 w-28 rounded" />
                            </View>
                            <View className="bg-gray-200 h-4 w-6 rounded" />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
