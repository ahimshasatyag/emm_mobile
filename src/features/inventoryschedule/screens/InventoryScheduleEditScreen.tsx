import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Save, CheckSquare, Square, Pencil } from 'lucide-react-native';
import Animated, { FadeIn, FadeInUp, FadeOut } from 'react-native-reanimated';
import { theme } from '../../../theme/theme';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import { useInventoryScheduleForm } from '../hooks/useInventoryScheduleForm';
import { InventoryScheduleEditSkeleton } from '../skeleton/InventoryScheduleEditSkeleton';
import { fetchScheduleById } from '../api/inventoryscheduleApi';
import { InventorySchedule } from '../types/inventoryschedule.types';
import { ToastMessages } from '../../../components/ui/ToastMessages';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';

export function InventoryScheduleEditScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { id } = route.params || {};

    const [isEditMode, setIsEditMode] = useState(false);
    const [initialData, setInitialData] = useState<InventorySchedule | undefined>(undefined);
    const [isLoadingData, setIsLoadingData] = useState(true);

    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('error');
    const [isModalConfirmVisible, setIsModalConfirmVisible] = useState(false);

    useEffect(() => {
        if (route.params?.showSuccessToast) {
            setToastType('success');
            setToastMessage('Data berhasil disimpan');
            setToastVisible(true);
            navigation.setParams({ showSuccessToast: undefined });
        }
    }, [route.params?.showSuccessToast, navigation]);

    const {
        formData,
        assets,
        users,
        isSaving,
        handleChange,
        handleReminderChange,
        handlePicChange,
        handleSave,
        validateForm
    } = useInventoryScheduleForm(initialData);

    useEffect(() => {
        const loadData = async () => {
            if (id) {
                const data = await fetchScheduleById(id);
                setInitialData(data);
            }
            setIsLoadingData(false);
        };
        loadData();
    }, [id]);

    const [isRefreshing, setIsRefreshing] = useState(false);

    const onRefresh = useCallback(async () => {
        setIsRefreshing(true);
        if (id) {
            const data = await fetchScheduleById(id);
            setInitialData(data);
        }
        setIsRefreshing(false);
    }, [id]);

    const onSavePress = () => {
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
            setToastMessage('Data berhasil disimpan');
            setToastVisible(true);
            setIsEditMode(false);
        });
    };

    if (isLoadingData) {
        return (
            <View className="flex-1 bg-gray-50">
                <HeaderNavigator title="MEMUAT DATA..." showBackButton={true} />
                <InventoryScheduleEditSkeleton />
            </View>
        );
    }

    const assetOptions = assets.map(a => ({ label: `${a.id}. ${a.name}`, value: a.id }));

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
                message="Apakah Anda yakin ingin menyimpan perubahan data schedule ini?"
                cancelText='Batal!'
                confirmText='Simpan!'
                onCancel={() => setIsModalConfirmVisible(false)}
                onConfirm={handleConfirmSave}
                isLoading={isSaving}
            />

            <HeaderNavigator title={isRefreshing ? "MEMUAT DATA..." : (isEditMode ? "EDIT ASSET SCHEDULE" : "DETAIL ASSET SCHEDULE")} showBackButton={true} />

            <ScrollView
                className="flex-1 px-4 pt-4"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
                }
            >
                {isRefreshing ? (
                    <Animated.View key="skeleton" exiting={FadeOut.duration(300)} className="-mx-4 -mt-4">
                        <InventoryScheduleEditSkeleton />
                    </Animated.View>
                ) : (
                    <Animated.View key="content" entering={FadeIn.duration(600)} className="flex-1">
                        <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">

                            {/* Asset ID (Dropdown) */}
                            <View className="mb-4">
                                <Text className="text-gray-700 text-sm mb-1">Assets ID <Text className="text-red-500">*</Text></Text>
                                <View className={`border border-gray-200 rounded-lg overflow-hidden ${isEditMode ? 'bg-white' : 'bg-gray-100'}`}>
                                    <Dropdown
                                        style={{ height: 48, paddingHorizontal: 12 }}
                                        data={assetOptions}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Pilih Asset..."
                                        value={formData.asset_id}
                                        onChange={(item) => handleChange('asset_id', item.value)}
                                        disable={!isEditMode}
                                    />
                                </View>
                            </View>

                            {/* Name */}
                            <View className="mb-4">
                                <Text className="text-gray-700 text-sm mb-1">Payment Name <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className={`border border-gray-200 rounded-lg p-3 ${isEditMode ? 'bg-white text-gray-800' : 'bg-gray-100 text-gray-500'}`}
                                    value={formData.name}
                                    onChangeText={(val) => handleChange('name', val)}
                                    editable={isEditMode}
                                />
                            </View>

                            {/* Deskripsi */}
                            <View className="mb-4">
                                <Text className="text-gray-700 text-sm mb-1">Payment Deskripsi</Text>
                                <TextInput
                                    className={`border border-gray-200 rounded-lg p-3 ${isEditMode ? 'bg-white text-gray-800' : 'bg-gray-100 text-gray-500'}`}
                                    value={formData.deskripsi}
                                    onChangeText={(val) => handleChange('deskripsi', val)}
                                    editable={isEditMode}
                                    multiline
                                    numberOfLines={4}
                                    style={{ textAlignVertical: 'top', minHeight: 100 }}
                                />
                            </View>

                            {/* Periode */}
                            <View className="mb-4">
                                <Text className="text-gray-700 text-sm mb-1">Payment Periode</Text>
                                <View className="flex-row">
                                    {['Monthly', 'Yearly'].map((p) => {
                                        const isSelected = formData.periode === p;
                                        return (
                                            <TouchableOpacity
                                                key={p}
                                                disabled={!isEditMode}
                                                onPress={() => handleChange('periode', p)}
                                                className={`flex-1 py-3 items-center border ${p === 'Monthly' ? 'rounded-l-lg' : 'rounded-r-lg'}`}
                                                style={isSelected ? { backgroundColor: theme.colors.primaryContainer, borderColor: theme.colors.primaryContainer } : { backgroundColor: 'white', borderColor: '#e5e7eb' }}
                                            >
                                                <Text style={isSelected ? { color: theme.colors.primary, fontWeight: 'bold' } : { color: '#9ca3af' }}>{p}</Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </View>

                            {/* Due Date */}
                            <View className="mb-4">
                                <Text className="text-gray-700 text-sm mb-1">Payment DueDate</Text>
                                <TextInput
                                    className={`border border-gray-200 rounded-lg p-3 ${isEditMode ? 'bg-white text-gray-800' : 'bg-gray-100 text-gray-500'}`}
                                    value={formData.due_date}
                                    onChangeText={(val) => handleChange('due_date', val)}
                                    editable={isEditMode}
                                />
                            </View>

                            {/* Reminder */}
                            <View className="mb-4">
                                <Text className="text-gray-700 text-sm mb-1">Reminder</Text>
                                <View className="flex-row gap-4 mt-2">
                                    {['3', '7', '14'].map((days) => {
                                        const isChecked = formData.reminder?.split(',').includes(days);
                                        return (
                                            <TouchableOpacity
                                                key={days}
                                                disabled={!isEditMode}
                                                onPress={() => handleReminderChange(days)}
                                                className="flex-row items-center"
                                            >
                                                {isChecked ? (
                                                    <CheckSquare color={theme.colors.primary} size={20} />
                                                ) : (
                                                    <Square color="#9ca3af" size={20} />
                                                )}
                                                <Text className="ml-2 text-gray-700">{days} days</Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </View>

                            {/* PIC */}
                            <View className="mb-4">
                                <Text className="text-gray-700 text-sm mb-1">PIC <Text className="text-red-500">*</Text></Text>
                                <View className={`border border-gray-200 rounded-lg overflow-hidden mt-1 ${isEditMode ? 'bg-white' : 'bg-gray-100'}`}>
                                    <MultiSelect
                                        style={{ minHeight: 48, paddingHorizontal: 12 }}
                                        data={users.map(u => ({ label: u.nm_users, value: u.username }))}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Pilih PIC..."
                                        value={formData.pic?.map(p => p.username) || []}
                                        onChange={(selectedUsernames) => {
                                            const newPics = selectedUsernames
                                                .map(username => users.find(u => u.username === username))
                                                .filter(Boolean) as typeof formData.pic;
                                            handleChange('pic', newPics);
                                        }}
                                        disable={!isEditMode}
                                        selectedStyle={{ borderRadius: 8, backgroundColor: theme.colors.primaryContainer, borderColor: theme.colors.primaryContainer }}
                                        selectedTextStyle={{ color: theme.colors.primary, fontSize: 13, fontWeight: 'bold' }}
                                        dropdownPosition="top"
                                    />
                                </View>
                            </View>
                        </View>

                        {/* Toggle Edit Mode Button / Action Buttons */}
                        <Animated.View entering={FadeInUp.delay(100)}>
                            {isEditMode ? (
                                <View className="flex-row gap-4 mt-2 mb-8">
                                    <TouchableOpacity
                                        onPress={() => {
                                            setIsEditMode(false);
                                        }}
                                        className="flex-1 py-4 rounded-xl items-center justify-center bg-gray-100"
                                    >
                                        <Text className="text-gray-700 font-bold text-lg">Batal</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={onSavePress}
                                        disabled={isSaving}
                                        className="flex-1 py-4 rounded-xl flex-row items-center justify-center"
                                        style={{ backgroundColor: theme.colors.primary }}
                                    >
                                        {isSaving ? (
                                            <ActivityIndicator color="white" />
                                        ) : (
                                            <>
                                                <Save color="white" size={20} className="mr-2" />
                                                <Text className="text-white font-bold text-lg">Simpan</Text>
                                            </>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View className="flex-row gap-4 mt-2 mb-8">
                                    <TouchableOpacity
                                        onPress={() => setIsEditMode(true)}
                                        className="flex-1 h-14 rounded-2xl flex-row items-center justify-center"
                                        style={{ backgroundColor: theme.colors.primary }}
                                    >
                                        <Pencil color="white" size={20} className="mr-2" />
                                        <Text className="text-white font-bold text-lg">Edit</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </Animated.View>
                    </Animated.View>
                )}
            </ScrollView>
        </View>
    );
}
