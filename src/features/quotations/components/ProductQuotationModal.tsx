import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { X, Trash2, Save } from 'lucide-react-native';
import { theme } from '../../../theme/theme';
import { ProductQuotationModalTable } from './ProductQuotationModalTable';
import { formatInputNumber, parseInputNumber } from '../../../utils/helpers/money';
import { useQuotationProducts } from '../hooks/useQuotationProducts';

interface ProductQuotationModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (data: any, index?: number) => void;
    onDelete?: (index: number) => void;
    initialData?: any;
    editIndex?: number;
    readOnly?: boolean;
    mata_uang?: string;
    kurs?: number;
    flag_agent?: string;
}

export function ProductQuotationModal({ 
    visible, onClose, onSave, onDelete, initialData, editIndex, readOnly,
    mata_uang = 'IDR', kurs = 1, flag_agent = '0'
}: ProductQuotationModalProps) {
    const { products } = useQuotationProducts();

    const [formData, setFormData] = useState({
        id_product: '',
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
                setFormData({
                    ...initialData,
                    harga: initialData.harga?.toString() || '',
                    qty: initialData.qty?.toString() || '1',
                    lama_indent: initialData.indent_amount?.toString() || initialData.lama_indent?.toString() || '',
                });
            } else {
                setFormData({
                    id_product: '',
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

    const productOptions = products.map((p: any) => ({
        label: p.code_product,
        value: p.id_product,
        originalData: p
    }));

    const handleProductChange = (item: any) => {
        const p = products.find(x => x.id_product === item.value);
        if (p) {
            let base_price = Number(p.product_price) || 0;
            if (flag_agent === '1' || flag_agent === 1) {
                base_price = Number(p.product_price_agent) || 0;
            }
            
            let calculated_price = base_price * (kurs || 1);
            if (mata_uang === 'IDR' && calculated_price > 1000000) {
                calculated_price = Math.ceil(calculated_price / 1000000) * 1000000;
            }

            // Options
            const options = p.options_product ? p.options_product.map((opt: any) => {
                let amount_option = Number(opt.amount) || 0;
                if (mata_uang === 'IDR') {
                    amount_option = amount_option * (kurs || 1);
                }
                return {
                    id_product_price_opt: opt.id_product_price_opt,
                    nm_product_opt: opt.nm_product_opt,
                    amount: amount_option,
                    qty: '1'
                };
            }) : [];

            setFormData(prev => ({
                ...prev,
                id_product: p.id_product,
                product_code: p.code_product,
                product_name: p.nm_product || '',
                harga: calculated_price > 0 ? String(calculated_price) : prev.harga,
                satuan: p.nm_product_satuan || p.satuan?.nm_product_satuan || '',
                delivery_term: p.delivery_term || prev.delivery_term,
                options: options
            }));
        }
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
                                    data={productOptions}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Pilih Product Code..."
                                    value={formData.id_product}
                                    onChange={handleProductChange}
                                    selectedTextStyle={{ color: readOnly ? '#9ca3af' : '#1f2937', fontSize: 14 }}
                                    placeholderStyle={{ color: '#9ca3af', fontSize: 14 }}
                                    disable={readOnly}
                                    search
                                    searchPlaceholder="Cari Produk..."
                                    inputSearchStyle={{ height: 40, fontSize: 14 }}
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
                                    data={[{ label: 'Ready', value: 'READY' }, { label: 'Indent', value: 'INDENT' }]}
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
                                    placeholder="Masukan lama indent"
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
                                    className={`flex-1 h-10 border border-gray-200 rounded-lg px-3 text-sm text-gray-800 ${readOnly ? 'bg-gray-100 text-gray-500' : 'bg-white'}`}
                                    value={formatInputNumber(formData.harga?.toString() || '')}
                                    onChangeText={(text) => setFormData(prev => ({ ...prev, harga: parseInputNumber(text) }))}
                                    keyboardType="numeric"
                                    editable={!readOnly}
                                />
                            </View>
                            <View className="flex-1">
                                <Text className="text-xs text-gray-600 font-medium mb-1.5">Qty</Text>
                                <TextInput
                                    className={`flex-1 h-10 border border-gray-200 rounded-lg px-3 text-sm text-gray-800 ${readOnly ? 'bg-gray-100 text-gray-500' : 'bg-white'}`}
                                    value={formData.qty?.toString()}
                                    onChangeText={(text) => setFormData(prev => ({ ...prev, qty: text }))}
                                    keyboardType="numeric"
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
                        <ProductQuotationModalTable 
                            options={formData.options}
                            readOnly={readOnly}
                            onChange={(index, field, value) => {
                                const newOptions = [...formData.options];
                                (newOptions[index] as any)[field] = value;
                                updateField('options', newOptions);
                            }}
                            onDelete={(index) => {
                                const newOptions = [...formData.options];
                                newOptions.splice(index, 1);
                                updateField('options', newOptions);
                            }}
                        />
                    </ScrollView>

                    {/* Footer / Action Buttons */}
                    {!readOnly && (
                        <View className="p-4 border-t border-gray-100 flex-row gap-3">
                            {editIndex !== undefined && onDelete && (
                                <TouchableOpacity
                                    onPress={() => onDelete(editIndex)}
                                    className="py-4 px-5 rounded-2xl flex-row items-center justify-center bg-red-100"
                                >
                                    <Trash2 color="#ef4444" size={24} />
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity
                                onPress={() => onSave(formData, editIndex)}
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
}
