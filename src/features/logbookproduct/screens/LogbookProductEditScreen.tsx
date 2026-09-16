import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput, RefreshControl } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { Save, Edit3, Trash2, X } from 'lucide-react-native';
import { Dropdown } from "react-native-element-dropdown";
import Animated, { FadeInUp } from 'react-native-reanimated';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { Button } from '../../../components/ui/button';
import { theme } from '../../../theme/theme';
import { AppDispatch } from '../../../stores';
import { fetchLogbookProductDetail } from '../stores/logbookproductSlice';
import { LogbookProductEditSkeleton } from '../skeleton/LogbookProductEditSkeleton';
import { useLogbookProductForm } from '../hooks/useLogbookProductForm';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';
import { ModalCancel } from '../../../components/ui/ModalCancel';
import { formatDate } from '../../../utils/helpers/date';

export function LogbookProductEditScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const dispatch = useDispatch<AppDispatch>();

    const { id } = route.params || {};

    const [isEditing, setIsEditing] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalType, setModalType] = useState<'save' | 'delete' | null>(null);
    const [toast, setToast] = useState<{ visible: boolean; type: ToastType; message: string; title?: string }>({
        visible: false,
        type: 'success',
        message: '',
        title: undefined
    });

    // Form Hook
    const { formData, updateField, validate, handleSave, handleDelete: deleteRecord, masterDataBarang, masterDataTypeKerusakan, isLoading, isSaving } = useLogbookProductForm(id);

    useEffect(() => {
        if (route.params?.showSuccessToast && route.params?.successMessage) {
            setToast({ visible: true, type: 'success', message: route.params.successMessage });
            navigation.setParams({ showSuccessToast: undefined, successMessage: undefined });
        }
    }, [route.params?.showSuccessToast, route.params?.successMessage, navigation]);

    const loadData = async () => {
        if (id) {
            await dispatch(fetchLogbookProductDetail(id));
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await loadData();
        setIsRefreshing(false);
    };

    const handleUpdate = () => {
        const errorMsg = validate();
        if (errorMsg) {
            setToast({ visible: true, type: 'error', message: errorMsg, title: 'Validasi' });
            return;
        }

        setModalType('save');
        setIsModalVisible(true);
    };

    const confirmUpdate = async () => {
        setIsModalVisible(false);
        try {
            await handleSave();
            setToast({ visible: true, type: 'success', message: 'Data berhasil diupdate!' });
            setIsEditing(false);
        } catch (e: any) {
            setToast({ visible: true, type: 'error', message: e.message || 'Gagal mengupdate data.' });
        }
    };

    const handleDelete = () => {
        setModalType('delete');
        setIsModalVisible(true);
    };

    const confirmDelete = async () => {
        setIsModalVisible(false);
        try {
            await deleteRecord();
            (navigation as any).navigate('Drawer', {
                screen: 'LogbookProductListScreen',
                params: {
                    toastMessage: 'Data berhasil dihapus!',
                    toastType: 'success',
                    timestamp: Date.now()
                }
            });
        } catch (e: any) {
            setToast({ visible: true, type: 'error', message: e.message || 'Gagal menghapus data.' });
        }
    };

    const productOptions = masterDataBarang.map(item => ({
        label: `${item.code_product} - ${item.nm_product}`,
        value: item.id_product.toString()
    }));

    const kerusakanOptions = masterDataTypeKerusakan.map(item => ({
        label: item.nm_type_kerusakan,
        value: item.id_type_kerusakan.toString()
    }));

    return (
        <View className="flex-1 bg-gray-50">
            {modalType === 'delete' ? (
                <ModalCancel
                    visible={isModalVisible}
                    title="Konfirmasi Hapus"
                    message="Apakah anda yakin ingin menghapus data logbook ini?"
                    confirmText="Ya!"
                    cancelText="Batal!"
                    onConfirm={confirmDelete}
                    onCancel={() => setIsModalVisible(false)}
                />
            ) : (
                <ModalConfirm
                    visible={isModalVisible}
                    title="Konfirmasi Simpan"
                    message="Apakah Anda yakin ingin menyimpan perubahan data logbook ini?"
                    confirmText="Ya!"
                    cancelText="Batal!"
                    onConfirm={confirmUpdate}
                    onCancel={() => setIsModalVisible(false)}
                />
            )}
            <ToastMessages
                visible={toast.visible}
                title={toast.title || (toast.type === 'error' ? 'Error' : 'Sukses')}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(prev => ({ ...prev, visible: false }))}
            />
            <HeaderNavigator
                title={isLoading || isRefreshing ? "MEMUAT DATA..." : (isEditing ? "EDIT LOGBOOK PRODUCT" : "DETAIL LOGBOOK PRODUCT")}
                showBackButton={true}
                onBackPress={() => {
                    if (isEditing) {
                        setIsEditing(false);
                    } else {
                        navigation.goBack();
                    }
                }}
                disableAnimation={true}
            />

            <View style={{ padding: 12, flex: 1, paddingBottom: 0 }}>
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    refreshControl={
                        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} colors={['#0ea5e9']} />
                    }
                >
                    {(isLoading || isRefreshing) ? (
                        <LogbookProductEditSkeleton />
                    ) : (
                        <View className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">

                            <View className="mb-5">
                                <Text className="text-xs font-bold text-gray-700 mb-2">Product Name <Text className="text-red-500">*</Text></Text>
                                <View className={`border border-gray-300 rounded-lg justify-center h-[42px] ${isEditing ? 'bg-white' : 'bg-gray-100'}`}>
                                    <Dropdown
                                        style={{ paddingHorizontal: 12 }}
                                        data={productOptions}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Select Product"
                                        value={formData.id_product}
                                        onChange={(item) => updateField('id_product', item.value)}
                                        selectedTextStyle={{ color: '#1F2937', fontSize: 14 }}
                                        disable={!isEditing}
                                        search
                                        searchPlaceholder="Cari..."
                                    />
                                </View>
                            </View>

                            <View className="mb-5">
                                <Text className="text-xs font-bold text-gray-700 mb-2">Tipe Kerusakan <Text className="text-red-500">*</Text></Text>
                                <View className={`border border-gray-300 rounded-lg justify-center h-[42px] ${isEditing ? 'bg-white' : 'bg-gray-100'}`}>
                                    <Dropdown
                                        style={{ paddingHorizontal: 12 }}
                                        data={kerusakanOptions}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Select Tipe Kerusakan"
                                        value={formData.id_type_kerusakan}
                                        onChange={(item) => updateField('id_type_kerusakan', item.value)}
                                        selectedTextStyle={{ color: '#1F2937', fontSize: 14 }}
                                        disable={!isEditing}
                                        search
                                        searchPlaceholder="Cari..."
                                    />
                                </View>
                            </View>

                            <View className="mb-5">
                                <Text className="text-xs font-bold text-gray-700 mb-2">Date</Text>
                                <View className="bg-gray-100 px-3 justify-center border border-gray-200 rounded-lg h-[42px]">
                                    <Text className="text-sm text-gray-800">{formData.date_log_book ? formatDate(new Date(formData.date_log_book)) : ''}</Text>
                                </View>
                            </View>

                            <View className="h-px bg-gray-200 mb-5" />

                            <View className="mb-5">
                                <Text className="text-xs font-bold text-gray-700 mb-2">Problem <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className={`p-3 border border-gray-300 rounded-lg text-sm text-gray-800 ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
                                    style={{ minHeight: 80, textAlignVertical: 'top' }}
                                    multiline
                                    value={formData.masalah}
                                    onChangeText={(t) => updateField('masalah', t)}
                                    editable={isEditing}
                                    placeholder="Jelaskan masalah..."
                                />
                            </View>

                            <View className="mb-5">
                                <Text className="text-xs font-bold text-gray-700 mb-2">Solution <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className={`p-3 border border-gray-300 rounded-lg text-sm text-gray-800 ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
                                    style={{ minHeight: 80, textAlignVertical: 'top' }}
                                    multiline
                                    value={formData.solusi}
                                    onChangeText={(t) => updateField('solusi', t)}
                                    editable={isEditing}
                                    placeholder="Jelaskan solusi..."
                                />
                            </View>

                            <View className="mb-5">
                                <Text className="text-xs font-bold text-gray-700 mb-2">Note</Text>
                                <TextInput
                                    className={`p-3 border border-gray-300 rounded-lg text-sm text-gray-800 ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
                                    style={{ minHeight: 80, textAlignVertical: 'top' }}
                                    multiline
                                    value={formData.catatan}
                                    onChangeText={(t) => updateField('catatan', t)}
                                    editable={isEditing}
                                    placeholder="Tambahan catatan..."
                                />
                            </View>

                            {/* Actions */}
                            <Animated.View entering={FadeInUp.delay(100)} className="mt-4 flex-row gap-4">
                                {!isEditing ? (
                                    <>
                                        <Button
                                            onPress={() => setIsEditing(true)}
                                            className="flex-1 h-14 rounded-2xl flex-row items-center justify-center bg-indigo-600"
                                            style={{ elevation: 4, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                                        >
                                            <Edit3 color="white" size={20} className="mr-2" />
                                            <Text className="text-white font-bold text-lg">Edit</Text>
                                        </Button>
                                        <Button
                                            onPress={handleDelete}
                                            className="flex-1 h-14 rounded-2xl flex-row items-center justify-center bg-red-600"
                                            style={{ elevation: 4, shadowColor: '#ef4444', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                                        >
                                            <Trash2 color="white" size={20} className="mr-2" />
                                            <Text className="text-white font-bold text-lg">Hapus</Text>
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            variant="outline"
                                            onPress={() => setIsEditing(false)}
                                            className="flex-1 h-14 rounded-xl flex-row items-center justify-center"
                                        >
                                            <X color={theme.colors.primary} size={20} className="mr-2" />
                                            <Text className="font-bold text-lg" style={{ color: theme.colors.primary }}>Batal</Text>
                                        </Button>
                                        <Button
                                            onPress={handleUpdate}
                                            disabled={isSaving}
                                            className={`flex-1 h-14 rounded-2xl flex-row items-center justify-center ${isSaving ? 'bg-gray-400' : 'bg-green-600'}`}
                                            style={isSaving ? {} : { elevation: 4, shadowColor: '#16a34a', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                                        >
                                            <Save color="white" size={20} className="mr-2" />
                                            <Text className="text-white font-bold text-lg">{isSaving ? 'Menyimpan...' : 'Simpan'}</Text>
                                        </Button>
                                    </>
                                )}
                            </Animated.View>

                        </View>
                    )}
                </ScrollView>
            </View>
        </View>
    );
}
