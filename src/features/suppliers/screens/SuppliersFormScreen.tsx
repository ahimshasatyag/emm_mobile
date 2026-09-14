import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, RefreshControl, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInUp, FadeIn, FadeOut } from 'react-native-reanimated';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { ContactTable } from '../components/ContactTable';
import { Button } from '../../../components/ui/button';
import { SuppliersFormSkeleton } from '../skeleton/SuppliersFormSkeleton';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';
import { PreviewGambar } from '../components/PreviewGambar';
import { ContactModal } from '../components/ContactModal';
import { SupplierContact } from '../types/suppliers.types';
import { theme } from '../../../theme/theme';
import { Dropdown } from 'react-native-element-dropdown';
import * as DocumentPicker from 'expo-document-picker';
import { Plus, UploadCloud, Save } from 'lucide-react-native';
import { validateForm, useSuppliers } from '../hooks/useSuppliers';

export function SuppliersFormScreen() {
    const navigation = useNavigation();
    const { loadSupportData, submitSupplier } = useSuppliers();

    const [formData, setFormData] = useState({
        nm_suppliers: '',
        suppliers_mobile: '',
        suppliers_email: '',
        suppliers_address: '',
        suppliers_phone: '',
        suppliers_fax: '',
        suppliers_website: '',
        id_mata_uang: '1', // Default IDR id is typically 1, we can just bind to whatever is first
        suppliers_logo: null as string | null
    });

    const [mataUangs, setMataUangs] = useState<any[]>([]);
    const [contacts, setContacts] = useState<SupplierContact[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalType, setModalType] = useState<'save' | 'delete' | null>(null);
    const [deletingContactIndex, setDeletingContactIndex] = useState<number | null>(null);
    const [toast, setToast] = useState<{ visible: boolean; message: string; type: ToastType; title?: string }>({
        visible: false,
        message: '',
        type: 'success'
    });

    const [contactModalVisible, setContactModalVisible] = useState(false);
    const [editingContactIndex, setEditingContactIndex] = useState<number | null>(null);

    useEffect(() => {
        const fetchSupport = async () => {
            setIsRefreshing(true);
            try {
                const res = await loadSupportData();
                setMataUangs(res.mata_uangs || []);
                if (res.mata_uangs && res.mata_uangs.length > 0) {
                    setFormData(prev => ({ ...prev, id_mata_uang: res.mata_uangs[0].id_mata_uang.toString() }));
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsRefreshing(false);
            }
        };
        fetchSupport();
    }, [loadSupportData]);

    const onRefresh = useCallback(() => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 1000);
    }, []);

    const handleAddContact = () => {
        setEditingContactIndex(null);
        setContactModalVisible(true);
    };

    const handleEditContact = (index: number) => {
        setEditingContactIndex(index);
        setContactModalVisible(true);
    };

    const handleSaveContact = (contact: SupplierContact) => {
        if (editingContactIndex !== null) {
            const newContacts = [...contacts];
            newContacts[editingContactIndex] = contact;
            setContacts(newContacts);
            setToast({ visible: true, type: 'success', message: 'Kontak berhasil diupdate' });
        } else {
            setContacts([...contacts, contact]);
            setToast({ visible: true, type: 'success', message: 'Kontak berhasil ditambahkan' });
        }
    };

    const handlePickLogo = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'image/*',
            });
            if (!result.canceled && result.assets && result.assets.length > 0) {
                setFormData(prev => ({ ...prev, suppliers_logo: result.assets[0].uri }));
            }
        } catch (error) {
            Alert.alert('Error', 'Gagal memilih logo');
        }
    };

    const handleDeleteContact = (index: number) => {
        setDeletingContactIndex(index);
        setModalType('delete');
        setIsModalVisible(true);
    };

    const confirmDeleteContact = () => {
        if (deletingContactIndex !== null) {
            const newContacts = [...contacts];
            newContacts.splice(deletingContactIndex, 1);
            setContacts(newContacts);
            setDeletingContactIndex(null);
            setIsModalVisible(false);
            setToast({ visible: true, type: 'success', message: 'Kontak berhasil dihapus' });
        }
    };

    const handleSubmit = async () => {
        const errorMsg = validateForm(formData, contacts);
        if (errorMsg) {
            setToast({ visible: true, type: 'error', message: errorMsg, title: 'Validasi' });
            return;
        }

        setModalType('save');
        setIsModalVisible(true);
    };

    const confirmSave = async () => {
        setIsModalVisible(false);
        setIsSaving(true);
        try {
            const formPayload = new FormData();
            formPayload.append('nm_suppliers', formData.nm_suppliers);
            formPayload.append('suppliers_mobile', formData.suppliers_mobile);
            formPayload.append('suppliers_email', formData.suppliers_email);
            formPayload.append('suppliers_address', formData.suppliers_address);
            formPayload.append('suppliers_phone', formData.suppliers_phone);
            formPayload.append('suppliers_fax', formData.suppliers_fax);
            formPayload.append('suppliers_website', formData.suppliers_website);
            formPayload.append('mata_uang', formData.id_mata_uang); // API uses mata_uang for id_mata_uang

            if (formData.suppliers_logo) {
                const uri = formData.suppliers_logo;
                const fileType = uri.substring(uri.lastIndexOf('.') + 1);
                formPayload.append('file', {
                    uri,
                    name: `logo.${fileType}`,
                    type: `image/${fileType === 'jpg' ? 'jpeg' : fileType}`,
                } as any);
            }

            formPayload.append('jml', contacts.length.toString());
            contacts.forEach((contact, index) => {
                const i = index + 1;
                formPayload.append(`nm_suppliers_contact${i}`, contact.nm_suppliers_contact);
                formPayload.append(`suppliers_contact_posisi${i}`, contact.suppliers_contact_posisi || '');
                formPayload.append(`suppliers_contact_phone${i}`, contact.suppliers_contact_phone || '');
                formPayload.append(`suppliers_contact_email${i}`, contact.suppliers_contact_email || '');
            });

            const res = await submitSupplier(formPayload, false);
            
            (navigation as any).replace('SuppliersEditScreen', {
                id: res.kode,
                showSuccessToast: true,
                successMessage: 'Supplier berhasil ditambahkan!'
            });
        } catch (error: any) {
            setToast({ visible: true, type: 'error', message: error.message || 'Gagal menyimpan data supplier' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            className="flex-1 bg-gray-50"
        >
            <ModalConfirm
                visible={isModalVisible}
                title={modalType === 'delete' ? "Hapus Kontak" : "Konfirmasi Simpan"}
                message={modalType === 'delete' ? "Apakah Anda yakin ingin menghapus kontak ini?" : "Apakah Anda yakin ingin menyimpan data supplier ini?"}
                confirmText={modalType === 'delete' ? "Ya, Hapus" : "Ya, Simpan"}
                cancelText="Batal"
                onConfirm={modalType === 'delete' ? confirmDeleteContact : confirmSave}
                onCancel={() => {
                    setIsModalVisible(false);
                    if (modalType === 'delete') setDeletingContactIndex(null);
                }}
            />

            <ToastMessages
                visible={toast.visible}
                title={toast.title || (toast.type === 'error' ? 'Error' : 'Sukses')}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(prev => ({ ...prev, visible: false }))}
            />

            <HeaderNavigator title={isRefreshing ? "MEMUAT DATA..." : "TAMBAH SUPPLIER"} showBackButton={true} />

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
                }
            >
                {isRefreshing ? (
                    <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>
                        <SuppliersFormSkeleton />
                    </Animated.View>
                ) : (
                    <Animated.View key="content" entering={FadeIn.duration(600)} className="p-4">
                        <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">

                            <Text className="text-sm font-bold text-gray-700 mb-2">Nama Supplier <Text className="text-red-500">*</Text></Text>
                            <TextInput
                                className="bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 text-gray-900 mb-4"
                                value={formData.nm_suppliers}
                                onChangeText={t => setFormData(prev => ({ ...prev, nm_suppliers: t }))}
                                placeholder="Contoh: PT. Maju Bersama"
                            />

                            <Text className="text-sm font-bold text-gray-700 mb-2">Address</Text>
                            <TextInput
                                className="bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 text-gray-900 mb-4"
                                value={formData.suppliers_address}
                                onChangeText={t => setFormData(prev => ({ ...prev, suppliers_address: t }))}
                                placeholder="Alamat Perusahaan"
                                multiline={true}
                                numberOfLines={4}
                                textAlignVertical="top"
                                style={{ minHeight: 100 }}
                            />

                            <View className="flex-row justify-between mb-4">
                                <View className="flex-1 mr-2">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Fax</Text>
                                    <TextInput
                                        className="bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 text-gray-900"
                                        value={formData.suppliers_fax}
                                        onChangeText={t => setFormData(prev => ({ ...prev, suppliers_fax: t }))}
                                        placeholder="No Fax"
                                        keyboardType="phone-pad"
                                    />
                                </View>
                                <View className="flex-1 ml-2">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Website</Text>
                                    <TextInput
                                        className="bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 text-gray-900"
                                        value={formData.suppliers_website}
                                        onChangeText={t => setFormData(prev => ({ ...prev, suppliers_website: t }))}
                                        placeholder="www.example.com"
                                        keyboardType="url"
                                        autoCapitalize="none"
                                    />
                                </View>
                            </View>

                            <View className="flex-row justify-between mb-4">
                                <View className="flex-1 mr-2">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Logo</Text>
                                    <TouchableOpacity
                                        className="bg-gray-50 px-3 h-12 rounded-xl border border-gray-200 justify-center items-center flex-row"
                                        onPress={() => formData.suppliers_logo ? setPreviewVisible(true) : handlePickLogo()}
                                    >
                                        {formData.suppliers_logo ? (
                                            <>
                                                <UploadCloud size={16} color="#3b82f6" style={{ marginRight: 8 }} />
                                                <Text className="text-blue-500 text-xs flex-1" numberOfLines={1}>
                                                    {formData.suppliers_logo.split('/').pop() || 'Lihat Logo'}
                                                </Text>
                                            </>
                                        ) : (
                                            <>
                                                <UploadCloud size={16} color="#6b7280" style={{ marginRight: 8 }} />
                                                <Text className="text-gray-500 text-xs flex-1" numberOfLines={1}>Pilih Logo</Text>
                                            </>
                                        )}
                                    </TouchableOpacity>
                                </View>
                                <View className="flex-1 ml-2">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Mata Uang</Text>
                                    <View className="border border-gray-200 rounded-xl bg-gray-50">
                                        <Dropdown
                                            style={{ height: 48, paddingHorizontal: 16 }}
                                            data={mataUangs.map(mu => ({ label: mu.mata_uang, value: mu.id_mata_uang.toString() }))}
                                            labelField="label"
                                            valueField="value"
                                            placeholder="Mata Uang"
                                            value={formData.id_mata_uang}
                                            onChange={item => setFormData(prev => ({ ...prev, id_mata_uang: item.value }))}
                                        />
                                    </View>
                                </View>
                            </View>

                            <View className="flex-row justify-between mb-4">
                                <View className="flex-1 mr-2">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Telepon</Text>
                                    <TextInput
                                        className="bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 text-gray-900"
                                        value={formData.suppliers_phone}
                                        onChangeText={t => setFormData(prev => ({ ...prev, suppliers_phone: t }))}
                                        placeholder="No Telepon"
                                        keyboardType="phone-pad"
                                    />
                                </View>
                                <View className="flex-1 ml-2">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Phone</Text>
                                    <TextInput
                                        className="bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 text-gray-900"
                                        value={formData.suppliers_mobile}
                                        onChangeText={t => setFormData(prev => ({ ...prev, suppliers_mobile: t }))}
                                        placeholder="No HP"
                                        keyboardType="phone-pad"
                                    />
                                </View>
                            </View>

                            <Text className="text-sm font-bold text-gray-700 mb-2">Email</Text>
                            <TextInput
                                className="bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 text-gray-900 mb-4"
                                value={formData.suppliers_email}
                                onChangeText={t => setFormData(prev => ({ ...prev, suppliers_email: t }))}
                                placeholder="Email Perusahaan"
                                keyboardType="email-address"
                            />

                            <View className="h-px bg-gray-200 my-4" />

                            <View className="flex-row justify-between items-center mb-4">
                                <Text className="font-bold text-gray-800">Daftar Kontak</Text>
                                <TouchableOpacity
                                    onPress={handleAddContact}
                                    className="flex-row items-center px-3 py-1.5 rounded-lg"
                                    style={{ backgroundColor: theme.colors.primary }}
                                >
                                    <Plus size={16} color="#ffffff" />
                                    <Text className="text-white font-bold ml-1 text-xs">Tambah</Text>
                                </TouchableOpacity>
                            </View>

                            <ContactTable
                                contacts={contacts}
                                onEditContact={handleEditContact}
                                onDeleteContact={handleDeleteContact}
                                isEditMode={true}
                            />
                        </View>

                        <Animated.View entering={FadeInUp.delay(100)}>
                            <Button
                                onPress={handleSubmit}
                                disabled={isSaving}
                                className="w-full h-14 rounded-2xl flex-row items-center justify-center"
                                style={{ elevation: 4, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                            >
                                {isSaving ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <>
                                        <Save color="white" size={20} className="mr-2" />
                                        <Text className="text-white font-bold text-lg">Simpan Supplier</Text>
                                    </>
                                )}
                            </Button>
                        </Animated.View>
                    </Animated.View>
                )}
            </ScrollView>

            <PreviewGambar
                visible={previewVisible}
                imageUrl={formData.suppliers_logo}
                onClose={() => setPreviewVisible(false)}
                onChange={handlePickLogo}
                onRemove={() => setFormData(prev => ({ ...prev, suppliers_logo: null }))}
            />

            <ContactModal
                visible={contactModalVisible}
                onClose={() => setContactModalVisible(false)}
                onSubmit={handleSaveContact}
                onDelete={editingContactIndex !== null ? () => handleDeleteContact(editingContactIndex) : undefined}
                initialData={editingContactIndex !== null ? contacts[editingContactIndex] : null}
            />
        </KeyboardAvoidingView>
    );
}
