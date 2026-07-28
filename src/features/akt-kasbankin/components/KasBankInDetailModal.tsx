import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { X, Save, Trash2 } from 'lucide-react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Coa, KasBankInDetail } from '../types/kasbankin.types';
import { theme } from '../../../theme/theme';

interface KasBankInDetailModalProps {
    visible: boolean;
    onDismiss: () => void;
    onSave: (data: Partial<KasBankInDetail>) => void;
    coas: Coa[];
    initialData?: Partial<KasBankInDetail> | null;
    onDelete?: () => void;
}

export const KasBankInDetailModal: React.FC<KasBankInDetailModalProps> = ({
    visible,
    onDismiss,
    onSave,
    coas,
    initialData,
    onDelete
}) => {
    const [idCoa, setIdCoa] = useState('');
    const [amount, setAmount] = useState('');
    const [deskripsi, setDeskripsi] = useState('');

    useEffect(() => {
        if (visible) {
            if (initialData) {
                setIdCoa(initialData.id_coa || '');
                setAmount(initialData.v_amount ? initialData.v_amount.toString() : '');
                setDeskripsi(initialData.deskripsi || '');
            } else {
                setIdCoa('');
                setAmount('');
                setDeskripsi('');
            }
        }
    }, [visible, initialData]);

    const formatNumber = (num: string) => {
        return num.replace(/[^0-9]/g, '');
    };

    const formatDisplayNumber = (num: string) => {
        const clean = formatNumber(num);
        if (!clean) return '';
        return parseInt(clean, 10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const handleSave = () => {
        onSave({
            id_coa: idCoa,
            v_amount: amount ? parseInt(formatNumber(amount), 10) : 0,
            deskripsi: deskripsi,
        });
        onDismiss();
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onDismiss}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                className="flex-1 justify-end bg-black/50"
            >
                <View className="bg-white rounded-t-3xl min-h-[50%]">
                    {/* Header */}
                    <View className="flex-row items-center justify-between p-5 border-b border-gray-100">
                        <Text className="text-lg font-bold text-gray-800">
                            {initialData ? 'Edit Detail COA' : 'Tambah Detail COA'}
                        </Text>
                        <TouchableOpacity onPress={onDismiss} className="p-2 bg-gray-100 rounded-full">
                            <X color="#6B7280" size={20} />
                        </TouchableOpacity>
                    </View>

                    {/* Form Content */}
                    <ScrollView className="p-5">
                        <View className="mb-4">
                            <Text className="text-sm font-bold text-gray-700 mb-2">Pilih COA</Text>
                            <View className="border border-gray-200 rounded-xl bg-gray-50 h-12 justify-center">
                                <Dropdown
                                    style={{ height: 48, paddingHorizontal: 16 }}
                                    placeholderStyle={{ fontSize: 14, color: '#9CA3AF' }}
                                    selectedTextStyle={{ fontSize: 14, color: '#1F2937' }}
                                    data={coas.map(c => ({ label: `${c.code_coa} - ${c.coa_name}`, value: c.id_coa }))}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Pilih Akun COA"
                                    value={idCoa}
                                    search
                                    searchPlaceholder="Cari COA..."
                                    inputSearchStyle={{ borderRadius: 8 }}
                                    dropdownPosition="top"
                                    onChange={(selected) => setIdCoa(selected.value)}
                                />
                            </View>
                        </View>

                        <View className="mb-4">
                            <Text className="text-sm font-bold text-gray-700 mb-2">Amount</Text>
                            <TextInput
                                className="border border-gray-200 rounded-xl bg-gray-50 h-12 px-4 text-gray-800"
                                keyboardType="numeric"
                                placeholder="0"
                                placeholderTextColor="#9CA3AF"
                                value={formatDisplayNumber(amount)}
                                onChangeText={(text) => setAmount(formatNumber(text))}
                            />
                        </View>

                        <View className="mb-6">
                            <Text className="text-sm font-bold text-gray-700 mb-2">Deskripsi</Text>
                            <TextInput
                                className="border border-gray-200 rounded-xl bg-gray-50 p-4 text-gray-800"
                                placeholder="Tuliskan keterangan..."
                                placeholderTextColor="#9CA3AF"
                                value={deskripsi}
                                onChangeText={setDeskripsi}
                                multiline
                                numberOfLines={3}
                                textAlignVertical="top"
                                style={{ minHeight: 80 }}
                            />
                        </View>

                    </ScrollView>

                    {/* Footer / Action Buttons */}
                    <View className="p-4 border-t border-gray-100 flex-row gap-3">
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
                            <Text className="text-white font-bold text-lg">Simpan</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};
