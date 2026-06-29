import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Search, X, Check } from 'lucide-react-native';
import { BrosurProduct } from '../types/brosur.types';
import { theme } from '../../../theme/theme';

interface BrosurProductSelectorProps {
    visible: boolean;
    products: BrosurProduct[];
    onClose: () => void;
    onSelect: (product: BrosurProduct) => void;
}

export function BrosurProductSelector({ visible, products, onClose, onSelect }: BrosurProductSelectorProps) {
    const [search, setSearch] = useState('');

    const filteredProducts = products.filter(p => 
        p.nm_product.toLowerCase().includes(search.toLowerCase()) || 
        p.code_product.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-end bg-black/50">
                <KeyboardAvoidingView 
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    className="bg-white rounded-t-3xl h-[80%]"
                >
                    <View className="flex-row items-center justify-between p-4 border-b border-gray-100">
                        <Text className="text-lg font-bold text-gray-800">Pilih Barang</Text>
                        <TouchableOpacity onPress={onClose} className="p-2 bg-gray-100 rounded-full">
                            <X size={20} color="#6b7280" />
                        </TouchableOpacity>
                    </View>

                    <View className="p-4 border-b border-gray-100">
                        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-2">
                            <Search size={20} color="#9ca3af" />
                            <TextInput
                                className="flex-1 ml-2 text-base text-gray-800 py-1.5"
                                placeholder="Cari kode atau nama barang..."
                                value={search}
                                onChangeText={setSearch}
                                autoFocus={true}
                            />
                            {search.length > 0 && (
                                <TouchableOpacity onPress={() => setSearch('')}>
                                    <X size={18} color="#9ca3af" />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    <FlatList
                        data={filteredProducts}
                        keyExtractor={(item) => item.id_product}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                className="flex-row items-center px-6 py-4 border-b border-gray-50"
                                onPress={() => {
                                    onSelect(item);
                                    setSearch('');
                                }}
                            >
                                <View className="flex-1">
                                    <Text className="text-sm font-bold text-gray-900 mb-0.5">{item.code_product}</Text>
                                    <Text className="text-sm text-gray-600">{item.nm_product}</Text>
                                </View>
                                <View className="w-6 h-6 rounded-full border border-gray-300 items-center justify-center bg-gray-50">
                                    {/* Placeholder for selected state if needed later */}
                                </View>
                            </TouchableOpacity>
                        )}
                        ListEmptyComponent={() => (
                            <View className="items-center justify-center p-10">
                                <Text className="text-gray-500">Tidak ada barang yang ditemukan.</Text>
                            </View>
                        )}
                        keyboardShouldPersistTaps="handled"
                    />
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}
