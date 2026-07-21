import React, { useState } from 'react';
import { View, ScrollView, RefreshControl, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { useTandaTerimaCust } from '../hooks/useTandaTerimaCust';
import { TandaTerimaCustEditSkeleton } from '../skeleton/TandaTerimaCustEditSkeleton';
import { TandaTerimaCustTable } from '../components/TandaTerimaCustTable';
import { TandaTerimaCustModal } from '../components/TandaTerimaCustModal';
import { ModalCancel } from '../../../components/ui/ModalCancel';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { theme } from '../../../theme/theme';
import { Save, Trash2, Pencil } from 'lucide-react-native';
import { Dropdown } from 'react-native-element-dropdown';

type RouteParams = {
    TandaTerimaCustEditScreen: { id: string };
};

export const TandaTerimaCustEditScreen = () => {
    const navigation = useNavigation();
    const route = useRoute<RouteProp<RouteParams, 'TandaTerimaCustEditScreen'>>();
    const { id } = route.params;

    const [modalVisible, setModalVisible] = useState(false);
    const [editingDetailIndex, setEditingDetailIndex] = useState<number | null>(null);
    const [editingDetailData, setEditingDetailData] = useState<any | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastType, setToastType] = useState<ToastType>('success');
    const [toastMsg, setToastMsg] = useState('');

    const { formData, customers, handleChange, handleAddFile, handleRemoveFile, handleSave, handleDelete, isSaving, loading, isRefreshing, onRefresh, currentItem, setFormData } = useTandaTerimaCust(id);

    const onSavePress = () => {
        if (!formData.id_customers) {
            setToastType('error');
            setToastMsg('Customer wajib dipilih');
            setToastVisible(true);
            return;
        }
        setConfirmModalVisible(true);
    };

    const handleConfirmUpdate = () => {
        setConfirmModalVisible(false);
        handleSave(() => {
            setIsEditMode(false);
            setToastMsg('Data berhasil diupdate!');
            setToastType('success');
            setToastVisible(true);
        });
    };

    const onDeletePress = () => {
        setDeleteModalVisible(true);
    };

    const handleRowClick = (item: any, index: number) => {
        setEditingDetailIndex(index);
        setEditingDetailData(item);
        setModalVisible(true);
    };

    const handleAddClick = () => {
        setEditingDetailIndex(null);
        setEditingDetailData(null);
        setModalVisible(true);
    };

    const handleSaveDetail = (data: { keterangan: string; fileName: string }) => {
        if (editingDetailIndex !== null) {
            setFormData(prev => {
                const newFiles = [...prev.files];
                newFiles[editingDetailIndex] = {
                    ...newFiles[editingDetailIndex],
                    keterangan: data.keterangan,
                    file: data.fileName,
                    nama: data.fileName
                };
                return { ...prev, files: newFiles };
            });
            setToastMsg('File berhasil diupdate!');
        } else {
            handleAddFile(data.fileName, data.keterangan);
            setToastMsg('File berhasil ditambahkan!');
        }
        setToastType('success');
        setToastVisible(true);
    };

    const handleDeleteDetail = () => {
        if (editingDetailIndex !== null) {
            handleRemoveFile(editingDetailIndex);
            setToastMsg('File berhasil dihapus!');
            setToastType('success');
            setToastVisible(true);
        }
    };

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator title={isRefreshing ? "MEMUAT DATA..." : (isEditMode ? "EDIT REPOSITORY TANDA TERIMA" : "DETAIL REPOSITORY TANDA TERIMA")} showBackButton={true} />
            <ScrollView
                className="flex-1 px-4 pt-4"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
                }
            >
                {(loading || isRefreshing) ? (
                    <TandaTerimaCustEditSkeleton />
                ) : (
                    <Animated.View entering={FadeIn.duration(600)} exiting={FadeOut}>
                        <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">

                            <View className="mb-4">
                                <Text className="text-gray-700 text-sm mb-1">Customer <Text className="text-red-500">*</Text></Text>
                                <View className={`border border-gray-200 rounded-lg ${isEditMode ? 'bg-gray-50' : 'bg-gray-100'}`}>
                                    <Dropdown
                                        style={{ height: 50, paddingHorizontal: 16 }}
                                        data={customers.map(c => ({ label: c.nm_customers, value: c.id_customers }))}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Pilih Customer..."
                                        value={formData.id_customers}
                                        onChange={item => handleChange('id_customers', item.value)}
                                        disable={!isEditMode}
                                    />
                                </View>
                            </View>

                            {/* Tanggal */}
                            <View className="mb-4">
                                <Text className="text-gray-700 text-sm mb-1">Tanggal <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className="border border-gray-200 rounded-lg p-3 text-gray-800 bg-gray-50"
                                    value={formData.date_tanda_terima}
                                    editable={false}
                                />
                            </View>

                            <View className="mb-4">
                                <Text className="text-gray-700 text-sm mb-1">Keterangan</Text>
                                <TextInput
                                    className={`border border-gray-200 rounded-lg p-3 ${isEditMode ? 'text-gray-800 bg-gray-50' : 'text-gray-500 bg-gray-100'}`}
                                    value={formData.keterangan}
                                    onChangeText={(val) => handleChange('keterangan', val)}
                                    placeholder="Masukkan keterangan"
                                    editable={isEditMode}
                                />
                            </View>

                            <View className="mt-2 border-t border-gray-100 pt-2 -mx-4">
                                <TandaTerimaCustTable
                                    data={formData.files}
                                    onAddClick={handleAddClick}
                                    onRowClick={handleRowClick}
                                    readOnly={!isEditMode}
                                />
                            </View>
                        </View>

                        {isEditMode ? (
                            <View className="flex-row gap-4 mt-2 mb-10">
                                <TouchableOpacity
                                    onPress={() => setIsEditMode(false)}
                                    className="flex-1 py-4 rounded-xl flex-row items-center justify-center bg-white border border-gray-200"
                                    disabled={isSaving}
                                >
                                    <Text className="text-gray-700 font-bold text-lg">Batal</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={onSavePress}
                                    className="flex-1 py-4 rounded-xl flex-row items-center justify-center"
                                    style={{ backgroundColor: theme.colors.primary }}
                                    disabled={isSaving}
                                >
                                    {isSaving ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <>
                                            <Save color="white" size={20} className="mr-2" />
                                            <Text className="text-white font-bold text-lg">Update</Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View className="flex-row gap-4 mt-2 mb-10">
                                <TouchableOpacity
                                    onPress={onDeletePress}
                                    className="flex-1 py-4 rounded-xl flex-row items-center justify-center bg-red-50 border border-red-100"
                                >
                                    <Trash2 color="#ef4444" size={20} className="mr-2" />
                                    <Text className="text-red-500 font-bold text-lg">Hapus</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => setIsEditMode(true)}
                                    className="flex-1 py-4 rounded-xl flex-row items-center justify-center"
                                    style={{ backgroundColor: theme.colors.primary }}
                                >
                                    <Pencil color="white" size={20} className="mr-2" />
                                    <Text className="text-white font-bold text-lg">Edit</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        <TandaTerimaCustModal
                            visible={modalVisible}
                            onDismiss={() => setModalVisible(false)}
                            onSave={handleSaveDetail}
                            initialData={editingDetailData}
                            onDelete={handleDeleteDetail}
                            readOnly={!isEditMode}
                        />
                        <ModalCancel
                            visible={deleteModalVisible}
                            title="Konfirmasi Hapus"
                            message="Apakah Anda yakin ingin menghapus tanda terima ini?"
                            confirmText="Hapus"
                            cancelText="Batal"
                            onConfirm={() => {
                                setDeleteModalVisible(false);
                                handleDelete(() => {
                                    (navigation as any).navigate('TandaTerimaCustListScreen', {
                                        toastMessage: 'Data berhasil dihapus!',
                                        toastType: 'success'
                                    });
                                });
                            }}
                            onCancel={() => setDeleteModalVisible(false)}
                        />
                        <ModalConfirm
                            visible={confirmModalVisible}
                            title="Konfirmasi Update"
                            message="Apakah Anda yakin ingin menyimpan perubahan tanda terima ini?"
                            confirmText="Ya, Update"
                            cancelText="Batal"
                            onConfirm={handleConfirmUpdate}
                            onCancel={() => setConfirmModalVisible(false)}
                        />
                    </Animated.View>
                )}
            </ScrollView>

            <ToastMessages
                visible={toastVisible}
                type={toastType}
                title={toastType === 'error' ? 'Validasi' : 'Berhasil'}
                message={toastMsg}
                onClose={() => setToastVisible(false)}
            />
        </View>
    );
};
