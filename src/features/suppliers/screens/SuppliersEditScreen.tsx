import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, RefreshControl, Image, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Animated, { FadeInUp, FadeIn, FadeOut } from 'react-native-reanimated';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { ContactTable } from '../components/ContactTable';
import { Button } from '../../../components/ui/button';
import { SuppliersEditSkeleton } from '../skeleton/SuppliersEditSkeleton';
import { PreviewGambar } from '../components/PreviewGambar';
import { ContactModal } from '../components/ContactModal';
import { SupplierContact } from '../types/suppliers.types';
import { theme } from '../../../theme/theme';
import { Dropdown } from 'react-native-element-dropdown';
import * as DocumentPicker from 'expo-document-picker';
import { Plus, UploadCloud, X, Save, Pencil } from 'lucide-react-native';
import { getSupplierById } from '../api/suppliers.api';
import { validateForm } from '../hooks/useSuppliers';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';

export function SuppliersEditScreen() {
    const navigation = useNavigation();
    const route = useRoute<any>();
    const id = route.params?.id;

    const [formData, setFormData] = useState({
        nm_suppliers: '',
        suppliers_mobile: '',
        suppliers_email: '',
        suppliers_address: '',
        suppliers_phone: '',
        suppliers_fax: '',
        suppliers_website: '',
        mata_uang: 'IDR'
    });

    const [contacts, setContacts] = useState<SupplierContact[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoadingDetail, setIsLoadingDetail] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    const [contactModalVisible, setContactModalVisible] = useState(false);
    const [editingContactIndex, setEditingContactIndex] = useState<number | null>(null);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalType, setModalType] = useState<'update' | 'delete' | null>(null);
    const [toast, setToast] = useState<{ visible: boolean; message: string; type: ToastType; title?: string }>({
        visible: false,
        message: '',
        type: 'success'
    });
    const [deletingContactIndex, setDeletingContactIndex] = useState<number | null>(null);

    useEffect(() => {
        if (route.params?.showSuccessToast) {
            setToast({
                visible: true,
                type: 'success',
                message: route.params.successMessage || 'Data berhasil disimpan!'
            });
            navigation.setParams({ showSuccessToast: undefined, successMessage: undefined });
        }
    }, [route.params?.showSuccessToast]);

    const loadDetail = useCallback(async (supplierId: string, mode: 'initial' | 'refresh' | 'silent' = 'initial') => {
        if (mode === 'initial') {
            setIsLoadingDetail(true);
        } else if (mode === 'refresh') {
            setIsRefreshing(true);
        }

        try {
            const data = await getSupplierById(supplierId);
            if (data) {
                setFormData({
                    nm_suppliers: data.nm_suppliers || '',
                    suppliers_mobile: data.suppliers_mobile || '',
                    suppliers_email: data.suppliers_email || '',
                    suppliers_address: data.suppliers_address || '',
                    suppliers_phone: data.suppliers_phone || '',
                    suppliers_fax: data.suppliers_fax || '',
                    suppliers_website: data.suppliers_website || '',
                    mata_uang: data.mata_uang || 'IDR'
                });
                setContacts(data.contacts || []);
            }
        } catch (error) {
            setToast({ visible: true, type: 'error', message: 'Gagal memuat detail supplier' });
        } finally {
            if (mode === 'initial') {
                setIsLoadingDetail(false);
            } else if (mode === 'refresh') {
                setIsRefreshing(false);
            }
        }
    }, []);

    useEffect(() => {
        if (id) {
            loadDetail(id);
        }
    }, [id, loadDetail]);

    const handleAddContact = () => {
        if (!isEditMode) return;
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
        if (!isEditMode) return;
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'image/*',
            });
            if (!result.canceled) {
                setFormData(prev => ({ ...prev, suppliers_logo: result.assets[0].uri }));
            }
        } catch (error) {
            setToast({ visible: true, type: 'error', message: 'Gagal memilih logo' });
        }
    };

    const handleDeleteContact = (index: number) => {
        if (!isEditMode) return;
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

    const handleSubmitClick = async () => {
        if (!isEditMode) {
            setIsEditMode(true);
            return;
        }

        const errorMsg = validateForm(formData, contacts);
        if (errorMsg) {
            setToast({ visible: true, type: 'error', message: errorMsg, title: 'Validasi' });
            return;
        }

        setModalType('update');
        setIsModalVisible(true);
    };

    const confirmUpdate = async () => {
        setIsModalVisible(false);
        setIsSaving(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setToast({ visible: true, type: 'success', message: 'Perubahan berhasil disimpan' });
            setIsEditMode(false);
        } catch (error) {
            setToast({ visible: true, type: 'error', message: 'Gagal menyimpan perubahan' });
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
                title={modalType === 'delete' ? "Hapus Kontak" : "Konfirmasi Update"}
                message={modalType === 'delete' ? "Apakah Anda yakin ingin menghapus kontak ini?" : "Apakah Anda yakin ingin menyimpan perubahan data supplier ini?"}
                confirmText={modalType === 'delete' ? "Ya, Hapus" : "Ya, Update"}
                cancelText="Batal"
                onConfirm={modalType === 'delete' ? confirmDeleteContact : confirmUpdate}
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

            <HeaderNavigator
                title={isLoadingDetail ? 'MEMUAT DATA...' : isEditMode ? `EDIT ${formData.nm_suppliers}` : `DETAIL ${formData.nm_suppliers}`}
                showBackButton={true}
            />

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={() => id && loadDetail(id, 'refresh')} colors={[theme.colors.primary]} />
                }
            >
                {isLoadingDetail || isRefreshing ? (
                    <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>
                        <SuppliersEditSkeleton />
                    </Animated.View>
                ) : (
                    <Animated.View key="content" entering={FadeIn.duration(600)} className="p-4">
                        <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">

                            <Text className="text-sm font-bold text-gray-700 mb-2">Nama Supplier <Text className="text-red-500">*</Text></Text>
                            <TextInput
                                className={`px-4 py-3 rounded-xl border mb-4 ${!isEditMode ? 'bg-gray-100 border-gray-200 text-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                                value={formData.nm_suppliers}
                                onChangeText={t => setFormData(prev => ({ ...prev, nm_suppliers: t }))}
                                placeholder="Contoh: PT. Maju Bersama"
                                editable={isEditMode}
                            />

                            <Text className="text-sm font-bold text-gray-700 mb-2">Address</Text>
                            <TextInput
                                className={`px-4 py-3 rounded-xl border mb-4 ${!isEditMode ? 'bg-gray-100 border-gray-200 text-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                                value={formData.suppliers_address}
                                onChangeText={t => setFormData(prev => ({ ...prev, suppliers_address: t }))}
                                placeholder="Alamat Perusahaan"
                                multiline={true}
                                numberOfLines={4}
                                textAlignVertical="top"
                                style={{ minHeight: 100 }}
                                editable={isEditMode}
                            />

                            <View className="flex-row justify-between mb-4">
                                <View className="flex-1 mr-2">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Fax</Text>
                                    <TextInput
                                        className={`px-4 py-3 rounded-xl border ${!isEditMode ? 'bg-gray-100 border-gray-200 text-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                                        value={formData.suppliers_fax}
                                        onChangeText={t => setFormData(prev => ({ ...prev, suppliers_fax: t }))}
                                        placeholder="No Fax"
                                        keyboardType="phone-pad"
                                        editable={isEditMode}
                                    />
                                </View>
                                <View className="flex-1 ml-2">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Website</Text>
                                    <TextInput
                                        className={`px-4 py-3 rounded-xl border ${!isEditMode ? 'bg-gray-100 border-gray-200 text-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                                        value={formData.suppliers_website}
                                        onChangeText={t => setFormData(prev => ({ ...prev, suppliers_website: t }))}
                                        placeholder="www.example.com"
                                        keyboardType="url"
                                        autoCapitalize="none"
                                        editable={isEditMode}
                                    />
                                </View>
                            </View>

                            <View className="flex-row justify-between mb-4">
                                <View className="flex-1 mr-2">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Logo</Text>
                                    <TouchableOpacity
                                        className={`px-3 h-12 rounded-xl border justify-center items-center flex-row ${!isEditMode ? 'bg-gray-100 border-gray-200' : 'bg-gray-50 border-gray-200'}`}
                                        onPress={() => formData.suppliers_logo ? setPreviewVisible(true) : handlePickLogo()}
                                        disabled={!isEditMode && !formData.suppliers_logo}
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
                                    <View className={`border rounded-xl ${!isEditMode ? 'bg-gray-100 border-gray-200' : 'bg-gray-50 border-gray-200'}`}>
                                        <Dropdown
                                            style={{ height: 48, paddingHorizontal: 16 }}
                                            data={[
                                                { label: 'IDR', value: 'IDR' },
                                                { label: 'USD', value: 'USD' }
                                            ]}
                                            labelField="label"
                                            valueField="value"
                                            placeholder="Mata Uang"
                                            value={formData.mata_uang}
                                            onChange={item => isEditMode && setFormData(prev => ({ ...prev, mata_uang: item.value }))}
                                            disable={!isEditMode}
                                        />
                                    </View>
                                </View>
                            </View>

                            <View className="flex-row justify-between mb-4">
                                <View className="flex-1 mr-2">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Telepon</Text>
                                    <TextInput
                                        className={`px-4 py-3 rounded-xl border ${!isEditMode ? 'bg-gray-100 border-gray-200 text-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                                        value={formData.suppliers_phone}
                                        onChangeText={t => setFormData(prev => ({ ...prev, suppliers_phone: t }))}
                                        placeholder="No Telepon"
                                        keyboardType="phone-pad"
                                        editable={isEditMode}
                                    />
                                </View>
                                <View className="flex-1 ml-2">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Phone</Text>
                                    <TextInput
                                        className={`px-4 py-3 rounded-xl border ${!isEditMode ? 'bg-gray-100 border-gray-200 text-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                                        value={formData.suppliers_mobile}
                                        onChangeText={t => setFormData(prev => ({ ...prev, suppliers_mobile: t }))}
                                        placeholder="No HP"
                                        keyboardType="phone-pad"
                                        editable={isEditMode}
                                    />
                                </View>
                            </View>

                            <Text className="text-sm font-bold text-gray-700 mb-2">Email</Text>
                            <TextInput
                                className={`px-4 py-3 rounded-xl border mb-4 ${!isEditMode ? 'bg-gray-100 border-gray-200 text-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                                value={formData.suppliers_email}
                                onChangeText={t => setFormData(prev => ({ ...prev, suppliers_email: t }))}
                                placeholder="Email Perusahaan"
                                keyboardType="email-address"
                                editable={isEditMode}
                            />

                            <View className="h-px bg-gray-200 my-4" />

                            <View className="flex-row justify-between items-center mb-4">
                                <Text className="font-bold text-gray-800">Daftar Kontak</Text>
                                {isEditMode && (
                                    <TouchableOpacity
                                        onPress={handleAddContact}
                                        className="flex-row items-center px-3 py-1.5 rounded-lg"
                                        style={{ backgroundColor: theme.colors.primary }}
                                    >
                                        <Plus size={16} color="#ffffff" />
                                        <Text className="text-white font-bold ml-1 text-xs">Tambah</Text>
                                    </TouchableOpacity>
                                )}
                            </View>

                            <ContactTable
                                contacts={contacts}
                                onEditContact={handleEditContact}
                                onDeleteContact={handleDeleteContact}
                                isEditMode={isEditMode}
                            />
                        </View>

                        <Animated.View entering={FadeInUp.delay(100)}>
                            {isEditMode ? (
                                <View className="flex-row gap-4">
                                    <Button
                                        variant="outline"
                                        onPress={() => {
                                            setIsEditMode(false);
                                            if (id) loadDetail(id, 'silent');
                                        }}
                                        disabled={isSaving}
                                        className="flex-1 h-14 rounded-xl flex-row items-center justify-center"
                                    >
                                        <X color={theme.colors.primary} size={20} className="mr-2" />
                                        <Text className="font-bold text-lg" style={{ color: theme.colors.primary }}>Batal</Text>
                                    </Button>

                                    <Button
                                        onPress={handleSubmitClick}
                                        disabled={isSaving}
                                        className="flex-1 h-14 rounded-2xl flex-row items-center justify-center"
                                        style={{ elevation: 4, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                                    >
                                        {isSaving ? (
                                            <ActivityIndicator color="white" />
                                        ) : (
                                            <>
                                                <Save color="white" size={20} className="mr-2" />
                                                <Text className="text-white font-bold text-lg">Simpan</Text>
                                            </>
                                        )}
                                    </Button>
                                </View>
                            ) : (
                                <View className="flex-row gap-4">
                                    <Button
                                        onPress={handleSubmitClick}
                                        className="flex-1 h-14 rounded-2xl flex-row items-center justify-center bg-gray-800"
                                    >
                                        <Pencil color="white" size={20} className="mr-2" />
                                        <Text className="text-white font-bold text-lg">Edit</Text>
                                    </Button>
                                </View>
                            )}
                        </Animated.View>
                    </Animated.View>
                )}
            </ScrollView>

            <PreviewGambar
                visible={previewVisible}
                imageUrl={formData.suppliers_logo}
                onClose={() => setPreviewVisible(false)}
                onChange={isEditMode ? handlePickLogo : undefined}
                onRemove={isEditMode ? () => setFormData(prev => ({ ...prev, suppliers_logo: null })) : undefined}
            />

            <ContactModal
                visible={contactModalVisible}
                onClose={() => setContactModalVisible(false)}
                onSubmit={handleSaveContact}
                onDelete={editingContactIndex !== null ? () => handleDeleteContact(editingContactIndex) : undefined}
                initialData={editingContactIndex !== null ? contacts[editingContactIndex] : null}
                isReadOnly={!isEditMode}
            />
        </KeyboardAvoidingView>
    );
}
