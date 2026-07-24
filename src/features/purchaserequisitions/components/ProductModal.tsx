import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { theme } from '../../../theme/theme';
import { X, Save, Trash2 } from 'lucide-react-native';
import { PurchaseRequisitionDetail } from '../types/purchaserequisitions';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';
import { validateProductForm } from '../hooks/usePurchaseRequisitions';

interface ProductModalProps {
    visible: boolean;
    onDismiss: () => void;
    onSave: (product: {
        id_product: string;
        nm_product: string;
        qty: number;
        satuan: string;
        note: string;
    }) => void;
    onDelete?: () => void;
    productsList: { id_product: string; code_product: string; nm_product: string, satuan?: string }[];
    initialData?: PurchaseRequisitionDetail | null;
    isReadOnly?: boolean;
}

export const ProductModal = ({ visible, onDismiss, onSave, onDelete, productsList, initialData, isReadOnly = false }: ProductModalProps) => {
    const [idProduct, setIdProduct] = useState('');
    const [namaBarang, setNamaBarang] = useState('');
    const [qty, setQty] = useState(1);
    const [satuan, setSatuan] = useState('Unit');
    const [note, setNote] = useState('');
    const [toast, setToast] = useState<{ visible: boolean; message: string; type: ToastType; title?: string }>({
        visible: false,
        message: '',
        type: 'error'
    });

    useEffect(() => {
        if (visible) {
            if (initialData) {
                setIdProduct(initialData.id_product);
                setNamaBarang(initialData.nm_product);
                setQty(initialData.qty);
                setSatuan(initialData.nm_product_satuan || 'Unit');
                setNote(initialData.note || '');
            } else {
                setIdProduct('');
                setNamaBarang('');
                setQty(1);
                setSatuan('Unit');
                setNote('');
            }
        }
    }, [visible, initialData]);

    const handleProductSelect = (selectedId: string) => {
        setIdProduct(selectedId);
        const product = productsList.find(p => p.id_product === selectedId);
        if (product) {
            setNamaBarang(product.nm_product);
            if (product.satuan) setSatuan(product.satuan);
        } else {
            setNamaBarang('');
        }
    };

    const handleSave = () => {
        const errorMsg = validateProductForm({ code_product: idProduct });
        if (errorMsg) {
            setToast({ visible: true, type: 'error', message: errorMsg, title: 'Validasi' });
            return;
        }
        if (qty <= 0) {
            setToast({ visible: true, type: 'error', message: 'Qty minimal 1', title: 'Validasi' });
            return;
        }

        onSave({
            id_product: idProduct,
            nm_product: namaBarang,
            qty: qty,
            satuan: satuan,
            note: note
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
                <ToastMessages
                    visible={toast.visible}
                    title={toast.title || 'Error'}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(prev => ({ ...prev, visible: false }))}
                />
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

                        {/* Qty & Satuan */}
                        <View className="flex-row gap-4 mb-4">
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
                                <Text className="text-sm font-bold text-gray-700 mb-2">Satuan</Text>
                                <TextInput
                                    className="bg-white px-4 py-3 rounded-xl border border-gray-200 text-gray-900"
                                    value={satuan}
                                    onChangeText={setSatuan}
                                    editable={!isReadOnly}
                                />
                            </View>
                        </View>

                        {/* Notes */}
                        <View className="mb-6">
                            <Text className="text-sm font-bold text-gray-700 mb-2">Catatan / Notes</Text>
                            <TextInput
                                className="bg-white px-4 py-3 rounded-xl border border-gray-200 text-gray-900"
                                style={{ minHeight: 100 }}
                                multiline={true}
                                numberOfLines={4}
                                textAlignVertical="top"
                                value={note}
                                onChangeText={setNote}
                                placeholder="Opsional"
                                editable={!isReadOnly}
                            />
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
