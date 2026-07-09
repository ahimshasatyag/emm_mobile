import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Package } from 'lucide-react-native';
import { formatRp } from '../../../utils/helpers/money';

interface PurchaseOrderTableProps {
    details: any[];
    onEditProduct?: (index: number) => void;
}

export function PurchaseOrderTable({ details, onEditProduct }: PurchaseOrderTableProps) {
    return (
        <View className="mb-4">
            <View className="flex-row bg-gray-50 p-3 border-y border-gray-100">
                <Text className="flex-1 text-xs font-bold text-gray-500">Kode Barang</Text>
                <Text className="w-20 text-xs font-bold text-gray-500 text-right">Price</Text>
                <Text className="w-12 text-xs font-bold text-gray-500 text-center">Qty</Text>
                <Text className="w-24 text-xs font-bold text-gray-500 text-right">Subtotal</Text>
            </View>
            {details.map((item, index) => {
                const optionTotal = (item.options || []).filter((o: any) => o.selected).reduce((acc: number, curr: any) => acc + (curr.harga || 0), 0);
                const subtotal = item.subtotal !== undefined ? item.subtotal : ((item.price || 0) + optionTotal) * (item.qty || 0);
                return (
                    <View key={index} className="border-b border-gray-50 bg-white">
                        <TouchableOpacity
                            onPress={() => onEditProduct && onEditProduct(index)}
                            disabled={!onEditProduct}
                            className="flex-row p-3 items-center active:bg-gray-100"
                        >
                            <View className="flex-1 pr-2">
                                <Text className="text-xs font-bold text-gray-800" numberOfLines={1}>
                                    {item.code_product || 'Pilih Produk'}
                                </Text>
                                {!!item.nm_product && (
                                    <Text className="text-xs text-gray-500 mt-1" numberOfLines={1}>{item.nm_product}</Text>
                                )}
                            </View>
                            <View className="w-20 items-end justify-center">
                                <Text className="text-xs text-gray-700">{formatRp(item.price || 0)}</Text>
                            </View>
                            <View className="w-12 items-center justify-center">
                                <Text className="text-xs text-gray-700">{item.qty || 0}</Text>
                            </View>
                            <View className="w-24 items-end justify-center">
                                <Text className="text-xs font-bold text-gray-900">{formatRp(subtotal)}</Text>
                            </View>
                        </TouchableOpacity>

                        {/* Options List */}
                        {item.options && item.options.filter((opt: any) => opt.selected).length > 0 && (
                            <View className="px-4 pb-3">
                                <View className="bg-gray-50/80 p-2 rounded-lg border border-gray-100">
                                    <Text className="text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Options:</Text>
                                    {item.options.filter((opt: any) => opt.selected).map((opt: any, optIdx: number) => (
                                        <View key={optIdx} className="flex-row items-center justify-between py-1">
                                            <View className="flex-row items-center flex-1 pr-2">
                                                <View className="w-1 h-1 rounded-full bg-blue-400 mr-2" />
                                                <Text className="text-xs text-gray-600 flex-1">{opt.nm_product_opt}</Text>
                                            </View>
                                            <Text className="text-xs font-medium text-gray-700">{formatRp(opt.harga || 0)}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}
                    </View>
                );
            })}
            {details.length === 0 && (
                <View className="py-8 items-center border-b border-gray-50 bg-white">
                    <Package color="#9ca3af" size={32} className="mb-2" />
                    <Text className="text-gray-400 text-xs font-medium">Belum ada barang</Text>
                </View>
            )}
            
            {/* Total Section */}
            {details.length > 0 && (
                <View className="flex-row bg-gray-50 p-3 border-t border-gray-100 items-center justify-end">
                    <Text className="text-xs font-bold text-gray-700 mr-4">Total:</Text>
                    <Text className="text-sm font-bold text-primary">
                        {formatRp(details.reduce((acc, curr) => acc + ((curr.price || 0) * (curr.qty || 0)), 0))}
                    </Text>
                </View>
            )}
        </View>
    );
}
