import React from 'react';
import { View, ScrollView } from 'react-native';

export function ListSODetailSkeleton() {
    return (
        <View className="flex-1 p-4">
            {/* General & Payment Info Combined Box */}
            <View className="bg-white p-5 rounded-2xl mb-4 shadow-sm border border-gray-100">
                <View className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
                
                <View className="mb-2">
                    <View className="h-3 bg-gray-200 rounded w-full mb-3" />
                    <View className="h-3 bg-gray-200 rounded w-3/4 mb-3" />
                    <View className="h-3 bg-gray-200 rounded w-5/6 mb-3" />
                    <View className="h-3 bg-gray-200 rounded w-2/3 mb-3" />
                    <View className="h-3 bg-gray-200 rounded w-1/2 mb-3" />
                    <View className="h-3 bg-gray-200 rounded w-3/5 mb-3" />
                    <View className="h-3 bg-gray-200 rounded w-4/5 mb-3" />
                    <View className="h-3 bg-gray-200 rounded w-2/3" />
                </View>

                <View className="h-4 bg-gray-200 rounded w-1/3 mt-2 mb-4" />
                
                <View className="mb-2">
                    <View className="mb-3 flex-row">
                        <View className="w-1/3"><View className="h-3 bg-gray-200 rounded w-16" /></View>
                        <View className="w-2/3"><View className="h-3 bg-gray-200 rounded w-24" /></View>
                    </View>
                    <View className="mb-3 flex-row">
                        <View className="w-1/3"><View className="h-3 bg-gray-200 rounded w-24" /></View>
                        <View className="w-2/3"><View className="h-3 bg-gray-200 rounded w-20" /></View>
                    </View>
                    
                    <View className="bg-white p-4 mb-3 border border-gray-100 rounded-xl">
                        <View className="flex-row mb-4">
                            <View className="flex-row flex-1 items-center">
                                <View className="w-1/2"><View className="h-3 bg-gray-200 rounded w-10" /></View>
                                <View className="h-3 bg-gray-200 rounded w-8" />
                            </View>
                            <View className="flex-row flex-1 items-center justify-between">
                                <View className="w-1/2 items-center"><View className="h-3 bg-gray-200 rounded w-10" /></View>
                                <View className="h-3 bg-gray-200 rounded w-16" />
                            </View>
                        </View>
                        <View className="flex-row">
                            <View className="flex-row flex-1 items-center">
                                <View className="w-1/2"><View className="h-3 bg-gray-200 rounded w-12" /></View>
                                <View className="h-3 bg-gray-200 rounded w-4" />
                            </View>
                            <View className="flex-row flex-1 items-center justify-between">
                                <View className="h-3 bg-gray-300 rounded w-3 mr-4" />
                                <View className="w-1/3 items-center"><View className="h-3 bg-gray-200 rounded w-14" /></View>
                                <View className="h-3 bg-gray-200 rounded w-12" />
                            </View>
                        </View>
                    </View>

                    <View className="mb-3 flex-row">
                        <View className="w-1/3"><View className="h-3 bg-gray-200 rounded w-24" /></View>
                        <View className="w-2/3"><View className="h-3 bg-gray-200 rounded w-16" /></View>
                    </View>
                    <View className="mb-3 flex-row">
                        <View className="w-1/3"><View className="h-3 bg-gray-200 rounded w-20" /></View>
                        <View className="w-2/3"><View className="h-3 bg-gray-200 rounded w-32" /></View>
                    </View>
                    <View className="mb-3 flex-row">
                        <View className="w-1/3"><View className="h-3 bg-gray-200 rounded w-16" /></View>
                        <View className="w-2/3"><View className="h-3 bg-gray-200 rounded w-40" /></View>
                    </View>
                    <View className="mb-3 flex-row">
                        <View className="w-1/3"><View className="h-3 bg-gray-200 rounded w-20" /></View>
                        <View className="w-2/3"><View className="h-3 bg-gray-200 rounded w-24" /></View>
                    </View>
                </View>
            </View>
            {/* Items Box */}
            <View className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <View className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
                
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                    <View>
                        {/* Table Header Skeleton */}
                        <View className="flex-row bg-gray-200 rounded-t-xl overflow-hidden border border-gray-200 h-10 w-[840px]" />
                        
                        {/* Table Rows Skeleton */}
                        {[1, 2, 3].map(item => (
                            <View key={item} className={`flex-row items-center border-b border-gray-200 border-x h-16 w-[840px] ${item % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                <View className="w-10 px-2 items-center"><View className="h-3 w-4 bg-gray-200 rounded" /></View>
                                <View className="w-48 px-2 justify-center">
                                    <View className="h-3 w-3/4 bg-gray-200 rounded mb-1.5" />
                                    <View className="h-2 w-1/2 bg-gray-200 rounded" />
                                </View>
                                <View className="w-32 px-2 items-end"><View className="h-3 w-20 bg-gray-200 rounded" /></View>
                                <View className="w-16 px-2 items-center"><View className="h-3 w-8 bg-gray-200 rounded" /></View>
                                <View className="w-24 px-2 items-center"><View className="h-3 w-10 bg-gray-200 rounded" /></View>
                                <View className="w-28 px-2 items-center"><View className="h-3 w-12 bg-gray-200 rounded" /></View>
                                <View className="w-36 px-2 items-center justify-center">
                                    <View className="flex-row items-center">
                                        <View className="h-3 w-10 bg-gray-200 rounded mr-1.5" />
                                        <View className="h-4 w-12 bg-gray-200 rounded" />
                                    </View>
                                </View>
                                <View className="w-32 px-2 items-end"><View className="h-3 w-24 bg-gray-300 rounded" /></View>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}
