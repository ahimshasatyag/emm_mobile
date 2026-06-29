import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, TextInput } from 'react-native';
import { Search, X, Tag } from 'lucide-react-native';
import { ProductPriceReqProduct } from '../types/productpricereq.types';
import { theme } from '../../../theme/theme';

interface Props {
    visible: boolean;
    products: ProductPriceReqProduct[];
    onClose: () => void;
    onSelect: (product: ProductPriceReqProduct) => void;
}

export function ProductPriceReqProductSelector({ visible, products, onClose, onSelect }: Props) {
    const [searchQuery, setSearchQuery] = useState('');

    const filtered = products.filter(p => 
        p.nm_product.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.code_product.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!visible) return null;

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View className="flex-1 bg-black/50 justify-end">
                <View className="bg-white rounded-t-2xl h-[80%]">
                    {/* Header */}
                    <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
                        <Text className="text-lg font-bold text-gray-800">Pilih Produk</Text>
                        <TouchableOpacity onPress={onClose} className="p-2 bg-gray-100 rounded-full">
                            <X color="#4B5563" size={20} />
                        </TouchableOpacity>
                    </View>

                    {/* Search */}
                    <View className="px-6 py-4 border-b border-gray-100">
                        <View className="bg-gray-100 flex-row items-center px-4 h-12 rounded-xl">
                            <Search color="#9CA3AF" size={18} />
                            <TextInput
                                className="flex-1 ml-2 text-sm text-gray-800"
                                placeholder="Cari kode atau nama..."
                                placeholderTextColor="#9CA3AF"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </View>
                    </View>

                    {/* List */}
                    <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
                        {filtered.length === 0 ? (
                            <Text className="text-center text-gray-400 mt-10">Produk tidak ditemukan</Text>
                        ) : (
                            filtered.map((product) => (
                                <TouchableOpacity
                                    key={product.id_product}
                                    onPress={() => onSelect(product)}
                                    className="flex-row items-center p-4 border-b border-gray-50"
                                >
                                    <View className="w-10 h-10 rounded-full items-center justify-center mr-4" style={{ backgroundColor: theme.colors.primaryContainer }}>
                                        <Tag color={theme.colors.primary} size={20} />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-gray-800 font-bold mb-1">{product.nm_product}</Text>
                                        <Text className="text-gray-500 text-xs">{product.code_product}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))
                        )}
                        <View className="h-10" />
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}
