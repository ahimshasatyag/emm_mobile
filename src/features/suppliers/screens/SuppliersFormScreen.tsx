import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, RefreshControl, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
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

export function SuppliersFormScreen() {
    const navigation = useNavigation();

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
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [previewVisible, setPreviewVisible] = useState(false);

    const onRefresh = useCallback(() => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 1000);
    }, []);

    const handleAddContact = () => {
        setContacts([...contacts, {
            nm_suppliers_contact: '',
            suppliers_contact_posisi: '',
            suppliers_contact_phone: '',
            suppliers_contact_email: ''
        }]);
    };

    const handlePickLogo = async () => {
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
        Alert.alert('Info', 'Fitur edit contact detail akan segera hadir');
    };

    const handleDeleteContact = (index: number) => {
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
        if (!formData.nm_suppliers.trim()) {
            Alert.alert('Error', 'Nama supplier harus diisi');
            return;
        }

        setIsSaving(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Saved Supplier:', { ...formData, contacts });
            Alert.alert('Sukses', 'Supplier berhasil ditambahkan');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Gagal menyimpan data supplier');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            className="flex-1 bg-gray-50"
        >
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
                                multiline
                                numberOfLines={3}
                                style={{ textAlignVertical: 'top' }}
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
                                        className="bg-gray-50 h-12 rounded-xl border border-gray-200 justify-center items-center overflow-hidden flex-row"
                                        onPress={() => formData.suppliers_logo ? setPreviewVisible(true) : handlePickLogo()}
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
                                    <View className="border border-gray-200 rounded-xl bg-gray-50">
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
                                            onChange={item => setFormData(prev => ({ ...prev, mata_uang: item.value }))}
                                        />
                                    </View>
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
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Mobile / HP</Text>
                                    <TextInput
                                        className="bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 text-gray-900"
                                        value={formData.suppliers_mobile}
                                        onChangeText={t => setFormData(prev => ({ ...prev, suppliers_mobile: t }))}
                                        placeholder="No HP"
                                        keyboardType="phone-pad"
                                    />
                                </View>
                            </View>

                            <View className="h-px bg-gray-200 my-4" />

                            <View className="flex-row justify-between items-center mb-4">
                                <Text className="font-bold text-gray-800">Daftar Kontak (PIC)</Text>
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
                                <Text className="text-white font-bold text-lg">
                                    {isSaving ? 'Menyimpan...' : 'Simpan Supplier'}
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
                onChange={handlePickLogo}
                onRemove={() => setFormData(prev => ({ ...prev, suppliers_logo: null }))}
            />
        </KeyboardAvoidingView>
    );
}
