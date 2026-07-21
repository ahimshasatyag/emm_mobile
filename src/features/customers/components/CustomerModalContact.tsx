import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { X, Save, Trash2 } from 'lucide-react-native';
import { theme } from '../../../theme/theme';
import { CustomerContact } from '../types/customers.types';

interface CustomerModalContactProps {
    visible: boolean;
    onDismiss: () => void;
    onSave: (data: CustomerContact) => void;
    initialData?: CustomerContact | null;
    onDelete?: () => void;
    readOnly?: boolean;
}

export const CustomerModalContact: React.FC<CustomerModalContactProps> = ({
    visible,
    onDismiss,
    onSave,
    initialData,
    onDelete,
    readOnly = false
}) => {
    const [nama, setNama] = useState('');
    const [posisi, setPosisi] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        if (visible) {
            if (initialData) {
                setNama(initialData.nm_customers_contact || '');
                setPosisi(initialData.customers_contact_posisi || '');
                setPhone(initialData.customers_contact_phone || '');
                setEmail(initialData.customers_contact_email || '');
            } else {
                setNama('');
                setPosisi('');
                setPhone('');
                setEmail('');
            }
        }
    }, [visible, initialData]);

    const handleSave = () => {
        if (!nama) return; // Prevent saving without name
        onSave({
            ...(initialData ? initialData : {}),
            nm_customers_contact: nama,
            customers_contact_posisi: posisi,
            customers_contact_phone: phone,
            customers_contact_email: email,
        } as CustomerContact);
        onDismiss();
    };

    const isFormValid = nama.trim() !== '';

    const getInputClass = () => {
        return readOnly 
            ? "border-transparent bg-gray-50 text-gray-800" 
            : "border-gray-200 bg-white focus:border-[#9e0b0f] text-gray-900";
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
                <View className="bg-white rounded-t-3xl min-h-[50%] max-h-[90%]">
                    {/* Header */}
                    <View className="flex-row items-center justify-between p-5 border-b border-gray-100">
                        <Text className="text-lg font-bold text-gray-800">
                            {readOnly ? 'Detail Kontak' : (initialData ? 'Edit Kontak' : 'Tambah Kontak')}
                        </Text>
                        <TouchableOpacity onPress={onDismiss} className="p-2 bg-gray-100 rounded-full">
                            <X color="#6B7280" size={20} />
                        </TouchableOpacity>
                    </View>

                    {/* Form Content */}
                    <ScrollView className="p-5" showsVerticalScrollIndicator={false}>
                        <View className="mb-4">
                            <Text className="text-sm font-bold text-gray-700 mb-2">Nama Kontak {!readOnly && <Text className="text-red-500">*</Text>}</Text>
                            <TextInput
                                className={`border rounded-xl px-4 h-12 ${getInputClass()}`}
                                placeholder={readOnly ? '-' : 'Masukkan nama kontak'}
                                value={nama}
                                onChangeText={setNama}
                                editable={!readOnly}
                            />
                        </View>

                        <View className="mb-4">
                            <Text className="text-sm font-bold text-gray-700 mb-2">Posisi</Text>
                            <TextInput
                                className={`border rounded-xl px-4 h-12 ${getInputClass()}`}
                                placeholder={readOnly ? '-' : 'Masukkan jabatan/posisi'}
                                value={posisi}
                                onChangeText={setPosisi}
                                editable={!readOnly}
                            />
                        </View>

                        <View className="mb-4">
                            <Text className="text-sm font-bold text-gray-700 mb-2">No. HP / Telepon</Text>
                            <TextInput
                                className={`border rounded-xl px-4 h-12 ${getInputClass()}`}
                                placeholder={readOnly ? '-' : 'Masukkan nomor telepon'}
                                value={phone}
                                onChangeText={setPhone}
                                editable={!readOnly}
                                keyboardType="phone-pad"
                            />
                        </View>

                        <View className="mb-6">
                            <Text className="text-sm font-bold text-gray-700 mb-2">Email</Text>
                            <TextInput
                                className={`border rounded-xl px-4 h-12 ${getInputClass()}`}
                                placeholder={readOnly ? '-' : 'Masukkan alamat email'}
                                value={email}
                                onChangeText={setEmail}
                                editable={!readOnly}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                        <View className="h-10" />
                    </ScrollView>

                    {/* Footer / Action Buttons */}
                    {!readOnly && (
                        <View className="p-4 border-t border-gray-100 flex-row gap-3 bg-white">
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
                                disabled={!isFormValid}
                                className="flex-1 py-4 rounded-2xl flex-row items-center justify-center"
                                style={{ 
                                    backgroundColor: theme.colors.primary, 
                                    opacity: isFormValid ? 1 : 0.5,
                                    elevation: isFormValid ? 4 : 0, 
                                    shadowColor: theme.colors.primary, 
                                    shadowOffset: { width: 0, height: 4 }, 
                                    shadowOpacity: isFormValid ? 0.3 : 0, 
                                    shadowRadius: 8 
                                }}
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
