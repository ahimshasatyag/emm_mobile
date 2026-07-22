import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Save } from 'lucide-react-native';
import Animated, { FadeInUp, FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { Dropdown } from 'react-native-element-dropdown';
import { theme } from '../../../theme/theme';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { useInventory } from '../hooks/useInventory';
import { Button } from '../../../components/ui/button';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';
import { InventoryFormSkeleton } from '../skeleton/InventoryFormSkeleton';
import { useProducts } from '../../products/hooks/useProducts';

export function InventoryFormScreen() {
    const navigation = useNavigation();
    const { types, categories, createAsset, fetchInitialData, isLoading, validateForm } = useInventory();
    const { products } = useProducts();

    const [isSaving, setIsSaving] = useState(false);
    const [name, setName] = useState('');
    const [typeId] = useState('');
    const [categoryId] = useState('');
    const [procuredDate] = useState(new Date().toISOString().split('T')[0]);
    const [purchasedDate] = useState(new Date().toISOString().split('T')[0]);
    const [deskripsi] = useState('');
    const [serial, setSerial] = useState('');
    const [status, setStatus] = useState<InventoryStatus>('active');
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [serialNumbers] = useState([{ name_sn: '', serial_number: '' }]);
    const [fPrint] = useState('');
    const [isModalConfirmVisible, setIsModalConfirmVisible] = useState(false);
    const [toastState, setToastState] = useState({
        visible: false,
        type: 'success' as ToastType,
        message: ''
    });

    useEffect(() => {
        if (types.length === 0 || categories.length === 0) {
            fetchInitialData();
        }
    }, []);

    const handleSave = () => {
        const validationError = validateForm({ name });
        if (validationError) {
            setToastState({
                visible: true,
                type: 'error',
                message: validationError
            });
            return;
        }
        setIsModalConfirmVisible(true);
    };

    const confirmSave = async () => {
        setIsModalConfirmVisible(false);
        setIsSaving(true);
        try {
            const result = await createAsset({
                name,
                inventory_type_id: typeId,
                inventory_category_id: categoryId,
                procured_date: procuredDate,
                purchased_date: purchasedDate,
                deskripsi,
                serial,
                status,
                f_print: fPrint,
                serialNumbers: serialNumbers.filter(sn => sn.name_sn && sn.serial_number)
            });

            navigation.replace('InventoryEdit', {
                id: result.id,
                showSuccessToast: true
            });
        } catch (error: any) {
            setToastState({
                visible: true,
                type: 'error',
                message: error.message || 'Gagal menyimpan data'
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 bg-gray-50">
            <HeaderNavigator
                title={isLoading ? "MEMUAT DATA..." : "TAMBAH SERIAL NUMBER"}
                showBackButton={true}
                onBackPress={() => navigation.goBack()}
            />

            <ToastMessages
                visible={toastState.visible}
                type={toastState.type}
                title={toastState.type === 'success' ? 'Sukses' : 'Validasi'}
                message={toastState.message}
                onClose={() => setToastState({ ...toastState, visible: false })}
            />

            <ModalConfirm
                visible={isModalConfirmVisible}
                title="Konfirmasi Simpan"
                message="Apakah Anda yakin ingin menyimpan aset ini?"
                confirmText="Ya, Simpan"
                cancelText="Batal"
                onCancel={() => setIsModalConfirmVisible(false)}
                onConfirm={confirmSave}
            />

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={fetchInitialData} colors={[theme.colors.primary]} />
                }
            >
                {isLoading ? (
                    <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>
                        <InventoryFormSkeleton />
                    </Animated.View>
                ) : (
                    <Animated.View key="content" entering={FadeIn.duration(600)}>
                        <Animated.View entering={FadeInUp.delay(50)} layout={LinearTransition.springify()}>
                            <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
                                <View className="mb-5">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Product Name <Text className="text-red-500">*</Text></Text>
                                    <View className="border rounded-xl bg-gray-50" style={{ borderColor: focusedField === 'name' ? theme.colors.primary : '#E5E7EB' }}>
                                        <Dropdown
                                            style={{ height: 56, paddingHorizontal: 16 }}
                                            data={products.map(p => ({ label: p.nm_product, value: p.nm_product }))}
                                            labelField="label"
                                            valueField="value"
                                            placeholder="Select Product"
                                            value={name}
                                            onChange={item => setName(item.value)}
                                            onFocus={() => setFocusedField('name')}
                                            onBlur={() => setFocusedField(null)}
                                            placeholderStyle={{ color: '#9CA3AF' }}
                                            search
                                            searchPlaceholder="Search product..."
                                        />
                                    </View>
                                </View>

                                <View className="mb-5">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Serial Number</Text>
                                    <TextInput
                                        className="bg-gray-50 border rounded-xl px-4 h-14 text-gray-900 font-medium"
                                        style={{ borderColor: focusedField === 'serial' ? theme.colors.primary : '#E5E7EB' }}
                                        value={serial}
                                        onChangeText={setSerial}
                                        onFocus={() => setFocusedField('serial')}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="Induk Serial Number"
                                    />
                                </View>
                                <View className="mb-5">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Status <Text className="text-red-500">*</Text></Text>
                                    <View className="border rounded-xl bg-gray-50" style={{ borderColor: focusedField === 'status' ? theme.colors.primary : '#E5E7EB' }}>
                                        <Dropdown
                                            style={{ height: 56, paddingHorizontal: 16 }}
                                            data={[
                                                { label: 'Active', value: 'active' },
                                                { label: 'Normal', value: 'normal' },
                                                { label: 'Not Assigned', value: 'not_assigned' },
                                                { label: 'Sold', value: 'sold' },
                                                { label: 'Rusak', value: 'rusak' }
                                            ]}
                                            labelField="label"
                                            valueField="value"
                                            placeholder="Select Status"
                                            value={status}
                                            onChange={item => setStatus(item.value as InventoryStatus)}
                                            onFocus={() => setFocusedField('status')}
                                            onBlur={() => setFocusedField(null)}
                                            placeholderStyle={{ color: '#9CA3AF' }}
                                        />
                                    </View>
                                </View>
                            </View>

                            <Button
                                onPress={handleSave}
                                disabled={isSaving || isLoading}
                                className="h-14 rounded-2xl flex-row items-center justify-center bg-indigo-600 mb-8"
                                style={{ elevation: 2, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
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
                        </Animated.View>
                    </Animated.View>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
