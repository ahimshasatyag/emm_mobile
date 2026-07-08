import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Package } from 'lucide-react-native';

interface ProductTableProps {
    details: any[];
    onEditProduct: (index: number) => void;
}

export function ProductTable({ details, onEditProduct }: ProductTableProps) {
    return (
        <View className="mb-4 bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <View className="flex-row bg-gray-50 p-3 border-b border-gray-100">
                <Text className="flex-1 text-xs font-bold text-gray-500">Kode/Nama</Text>
                <Text className="w-16 text-xs font-bold text-gray-500 text-center">Qty</Text>
            </View>
            {details.map((item, index) => (
                <TouchableOpacity
                    key={index}
                    onPress={() => onEditProduct(index)}
                    className="flex-row p-3 items-center border-b border-gray-50 active:bg-gray-100"
                >
                    <View className="flex-1 pr-2">
                        <Text className="text-xs font-bold text-gray-800" numberOfLines={1}>
                            {item.code_product || 'Pilih Produk'}
                        </Text>
                        {!!item.nm_product && (
                            <Text className="text-xs text-gray-500 mt-1">{item.nm_product}</Text>
                        )}
                    </View>
                    <View className="w-16 items-center justify-center">
                        <Text className="text-xs text-gray-700">{item.qty}</Text>
                    </View>
                </TouchableOpacity>
            ))}
            {details.length === 0 && (
                <View className="py-8 items-center border-b border-gray-50 bg-white">
                    <Package color="#9ca3af" size={32} className="mb-2" />
                    <Text className="text-gray-400 text-xs font-medium">Belum ada barang</Text>
                </View>
            )}
        </View>
    );
}
