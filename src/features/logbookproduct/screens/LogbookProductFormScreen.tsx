import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Alert, RefreshControl } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Save, X } from 'lucide-react-native';
import { Dropdown } from "react-native-element-dropdown";
import Animated, { FadeInUp } from 'react-native-reanimated';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { Button } from '../../../components/ui/button';
import { theme } from '../../../theme/theme';
import { useLogbookProductForm } from '../hooks/useLogbookProductForm';
import { logbookProductApi } from '../api/logbookProductApi';
import { dummyProductsDropdown, dummyKerusakanDropdown } from '../data/dummyProducts';
import { LogbookProductFormSkeleton } from '../skeleton/LogbookProductFormSkeleton';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';

export function LogbookProductFormScreen() {
    const navigation = useNavigation<any>();

    // Form State
    const { formData, updateField, validate } = useLogbookProductForm();
    const [isSaving, setIsSaving] = useState(false);
    const [isSaveModalVisible, setIsSaveModalVisible] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);
    const [toast, setToast] = useState<{ visible: boolean; type: ToastType; message: string; title?: string }>({
        visible: false,
        type: 'success',
        message: '',
        title: undefined
    });

    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;
            const initialize = async () => {
                setIsInitializing(true);
                await new Promise(resolve => setTimeout(resolve, 800));
                if (isActive) setIsInitializing(false);
            };
            initialize();
            return () => { isActive = false; setIsInitializing(true); };
        }, [])
    );

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        setIsRefreshing(false);
    };

    const handleSave = () => {
        const errorMsg = validate();
        if (errorMsg) {
            setToast({ visible: true, type: 'error', message: errorMsg, title: 'Validasi' });
            return;
        }

        setIsSaveModalVisible(true);
    };

    const confirmSave = async () => {
        setIsSaveModalVisible(false);
        setIsSaving(true);
        try {
            const newRecord = await logbookProductApi.create(formData);
            navigation.replace('LogbookProductEditScreen', { 
                id: newRecord.id_log_book,
                showSuccessToast: true,
                successMessage: 'Data berhasil disimpan!'
            });
        } catch (e) {
            setToast({ visible: true, type: 'error', message: 'Gagal menyimpan data.' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <View className="flex-1 bg-gray-50">
            <ModalConfirm
                visible={isSaveModalVisible}
                title="Konfirmasi Simpan"
                message="Apakah Anda yakin ingin menyimpan data logbook ini?"
                confirmText="Ya, Simpan"
                cancelText="Batal"
                onConfirm={confirmSave}
                onCancel={() => setIsSaveModalVisible(false)}
            />

            <ToastMessages
                visible={toast.visible}
                title={toast.title || (toast.type === 'error' ? 'Error' : 'Sukses')}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(prev => ({ ...prev, visible: false }))}
            />

            <HeaderNavigator
                title={(isInitializing || isRefreshing) ? "MEMUAT DATA..." : "TAMBAH LOGBOOK PRODUCT"}
                showBackButton={true}
                onBackPress={() => navigation.goBack()}
                disableAnimation={true}
                isLoading={isInitializing || isRefreshing}
            />

            <View style={{ padding: 12, flex: 1, paddingBottom: 0 }}>
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    refreshControl={
                        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} colors={[theme.colors.primary]} />
                    }
                >
                    {(isInitializing || isRefreshing) ? (
                        <LogbookProductFormSkeleton />
                    ) : (
                        <View className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">

                            <View className="mb-5">
                                <Text className="text-xs font-bold text-gray-700 mb-2">Product Name <Text className="text-red-500">*</Text></Text>
                                <View className="border border-gray-300 rounded-lg justify-center h-[42px] bg-white">
                                    <Dropdown
                                        style={{ paddingHorizontal: 12 }}
                                        data={dummyProductsDropdown}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Select Product"
                                        value={formData.id_product}
                                        onChange={(item) => updateField('id_product', item.value)}
                                        selectedTextStyle={{ color: '#1F2937', fontSize: 14 }}
                                    />
                                </View>
                            </View>

                            <View className="mb-5">
                                <Text className="text-xs font-bold text-gray-700 mb-2">Tipe Kerusakan <Text className="text-red-500">*</Text></Text>
                                <View className="border border-gray-300 rounded-lg justify-center h-[42px] bg-white">
                                    <Dropdown
                                        style={{ paddingHorizontal: 12 }}
                                        data={dummyKerusakanDropdown}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Select Tipe Kerusakan"
                                        value={formData.id_type_kerusakan}
                                        onChange={(item) => updateField('id_type_kerusakan', item.value)}
                                        selectedTextStyle={{ color: '#1F2937', fontSize: 14 }}
                                    />
                                </View>
                            </View>

                            <View className="mb-5">
                                <Text className="text-xs font-bold text-gray-700 mb-2">Date</Text>
                                <View className="bg-gray-100 px-3 justify-center border border-gray-200 rounded-lg h-[42px]">
                                    <Text className="text-sm text-gray-800">{formData.date_log_book}</Text>
                                </View>
                            </View>

                            <View className="h-px bg-gray-200 mb-5" />

                            <View className="mb-5">
                                <Text className="text-xs font-bold text-gray-700 mb-2">Problem <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className="bg-white p-3 border border-gray-300 rounded-lg text-sm text-gray-800"
                                    style={{ minHeight: 80, textAlignVertical: 'top' }}
                                    multiline
                                    value={formData.masalah}
                                    onChangeText={(t) => updateField('masalah', t)}
                                    placeholder="Jelaskan masalah..."
                                />
                            </View>

                            <View className="mb-5">
                                <Text className="text-xs font-bold text-gray-700 mb-2">Solution <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className="bg-white p-3 border border-gray-300 rounded-lg text-sm text-gray-800"
                                    style={{ minHeight: 80, textAlignVertical: 'top' }}
                                    multiline
                                    value={formData.solusi}
                                    onChangeText={(t) => updateField('solusi', t)}
                                    placeholder="Jelaskan solusi..."
                                />
                            </View>

                            <View className="mb-5">
                                <Text className="text-xs font-bold text-gray-700 mb-2">Note</Text>
                                <TextInput
                                    className="bg-white p-3 border border-gray-300 rounded-lg text-sm text-gray-800"
                                    style={{ minHeight: 80, textAlignVertical: 'top' }}
                                    multiline
                                    value={formData.catatan}
                                    onChangeText={(t) => updateField('catatan', t)}
                                    placeholder="Tambahan catatan..."
                                />
                            </View>

                            {/* Actions */}
                            <Animated.View entering={FadeInUp.delay(100)} className="mt-4 flex-row gap-4">
                                <Button
                                    onPress={handleSave}
                                    disabled={isSaving}
                                    className={`flex-1 h-14 rounded-2xl flex-row items-center justify-center ${isSaving ? 'bg-gray-400' : ''}`}
                                    style={isSaving ? {} : { backgroundColor: theme.colors.primary, elevation: 4, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                                >
                                    <Save color="white" size={20} className="mr-2" />
                                    <Text className="text-white font-bold text-lg">{isSaving ? 'Menyimpan...' : 'Simpan'}</Text>
                                </Button>
                            </Animated.View>

                        </View>
                    )}
                </ScrollView>
            </View>
        </View>
    );
}
