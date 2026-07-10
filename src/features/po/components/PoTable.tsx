import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { PoDetail } from '../types/po.types';
import { PoOptionTable } from './PoOptionTable';

interface PoTableProps {
    items: PoDetail[];
}

export function PoTable({ items }: PoTableProps) {
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(val);
    };

    return (
        <View className="mt-4 mb-6">
            <View className="flex-row justify-between items-center mb-3 px-1">
                <Text className="text-sm font-bold text-gray-800">Detail Produk</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="bg-white rounded-xl border border-gray-200 overflow-hidden min-w-[1050px]">
                    {/* Header */}
                    <View className="flex-row bg-gray-50 p-3 border-b border-gray-200">
                        <Text className="text-xs font-bold text-gray-600 w-32">Kode Barang</Text>
                        <Text className="text-xs font-bold text-gray-600 w-40">Nama Barang</Text>
                        <Text className="text-xs font-bold text-gray-600 w-48">Deskripsi</Text>
                        <Text className="text-xs font-bold text-gray-600 w-48">Notes</Text>
                        <Text className="text-xs font-bold text-gray-600 w-32 text-right">Price</Text>
                        <Text className="text-xs font-bold text-gray-600 w-24 text-center">Qty</Text>
                        <Text className="text-xs font-bold text-gray-600 w-40 text-right">Subtotal</Text>
                    </View>

                    {/* Rows */}
                    {items.length === 0 ? (
                        <View className="p-4 items-center justify-center">
                            <Text className="text-sm text-gray-500">Belum ada produk ditambahkan</Text>
                        </View>
                    ) : (
                        items.map((item, index) => (
                            <View key={index} className={`flex-col ${index < items.length - 1 ? 'border-b border-gray-100' : ''}`}>
                                <View className="flex-row p-3 items-center">
                                    <Text className="text-sm font-bold text-gray-800 w-32">{item.code_product}</Text>
                                    <Text className="text-sm text-gray-700 w-40">{item.nm_product}</Text>
                                    <Text className="text-sm text-gray-500 w-48">{item.product_deskripsi || '-'}</Text>
                                    <Text className="text-sm text-gray-500 w-48">{item.notes || '-'}</Text>

                                    <Text className="text-sm text-gray-700 w-32 text-right">
                                        {formatCurrency(item.product_price)}
                                    </Text>

                                    <Text className="text-sm text-gray-700 w-24 text-center font-medium">
                                        {item.qty}
                                    </Text>

                                    <Text className="text-sm font-bold text-gray-900 w-40 text-right">
                                        {formatCurrency(item.qty * item.product_price)}
                                    </Text>
                                </View>

                                {item.options && item.options.length > 0 && (
                                    <View className="px-3 pb-3">
                                        <PoOptionTable options={item.options} isReadOnly={true} />
                                    </View>
                                )}
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>
        </View>
    );
}
