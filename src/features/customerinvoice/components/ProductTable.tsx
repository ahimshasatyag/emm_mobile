import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { formatRp, formatUsd } from '../../../utils/helpers/money';

interface ProductTableProps {
    detail: any;
}

export const ProductTable: React.FC<ProductTableProps> = ({ detail }) => {
    return (
        <View className="border-b border-gray-100">
            <View className="p-4 border-b border-gray-100">
                <Text className="text-sm font-bold text-gray-800">Detail Produk</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View>
                    {/* Table Header */}
                    <View className="flex-row bg-gray-100 py-3 px-4 border-b border-gray-200">
                        <Text className="w-48 text-xs font-bold text-gray-600">Product</Text>
                        <Text className="w-20 text-xs font-bold text-gray-600 text-center">UOM</Text>
                        <Text className="w-32 text-xs font-bold text-gray-600 text-right">Unit Price</Text>
                        <Text className="w-20 text-xs font-bold text-gray-600 text-center">Qty</Text>
                        <Text className="w-32 text-xs font-bold text-gray-600 text-right">Total</Text>
                    </View>

                    {/* Table Body */}
                    {detail.items && detail.items.length > 0 ? (
                        detail.items.map((item: any, index: number) => (
                            <View key={item.id_product + index} className="flex-row py-3 px-4 border-b border-gray-100 items-center">
                                <View className="w-48">
                                    <Text className="text-sm font-medium text-gray-800">{item.code_product}</Text>
                                    <Text className="text-xs text-gray-500">{item.nm_product}</Text>
                                </View>
                                <Text className="w-20 text-sm text-gray-600 text-center">{item.nm_product_satuan}</Text>
                                <Text className="w-32 text-sm text-gray-800 text-right">{detail.vcurrency === 'USD' ? formatUsd(item.product_price) : formatRp(item.product_price)}</Text>
                                <Text className="w-20 text-sm text-gray-800 text-center font-semibold">{item.nqty}</Text>
                                <Text className="w-32 text-sm text-gray-800 text-right font-bold">{detail.vcurrency === 'USD' ? formatUsd(item.product_price * item.nqty) : formatRp(item.product_price * item.nqty)}</Text>
                            </View>
                        ))
                    ) : (
                        <View className="py-8 px-4 items-center justify-center">
                            <Text className="text-gray-400">Tidak ada item</Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Summary */}
            <View className="p-4 bg-gray-50 border-t border-gray-100 space-y-2">
                <View className="flex-row justify-between">
                    <Text className="text-sm text-gray-600 font-medium">SUB-TOTAL</Text>
                    <Text className="text-sm text-gray-800 font-bold">{detail.vcurrency === 'USD' ? formatUsd(detail.ntot_price_netto_amount - (detail.nppn_amount || 0)) : formatRp(detail.ntot_price_netto_amount - (detail.nppn_amount || 0))}</Text>
                </View>
                {String(detail.flag_ppn) === '1' && (
                    <View className="flex-row justify-between">
                        <Text className="text-sm text-gray-600 font-medium">PPN {detail.nppn_amount}%</Text>
                        <Text className="text-sm text-gray-800 font-bold">{detail.vcurrency === 'USD' ? formatUsd(detail.nppn_amount || 0) : formatRp(detail.nppn_amount || 0)}</Text>
                    </View>
                )}
                <View className="flex-row justify-between pt-2 border-t border-gray-200">
                    <Text className="text-sm text-gray-800 font-bold">TOTAL</Text>
                    <Text className="text-base text-blue-600 font-bold">{detail.vcurrency === 'USD' ? formatUsd(detail.ntot_price_netto_amount) : formatRp(detail.ntot_price_netto_amount)}</Text>
                </View>
                <View className="flex-row justify-between">
                    <Text className="text-sm text-gray-800 font-bold">BALANCE</Text>
                    <Text className="text-base text-red-600 font-bold">{detail.vcurrency === 'USD' ? formatUsd(detail.ntot_balance) : formatRp(detail.ntot_balance)}</Text>
                </View>
            </View>
        </View>
    );
};
