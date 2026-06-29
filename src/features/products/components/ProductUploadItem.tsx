import React from 'react';
import { View, Text } from 'react-native';
import { ProductUploadItem as ItemType } from '../types/productUpload';
import { AlertCircle, CheckCircle2 } from 'lucide-react-native';

interface Props {
    item: ItemType;
    index: number;
}

export function ProductUploadItem({ item, index }: Props) {
    const isError = !item.f_ada;

    return (
        <View className={`p-4 rounded-xl mb-3 border ${isError ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'}`}>
            <View className="flex-row justify-between items-start mb-2">
                <View className="flex-row items-center flex-1">
                    <Text className={`font-bold mr-2 ${isError ? 'text-red-800' : 'text-gray-900'}`}>
                        {index + 1}. {item.code_product}
                    </Text>
                    {isError ? (
                        <AlertCircle color="#ef4444" size={16} />
                    ) : (
                        <CheckCircle2 color="#22c55e" size={16} />
                    )}
                </View>
            </View>

            <Text className={`text-base font-semibold mb-1 ${isError ? 'text-red-900' : 'text-gray-800'}`}>
                {item.nm_product}
            </Text>

            <View className="flex-row flex-wrap gap-y-1 mb-2">
                <Text className={`text-xs mr-3 ${isError ? 'text-red-700' : 'text-gray-500'}`}>
                    Kategori: {item.nm_product_kategori || '-'}
                </Text>
                <Text className={`text-xs mr-3 ${isError ? 'text-red-700' : 'text-gray-500'}`}>
                    Sub: {item.nm_product_sub_kategori || '-'}
                </Text>
                <Text className={`text-xs ${isError ? 'text-red-700' : 'text-gray-500'}`}>
                    Brand: {item.nm_product_brand || '-'}
                </Text>
            </View>

            {item.product_deskripsi ? (
                <Text className={`text-sm mb-2 ${isError ? 'text-red-800' : 'text-gray-600'}`}>
                    {item.product_deskripsi}
                </Text>
            ) : null}

            {isError && item.error_message && (
                <View className="mt-2 bg-red-100 p-2 rounded-lg border border-red-200">
                    <Text className="text-xs text-red-700 font-medium">Error: {item.error_message}</Text>
                </View>
            )}
        </View>
    );
}
