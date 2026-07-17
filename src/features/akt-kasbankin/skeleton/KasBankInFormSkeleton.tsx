import React from 'react';
import { View, ScrollView } from 'react-native';

export const KasBankInFormSkeleton = () => {
    return (
        <View className="p-4">
                {/* Form Inputs Skeleton */}
                <View className="bg-white p-4 rounded-xl shadow-sm mb-4">
                    <View className="mb-4">
                        <View className="h-4 bg-gray-200 rounded-md w-1/4 mb-2 animate-pulse" />
                        <View className="h-12 bg-gray-200 rounded-xl w-full animate-pulse" />
                    </View>
                    <View className="mb-4">
                        <View className="h-4 bg-gray-200 rounded-md w-1/3 mb-2 animate-pulse" />
                        <View className="h-12 bg-gray-200 rounded-xl w-full animate-pulse" />
                    </View>
                    <View className="mb-4 flex-row justify-between">
                        <View className="flex-1 mr-2">
                            <View className="h-4 bg-gray-200 rounded-md w-1/2 mb-2 animate-pulse" />
                            <View className="h-12 bg-gray-200 rounded-xl w-full animate-pulse" />
                        </View>
                        <View className="flex-1 ml-2">
                            <View className="h-4 bg-gray-200 rounded-md w-1/2 mb-2 animate-pulse" />
                            <View className="h-12 bg-gray-200 rounded-xl w-full animate-pulse" />
                        </View>
                    </View>
                    <View className="mb-4">
                        <View className="h-4 bg-gray-200 rounded-md w-1/4 mb-2 animate-pulse" />
                        <View className="h-24 bg-gray-200 rounded-xl w-full animate-pulse" />
                    </View>
                </View>

                {/* Details Skeleton */}
                <View className="bg-white p-4 rounded-xl shadow-sm">
                    <View className="h-5 bg-gray-200 rounded-md w-1/3 mb-4 animate-pulse" />
                    {[1, 2].map((item) => (
                        <View key={item} className="mb-4 border-b border-gray-100 pb-4">
                            <View className="h-10 bg-gray-200 rounded-xl w-full mb-2 animate-pulse" />
                            <View className="flex-row">
                                <View className="h-10 bg-gray-200 rounded-xl flex-1 mr-2 animate-pulse" />
                                <View className="h-10 bg-gray-200 rounded-xl flex-1 animate-pulse" />
                            </View>
                        </View>
                    ))}
                    <View className="h-10 bg-gray-200 rounded-xl w-32 animate-pulse mt-2" />
                </View>
        </View>
    );
};
