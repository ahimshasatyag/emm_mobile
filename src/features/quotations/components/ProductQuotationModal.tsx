import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { X, Trash2 } from 'lucide-react-native';
import { Button } from '../../../components/ui/button';
import { theme } from '../../../theme/theme';

interface ProductQuotationModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (data: any, index?: number) => void;
    initialData?: any;
    editIndex?: number;
    readOnly?: boolean;
}

export function ProductQuotationModal({ visible, onClose, onSave, initialData, editIndex, readOnly }: ProductQuotationModalProps) {
    const [formData, setFormData] = useState({
        product_code: '',
        product_name: '',
        status_barang: '',
        harga: '',
        qty: '1',
        satuan: '',
        delivery_term: '',
        lama_indent: '',
        options: []
    });

    React.useEffect(() => {
        if (visible) {
            if (initialData) {
                setFormData(initialData);
            } else {
                setFormData({
                    product_code: '',
                    product_name: '',
                    status_barang: '',
                    harga: '',
                    qty: '1',
                    satuan: '',
                    delivery_term: '',
                    lama_indent: '',
                    options: []
                });
            }
        }
    }, [visible, initialData]);

    const updateField = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                className="flex-1 bg-black/50 justify-end"
            >
                <View className="bg-white rounded-t-3xl flex-1 mt-16">
                    {/* Header */}
                    <View className="flex-row justify-between items-center p-4 border-b border-gray-100">
                        <Text className="text-lg font-bold text-gray-800">{readOnly ? 'Detail Barang' : (editIndex !== undefined ? 'Edit Barang' : 'Tambah Barang')}</Text>
                        <TouchableOpacity onPress={onClose} className="p-2 bg-gray-50 rounded-full">
                            <X size={20} color="#6b7280" />
                        </TouchableOpacity>
                    </View>

                    {/* Content */}
                    <ScrollView className="p-4" showsVerticalScrollIndicator={false}>
                        {/* Dropdown Product Code */}
                        <View className="mb-4">
                            <Text className="text-xs text-gray-600 font-medium mb-1.5">Product Code</Text>
                            <View className="border border-gray-200 rounded-lg bg-gray-50 overflow-hidden">
                                <Dropdown
                                    style={{ height: 44, paddingHorizontal: 12 }}
                                    data={[{label: 'P001', value: 'P001'}, {label: 'P002', value: 'P002'}]}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Pilih Product Code..."
                                    value={formData.product_code}
                                    onChange={(item) => updateField('product_code', item.value)}
                                    selectedTextStyle={{ color: readOnly ? '#9ca3af' : '#1f2937', fontSize: 14 }}
                                    placeholderStyle={{ color: '#9ca3af', fontSize: 14 }}
                                    disable={readOnly}
                                />
                            </View>
                        </View>
                        
                        <View className="mb-4">
                            <Text className="text-xs text-gray-600 font-medium mb-1.5">Product Name</Text>
                            <TextInput 
                                className="border border-gray-200 rounded-lg px-3 py-2.5 text-gray-800 text-sm bg-gray-100"
                                value={formData.product_name}
                                editable={false}
                                placeholder="Nama Produk"
                            />
                        </View>

                        <View className="mb-4">
                            <Text className="text-xs text-gray-600 font-medium mb-1.5">Status Barang</Text>
                            <View className="border border-gray-200 rounded-lg bg-gray-50 overflow-hidden">
                                <Dropdown
                                    style={{ height: 44, paddingHorizontal: 12 }}
                                    data={[{label: 'Ready', value: 'READY'}, {label: 'Indent', value: 'INDENT'}]}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Pilih Status..."
                                    value={formData.status_barang}
                                    onChange={(item) => updateField('status_barang', item.value)}
                                    selectedTextStyle={{ color: readOnly ? '#9ca3af' : '#1f2937', fontSize: 14 }}
                                    placeholderStyle={{ color: '#9ca3af', fontSize: 14 }}
                                    disable={readOnly}
                                />
                            </View>
                        </View>

                        {formData.status_barang === 'INDENT' && (
                            <View className="mb-4">
                                <Text className="text-xs text-gray-600 font-medium mb-1.5">Lama Indent (Hari)</Text>
                                <TextInput 
                                    className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-gray-800 text-sm"
                                    placeholder="Contoh: 14"
                                    value={formData.lama_indent}
                                    onChangeText={(v) => updateField('lama_indent', v)}
                                    keyboardType="numeric"
                                    editable={!readOnly}
                                    className={`border border-gray-200 rounded-lg px-3 py-2.5 text-sm ${readOnly ? 'bg-gray-100 text-gray-500' : 'bg-gray-50 text-gray-800'}`}
                                />
                            </View>
                        )}

                        <View className="flex-row gap-4 mb-4">
                            <View className="flex-1">
                                <Text className="text-xs text-gray-600 font-medium mb-1.5">Harga</Text>
                                <TextInput 
                                    className={`border border-gray-200 rounded-lg px-3 py-2.5 text-sm ${readOnly ? 'bg-gray-100 text-gray-500' : 'bg-gray-50 text-gray-800'}`}
                                    value={formData.harga}
                                    onChangeText={(v) => updateField('harga', v)}
                                    keyboardType="numeric"
                                    placeholder="0"
                                    editable={!readOnly}
                                />
                            </View>
                            <View className="flex-1">
                                <Text className="text-xs text-gray-600 font-medium mb-1.5">Qty</Text>
                                <TextInput 
                                    className={`border border-gray-200 rounded-lg px-3 py-2.5 text-sm ${readOnly ? 'bg-gray-100 text-gray-500' : 'bg-gray-50 text-gray-800'}`}
                                    value={formData.qty}
                                    onChangeText={(v) => updateField('qty', v)}
                                    keyboardType="numeric"
                                    placeholder="0"
                                    editable={!readOnly}
                                />
                            </View>
                        </View>

                        <View className="flex-row gap-4 mb-4">
                            <View className="flex-1">
                                <Text className="text-xs text-gray-600 font-medium mb-1.5">Satuan</Text>
                                <TextInput 
                                    className="border border-gray-200 rounded-lg px-3 py-2.5 text-gray-800 text-sm bg-gray-100"
                                    value={formData.satuan}
                                    editable={false}
                                    placeholder="Satuan"
                                />
                            </View>
                            <View className="flex-1">
                                <Text className="text-xs text-gray-600 font-medium mb-1.5">Delivery Term</Text>
                                <TextInput 
                                    className="border border-gray-200 rounded-lg px-3 py-2.5 text-gray-800 text-sm bg-gray-100"
                                    value={formData.delivery_term}
                                    editable={false}
                                    placeholder="Term"
                                />
                            </View>
                        </View>

                        {/* Options Table */}
                        <Text className="text-sm font-bold text-gray-700 mt-2 mb-2">Options / Varian</Text>
                        <View className="border border-gray-200 rounded-xl overflow-hidden mb-8">
                            <View className="flex-row bg-gray-100 p-2 border-b border-gray-200">
                                <Text className="flex-[0.5] text-xs font-bold text-gray-600 text-center">No</Text>
                                <Text className="flex-[1.5] text-xs font-bold text-gray-600">ID & Nama</Text>
                                <Text className="flex-[1.5] text-xs font-bold text-gray-600 text-center">Harga</Text>
                                <Text className="flex-[1] text-xs font-bold text-gray-600 text-center">Qty</Text>
                                <Text className="flex-[0.5] text-xs font-bold text-gray-600 text-center">Aksi</Text>
                            </View>
                            
                            {/* Dummy Row for Mockup */}
                            <View className="flex-row p-2 border-b border-gray-100 items-center">
                                <Text className="flex-[0.5] text-xs text-gray-600 text-center">1</Text>
                                <View className="flex-[1.5]">
                                    <Text className="text-xs text-gray-800 font-medium">OPT-001</Text>
                                    <Text className="text-[10px] text-gray-500">Option Name</Text>
                                </View>
                                <View className="flex-[1.5] px-1">
                                    <TextInput className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-xs text-center" placeholder="0" keyboardType="numeric" />
                                </View>
                                <View className="flex-[1] px-1">
                                    <TextInput className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-xs text-center" placeholder="1" keyboardType="numeric" />
                                </View>
                                <View className="flex-[0.5] items-center">
                                    <TouchableOpacity>
                                        <Trash2 size={16} color="#ef4444" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View className="flex-row p-2 items-center">
                                <Text className="flex-[0.5] text-xs text-gray-600 text-center">2</Text>
                                <View className="flex-[1.5]">
                                    <Text className="text-xs text-gray-800 font-medium">OPT-002</Text>
                                    <Text className="text-[10px] text-gray-500">Extra Option</Text>
                                </View>
                                <View className="flex-[1.5] px-1">
                                    <TextInput className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-xs text-center" placeholder="0" keyboardType="numeric" />
                                </View>
                                <View className="flex-[1] px-1">
                                    <TextInput className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-xs text-center" placeholder="1" keyboardType="numeric" />
                                </View>
                                <View className="flex-[0.5] items-center">
                                    <TouchableOpacity>
                                        <Trash2 size={16} color="#ef4444" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <View className="flex-row gap-3 mt-4 mb-10">
                            {readOnly ? (
                                <Button 
                                    variant="outline"
                                    className="flex-1 h-12 rounded-xl"
                                    onPress={onClose}
                                >
                                    <Text className="font-bold text-gray-700">Tutup</Text>
                                </Button>
                            ) : (
                                <>
                                    <Button 
                                        variant="outline"
                                        className="flex-1 h-12 rounded-xl"
                                        onPress={onClose}
                                    >
                                        <Text className="font-bold text-gray-700">Batal</Text>
                                    </Button>
                                    <Button 
                                        variant="default"
                                        className="flex-1 h-12 rounded-xl"
                                        onPress={() => onSave(formData, editIndex)}
                                    >
                                        <Text className="font-bold text-white">Simpan Barang</Text>
                                    </Button>
                                </>
                            )}
                        </View>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}
