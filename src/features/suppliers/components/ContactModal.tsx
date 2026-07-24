import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { X, Save, Trash2 } from 'lucide-react-native';
import { SupplierContact } from '../types/suppliers.types';
import { theme } from '../../../theme/theme';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';
import { validateContactForm } from '../hooks/useSuppliers';

interface ContactModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (contact: SupplierContact) => void;
    onDelete?: () => void;
    initialData?: SupplierContact | null;
    isReadOnly?: boolean;
}

export function ContactModal({ visible, onClose, onSubmit, onDelete, initialData, isReadOnly = false }: ContactModalProps) {
    const [formData, setFormData] = useState<SupplierContact>({
        nm_suppliers_contact: '',
        suppliers_contact_posisi: '',
        suppliers_contact_phone: '',
        suppliers_contact_email: ''
    });

    const [toast, setToast] = useState<{ visible: boolean; message: string; type: ToastType; title?: string }>({
        visible: false,
        message: '',
        type: 'error'
    });

    useEffect(() => {
        if (visible) {
            if (initialData) {
                setFormData(initialData);
            } else {
                setFormData({
                    nm_suppliers_contact: '',
                    suppliers_contact_posisi: '',
                    suppliers_contact_phone: '',
                    suppliers_contact_email: ''
                });
            }
        }
    }, [visible, initialData]);

    const handleSubmit = () => {
        const errorMsg = validateContactForm(formData);
        if (errorMsg) {
            setToast({ visible: true, type: 'error', message: errorMsg, title: 'Peringatan' });
            return;
        }
        onSubmit(formData);
        setFormData({
            nm_suppliers_contact: '',
            suppliers_contact_posisi: '',
            suppliers_contact_phone: '',
            suppliers_contact_email: ''
        });
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
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
                            {isReadOnly ? 'Detail Kontak' : initialData ? 'Edit Kontak' : 'Tambah Kontak'}
                        </Text>
                        <TouchableOpacity onPress={onClose} className="bg-gray-100 p-2 rounded-full">
                            <X color="#6b7280" size={20} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} style={{ flexGrow: 0 }}>
                        <View className="mb-4">
                            <Text className="text-sm font-bold text-gray-700 mb-2">Nama Kontak <Text className="text-red-500">*</Text></Text>
                            <TextInput
                                className={`px-4 py-3 rounded-xl border ${isReadOnly ? 'bg-gray-100 border-gray-200 text-gray-500' : 'bg-white border-gray-200 text-gray-900'}`}
                                placeholder="Nama Lengkap"
                                value={formData.nm_suppliers_contact}
                                onChangeText={(text) => setFormData(prev => ({ ...prev, nm_suppliers_contact: text }))}
                                editable={!isReadOnly}
                            />
                        </View>

                        <View className="mb-4">
                            <Text className="text-sm font-bold text-gray-700 mb-2">Posisi / Jabatan</Text>
                            <TextInput
                                className={`px-4 py-3 rounded-xl border ${isReadOnly ? 'bg-gray-100 border-gray-200 text-gray-500' : 'bg-white border-gray-200 text-gray-900'}`}
                                placeholder="Contoh: Manager, Staff"
                                value={formData.suppliers_contact_posisi}
                                onChangeText={(text) => setFormData(prev => ({ ...prev, suppliers_contact_posisi: text }))}
                                editable={!isReadOnly}
                            />
                        </View>

                        <View className="mb-4">
                            <Text className="text-sm font-bold text-gray-700 mb-2">Nomor Telepon / HP</Text>
                            <TextInput
                                className={`px-4 py-3 rounded-xl border ${isReadOnly ? 'bg-gray-100 border-gray-200 text-gray-500' : 'bg-white border-gray-200 text-gray-900'}`}
                                placeholder="08123456789"
                                keyboardType="phone-pad"
                                value={formData.suppliers_contact_phone}
                                onChangeText={(text) => setFormData(prev => ({ ...prev, suppliers_contact_phone: text }))}
                                editable={!isReadOnly}
                            />
                        </View>

                        <View className="mb-6">
                            <Text className="text-sm font-bold text-gray-700 mb-2">Email</Text>
                            <TextInput
                                className={`px-4 py-3 rounded-xl border ${isReadOnly ? 'bg-gray-100 border-gray-200 text-gray-500' : 'bg-white border-gray-200 text-gray-900'}`}
                                placeholder="email@example.com"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={formData.suppliers_contact_email}
                                onChangeText={(text) => setFormData(prev => ({ ...prev, suppliers_contact_email: text }))}
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
                                        onClose();
                                    }}
                                    className="p-4 rounded-2xl items-center justify-center bg-red-50 border border-red-100"
                                >
                                    <Trash2 color="#ef4444" size={20} />
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity
                                onPress={handleSubmit}
                                className="flex-1 py-4 rounded-2xl flex-row items-center justify-center"
                                style={{ backgroundColor: theme.colors.primary, elevation: 4, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                            >
                                <Save color="#fff" size={20} className="mr-2" />
                                <Text className="text-white font-bold text-lg">Simpan Kontak</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}
