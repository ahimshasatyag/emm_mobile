import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, TouchableOpacity, Switch, RefreshControl } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation } from '@react-navigation/native';
import { Save, Trash2, Plus, CheckSquare, Square } from 'lucide-react-native';
import { useCustomerForm } from '../hooks/useCustomerForm';
import { CustomerFormSkeleton } from '../skeleton/CustomerFormSkeleton';
import { theme } from '../../../theme/theme';
import Animated, { FadeInUp, FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { Button } from '../../../components/ui/button';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';
import { CustomerTableContact } from '../components/CustomerTableContact';
import { CustomerModalContact } from '../components/CustomerModalContact';
import { CustomerContact } from '../types/customers.types';

export function CustomerFormScreen() {
    const navigation = useNavigation();

    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMsg, setToastMsg] = useState('');
    const [toastType, setToastType] = useState<ToastType>('error');
    const [toastTitle, setToastTitle] = useState('Validasi');

    const [contactModalVisible, setContactModalVisible] = useState(false);
    const [selectedContact, setSelectedContact] = useState<CustomerContact | null>(null);
    const [selectedContactIndex, setSelectedContactIndex] = useState<number | null>(null);

    const {
        formData,
        provinces,
        regencies,
        isSaving,
        error,
        initialLoadDone,
        updateField,
        handleProvinceChange,
        setFormData,
        removeContact,
        save,
        loadInitialData,
        validateForm,
    } = useCustomerForm();

    useEffect(() => {
        loadInitialData();
    }, [loadInitialData]);

    const onSavePress = async () => {
        const validationError = validateForm();
        if (validationError) {
            setToastMsg(validationError);
            setToastType('error');
            setToastTitle('Validasi');
            setToastVisible(true);
            return;
        }
        setConfirmModalVisible(true);
    };

    const handleConfirmSave = async () => {
        setConfirmModalVisible(false);
        const result = await save();
        if (result && result.id_customers) {
            (navigation as any).replace('CustomerEdit', { 
                id: result.id_customers,
                toastMessage: 'Data pelanggan berhasil ditambahkan!',
                toastType: 'success'
            });
        }
    };

    const handleOpenAddContact = () => {
        setSelectedContact(null);
        setSelectedContactIndex(null);
        setContactModalVisible(true);
    };

    const handleOpenEditContact = (contact: CustomerContact, index: number) => {
        setSelectedContact(contact);
        setSelectedContactIndex(index);
        setContactModalVisible(true);
    };

    const handleSaveContact = (contact: CustomerContact) => {
        if (selectedContactIndex !== null) {
            // Edit
            const newContacts = [...formData.contacts];
            newContacts[selectedContactIndex] = contact;
            setFormData({ ...formData, contacts: newContacts });
            
            setToastMsg('Kontak berhasil diperbarui');
        } else {
            // Add
            setFormData({
                ...formData,
                contacts: [...formData.contacts, { ...contact, id_contact: Date.now().toString() }]
            });
            
            setToastMsg('Kontak baru berhasil ditambahkan');
        }
        
        setToastTitle('Sukses');
        setToastType('success');
        setToastVisible(true);
    };

    const handleDeleteContact = (index: number) => {
        removeContact(index);
        setToastTitle('Sukses');
        setToastMsg('Kontak berhasil dihapus');
        setToastType('success');
        setToastVisible(true);
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
            style={{ flex: 1, backgroundColor: theme.colors.background }}
        >
            <HeaderNavigator 
                title={!initialLoadDone ? "MEMUAT DATA..." : "TAMBAH PELANGGAN"}
                showBackButton 
                onBackPress={() => navigation.goBack()} 
            />

            <ScrollView 
                className="flex-1" 
                contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={!initialLoadDone} onRefresh={loadInitialData} colors={[theme.colors.primary]} />
                }
            >
                {!initialLoadDone ? (
                    <Animated.View exiting={FadeOut.duration(300)}>
                        <CustomerFormSkeleton />
                    </Animated.View>
                ) : (
                    <Animated.View entering={FadeIn.duration(600)}>
                        {error && (
                            <Animated.View entering={FadeInUp} className="bg-red-50 p-4 rounded-xl mb-6 border border-red-100">
                                <Text className="text-red-600 font-medium">{error}</Text>
                            </Animated.View>
                        )}

                        <Animated.View 
                            entering={FadeInUp.delay(50)} 
                            layout={LinearTransition.springify()}
                            className="bg-white rounded-3xl border border-gray-100 mb-6 overflow-hidden" 
                            style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }}
                        >
                            <View className="p-5">
                                {/* 1. Company Name */}
                                <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Company Name <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className="h-12 bg-gray-50 px-4 rounded-xl border border-gray-200 focus:border-[#9e0b0f] text-gray-900"
                                    value={formData.nm_customers}
                                    onChangeText={(t) => updateField('nm_customers', t)}
                                    placeholder="Enter company name"
                                />
                            </View>

                            {/* 2. Address */}
                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Address <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className="bg-gray-50 p-4 rounded-xl border border-gray-200 focus:border-[#9e0b0f] text-gray-900 min-h-[96px]"
                                    value={formData.customers_address}
                                    onChangeText={(t) => updateField('customers_address', t)}
                                    placeholder="Enter address"
                                    multiline={true}
                                    numberOfLines={4}
                                    textAlignVertical="top"
                                />
                            </View>

                            {/* 3. Address Invoice */}
                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Address Invoice <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className="bg-gray-50 p-4 rounded-xl border border-gray-200 focus:border-[#9e0b0f] text-gray-900 min-h-[96px]"
                                    value={formData.customers_address_invoice}
                                    onChangeText={(t) => updateField('customers_address_invoice', t)}
                                    placeholder="Enter address invoice"
                                    multiline={true}
                                    numberOfLines={4}
                                    textAlignVertical="top"
                                />
                            </View>

                            {/* 4 & 5. Blacklist and External Sales checkboxes */}
                            <View className="flex-row justify-between items-center mb-4">
                                <TouchableOpacity 
                                    className="flex-row items-center" 
                                    onPress={() => updateField('is_blacklist', !formData.is_blacklist)}
                                >
                                    {formData.is_blacklist ? <CheckSquare size={20} color="#3b82f6" /> : <Square size={20} color="#d1d5db" />}
                                    <Text className="text-sm font-bold text-gray-700 ml-2">Blacklist</Text>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                    className="flex-row items-center" 
                                    onPress={() => updateField('is_external_sales', !formData.is_external_sales)}
                                >
                                    {formData.is_external_sales ? <CheckSquare size={20} color="#3b82f6" /> : <Square size={20} color="#d1d5db" />}
                                    <Text className="text-sm font-bold text-gray-700 ml-2">External Sales</Text>
                                </TouchableOpacity>
                            </View>

                            {/* 6. Company toggle */}
                            <View className="flex-row justify-between items-center mb-4">
                                <Text className="text-sm font-bold text-gray-700">Company</Text>
                                <Switch
                                    value={formData.f_company}
                                    onValueChange={(val) => updateField('f_company', val)}
                                    trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
                                    thumbColor={Platform.OS === 'android' ? '#ffffff' : undefined}
                                />
                            </View>

                            {/* If Company: Nama PIC, NIB, NPWP */}
                            {formData.f_company && (
                                <>
                                    <View className="mb-4">
                                        <Text className="text-sm font-bold text-gray-700 mb-2">Nama PIC</Text>
                                        <TextInput
                                            className="h-12 bg-gray-50 px-4 rounded-xl border border-gray-200 focus:border-[#9e0b0f] text-gray-900"
                                            value={formData.nama_lengkap}
                                            onChangeText={(t) => updateField('nama_lengkap', t)}
                                            placeholder="Enter Nama PIC"
                                        />
                                    </View>
                                    <View className="mb-4">
                                        <Text className="text-sm font-bold text-gray-700 mb-2">NIB</Text>
                                        <TextInput
                                            className="h-12 bg-gray-50 px-4 rounded-xl border border-gray-200 focus:border-[#9e0b0f] text-gray-900"
                                            value={formData.nib}
                                            onChangeText={(t) => updateField('nib', t.replace(/[^0-9]/g, ''))}
                                            placeholder="Enter NIB"
                                            keyboardType="number-pad"
                                        />
                                    </View>
                                    <View className="mb-4">
                                        <Text className="text-sm font-bold text-gray-700 mb-2">NPWP</Text>
                                        <TextInput
                                            className="h-12 bg-gray-50 px-4 rounded-xl border border-gray-200 focus:border-[#9e0b0f] text-gray-900"
                                            value={formData.npwp}
                                            onChangeText={(t) => updateField('npwp', t)}
                                            placeholder="Enter NPWP"
                                        />
                                    </View>
                                </>
                            )}

                            {/* 7. NIK PIC */}
                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">NIK PIC</Text>
                                <TextInput
                                    className="h-12 bg-gray-50 px-4 rounded-xl border border-gray-200 focus:border-[#9e0b0f] text-gray-900"
                                    value={formData.nik}
                                    onChangeText={(t) => updateField('nik', t.replace(/[^0-9]/g, ''))}
                                    placeholder="Enter NIK PIC"
                                    keyboardType="number-pad"
                                    maxLength={16}
                                />
                            </View>

                            {/* 8. Mobile */}
                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Mobile <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className="h-12 bg-gray-50 px-4 rounded-xl border border-gray-200 focus:border-[#9e0b0f] text-gray-900"
                                    value={formData.customers_mobile}
                                    onChangeText={(t) => updateField('customers_mobile', t.replace(/[^0-9]/g, ''))}
                                    placeholder="Enter mobile"
                                    keyboardType="phone-pad"
                                />
                            </View>

                            {/* 9. Email */}
                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Email</Text>
                                <TextInput
                                    className="h-12 bg-gray-50 px-4 rounded-xl border border-gray-200 focus:border-[#9e0b0f] text-gray-900"
                                    value={formData.customers_email}
                                    onChangeText={(t) => updateField('customers_email', t)}
                                    placeholder="Enter email"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>

                            {/* 10. Fax */}
                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Fax</Text>
                                <TextInput
                                    className="h-12 bg-gray-50 px-4 rounded-xl border border-gray-200 focus:border-[#9e0b0f] text-gray-900"
                                    value={formData.customers_fax}
                                    onChangeText={(t) => updateField('customers_fax', t.replace(/[^0-9]/g, ''))}
                                    placeholder="Enter fax"
                                    keyboardType="phone-pad"
                                />
                            </View>

                            {/* 11. Phone */}
                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Phone</Text>
                                <TextInput
                                    className="h-12 bg-gray-50 px-4 rounded-xl border border-gray-200 focus:border-[#9e0b0f] text-gray-900"
                                    value={formData.customers_phone}
                                    onChangeText={(t) => updateField('customers_phone', t.replace(/[^0-9]/g, ''))}
                                    placeholder="Enter phone number"
                                    keyboardType="phone-pad"
                                />
                            </View>

                            {/* 12. Alamat PIC */}
                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Alamat PIC</Text>
                                <TextInput
                                    className="bg-gray-50 p-4 rounded-xl border border-gray-200 focus:border-[#9e0b0f] text-gray-900 min-h-[96px]"
                                    value={formData.alamat}
                                    onChangeText={(t) => updateField('alamat', t)}
                                    placeholder="Enter Alamat PIC"
                                    multiline={true}
                                    numberOfLines={4}
                                    textAlignVertical="top"
                                />
                            </View>

                            {/* 13. Provinsi dropdown */}
                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Provinsi <Text className="text-red-500">*</Text></Text>
                                <View className="border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
                                    <Dropdown
                                        style={{ height: 48, paddingHorizontal: 16 }}
                                        data={provinces.map(d => ({ label: d.nama, value: d.id }))}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Pilih Provinsi"
                                        value={formData.provinsi}
                                        onChange={(item) => handleProvinceChange(item.value)}
                                        search
                                        searchPlaceholder="Cari provinsi..."
                                    />
                                </View>
                            </View>

                            {/* 14. Kabupaten/Kota dropdown */}
                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Kabupaten/Kota <Text className="text-red-500">*</Text></Text>
                                <View className="border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
                                    <Dropdown
                                        style={{ height: 48, paddingHorizontal: 16 }}
                                        data={regencies.map(p => ({ label: p.nama_kabupaten, value: p.id }))}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Pilih Kabupaten/Kota"
                                        value={formData.kabupaten}
                                        onChange={(item) => updateField('kabupaten', item.value)}
                                        search
                                        searchPlaceholder="Cari kabupaten..."
                                    />
                                </View>
                            </View>
                            </View>

                            {/* SECTION: CONTACT PERSONS */}
                            <View className="border-t border-gray-100 bg-white">
                                <View className="flex-row justify-between items-center mb-4 px-5 pt-5">
                                    <Text className="text-sm font-bold text-gray-700">Daftar Kontak</Text>
                                    <TouchableOpacity 
                                        onPress={handleOpenAddContact}
                                        className="flex-row items-center px-3 py-1.5 rounded-lg"
                                        style={{ backgroundColor: `${theme.colors.primary}15` }}
                                    >
                                        <Plus size={14} color={theme.colors.primary} />
                                        <Text className="text-xs font-bold ml-1" style={{ color: theme.colors.primary }}>Tambah</Text>
                                    </TouchableOpacity>
                                </View>

                                <CustomerTableContact 
                                    contacts={formData.contacts} 
                                    onEdit={handleOpenEditContact}
                                    onDelete={handleDeleteContact}
                                />
                            </View>
                        </Animated.View>

                        <Animated.View entering={FadeInUp.delay(150)}>
                            <Button
                                onPress={onSavePress}
                                disabled={isSaving}
                                className="w-full h-14 rounded-2xl flex-row items-center justify-center"
                                style={{ elevation: 4, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                            >
                                {isSaving ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <>
                                        <Save color="white" size={20} className="mr-2" />
                                        <Text className="text-white font-bold text-lg">Simpan Customer</Text>
                                    </>
                                )}
                            </Button>
                        </Animated.View>

                    </Animated.View>
                )}
            </ScrollView>

            <ModalConfirm
                visible={confirmModalVisible}
                title="Konfirmasi Simpan"
                message="Apakah Anda yakin ingin menyimpan data pelanggan ini?"
                onConfirm={handleConfirmSave}
                onCancel={() => setConfirmModalVisible(false)}
            />

            <ToastMessages
                visible={toastVisible}
                type={toastType}
                title={toastTitle}
                message={toastMsg}
                onClose={() => setToastVisible(false)}
            />

            <CustomerModalContact 
                visible={contactModalVisible}
                onDismiss={() => setContactModalVisible(false)}
                onSave={handleSaveContact}
                initialData={selectedContact}
                onDelete={selectedContactIndex !== null ? () => handleDeleteContact(selectedContactIndex) : undefined}
            />
        </KeyboardAvoidingView>
    );
}
