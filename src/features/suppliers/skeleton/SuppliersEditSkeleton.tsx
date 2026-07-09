import React from 'react';
import { View, ScrollView } from 'react-native';

export function SuppliersEditSkeleton() {
    return (
        <View className="flex-1 bg-gray-50 animate-pulse">
            <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
                <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
                    {/* Nama Supplier */}
                    <View className="mb-4">
                        <View className="bg-gray-200 h-4 w-32 rounded mb-2" />
                        <View className="bg-gray-100 h-12 w-full rounded-xl" />
                    </View>
                    
                    {/* Address (Textarea) */}
                    <View className="mb-4">
                        <View className="bg-gray-200 h-4 w-24 rounded mb-2" />
                        <View className="bg-gray-100 h-[100px] w-full rounded-xl" />
                    </View>
                    
                    {/* Fax & Website */}
                    <View className="flex-row justify-between mb-4">
                        <View className="flex-1 mr-2">
                            <View className="bg-gray-200 h-4 w-12 rounded mb-2" />
                            <View className="bg-gray-100 h-12 w-full rounded-xl" />
                        </View>
                        <View className="flex-1 ml-2">
                            <View className="bg-gray-200 h-4 w-20 rounded mb-2" />
                            <View className="bg-gray-100 h-12 w-full rounded-xl" />
                        </View>
                    </View>
                    
                    {/* Logo & Mata Uang */}
                    <View className="flex-row justify-between mb-4">
                        <View className="flex-1 mr-2">
                            <View className="bg-gray-200 h-4 w-12 rounded mb-2" />
                            <View className="bg-gray-100 h-12 w-full rounded-xl" />
                        </View>
                        <View className="flex-1 ml-2">
                            <View className="bg-gray-200 h-4 w-24 rounded mb-2" />
                            <View className="bg-gray-100 h-12 w-full rounded-xl" />
                        </View>
                    </View>

                    {/* Telepon & Phone */}
                    <View className="flex-row justify-between mb-4">
                        <View className="flex-1 mr-2">
                            <View className="bg-gray-200 h-4 w-20 rounded mb-2" />
                            <View className="bg-gray-100 h-12 w-full rounded-xl" />
                        </View>
                        <View className="flex-1 ml-2">
                            <View className="bg-gray-200 h-4 w-16 rounded mb-2" />
                            <View className="bg-gray-100 h-12 w-full rounded-xl" />
                        </View>
                    </View>

                    {/* Email */}
                    <View className="mb-4">
                        <View className="bg-gray-200 h-4 w-16 rounded mb-2" />
                        <View className="bg-gray-100 h-12 w-full rounded-xl" />
                    </View>

                    <View className="h-px bg-gray-200 my-4" />
                    
                    {/* Daftar Kontak Table */}
                    <View className="flex-row justify-between items-center mb-4">
                        <View className="bg-gray-200 h-5 w-32 rounded" />
                    </View>
                    <View className="bg-gray-100 h-14 w-full rounded-xl" />
                </View>

                {/* Edit Button */}
                <View className="h-14 w-full bg-gray-200 rounded-2xl" />
            </ScrollView>
        </View>
    );
}
