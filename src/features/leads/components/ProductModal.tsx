import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Slider from '@react-native-community/slider';
import { formatRp } from '../../../utils/helpers/money';
import { theme } from '../../../theme/theme';
import { X, Check, Trash2, Save } from 'lucide-react-native';

interface ProductModalProps {
    visible: boolean;
    onDismiss: () => void;
    onSave: (product: {
        id_product: string;
        product_price: number;
        nqty: number;
        persentase: number;
    }) => void;
    onDelete?: () => void;
    productsList: { id_product: string; code_product: string; nm_product: string }[];
    initialData?: {
        id_product: string;
        product_price: number;
        nqty: number;
        persentase: number;
    } | null;
    isReadOnly?: boolean;
}

export const ProductModal = ({ visible, onDismiss, onSave, onDelete, productsList, initialData, isReadOnly = false }: ProductModalProps) => {
    const [idProduct, setIdProduct] = useState('');
    const [namaBarang, setNamaBarang] = useState('');
    const [price, setPrice] = useState(0);
    const [qty, setQty] = useState(1);
    const [persentase, setPersentase] = useState(0);

    // Reset atau isi form saat modal dibuka
    useEffect(() => {
        if (visible) {
            if (initialData) {
                setIdProduct(initialData.id_product);
                const product = productsList.find(p => p.id_product === initialData.id_product);
                setNamaBarang(product ? product.nm_product : '');
                setPrice(initialData.product_price);
                setQty(initialData.nqty);
                setPersentase(initialData.persentase);
            } else {
                setIdProduct('');
                setNamaBarang('');
                setPrice(0);
                setQty(1);
                setPersentase(0);
            }
        }
    }, [visible, initialData]);

    // Update nama barang otomatis
    const handleProductSelect = (selectedId: string) => {
        setIdProduct(selectedId);
        const product = productsList.find(p => p.id_product === selectedId);
        if (product) {
            setNamaBarang(product.nm_product);
        } else {
            setNamaBarang('');
        }
    };

    const handleSave = () => {
        if (!idProduct) {
            alert('Mohon pilih Kode Barang');
            return;
        }
        if (qty <= 0) {
            alert('Qty minimal 1');
            return;
        }

        onSave({
            id_product: idProduct,
            product_price: price,
            nqty: qty,
            persentase: persentase
        });
        onDismiss();
    };

    const subtotal = price * qty;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onDismiss}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                className="flex-1 justify-end bg-black/50"
            >
                <View className="bg-white rounded-t-3xl p-6" style={{ maxHeight: '90%' }}>
                    {/* Header */}
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="text-xl font-bold text-gray-800">Tambah Barang</Text>
                        <TouchableOpacity onPress={onDismiss} className="bg-gray-100 p-2 rounded-full">
                            <X color="#6b7280" size={20} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} style={{ flexGrow: 0 }}>
                        {/* Kode Barang */}
                        <View className="mb-4">
                            <Text className="text-sm font-bold text-gray-700 mb-2">Kode Barang</Text>
                            <View className="border border-gray-200 rounded-xl bg-white">
                                <Dropdown
                                    style={{ height: 50, paddingHorizontal: 16 }}
                                    data={productsList.map(p => ({ label: p.code_product, value: p.id_product }))}
                                    labelField="label"
                                    valueField="value"
                                    search
                                    searchPlaceholder="Cari kode..."
                                    placeholder="Pilih Kode"
                                    value={idProduct}
                                    onChange={opt => handleProductSelect(opt.value)}
                                    disable={isReadOnly}
                                />
                            </View>
                        </View>

                        {/* Nama Barang */}
                        <View className="mb-4">
                            <Text className="text-sm font-bold text-gray-700 mb-2">Nama Barang</Text>
                            <TextInput
                                className="bg-gray-100 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold"
                                value={namaBarang}
                                editable={false}
                                placeholder="Otomatis terisi"
                            />
                        </View>

                        {/* Price & Qty */}
                        <View className="flex-row gap-4 mb-4">
                            <View className="flex-1">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Price (Rp)</Text>
                                <TextInput
                                    className="bg-white px-4 py-3 rounded-xl border border-gray-200 text-gray-900"
                                    value={price.toString()}
                                    onChangeText={t => setPrice(parseInt(t.replace(/[^0-9]/g, '')) || 0)}
                                    keyboardType="numeric"
                                    editable={!isReadOnly}
                                />
                            </View>
                            <View className="w-24">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Qty</Text>
                                <TextInput
                                    className="bg-white px-4 py-3 rounded-xl border border-gray-200 text-gray-900"
                                    value={qty.toString()}
                                    onChangeText={t => setQty(parseInt(t.replace(/[^0-9]/g, '')) || 0)}
                                    keyboardType="numeric"
                                    textAlign="center"
                                    editable={!isReadOnly}
                                />
                            </View>
                        </View>

                        {/* Success % */}
                        <View className="mb-6">
                            <View className="flex-row items-center justify-between mb-2">
                                <Text className="text-sm font-bold text-gray-700">Success (%)</Text>
                                <Text className="text-sm font-bold" style={{ color: theme.colors.primary }}>{persentase}%</Text>
                            </View>
                            <Slider
                                style={{ width: '100%', height: 40 }}
                                minimumValue={0}
                                maximumValue={100}
                                step={10}
                                value={persentase}
                                onValueChange={setPersentase}
                                minimumTrackTintColor={theme.colors.primary}
                                maximumTrackTintColor="#E5E7EB"
                                thumbTintColor={theme.colors.primary}
                                disabled={isReadOnly}
                            />
                        </View>

                        {/* Subtotal */}
                        <View className="p-4 rounded-xl border bg-gray-50 border-gray-200 mb-6">
                            <Text className="text-sm font-bold mb-1 text-gray-500">Subtotal</Text>
                            <Text className="font-bold text-lg text-gray-900">{formatRp(subtotal)}</Text>
                        </View>

                    </ScrollView>

                    {/* Footer / Action Buttons */}
                    {!isReadOnly && (
                        <View className="pt-4 border-t border-gray-100 flex-row gap-3">
                            {initialData && onDelete && (
                                <TouchableOpacity
                                    onPress={() => {
                                        onDelete();
                                        onDismiss();
                                    }}
                                    className="p-4 rounded-2xl items-center justify-center bg-red-50 border border-red-100"
                                >
                                    <Trash2 color="#ef4444" size={20} />
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity
                                onPress={handleSave}
                                className="flex-1 py-4 rounded-2xl flex-row items-center justify-center"
                                style={{ backgroundColor: theme.colors.primary, elevation: 4, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                            >
                                <Save color="#fff" size={20} className="mr-2" />
                                <Text className="text-white font-bold text-lg">Simpan Barang</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};
