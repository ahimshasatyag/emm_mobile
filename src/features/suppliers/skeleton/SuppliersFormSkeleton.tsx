import React from 'react';
import { View, ScrollView } from 'react-native';

export function SuppliersFormSkeleton() {
    return (
        <View className="flex-1 bg-gray-50 animate-pulse">
            <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
                <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
                    <View className="mb-4">
                        <View className="bg-gray-200 h-4 w-24 rounded mb-2" />
                        <View className="bg-gray-100 h-12 w-full rounded-xl" />
                    </View>
                    <View className="mb-4">
                        <View className="bg-gray-200 h-4 w-32 rounded mb-2" />
                        <View className="bg-gray-100 h-24 w-full rounded-xl" />
                    </View>
                    <View className="flex-row justify-between mb-4">
                        <View className="flex-1 mr-2">
                            <View className="bg-gray-200 h-4 w-16 rounded mb-2" />
                            <View className="bg-gray-100 h-12 w-full rounded-xl" />
                        </View>
                        <View className="flex-1 ml-2">
                            <View className="bg-gray-200 h-4 w-20 rounded mb-2" />
                            <View className="bg-gray-100 h-12 w-full rounded-xl" />
                        </View>
                    </View>
                    <View className="flex-row justify-between mb-4">
                        <View className="flex-1 mr-2">
                            <View className="bg-gray-200 h-4 w-16 rounded mb-2" />
                            <View className="bg-gray-100 h-12 w-full rounded-xl" />
                        </View>
                        <View className="flex-1 ml-2">
                            <View className="bg-gray-200 h-4 w-24 rounded mb-2" />
                            <View className="bg-gray-100 h-12 w-full rounded-xl" />
                        </View>
                    </View>
                    <View className="mb-4">
                        <View className="bg-gray-200 h-4 w-32 rounded mb-2" />
                        <View className="bg-gray-100 h-12 w-full rounded-xl" />
                    </View>
                    <View className="flex-row justify-between mb-4">
                        <View className="flex-1 mr-2">
                            <View className="bg-gray-200 h-4 w-20 rounded mb-2" />
                            <View className="bg-gray-100 h-12 w-full rounded-xl" />
                        </View>
                        <View className="flex-1 ml-2">
                            <View className="bg-gray-200 h-4 w-20 rounded mb-2" />
                            <View className="bg-gray-100 h-12 w-full rounded-xl" />
                        </View>
                    </View>

                    <View className="h-px bg-gray-200 my-4" />
                    <View className="flex-row justify-between mb-4">
                        <View className="bg-gray-200 h-5 w-32 rounded" />
                        <View className="bg-gray-200 h-8 w-20 rounded-lg" />
                    </View>
                    <View className="bg-gray-100 h-20 w-full rounded-xl" />
                </View>
            </ScrollView>
        </View>
    );
}
