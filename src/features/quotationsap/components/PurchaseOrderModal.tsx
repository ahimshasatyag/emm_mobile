import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { theme } from '../../../theme/theme';
import { X, Save, Trash2 } from 'lucide-react-native';
import { formatRp } from '../../../utils/helpers/money';
import { PurchaseOrderOptionTable } from './PurchaseOrderOptionTable';

interface Product {
    id_product: string;
    code_product: string;
    nm_product: string;
    deskripsi?: string;
    satuan?: string;
    price?: number;
}

interface PurchaseOrderModalProps {
    visible: boolean;
    onDismiss: () => void;
    onSave: (product: any) => void;
    onDelete?: () => void;
    productsList: Product[];
    initialData?: any | null;
    isReadOnly?: boolean;
}

export const PurchaseOrderModal = ({ visible, onDismiss, onSave, onDelete, productsList, initialData, isReadOnly = false }: PurchaseOrderModalProps) => {
    // States
    const [idProduct, setIdProduct] = useState('');
    const [namaBarang, setNamaBarang] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [note, setNote] = useState('');
    const [satuan, setSatuan] = useState('Unit');
    const [price, setPrice] = useState(0);
    const [qty, setQty] = useState(1);
    
    // Dummy options
    const [options, setOptions] = useState<any[]>([]);

    useEffect(() => {
        if (visible) {
            if (initialData) {
                setIdProduct(initialData.id_product);
                setNamaBarang(initialData.nm_product);
                setDeskripsi(initialData.deskripsi || '');
                setNote(initialData.note || '');
                setSatuan(initialData.satuan || 'Unit');
                setPrice(initialData.price || 0);
                setQty(initialData.qty || 1);
                
                // Set options based on initialData if exists, or generate dummy
                setOptions(initialData.options || [
                    { nm_product_opt: 'Option A', harga: 5000, selected: false },
                    { nm_product_opt: 'Option B', harga: 15000, selected: false }
                ]);
            } else {
                setIdProduct('');
                setNamaBarang('');
                setDeskripsi('');
                setNote('');
                setSatuan('Unit');
                setPrice(0);
                setQty(1);
                setOptions([]);
            }
        }
    }, [visible, initialData]);

    const handleProductSelect = (selectedId: string) => {
        setIdProduct(selectedId);
        const product = productsList.find(p => p.id_product === selectedId);
        if (product) {
            setNamaBarang(product.nm_product);
            setDeskripsi(product.deskripsi || 'Deskripsi Produk Dummy');
            if (product.satuan) setSatuan(product.satuan);
            if (product.price) setPrice(product.price);
            
            // Generate dummy options when product is selected
            setOptions([
                { nm_product_opt: `Opsi Khusus ${product.code_product} A`, harga: 5000, selected: false },
                { nm_product_opt: `Opsi Khusus ${product.code_product} B`, harga: 10000, selected: false },
            ]);
        } else {
            setNamaBarang('');
            setDeskripsi('');
            setOptions([]);
        }
    };

    const handleToggleOption = (index: number) => {
        if (isReadOnly) return;
        setOptions(prev => {
            const next = [...prev];
            next[index] = { ...next[index], selected: !next[index].selected };
            return next;
        });
    };

    const handlePriceChange = (index: number, newPrice: number) => {
        if (isReadOnly) return;
        setOptions(prev => {
            const next = [...prev];
            next[index] = { ...next[index], harga: newPrice };
            return next;
        });
    };

    const subtotal = useMemo(() => {
        const optionTotal = options.filter(o => o.selected).reduce((acc, curr) => acc + (curr.harga || 0), 0);
        return qty * (price + optionTotal);
    }, [qty, price, options]);

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
            nm_product: namaBarang,
            deskripsi,
            note,
            satuan,
            price,
            qty,
            subtotal,
            options: options
        });
        onDismiss();
    };

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
                        <Text className="text-xl font-bold text-gray-800">
                            {isReadOnly ? 'Detail Barang' : (initialData ? 'Edit Barang' : 'Tambah Barang')}
                        </Text>
                        <TouchableOpacity onPress={onDismiss} className="bg-gray-100 p-2 rounded-full">
                            <X color="#6b7280" size={20} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} style={{ flexGrow: 0 }}>
                        {/* Kode Barang */}
                        <View className="mb-4">
                            <Text className="text-sm font-bold text-gray-700 mb-2">Kode Barang <Text className="text-red-500">*</Text></Text>
                            <View className="border border-gray-200 rounded-xl bg-white">
                                <Dropdown
                                    style={{ height: 50, paddingHorizontal: 16 }}
                                    data={productsList.map(p => ({ label: p.code_product, value: p.id_product }))}
                                    labelField="label"
                                    valueField="value"
                                    search
                                    searchPlaceholder="Cari kode..."
                                    placeholder="Pilih Kode Barang"
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

                        {/* Deskripsi Barang */}
                        <View className="mb-4">
                            <Text className="text-sm font-bold text-gray-700 mb-2">Deskripsi Barang</Text>
                            <TextInput
                                className="bg-gray-100 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold"
                                value={deskripsi}
                                editable={false}
                                placeholder="Otomatis terisi"
                                multiline
                            />
                        </View>

                        {/* Notes */}
                        <View className="mb-4">
                            <Text className="text-sm font-bold text-gray-700 mb-2">Notes</Text>
                            <TextInput
                                className="bg-white p-4 rounded-xl border border-gray-200 text-gray-900 h-24"
                                value={note}
                                onChangeText={setNote}
                                editable={!isReadOnly}
                                placeholder="Masukkan catatan"
                                multiline
                                textAlignVertical="top"
                            />
                        </View>

                        {/* Price & Satuan */}
                        <View className="flex-row gap-4 mb-4">
                            <View className="flex-1">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Price <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className="bg-white px-4 py-3 rounded-xl border border-gray-200 text-gray-900"
                                    value={price.toString()}
                                    onChangeText={t => setPrice(parseInt(t.replace(/[^0-9]/g, '')) || 0)}
                                    keyboardType="numeric"
                                    editable={!isReadOnly}
                                />
                            </View>
                            <View className="flex-[0.7]">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Satuan</Text>
                                <TextInput
                                    className="bg-white px-4 py-3 rounded-xl border border-gray-200 text-gray-900"
                                    value={satuan}
                                    onChangeText={setSatuan}
                                    editable={!isReadOnly}
                                />
                            </View>
                        </View>

                        {/* Qty & Subtotal */}
                        <View className="flex-row gap-4 mb-6">
                            <View className="flex-1">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Qty <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className="bg-white px-4 py-3 rounded-xl border border-gray-200 text-gray-900"
                                    value={qty.toString()}
                                    onChangeText={t => setQty(parseInt(t.replace(/[^0-9]/g, '')) || 0)}
                                    keyboardType="numeric"
                                    editable={!isReadOnly}
                                />
                            </View>
                            <View className="flex-1">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Subtotal</Text>
                                <TextInput
                                    className="bg-gray-100 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold"
                                    value={formatRp(subtotal)}
                                    editable={false}
                                />
                            </View>
                        </View>

                        {/* Options Table */}
                        {idProduct ? (
                            <View className="mb-6">
                                <Text className="text-sm font-bold text-gray-700 mb-3">Options</Text>
                                <PurchaseOrderOptionTable 
                                    options={options} 
                                    onToggleOption={handleToggleOption} 
                                    onPriceChange={handlePriceChange}
                                />
                            </View>
                        ) : null}
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
