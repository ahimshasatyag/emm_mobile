import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export function ProductPriceUploadSkeleton() {
    return (
        <Animated.View entering={FadeIn} exiting={FadeOut}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="border border-gray-200 rounded-2xl bg-white">
                <View>
                    {/* Table Header */}
                    <View className="flex-row bg-gray-100 p-3 border-b border-gray-200">
                        <Text className="w-10 text-center font-bold text-gray-700 text-xs">No</Text>
                        <Text className="w-32 font-bold text-gray-700 text-xs">Product Code</Text>
                        <Text className="w-48 font-bold text-gray-700 text-xs">Product Name</Text>
                        <Text className="w-32 font-bold text-gray-700 text-xs text-right">Price (USD)</Text>
                        <Text className="w-32 font-bold text-gray-700 text-xs text-right">Agent Price (USD)</Text>
                        <Text className="w-32 font-bold text-gray-700 text-xs text-right">Kurs</Text>
                        <Text className="w-40 font-bold text-gray-700 text-xs text-right">Est. IDR</Text>
                        <Text className="w-32 font-bold text-gray-700 text-xs ml-4">Delivery Term</Text>
                    </View>
                    
                    {/* Table Body (Skeleton Rows) */}
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <View key={item} className="flex-row p-3 border-b border-gray-100 bg-white items-center">
                            <View className="w-10 items-center">
                                <View className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                            </View>
                            <View className="w-32 justify-center pr-2">
                                <View className="w-full h-4 bg-gray-200 rounded animate-pulse" />
                            </View>
                            <View className="w-48 justify-center pr-2">
                                <View className="w-full h-4 bg-gray-200 rounded animate-pulse" />
                            </View>
                            <View className="w-32 items-end pr-2">
                                <View className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
                            </View>
                            <View className="w-32 items-end pr-2">
                                <View className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
                            </View>
                            <View className="w-32 items-end pr-2">
                                <View className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
                            </View>
                            <View className="w-40 items-end pr-2">
                                <View className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
                            </View>
                            <View className="w-32 ml-4 justify-center">
                                <View className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </Animated.View>
    );
}
