import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, RefreshControl } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Save, Edit3, Trash2, X } from 'lucide-react-native';
import { Dropdown } from "react-native-element-dropdown";
import Animated, { FadeInUp } from 'react-native-reanimated';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { Button } from '../../../components/ui/button';
import { theme } from '../../../theme/theme';
import { RootState, AppDispatch } from '../../../stores';
import { fetchLogbookProductDetail, clearCurrent } from '../stores/logbookproductSlice';
import { LogbookProductEditSkeleton } from '../skeleton/LogbookProductEditSkeleton';
import { useLogbookProductForm } from '../hooks/useLogbookProductForm';
import { logbookProductApi } from '../api/logbookProductApi';
import { dummyProductsDropdown, dummyKerusakanDropdown } from '../data/dummyProducts';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';
import { ModalCancel } from '../../../components/ui/ModalCancel';

export function LogbookProductEditScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const dispatch = useDispatch<AppDispatch>();

    const { id } = route.params || {};
    const { current, isLoading } = useSelector((state: RootState) => state.logbookproduct || { current: null, isLoading: false });

    const [isEditing, setIsEditing] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalType, setModalType] = useState<'save' | 'delete' | null>(null);
    const [toast, setToast] = useState<{ visible: boolean; type: ToastType; message: string; title?: string }>({
        visible: false,
        type: 'success',
        message: '',
        title: undefined
    });

    // Form Hook
    const { formData, updateField, validate } = useLogbookProductForm(current || undefined);

    useEffect(() => {
        if (id) {
            loadData();
        }
        return () => { dispatch(clearCurrent()); };
    }, [id]);

    useEffect(() => {
        if (route.params?.showSuccessToast && route.params?.successMessage) {
            setToast({ visible: true, type: 'success', message: route.params.successMessage });
            navigation.setParams({ showSuccessToast: undefined, successMessage: undefined });
        }
    }, [route.params?.showSuccessToast, route.params?.successMessage, navigation]);

    useEffect(() => {
        if (current) {
            updateField('id_product', current.id_product);
            updateField('id_type_kerusakan', current.id_type_kerusakan);
            updateField('masalah', current.masalah);
            updateField('solusi', current.solusi);
            updateField('catatan', current.catatan);
            updateField('date_log_book', current.date_log_book);
        }
    }, [current]);

    const loadData = async () => {
        await dispatch(fetchLogbookProductDetail(id));
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
        setIsSaving(true);
        try {
            await logbookProductApi.update(id, formData);
            setToast({ visible: true, type: 'success', message: 'Data berhasil diupdate!' });
            setIsEditing(false);
            await loadData();
        } catch (e) {
            setToast({ visible: true, type: 'error', message: 'Gagal mengupdate data.' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = () => {
        setModalType('delete');
        setIsModalVisible(true);
    };

    const confirmDelete = async () => {
        setIsModalVisible(false);
        try {
            await logbookProductApi.delete(id);

            (navigation as any).navigate('Drawer', {
                screen: 'LogbookProductListScreen',
                params: {
                    toastMessage: 'Data berhasil dihapus!',
                    toastType: 'success',
                    timestamp: Date.now()
                }
            });
        } catch (e) {
            setToast({ visible: true, type: 'error', message: 'Gagal menghapus data.' });
        }
    };

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
                                        data={dummyProductsDropdown}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Select Product"
                                        value={formData.id_product}
                                        onChange={(item) => updateField('id_product', item.value)}
                                        selectedTextStyle={{ color: '#1F2937', fontSize: 14 }}
                                        disable={!isEditing}
                                    />
                                </View>
                            </View>

                            <View className="mb-5">
                                <Text className="text-xs font-bold text-gray-700 mb-2">Tipe Kerusakan <Text className="text-red-500">*</Text></Text>
                                <View className={`border border-gray-300 rounded-lg justify-center h-[42px] ${isEditing ? 'bg-white' : 'bg-gray-100'}`}>
                                    <Dropdown
                                        style={{ paddingHorizontal: 12 }}
                                        data={dummyKerusakanDropdown}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Select Tipe Kerusakan"
                                        value={formData.id_type_kerusakan}
                                        onChange={(item) => updateField('id_type_kerusakan', item.value)}
                                        selectedTextStyle={{ color: '#1F2937', fontSize: 14 }}
                                        disable={!isEditing}
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
