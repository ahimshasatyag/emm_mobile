import React from 'react';
import { View, ScrollView } from 'react-native';

export function AssestsEditSkeleton() {
    return (
        <View className="flex-1 bg-gray-50 animate-pulse">
            <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
                <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
                    {/* Name */}
                    <View className="mb-4">
                        <View className="bg-gray-200 h-4 w-24 rounded mb-2" />
                        <View className="bg-gray-100 h-12 w-full rounded-xl" />
                    </View>

                    {/* Type */}
                    <View className="mb-4">
                        <View className="bg-gray-200 h-4 w-16 rounded mb-2" />
                        <View className="bg-gray-100 h-12 w-full rounded-xl" />
                    </View>

                    {/* Category */}
                    <View className="mb-4">
                        <View className="bg-gray-200 h-4 w-24 rounded mb-2" />
                        <View className="bg-gray-100 h-12 w-full rounded-xl" />
                    </View>

                    {/* Serial */}
                    <View className="mb-4">
                        <View className="bg-gray-200 h-4 w-24 rounded mb-2" />
                        <View className="bg-gray-100 h-12 w-full rounded-xl" />
                    </View>

                    {/* Dates */}
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

                    {/* Deskripsi */}
                    <View className="mb-4">
                        <View className="bg-gray-200 h-4 w-24 rounded mb-2" />
                        <View className="bg-gray-100 h-24 w-full rounded-xl" />
                    </View>

                    {/* Status */}
                    <View className="mb-4">
                        <View className="bg-gray-200 h-4 w-16 rounded mb-2" />
                        <View className="bg-gray-100 h-12 w-full rounded-xl" />
                    </View>

                    <View className="h-px bg-gray-200 my-4" />

                    {/* Multi Serial Number Table */}
                    <View className="flex-row justify-between mb-4">
                        <View className="bg-gray-200 h-5 w-32 rounded" />
                        <View className="bg-gray-200 h-8 w-24 rounded-lg" />
                    </View>
                    <View className="-mx-4">
                        <View className="bg-gray-100 h-10 w-full" />
                        <View className="bg-gray-50 h-12 w-full border-b border-gray-100" />
                        <View className="bg-gray-50 h-12 w-full border-b border-gray-100" />
                    </View>
                </View>

                {/* Edit Toggle Button Skeleton */}
                <View className="mt-2 flex-row gap-4">
                    <View className="bg-gray-200 h-14 w-full rounded-xl" />
                </View>
            </ScrollView>
        </View>
    );
}
