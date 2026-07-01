import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { X, Save } from 'lucide-react-native';

interface SparepartModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (data: { nama_part: string; qty: string; harga: string }) => void;
}

export function SparepartModal({ visible, onClose, onSave }: SparepartModalProps) {
    const [namaPart, setNamaPart] = useState('');
    const [qty, setQty] = useState('');
    const [harga, setHarga] = useState('');

    const handleSave = () => {
        onSave({
            nama_part: namaPart,
            qty: qty,
            harga: harga,
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
            animationType="fade"
            transparent={true}
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 bg-black/50 justify-center items-center p-4"
            >
                <View className="bg-white w-full rounded-2xl shadow-lg overflow-hidden">
                    {/* Header */}
                    <View className="flex-row justify-between items-center bg-gray-50 p-4 border-b border-gray-200">
                        <Text className="text-base font-bold text-gray-800">Tambah Sparepart</Text>
                        <TouchableOpacity onPress={handleClose} className="p-1">
                            <X size={20} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    {/* Body */}
                    <ScrollView className="p-4" keyboardShouldPersistTaps="handled">
                        <View className="mb-4">
                            <Text className="text-xs font-bold text-gray-700 mb-2">Nama Part <Text className="text-red-500">*</Text></Text>
                            <TextInput
                                className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-800 bg-white"
                                placeholder="Masukkan nama part..."
                                placeholderTextColor="#9CA3AF"
                                value={namaPart}
                                onChangeText={setNamaPart}
                            />
                        </View>

                        <View className="flex-row space-x-3 mb-2">
                            <View className="flex-1">
                                <Text className="text-xs font-bold text-gray-700 mb-2">Harga <Text className="text-red-500">*</Text></Text>
                                <View className="flex-row items-center px-3 border border-gray-300 rounded-lg h-[42px] bg-white">
                                    <Text className="text-sm text-gray-500 mr-2">Rp</Text>
                                    <TextInput
                                        className="flex-1 text-sm text-gray-800 p-0"
                                        placeholder="0"
                                        placeholderTextColor="#9CA3AF"
                                        keyboardType="numeric"
                                        value={harga}
                                        onChangeText={setHarga}
                                    />
                                </View>
                            </View>
                            
                            <View className="w-1/3">
                                <Text className="text-xs font-bold text-gray-700 mb-2">Qty <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-800 bg-white h-[42px] text-center"
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
                    <View className="flex-row justify-end items-center p-4 border-t border-gray-200 bg-gray-50">
                        <TouchableOpacity 
                            className="px-4 py-2 rounded-lg mr-3"
                            onPress={handleClose}
                        >
                            <Text className="text-gray-600 font-bold text-sm">Batal</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            className="bg-emerald-500 px-5 py-2 rounded-lg flex-row items-center"
                            onPress={handleSave}
                        >
                            <Save size={16} color="white" />
                            <Text className="text-white font-bold text-sm ml-2">Simpan Part</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}
