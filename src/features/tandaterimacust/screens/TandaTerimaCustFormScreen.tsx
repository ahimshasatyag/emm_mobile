import React, { useState } from 'react';
import { View, ScrollView, RefreshControl, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { useTandaTerimaCust } from '../hooks/useTandaTerimaCust';
import { TandaTerimaCustFormSkeleton } from '../skeleton/TandaTerimaCustFormSkeleton';
import { TandaTerimaCustTable } from '../components/TandaTerimaCustTable';
import { TandaTerimaCustModal } from '../components/TandaTerimaCustModal';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { theme } from '../../../theme/theme';
import { Save } from 'lucide-react-native';
import { Dropdown } from 'react-native-element-dropdown';

export const TandaTerimaCustFormScreen = () => {
    const navigation = useNavigation();

    const [modalVisible, setModalVisible] = useState(false);
    const [editingDetailIndex, setEditingDetailIndex] = useState<number | null>(null);
    const [editingDetailData, setEditingDetailData] = useState<any | null>(null);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastType, setToastType] = useState<ToastType>('error');
    const [toastMsg, setToastMsg] = useState('');

    const { formData, customers, handleChange, handleAddFile, handleRemoveFile, handleSave, isSaving, loading, isRefreshing, onRefresh, setFormData } = useTandaTerimaCust();

    const onSavePress = () => {
        if (!formData.id_customers) {
            setToastType('error');
            setToastMsg('Customer wajib dipilih');
            setToastVisible(true);
            return;
        }
        setConfirmModalVisible(true);
    };

    const handleConfirmSave = () => {
        setConfirmModalVisible(false);
        handleSave(() => {
            (navigation as any).navigate('TandaTerimaCustListScreen', {
                toastMessage: 'Data berhasil disimpan!',
                toastType: 'success'
            });
        });
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
            <HeaderNavigator title={isRefreshing ? "MEMUAT DATA..." : "TAMBAH REPOSITORY TANDA TERIMA"} showBackButton={true} />
            <ScrollView
                className="flex-1 px-4 pt-4"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
                }
            >
                {(loading || isRefreshing) ? (
                    <TandaTerimaCustFormSkeleton />
                ) : (
                    <Animated.View entering={FadeIn.duration(600)} exiting={FadeOut}>
                        <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">

                            {/* Customer */}
                            <View className="mb-4">
                                <Text className="text-gray-700 text-sm mb-1">Customer <Text className="text-red-500">*</Text></Text>
                                <View className="border border-gray-200 rounded-lg bg-gray-50">
                                    <Dropdown
                                        style={{ height: 50, paddingHorizontal: 16 }}
                                        data={customers.map(c => ({ label: c.nm_customers, value: c.id_customers }))}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Pilih Customer..."
                                        value={formData.id_customers}
                                        onChange={item => handleChange('id_customers', item.value)}
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

                            {/* Keterangan */}
                            <View className="mb-4">
                                <Text className="text-gray-700 text-sm mb-1">Keterangan</Text>
                                <TextInput
                                    className="border border-gray-200 rounded-lg p-3 text-gray-800"
                                    value={formData.keterangan}
                                    onChangeText={(val) => handleChange('keterangan', val)}
                                    placeholder="Masukkan keterangan"
                                />
                            </View>

                            {/* File Section */}
                            <View className="mt-2 border-t border-gray-100 pt-2 -mx-4">
                                <TandaTerimaCustTable
                                    data={formData.files}
                                    onAddClick={handleAddClick}
                                    onRowClick={handleRowClick}
                                />
                            </View>
                        </View>

                        <View className="flex-row gap-4 mt-2 mb-10">

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
                                        <Text className="text-white font-bold text-lg">Simpan</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                        <TandaTerimaCustModal
                            visible={modalVisible}
                            onDismiss={() => setModalVisible(false)}
                            onSave={handleSaveDetail}
                            initialData={editingDetailData}
                            onDelete={handleDeleteDetail}
                        />
                        <ModalConfirm
                            visible={confirmModalVisible}
                            title="Konfirmasi Simpan"
                            message="Apakah Anda yakin ingin menyimpan tanda terima ini?"
                            confirmText="Ya, Simpan"
                            cancelText="Batal"
                            onConfirm={handleConfirmSave}
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
