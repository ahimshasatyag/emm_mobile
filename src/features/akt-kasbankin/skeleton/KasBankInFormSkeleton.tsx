import React from 'react';
import { View, ScrollView } from 'react-native';

export const KasBankInFormSkeleton = () => {
    return (
        <View className="p-4">
            <View className="bg-white p-4 rounded-xl shadow-sm mb-4">
                <View className="h-6 bg-gray-200 rounded-md w-1/3 mb-4 animate-pulse" />

                {/* Bank */}
                <View className="mb-4">
                    <View className="h-4 bg-gray-200 rounded-md w-1/4 mb-2 animate-pulse" />
                    <View className="h-12 bg-gray-200 rounded-xl w-full animate-pulse" />
                </View>

                {/* Tipe & DP */}
                <View className="mb-4 flex-row space-x-2">
                    <View className="flex-1 mr-2">
                        <View className="h-4 bg-gray-200 rounded-md w-1/3 mb-2 animate-pulse" />
                        <View className="h-12 bg-gray-200 rounded-xl w-full animate-pulse" />
                    </View>
                    <View className="flex-1 ml-2 justify-center">
                        <View className="h-12 bg-gray-200 rounded-xl w-full animate-pulse mt-6" />
                    </View>
                </View>

                {/* Tanggal */}
                <View className="mb-4">
                    <View className="h-4 bg-gray-200 rounded-md w-1/4 mb-2 animate-pulse" />
                    <View className="h-12 bg-gray-200 rounded-xl w-full animate-pulse" />
                </View>

                {/* Total Amount */}
                <View className="mb-4">
                    <View className="h-4 bg-gray-200 rounded-md w-1/4 mb-2 animate-pulse" />
                    <View className="h-12 bg-gray-200 rounded-xl w-full animate-pulse" />
                </View>

                {/* Keterangan */}
                <View className="mb-2">
                    <View className="h-4 bg-gray-200 rounded-md w-1/3 mb-2 animate-pulse" />
                    <View className="h-24 bg-gray-200 rounded-xl w-full animate-pulse" />
                </View>

                {/* Details Section (Full card table) */}
                <View className="mt-2 border-t border-gray-100 pt-2 -mx-4">
                    <View className="bg-white">
                        <View className="flex-row justify-between items-center p-4 bg-white border-b border-gray-100">
                            <View className="h-5 bg-gray-200 rounded-md w-1/4 animate-pulse" />
                            <View className="h-8 bg-gray-200 rounded-lg w-20 animate-pulse" />
                        </View>

                        {/* Table Header */}
                        <View className="flex-row bg-gray-50 py-3 px-4 border-y border-gray-200">
                            <View className="flex-1">
                                <View className="h-4 bg-gray-200 rounded-md w-1/3 animate-pulse" />
                            </View>
                            <View className="w-[35%] items-end">
                                <View className="h-4 bg-gray-200 rounded-md w-1/2 animate-pulse" />
                            </View>
                        </View>

                        {/* Table Body */}
                        {[1, 2].map((item, index) => (
                            <View key={item} className={`flex-row py-3 px-4 items-center border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                                <View className="flex-1 mr-2">
                                    <View className="h-4 bg-gray-200 rounded-md w-3/4 animate-pulse" />
                                </View>
                                <View className="w-[35%] items-end">
                                    <View className="h-4 bg-gray-200 rounded-md w-2/3 animate-pulse" />
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        </View>
    );
};
