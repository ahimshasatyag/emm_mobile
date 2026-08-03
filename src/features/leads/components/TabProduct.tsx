import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Plus, Package } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { theme } from '../../../theme/theme';
import { formatRp as formatRupiah } from '../../../utils/helpers/money';

interface TabProductProps {
    isEditMode?: boolean;
    openAddProductModal: () => void;
    formData: any;
    productsList: any[];
    openEditProductModal: (index: number) => void;
}

export function TabProduct({
    isEditMode = true,
    openAddProductModal,
    formData,
    productsList,
    openEditProductModal
}: TabProductProps) {
    return (
        <Animated.View entering={FadeInUp.duration(300)}>
            <View className="flex-row items-center justify-between mb-4">
                <Text className="text-sm font-bold text-gray-700">List Product</Text>
                {isEditMode && (
                    <TouchableOpacity
                        onPress={openAddProductModal}
                        className="px-3 py-1.5 rounded-lg flex-row items-center"
                        style={{ backgroundColor: theme.colors.primaryContainer }}
                    >
                        <Plus color={theme.colors.primary} size={16} className="mr-1" />
                        <Text className="font-bold text-xs" style={{ color: theme.colors.primary }}>Tambah Barang</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View className="-mx-4 bg-white border-y border-gray-100">
                <View className="flex-row bg-gray-50 px-4 py-3 border-b border-gray-100">
                    <Text className="flex-1 text-xs font-bold text-gray-500">Kode/Nama</Text>
                    <Text className="w-20 text-xs font-bold text-gray-500 text-right">Price</Text>
                    <Text className="w-12 text-xs font-bold text-gray-500 text-center">Qty</Text>
                    <Text className="w-24 text-xs font-bold text-gray-500 text-right">Subtotal</Text>
                </View>

                {formData.products.map((item: any, index: number) => (
                    <TouchableOpacity
                        key={index}
                        className="flex-row px-4 py-3 items-center border-b border-gray-50 active:bg-gray-100"
                        onPress={() => openEditProductModal(index)}
                    >
                        <View className="flex-1">
                            <Text className="text-xs font-bold text-gray-800" numberOfLines={1}>
                                {productsList.find(p => p.id_product === item.id_product)?.code_product || 'Unknown'}
                            </Text>
                        </View>
                        <Text className="w-20 text-xs text-gray-700 text-right">{formatRupiah(item.product_price)}</Text>
                        <Text className="w-12 text-xs text-gray-700 text-center">{item.nqty}</Text>
                        <Text className="w-24 text-xs font-bold text-gray-900 text-right" style={{ color: theme.colors.primary }}>{formatRupiah(item.product_price * item.nqty)}</Text>
                    </TouchableOpacity>
                ))}

                {formData.products.length === 0 && (
                    <View className="py-8 items-center border-b border-gray-50 bg-white">
                        <Package color="#9ca3af" size={32} className="mb-2" />
                        <Text className="text-gray-400 text-xs font-medium">Belum ada barang</Text>
                    </View>
                )}

                {formData.products.length > 0 && (
                    <View className="px-4 py-3 flex-row justify-between items-center bg-gray-50">
                        <Text className="text-sm font-bold text-gray-700">Total</Text>
                        <Text className="text-lg font-black" style={{ color: theme.colors.primary }}>
                            {formatRupiah(formData.products.reduce((acc: number, curr: any) => acc + (curr.product_price * curr.nqty), 0))}
                        </Text>
                    </View>
                )}
            </View>
        </Animated.View>
    );
}
