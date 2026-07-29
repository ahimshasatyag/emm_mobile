import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { Dropdown } from 'react-native-element-dropdown';
import { useAssestForm } from '../hooks/useAssests';
import { theme } from '../../../theme/theme';
import { Save, ArrowLeft } from 'lucide-react-native';
import { AssetSerialNumber } from '../types/assests.types';
import { AssetsManagementSNTable } from '../components/AssetsManagementSNTable';
import { AssetsFormSkeleton } from '../skeleton/AssetsFormSkeleton';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { ToastMessages } from '../../../components/ui/ToastMessages';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';

export function AssestFormScreen() {
    const navigation = useNavigation();
    const route = useRoute<any>();
    const { mode, asset } = route.params || { mode: 'add' };

    const {
        formData,
        serialNumbers,
        categories,
        types,
        isSaving,
        labelProcured,
        labelPurchased,
        handleChange,
        addSerialNumber,
        updateSerialNumber,
        removeSerialNumber,
        setMainSerialNumber,
        handleSave,
        validateForm
    } = useAssestForm(mode === 'edit' ? asset : undefined);

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('error');
    const [isModalConfirmVisible, setIsModalConfirmVisible] = useState(false);

    const onRefresh = useCallback(() => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 1000);
    }, []);

    const statusOptions = [
        { label: 'Active', value: 'active' },
        { label: 'Normal', value: 'normal' },
        { label: 'Not Assigned', value: 'not_assigned' },
        { label: 'Sold', value: 'sold' },
        { label: 'Rusak', value: 'rusak' },
    ];

    const categoryOptions = categories.map(c => ({ label: c.name, value: c.id }));
    const typeOptions = types.map(t => ({ label: t.name, value: t.id }));

    const handleSaveForm = () => {
        const errorMsg = validateForm();
        if (errorMsg) {
            setToastType('error');
            setToastMessage(errorMsg);
            setToastVisible(true);
            return;
        }
        setIsModalConfirmVisible(true);
    };

    const handleConfirmSave = () => {
        setIsModalConfirmVisible(false);
        handleSave((savedAsset: any) => {
            navigation.replace('AssestsEditScreen', {
                assetId: savedAsset.id,
                asset: savedAsset,
                showSuccessToast: true
            });
        });
    };

    const handleAddSn = (name: string, sn: string, isMain: boolean) => {
        const newId = Date.now().toString();
        const newSn: AssetSerialNumber = {
            id: newId,
            asset_id: formData.id || '',
            name_sn: name,
            serial_number: sn,
            f_print: isMain || serialNumbers.length === 0 ? '1' : null
        };
        addSerialNumber(newSn);
        if (isMain && serialNumbers.length > 0) {
            setMainSerialNumber(newId);
        }
    };

    const handleUpdateSn = (id: string, name: string, sn: string, isMain: boolean) => {
        const updatedSn: AssetSerialNumber = {
            id,
            asset_id: formData.id || '',
            name_sn: name,
            serial_number: sn,
            f_print: isMain ? '1' : null
        };
        updateSerialNumber(updatedSn);
        if (isMain) {
            setMainSerialNumber(id);
        }
    };

    return (
        <View className="flex-1 bg-gray-50">
            <ToastMessages
                visible={toastVisible}
                type={toastType}
                title={toastType === 'error' ? 'Validasi' : 'Sukses'}
                message={toastMessage}
                onClose={() => setToastVisible(false)}
            />

            <ModalConfirm
                visible={isModalConfirmVisible}
                title="Konfirmasi"
                message="Apakah Anda yakin ingin menyimpan data asset ini?"
                cancelText='Batal!'
                confirmText='Simpan!'
                onCancel={() => setIsModalConfirmVisible(false)}
                onConfirm={handleConfirmSave}
                isLoading={isSaving}
            />

            <HeaderNavigator title={isRefreshing ? "MEMUAT DATA..." : "TAMBAH ASSET"} showBackButton={true} />

            <ScrollView
                className="flex-1 px-4 pt-4"
                contentContainerStyle={{ paddingBottom: 100 }}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
                }
            >
                {isRefreshing ? (
                    <Animated.View key="skeleton" exiting={FadeOut.duration(300)} className="-mx-4 -mt-4">
                        <AssetsFormSkeleton />
                    </Animated.View>
                ) : (
                    <Animated.View key="content" entering={FadeIn.duration(600)}>
                        <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">

                            {/* Name */}
                            <View className="mb-4">
                                <Text className="text-gray-700 text-sm mb-1">Asset Name <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className="border border-gray-200 rounded-lg p-3 text-gray-800"
                                    value={formData.name}
                                    onChangeText={(t) => handleChange('name', t)}
                                    placeholder="Input asset name"
                                />
                            </View>

                            {/* Type */}
                            <View className="mb-4">
                                <Text className="text-gray-700 text-sm mb-1">Type <Text className="text-red-500">*</Text></Text>
                                <View className="border border-gray-200 rounded-lg bg-white overflow-hidden">
                                    <Dropdown
                                        style={{ height: 48, paddingHorizontal: 12 }}
                                        data={typeOptions}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Pilih Type..."
                                        value={formData.inventory_type_id}
                                        onChange={(item) => handleChange('inventory_type_id', item.value)}
                                    />
                                </View>
                            </View>

                            {/* Category */}
                            <View className="mb-4">
                                <Text className="text-gray-700 text-sm mb-1">Category <Text className="text-red-500">*</Text></Text>
                                <View className="border border-gray-200 rounded-lg bg-white overflow-hidden">
                                    <Dropdown
                                        style={{ height: 48, paddingHorizontal: 12 }}
                                        data={categoryOptions}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Pilih Category..."
                                        value={formData.inventory_category_id}
                                        onChange={(item) => handleChange('inventory_category_id', item.value)}
                                    />
                                </View>
                            </View>

                            {/* Serial (Main) */}
                            <View className="mb-4">
                                <Text className="text-gray-700 text-sm mb-1">Serial Number</Text>
                                <TextInput
                                    className="border border-gray-200 rounded-lg p-3 text-gray-800"
                                    value={formData.serial}
                                    onChangeText={(t) => handleChange('serial', t)}
                                    placeholder="Input serial number"
                                />
                            </View>

                            {/* Dynamic Dates */}
                            <View className="mb-4 flex-row justify-between">
                                <View className="flex-1 mr-2">
                                    <Text className="text-gray-700 text-sm mb-1">{labelProcured} <Text className="text-red-500">*</Text></Text>
                                    <TextInput
                                        className="border border-gray-200 rounded-lg p-3 text-gray-800"
                                        value={formData.procured_date}
                                        onChangeText={(t) => handleChange('procured_date', t)}
                                        placeholder="YYYY-MM-DD"
                                    />
                                </View>
                                <View className="flex-1 ml-2">
                                    <Text className="text-gray-700 text-sm mb-1">{labelPurchased} <Text className="text-red-500">*</Text></Text>
                                    <TextInput
                                        className="border border-gray-200 rounded-lg p-3 text-gray-800"
                                        value={formData.purchased_date}
                                        onChangeText={(t) => handleChange('purchased_date', t)}
                                        placeholder="YYYY-MM-DD"
                                    />
                                </View>
                            </View>

                            {/* Deskripsi */}
                            <View className="mb-4">
                                <Text className="text-gray-700 text-sm mb-1">Deskripsi</Text>
                                <TextInput
                                    className="border border-gray-200 rounded-lg p-3 text-gray-800"
                                    style={{ minHeight: 100 }}
                                    value={formData.deskripsi}
                                    onChangeText={(t) => handleChange('deskripsi', t)}
                                    placeholder="Input deskripsi"
                                    multiline={true}
                                    numberOfLines={4}
                                    textAlignVertical="top"
                                />
                            </View>

                            {/* Status */}
                            <View className="mb-4">
                                <Text className="text-gray-700 text-sm mb-1">Status <Text className="text-red-500">*</Text></Text>
                                <View className="border border-gray-200 rounded-lg bg-white overflow-hidden">
                                    <Dropdown
                                        style={{ height: 48, paddingHorizontal: 12 }}
                                        data={statusOptions}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Pilih Status..."
                                        value={formData.status}
                                        onChange={(item) => handleChange('status', item.value)}
                                    />
                                </View>
                            </View>

                            <View className="h-px bg-gray-200 my-4" />

                            {/* Sub-form: Serial Numbers */}
                            <AssetsManagementSNTable
                                serialNumbers={serialNumbers}
                                onAdd={handleAddSn}
                                onUpdate={handleUpdateSn}
                                onRemove={removeSerialNumber}
                                onSetMain={setMainSerialNumber}
                                onShowToast={(msg, type) => {
                                    setToastMessage(msg);
                                    setToastType(type);
                                    setToastVisible(true);
                                }}
                            />
                        </View>

                        {/* Buttons */}
                        <View className="mt-2">
                            <TouchableOpacity
                                className={`p-4 rounded-xl flex-row items-center justify-center ${isSaving ? 'opacity-70' : ''}`}
                                style={{ backgroundColor: theme.colors.primary, elevation: 4, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                                onPress={handleSaveForm}
                                disabled={isSaving}
                            >
                                <Save size={20} color="#fff" />
                                <Text className="text-white font-bold text-lg ml-2">{isSaving ? 'MENYIMPAN...' : 'SIMPAN'}</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                )}
            </ScrollView>
        </View>
    );
}
