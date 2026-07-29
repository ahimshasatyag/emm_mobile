import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, RefreshControl, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { Dropdown } from 'react-native-element-dropdown';
import { useAssestForm } from '../hooks/useAssests';
import { theme } from '../../../theme/theme';
import { Save, Pencil, X } from 'lucide-react-native';
import { AssetSerialNumber } from '../types/assests.types';
import { AssetsManagementSNTable } from '../components/AssetsManagementSNTable';
import { AssestsEditSkeleton } from '../skeleton/AssestsEditSkeleton';
import { Button } from '../../../components/ui/button';
import Animated, { FadeIn, FadeOut, FadeInUp } from 'react-native-reanimated';
import { ToastMessages } from '../../../components/ui/ToastMessages';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';

export function AssestsEditScreen() {
    const navigation = useNavigation();
    const route = useRoute<any>();
    const { asset, assetId } = route.params || {};
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
    } = useAssestForm(asset);

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('error');
    const [isModalConfirmVisible, setIsModalConfirmVisible] = useState(false);

    useEffect(() => {
        if (route.params?.showSuccessToast) {
            setToastType('success');
            setToastMessage('Data asset berhasil disimpan');
            setToastVisible(true);
            navigation.setParams({ showSuccessToast: undefined });
        }
    }, [route.params?.showSuccessToast, navigation]);

    const onRefresh = useCallback(() => {
        setIsRefreshing(true);
        // Simulate refresh delay
        setTimeout(() => setIsRefreshing(false), 800);
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
        handleSave(() => {
            setToastType('success');
            setToastMessage('Perubahan berhasil disimpan');
            setToastVisible(true);
            setIsEditMode(false);
        });
    };

    const handleAddSn = (name: string, sn: string, isMain: boolean) => {
        if (!isEditMode) return;
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
        if (!isEditMode) return;
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

    const handleRemoveSn = (id: string) => {
        if (!isEditMode) return;
        removeSerialNumber(id);
    };

    const handleSetMainSn = (id: string) => {
        if (!isEditMode) return;
        setMainSerialNumber(id);
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
                message="Apakah Anda yakin ingin menyimpan perubahan data asset ini?"
                cancelText='Batal!'
                confirmText='Simpan!'
                onCancel={() => setIsModalConfirmVisible(false)}
                onConfirm={handleConfirmSave}
                isLoading={isSaving}
            />

            <HeaderNavigator
                title={isRefreshing ? "MEMUAT DATA..." : (isEditMode ? `EDIT ${formData.name || 'ASSET'}` : `DETAIL ${formData.name || 'ASSET'}`)}
                showBackButton={true}
            />

            <ScrollView
                className="flex-1 px-4 pt-4"
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
                }
            >
                {isRefreshing ? (
                    <Animated.View key="skeleton" exiting={FadeOut.duration(300)} className="-mx-4 -mt-4">
                        <AssestsEditSkeleton />
                    </Animated.View>
                ) : (
                    <Animated.View key="content" entering={FadeIn.duration(600)}>
                        <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">

                            {/* Name */}
                            <View className="mb-4">
                                <Text className="text-gray-700 text-sm mb-1">Asset Name <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className={`rounded-lg p-3 border ${!isEditMode ? 'bg-gray-100 border-gray-200 text-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                                    value={formData.name}
                                    onChangeText={(t) => handleChange('name', t)}
                                    placeholder="Input asset name"
                                    editable={isEditMode}
                                />
                            </View>

                            {/* Type */}
                            <View className="mb-4">
                                <Text className="text-gray-700 text-sm mb-1">Type <Text className="text-red-500">*</Text></Text>
                                <View className={`border rounded-lg overflow-hidden ${!isEditMode ? 'bg-gray-100 border-gray-200' : 'bg-white border-gray-200'}`}>
                                    <Dropdown
                                        style={{ height: 48, paddingHorizontal: 12 }}
                                        data={typeOptions}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Pilih Type..."
                                        value={formData.inventory_type_id}
                                        onChange={(item) => handleChange('inventory_type_id', item.value)}
                                        disable={!isEditMode}
                                    />
                                </View>
                            </View>

                            {/* Category */}
                            <View className="mb-4">
                                <Text className="text-gray-700 text-sm mb-1">Category <Text className="text-red-500">*</Text></Text>
                                <View className={`border rounded-lg overflow-hidden ${!isEditMode ? 'bg-gray-100 border-gray-200' : 'bg-white border-gray-200'}`}>
                                    <Dropdown
                                        style={{ height: 48, paddingHorizontal: 12 }}
                                        data={categoryOptions}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Pilih Category..."
                                        value={formData.inventory_category_id}
                                        onChange={(item) => handleChange('inventory_category_id', item.value)}
                                        disable={!isEditMode}
                                    />
                                </View>
                            </View>

                            {/* Serial (Main) */}
                            <View className="mb-4">
                                <Text className="text-gray-700 text-sm mb-1">Serial Number</Text>
                                <TextInput
                                    className={`rounded-lg p-3 border ${!isEditMode ? 'bg-gray-100 border-gray-200 text-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                                    value={formData.serial}
                                    onChangeText={(t) => handleChange('serial', t)}
                                    placeholder="Input serial number"
                                    editable={isEditMode}
                                />
                            </View>

                            {/* Dynamic Dates */}
                            <View className="mb-4 flex-row justify-between">
                                <View className="flex-1 mr-2">
                                    <Text className="text-gray-700 text-sm mb-1">{labelProcured} <Text className="text-red-500">*</Text></Text>
                                    <TextInput
                                        className={`rounded-lg p-3 border ${!isEditMode ? 'bg-gray-100 border-gray-200 text-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                                        value={formData.procured_date}
                                        onChangeText={(t) => handleChange('procured_date', t)}
                                        placeholder="YYYY-MM-DD"
                                        editable={isEditMode}
                                    />
                                </View>
                                <View className="flex-1 ml-2">
                                    <Text className="text-gray-700 text-sm mb-1">{labelPurchased} <Text className="text-red-500">*</Text></Text>
                                    <TextInput
                                        className={`rounded-lg p-3 border ${!isEditMode ? 'bg-gray-100 border-gray-200 text-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                                        value={formData.purchased_date}
                                        onChangeText={(t) => handleChange('purchased_date', t)}
                                        placeholder="YYYY-MM-DD"
                                        editable={isEditMode}
                                    />
                                </View>
                            </View>

                            {/* Deskripsi */}
                            <View className="mb-4">
                                <Text className="text-gray-700 text-sm mb-1">Deskripsi</Text>
                                <TextInput
                                    className={`rounded-lg p-3 border ${!isEditMode ? 'bg-gray-100 border-gray-200 text-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                                    style={{ minHeight: 100 }}
                                    value={formData.deskripsi}
                                    onChangeText={(t) => handleChange('deskripsi', t)}
                                    placeholder="Input deskripsi"
                                    multiline={true}
                                    numberOfLines={4}
                                    textAlignVertical="top"
                                    editable={isEditMode}
                                />
                            </View>

                            {/* Status */}
                            <View className="mb-4">
                                <Text className="text-gray-700 text-sm mb-1">Status <Text className="text-red-500">*</Text></Text>
                                <View className={`border rounded-lg overflow-hidden ${!isEditMode ? 'bg-gray-100 border-gray-200' : 'bg-white border-gray-200'}`}>
                                    <Dropdown
                                        style={{ height: 48, paddingHorizontal: 12 }}
                                        data={statusOptions}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Pilih Status..."
                                        value={formData.status}
                                        onChange={(item) => handleChange('status', item.value)}
                                        disable={!isEditMode}
                                    />
                                </View>
                            </View>

                            <View className="h-px bg-gray-200 my-4" />

                            {/* Sub-form: Serial Numbers */}
                            <AssetsManagementSNTable
                                serialNumbers={serialNumbers}
                                onAdd={handleAddSn}
                                onUpdate={handleUpdateSn}
                                onRemove={handleRemoveSn}
                                onSetMain={handleSetMainSn}
                                isEditMode={isEditMode}
                                onShowToast={(msg, type) => {
                                    setToastMessage(msg);
                                    setToastType(type);
                                    setToastVisible(true);
                                }}
                            />
                        </View>

                        <Animated.View entering={FadeInUp.delay(100)}>
                            {isEditMode ? (
                                <View className="flex-row gap-4">
                                    <Button
                                        variant="outline"
                                        onPress={() => setIsEditMode(false)}
                                        disabled={isSaving}
                                        className="flex-1 h-14 rounded-xl flex-row items-center justify-center"
                                    >
                                        <X color={theme.colors.primary} size={20} className="mr-2" />
                                        <Text className="font-bold text-lg" style={{ color: theme.colors.primary }}>Batal</Text>
                                    </Button>

                                    <Button
                                        onPress={handleSaveForm}
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
                                <View className="flex-row gap-4 mt-2">
                                    <Button
                                        onPress={() => setIsEditMode(true)}
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
        </View>
    );
}
