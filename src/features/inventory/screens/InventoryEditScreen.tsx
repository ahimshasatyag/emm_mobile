import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, RefreshControl } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Save, Edit3, X } from 'lucide-react-native';
import Animated, { FadeInUp, FadeOut, FadeIn, LinearTransition } from 'react-native-reanimated';
import { Dropdown } from 'react-native-element-dropdown';
import { theme } from '../../../theme/theme';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { useInventory } from '../hooks/useInventory';
import { InventoryStatus } from '../types/inventory.types';
import { InventoryEditSkeleton } from '../skeleton/InventoryEditSkeleton';
import { Button } from '../../../components/ui/button';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';
import { useProducts } from '../../products/hooks/useProducts';

export function InventoryEditScreen() {
    const navigation = useNavigation();
    const route = useRoute<any>();
    const assetId = route.params?.id;

    const { assets, types, categories, editAsset, fetchInitialData, getAssetSerials, validateForm } = useInventory();
    const { products } = useProducts();

    const [isSaving, setIsSaving] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    const [focusedField, setFocusedField] = useState<string | null>(null);

    const [isModalConfirmVisible, setIsModalConfirmVisible] = useState(false);
    const [toastState, setToastState] = useState({
        visible: false,
        type: 'success' as ToastType,
        message: ''
    });

    const [name, setName] = useState('');
    const [typeId, setTypeId] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [procuredDate, setProcuredDate] = useState('');
    const [purchasedDate, setPurchasedDate] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [serial, setSerial] = useState('');
    const [status, setStatus] = useState<InventoryStatus>('active');

    const [serialNumbers, setSerialNumbers] = useState([{ name_sn: '', serial_number: '' }]);
    const [fPrint, setFPrint] = useState('');

    const loadData = async () => {
        setIsInitializing(true);
        if (types.length === 0 || categories.length === 0) {
            await fetchInitialData();
        }

        const asset = assets.find(a => a.id === assetId);
        if (asset) {
            setName(asset.name);
            setTypeId(asset.inventory_type_id);
            setCategoryId(asset.inventory_category_id);
            setProcuredDate(asset.procured_date);
            setPurchasedDate(asset.purchased_date);
            setDeskripsi(asset.deskripsi);
            setSerial(asset.serial);
            setStatus(asset.status);
            setFPrint(asset.f_print);

            const serials = await getAssetSerials(assetId);
            if (serials && serials.length > 0) {
                setSerialNumbers(serials.map(s => ({ name_sn: s.name_sn, serial_number: s.serial_number })));
            } else {
                setSerialNumbers([]);
            }
        }
        setIsInitializing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
        loadData();
    };

    useEffect(() => {
        loadData();

        if (route.params?.showSuccessToast) {
            setToastState({
                visible: true,
                type: 'success',
                message: 'Data inventaris berhasil ditambahkan'
            });
            navigation.setParams({ showSuccessToast: undefined });
        }
    }, [assetId, route.params?.showSuccessToast, navigation]);

    const onRefresh = async () => {
        setIsRefreshing(true);
        await loadData();
        setIsRefreshing(false);
    };

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
            await editAsset(assetId, {
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
            setToastState({
                visible: true,
                type: 'success',
                message: 'Data inventaris berhasil diupdate'
            });
            setIsEditing(false);
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
                title={isInitializing || isRefreshing ? "MEMUAT DATA..." : (isEditing ? "EDIT SERIAL NUMBER" : "DETAIL SERIAL NUMBER")}
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
                title="Konfirmasi Edit"
                message="Apakah Anda yakin ingin menyimpan perubahan pada aset ini?"
                confirmText="Ya, Simpan"
                cancelText="Batal"
                onCancel={() => setIsModalConfirmVisible(false)}
                onConfirm={confirmSave}
            />

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />}
            >
                {(isInitializing) ? (
                    <Animated.View exiting={FadeOut.duration(300)}>
                        <InventoryEditSkeleton />
                    </Animated.View>
                ) : (
                    <Animated.View entering={FadeIn.duration(600)}>
                        <Animated.View
                            key={`form-container-${isEditing}`}
                            entering={FadeInUp.delay(50)}
                            layout={LinearTransition.springify()}
                            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6"
                        >
                            <View className="mb-5">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Product Name <Text className="text-red-500">*</Text></Text>
                                <View className={`border rounded-xl bg-gray-50 ${!isEditing ? 'opacity-70 bg-gray-100' : ''}`} style={{ borderColor: focusedField === 'name' ? theme.colors.primary : '#E5E7EB' }}>
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
                                        disable={!isEditing}
                                        search
                                        searchPlaceholder="Search product..."
                                    />
                                </View>
                            </View>

                            <View className="mb-5">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Serial Number</Text>
                                <TextInput
                                    className={`bg-gray-50 border rounded-xl px-4 h-14 text-gray-900 font-medium ${!isEditing ? 'opacity-70 bg-gray-100' : ''}`}
                                    style={{ borderColor: focusedField === 'serial' ? theme.colors.primary : '#E5E7EB' }}
                                    value={serial}
                                    onChangeText={setSerial}
                                    onFocus={() => setFocusedField('serial')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="Induk Serial Number"
                                    editable={isEditing}
                                />
                            </View>
                            <View className="mb-5">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Status <Text className="text-red-500">*</Text></Text>
                                <View className={`border rounded-xl bg-gray-50 ${!isEditing ? 'opacity-70 bg-gray-100' : ''}`} style={{ borderColor: focusedField === 'status' ? theme.colors.primary : '#E5E7EB' }}>
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
                                        disable={!isEditing}
                                    />
                                </View>
                            </View>
                        </Animated.View>



                        <Animated.View
                            key={`actions-${isEditing}`}
                            entering={FadeInUp.delay(100)}
                            layout={LinearTransition.springify()}
                            className="flex-row space-x-3"
                        >
                            {!isEditing ? (
                                <Button
                                    onPress={() => setIsEditing(true)}
                                    className="flex-1 h-14 rounded-2xl flex-row items-center justify-center bg-indigo-600"
                                    style={{ elevation: 2, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                                >
                                    <Edit3 color="white" size={20} className="mr-2" />
                                    <Text className="text-white font-bold text-lg">Edit</Text>
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        variant="outline"
                                        onPress={handleCancel}
                                        className="flex-1 h-14 rounded-xl flex-row items-center justify-center"
                                    >
                                        <X color={theme.colors.primary} size={20} className="mr-2" />
                                        <Text className="font-bold text-lg" style={{ color: theme.colors.primary }}>Batal</Text>
                                    </Button>

                                    <Button
                                        onPress={handleSave}
                                        disabled={isSaving}
                                        className="flex-1 h-14 rounded-xl flex-row items-center justify-center bg-indigo-600"
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
                                </>
                            )}
                        </Animated.View>
                    </Animated.View>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
