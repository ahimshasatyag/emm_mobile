import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { X, Save } from 'lucide-react-native';
import { theme } from '../../../theme/theme';
import { useLkt } from '../hooks/useLkt';
import { ToastMessages } from '../../../components/ui/ToastMessages';
import { formatInputNumber, parseInputNumber } from '../../../utils/helpers/money';

interface SparepartModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (data: { nama_part: string; qty: string; harga: string }) => void;
}

export function SparepartModal({ visible, onClose, onSave }: SparepartModalProps) {
    const { validateSparepartForm } = useLkt();
    
    const [namaPart, setNamaPart] = useState('');
    const [qty, setQty] = useState('');
    const [harga, setHarga] = useState('');
    const [toast, setToast] = useState({ visible: false, message: '' });

    const handleSave = () => {
        const errorMsg = validateSparepartForm({ nama_part: namaPart, qty: qty, harga: harga });
        
        if (errorMsg) {
            setToast({ visible: true, message: errorMsg });
            return;
        }

        onSave({
            nama_part: namaPart,
            qty: qty,
            harga: parseInputNumber(harga),
        });
        
        // Reset form
        setNamaPart('');
        setQty('');
        setHarga('');
    };

    const handleClose = () => {
        // Reset form on close
        setNamaPart('');
        setQty('');
        setHarga('');
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={handleClose}
        >
            <ToastMessages 
                visible={toast.visible}
                type="error"
                title="Validasi"
                message={toast.message}
                onClose={() => setToast({ visible: false, message: '' })}
            />
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                className="flex-1 justify-end bg-black/50"
            >
                <View className="bg-white rounded-t-3xl p-6" style={{ maxHeight: '90%' }}>
                    {/* Header */}
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="text-xl font-bold text-gray-800">Tambah Sparepart</Text>
                        <TouchableOpacity onPress={handleClose} className="bg-gray-100 p-2 rounded-full">
                            <X size={20} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    {/* Body */}
                    <ScrollView showsVerticalScrollIndicator={false} style={{ flexGrow: 0 }} keyboardShouldPersistTaps="handled">
                        <View className="mb-4">
                            <Text className="text-sm font-bold text-gray-700 mb-2">Nama Part <Text className="text-red-500">*</Text></Text>
                            <TextInput
                                className="bg-white px-4 py-3 rounded-xl border border-gray-200 text-gray-900"
                                placeholder="Masukkan nama part..."
                                placeholderTextColor="#9CA3AF"
                                value={namaPart}
                                onChangeText={setNamaPart}
                            />
                        </View>

                        <View className="flex-row gap-4 mb-6">
                            <View className="flex-1">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Harga <Text className="text-red-500">*</Text></Text>
                                <View className="flex-row items-center px-4 rounded-xl border border-gray-200 bg-white h-[50px]">
                                    <Text className="text-sm text-gray-500 mr-2">Rp</Text>
                                    <TextInput
                                        className="flex-1 text-sm text-gray-900 p-0"
                                        placeholder="0"
                                        placeholderTextColor="#9CA3AF"
                                        keyboardType="numeric"
                                        value={harga}
                                        onChangeText={text => setHarga(formatInputNumber(text))}
                                    />
                                </View>
                            </View>
                            
                            <View className="flex-[0.6]">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Qty <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className="bg-white px-4 py-3 rounded-xl border border-gray-200 text-gray-900 h-[50px] text-center"
                                    placeholder="0"
                                    placeholderTextColor="#9CA3AF"
                                    keyboardType="numeric"
                                    value={qty}
                                    onChangeText={setQty}
                                />
                            </View>
                        </View>
                    </ScrollView>

                    {/* Footer / Actions */}
                    <View className="pt-4 border-t border-gray-100 flex-row gap-3">
                        <TouchableOpacity
                            onPress={handleSave}
                            className="flex-1 py-4 rounded-2xl flex-row items-center justify-center"
                            style={{ backgroundColor: theme.colors.primary, elevation: 4, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                        >
                            <Save color="#fff" size={20} className="mr-2" />
                            <Text className="text-white font-bold text-lg">Simpan Part</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}
