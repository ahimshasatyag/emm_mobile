import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, KeyboardAvoidingView, Platform, ScrollView, Switch } from 'react-native';
import { X, Save, Trash2 } from 'lucide-react-native';
import { theme } from '../../../theme/theme';
import { AssetSerialNumber } from '../types/assests.types';
import { ToastMessages } from '../../../components/ui/ToastMessages';
import { useAssestSNForm } from '../hooks/useAssests';

interface Props {
    visible: boolean;
    onClose: () => void;
    onSave: (name: string, sn: string, isMain: boolean) => void;
    initialData?: AssetSerialNumber | null;
    onDelete?: () => void;
    isReadOnly?: boolean;
    onShowToast?: (message: string, type: 'success' | 'error') => void;
}

export function AssetsManagementSNModal({ visible, onClose, onSave, initialData, onDelete, isReadOnly = false, onShowToast }: Props) {
    const { name, setName, sn, setSn, isMain, setIsMain, validateForm } = useAssestSNForm(initialData, visible);

    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('error');

    const handleSave = () => {
        const errorMsg = validateForm();
        if (errorMsg) {
            setToastType('error');
            setToastMessage(errorMsg);
            setToastVisible(true);
            return;
        }

        onSave(name, sn, isMain);
        if (onShowToast) {
            onShowToast(initialData ? 'Serial Number berhasil diperbarui' : 'Serial Number berhasil ditambahkan', 'success');
        }
        onClose();
    };

    const handleDelete = () => {
        if (onDelete) onDelete();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <ToastMessages
                visible={toastVisible}
                type={toastType}
                title={toastType === 'error' ? 'Validasi' : 'Sukses'}
                message={toastMessage}
                onClose={() => setToastVisible(false)}
            />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                className="flex-1 justify-end bg-black/50"
            >
                <View className="bg-white rounded-t-3xl p-6" style={{ maxHeight: '90%' }}>
                    {/* Header */}
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="text-xl font-bold text-gray-800">
                            {isReadOnly ? 'Detail Serial Number' : (initialData ? 'Edit Serial Number' : 'Tambah Serial Number')}
                        </Text>
                        <TouchableOpacity onPress={onClose} className="bg-gray-100 p-2 rounded-full">
                            <X color="#6b7280" size={20} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} style={{ flexGrow: 0 }}>
                        <View className="mb-4">
                            <Text className="text-sm font-bold text-gray-700 mb-2">Name <Text className="text-red-500">*</Text></Text>
                            <TextInput
                                className={`px-4 py-3 rounded-xl border ${isReadOnly ? 'bg-gray-100 border-gray-200 text-gray-500' : 'bg-white border-gray-200 text-gray-900'}`}
                                placeholder="Misal: Mesin"
                                value={name}
                                onChangeText={setName}
                                editable={!isReadOnly}
                            />
                        </View>

                        <View className="mb-4">
                            <Text className="text-sm font-bold text-gray-700 mb-2">Serial Number <Text className="text-red-500">*</Text></Text>
                            <TextInput
                                className={`px-4 py-3 rounded-xl border ${isReadOnly ? 'bg-gray-100 border-gray-200 text-gray-500' : 'bg-white border-gray-200 text-gray-900'}`}
                                placeholder="Input Serial Number"
                                value={sn}
                                onChangeText={setSn}
                                editable={!isReadOnly}
                            />
                        </View>

                        <View className="flex-row items-center justify-between mb-6 px-1">
                            <Text className="text-sm font-bold text-gray-700">Jadikan Utama</Text>
                            <Switch
                                value={isMain}
                                onValueChange={setIsMain}
                                trackColor={{ false: '#d1d5db', true: theme.colors.primaryContainer }}
                                thumbColor={isMain ? theme.colors.primary : '#f3f4f6'}
                                disabled={isReadOnly}
                            />
                        </View>
                    </ScrollView>

                    {/* Footer / Action Buttons */}
                    {!isReadOnly && (
                        <View className="pt-4 border-t border-gray-100 flex-row gap-3">
                            {initialData && onDelete && (
                                <TouchableOpacity
                                    onPress={handleDelete}
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
                                <Text className="text-white font-bold text-lg">Simpan SN</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}
