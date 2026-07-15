import React from 'react';
import { View, ScrollView } from 'react-native';

export const CustomerInvoiceEditSkeleton = () => {
    return (
        <View>
            <View className="p-4">
                <View
                    className="bg-white rounded-2xl mb-8"
                    style={{ elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12 }}
                >
                    <View className="rounded-2xl overflow-hidden border border-gray-100 bg-white">

                        {/* Header Info Skeleton */}
                        <View className="p-4 border-b border-gray-100">
                            <View className="w-1/3 h-5 bg-gray-200 rounded animate-pulse mb-3" />

                            <View className="space-y-3">
                                <View>
                                    <View className="w-1/4 h-4 bg-gray-200 rounded animate-pulse mb-2" />
                                    <View className="flex-row items-center">
                                        <View className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                                        <View className="w-2/3 h-4 bg-gray-200 rounded animate-pulse ml-2" />
                                    </View>
                                    <View className="flex-row mt-2 ml-6">
                                        <View className="w-3 h-3 bg-gray-200 rounded animate-pulse" />
                                        <View className="w-3/4 h-4 bg-gray-200 rounded animate-pulse ml-2" />
                                    </View>
                                </View>

                                <View className="flex-row pt-2 border-t border-gray-50">
                                    <View className="flex-1 pr-2">
                                        <View className="w-1/2 h-4 bg-gray-200 rounded animate-pulse mb-2" />
                                        <View className="flex-row items-center">
                                            <View className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                                            <View className="w-2/3 h-4 bg-gray-200 rounded animate-pulse ml-2" />
                                        </View>
                                    </View>
                                    <View className="flex-1">
                                        <View className="w-1/2 h-4 bg-gray-200 rounded animate-pulse mb-2" />
                                        <View className="flex-row items-center">
                                            <View className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                                            <View className="w-2/3 h-4 bg-gray-200 rounded animate-pulse ml-2" />
                                        </View>
                                    </View>
                                </View>

                                <View className="flex-row pt-2 border-t border-gray-50">
                                    <View className="flex-1 pr-2">
                                        <View className="w-1/2 h-4 bg-gray-200 rounded animate-pulse mb-2" />
                                        <View className="w-1/3 h-4 bg-gray-200 rounded animate-pulse" />
                                    </View>
                                    <View className="flex-1">
                                        <View className="w-1/2 h-4 bg-gray-200 rounded animate-pulse mb-2" />
                                        <View className="w-1/4 h-6 bg-gray-200 rounded animate-pulse" />
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Items Table Skeleton */}
                        <View className="border-b border-gray-100">
                            <View className="p-4 border-b border-gray-100 bg-gray-50">
                                <View className="w-1/4 h-5 bg-gray-200 rounded animate-pulse" />
                            </View>

                            <View className="py-4 px-4 space-y-4">
                                {[1, 2].map((item) => (
                                    <View key={item} className="flex-row items-center border-b border-gray-50 pb-4">
                                        <View className="w-1/3 h-10 bg-gray-200 rounded animate-pulse" />
                                        <View className="w-1/6 h-5 bg-gray-200 rounded animate-pulse ml-4" />
                                        <View className="w-1/4 h-5 bg-gray-200 rounded animate-pulse ml-4" />
                                        <View className="w-1/4 h-5 bg-gray-200 rounded animate-pulse ml-auto" />
                                    </View>
                                ))}
                            </View>

                            {/* Summary Skeleton */}
                            <View className="p-4 bg-gray-50 border-t border-gray-100 space-y-3">
                                <View className="flex-row justify-between">
                                    <View className="w-1/4 h-4 bg-gray-200 rounded animate-pulse" />
                                    <View className="w-1/4 h-4 bg-gray-200 rounded animate-pulse" />
                                </View>
                                <View className="flex-row justify-between pt-2 border-t border-gray-200">
                                    <View className="w-1/4 h-5 bg-gray-200 rounded animate-pulse" />
                                    <View className="w-1/3 h-5 bg-gray-200 rounded animate-pulse" />
                                </View>
                                <View className="flex-row justify-between">
                                    <View className="w-1/4 h-5 bg-gray-200 rounded animate-pulse" />
                                    <View className="w-1/3 h-5 bg-gray-200 rounded animate-pulse" />
                                </View>
                            </View>
                        </View>

                        {/* Payments Table Skeleton */}
                        <View>
                            <View className="p-4 border-b border-gray-100 bg-gray-50">
                                <View className="w-1/3 h-5 bg-gray-200 rounded animate-pulse" />
                            </View>

                            <View className="py-4 px-4 space-y-4">
                                {[1].map((item) => (
                                    <View key={item} className="flex-row items-center border-b border-gray-50 pb-4">
                                        <View className="w-8 h-5 bg-gray-200 rounded animate-pulse" />
                                        <View className="w-1/4 h-5 bg-gray-200 rounded animate-pulse ml-4" />
                                        <View className="w-1/5 h-5 bg-gray-200 rounded animate-pulse ml-4" />
                                        <View className="w-1/4 h-5 bg-gray-200 rounded animate-pulse ml-auto" />
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};
