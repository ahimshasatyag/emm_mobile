import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, RefreshControl, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Animated, { FadeInUp, FadeIn, FadeOut } from 'react-native-reanimated';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { ContactTable } from '../components/ContactTable';
import { Button } from '../../../components/ui/button';
import { SuppliersFormSkeleton } from '../skeleton/SuppliersFormSkeleton';
import { PreviewGambar } from '../components/PreviewGambar';
import { SupplierContact } from '../types/suppliers.types';
import { theme } from '../../../theme/theme';
import { Dropdown } from 'react-native-element-dropdown';
import * as DocumentPicker from 'expo-document-picker';
import { Plus, UploadCloud } from 'lucide-react-native';
import { getSupplierById } from '../api/suppliers.api';

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
    const [previewVisible, setPreviewVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    const loadDetail = useCallback(async (supplierId: string) => {
        setIsLoadingDetail(true);
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
            Alert.alert('Error', 'Gagal memuat detail supplier');
        } finally {
            setIsLoadingDetail(false);
        }
    }, []);

    useEffect(() => {
        if (id) {
            loadDetail(id);
        }
    }, [id, loadDetail]);

    const handleAddContact = () => {
        setContacts([...contacts, {
            nm_suppliers_contact: '',
            suppliers_contact_posisi: '',
            suppliers_contact_phone: '',
            suppliers_contact_email: ''
        }]);
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
            Alert.alert('Error', 'Gagal memilih logo');
        }
    };

    const handleEditContact = (index: number) => {
        if (!isEditMode) return;
        Alert.alert('Info', 'Fitur edit contact detail akan segera hadir');
    };

    const handleDeleteContact = (index: number) => {
        if (!isEditMode) return;
        Alert.alert(
            'Hapus Kontak',
            'Apakah Anda yakin ingin menghapus kontak ini?',
            [
                { text: 'Batal', style: 'cancel' },
                {
                    text: 'Hapus',
                    style: 'destructive',
                    onPress: () => {
                        const newContacts = [...contacts];
                        newContacts.splice(index, 1);
                        setContacts(newContacts);
                    }
                }
            ]
        );
    };

    const handleSubmit = async () => {
        if (!isEditMode) {
            setIsEditMode(true);
            return;
        }

        if (!formData.nm_suppliers.trim()) {
            Alert.alert('Error', 'Nama supplier harus diisi');
            return;
        }

        setIsSaving(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Updated Supplier:', { ...formData, id_suppliers: id, contacts });
            Alert.alert('Sukses', 'Perubahan berhasil disimpan');
            setIsEditMode(false);
        } catch (error) {
            Alert.alert('Error', 'Gagal menyimpan perubahan');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            className="flex-1 bg-gray-50"
        >
            <HeaderNavigator
                title={isLoadingDetail ? 'MEMUAT DATA...' : isEditMode ? 'EDIT SUPPLIER' : `DETAIL ${formData.nm_suppliers || 'SUPPLIER'}`}
                showBackButton={true}
            />

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
                refreshControl={
                    <RefreshControl refreshing={isLoadingDetail} onRefresh={() => id && loadDetail(id)} colors={[theme.colors.primary]} />
                }
            >
                {isLoadingDetail ? (
                    <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>
                        <SuppliersFormSkeleton />
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
                                multiline
                                numberOfLines={3}
                                style={{ textAlignVertical: 'top' }}
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
                                        className={`h-12 rounded-xl border justify-center items-center overflow-hidden flex-row ${!isEditMode ? 'bg-gray-100 border-gray-200' : 'bg-gray-50 border-gray-200'}`}
                                        onPress={() => formData.suppliers_logo ? setPreviewVisible(true) : handlePickLogo()}
                                        disabled={!isEditMode && !formData.suppliers_logo}
                                    >
                                        {formData.suppliers_logo ? (
                                            <Image source={{ uri: formData.suppliers_logo }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                                        ) : (
                                            <>
                                                <UploadCloud size={16} color="#6b7280" style={{ marginRight: 8 }} />
                                                <Text className="text-gray-500 text-xs" numberOfLines={1}>Pilih Logo</Text>
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

                            <Text className="text-sm font-bold text-gray-700 mb-2">Email</Text>
                            <TextInput
                                className={`px-4 py-3 rounded-xl border mb-4 ${!isEditMode ? 'bg-gray-100 border-gray-200 text-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                                value={formData.suppliers_email}
                                onChangeText={t => setFormData(prev => ({ ...prev, suppliers_email: t }))}
                                placeholder="Email Perusahaan"
                                keyboardType="email-address"
                                editable={isEditMode}
                            />

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
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Mobile / HP</Text>
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

                            <View className="h-px bg-gray-200 my-4" />

                            <View className="flex-row justify-between items-center mb-4">
                                <Text className="font-bold text-gray-800">Daftar Kontak (PIC)</Text>
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
                            <Button
                                onPress={handleSubmit}
                                disabled={isSaving}
                                className="w-full h-14 rounded-2xl flex-row items-center justify-center"
                                style={{ elevation: 4, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                            >
                                <Text className="text-white font-bold text-lg">
                                    {isSaving ? 'Menyimpan...' : isEditMode ? 'Simpan Perubahan' : 'Edit Supplier'}
                                </Text>
                            </Button>
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
        </KeyboardAvoidingView>
    );
}
