import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Save, Plus, Trash2, Package, Send, X, Edit2, ArrowLeft, Pencil } from 'lucide-react-native';
import { usePurchaseRequisitions, validateForm } from '../hooks/usePurchaseRequisitions';
import { PurchaseRequisitionDetail } from '../types/purchaserequisitions';
import { theme } from '../../../theme/theme';
import Animated, { FadeInUp, FadeIn, FadeOut } from 'react-native-reanimated';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { ProductModal } from '../components/ProductModal';
import { ProductTable } from '../components/ProductTable';
import { Button } from '../../../components/ui/button';
import { PurchaseRequisitionEditSkeleton } from '../skeleton/PurchaseRequisitionEditSkeleton';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';

export function PurchaseRequisitionEditScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const id = route.params?.id;

    const { currentDetail, isLoadingDetail, isSaving, loadDetail, update, ajukan, resetDetail, supportData } = usePurchaseRequisitions();

    const [products, setProducts] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await supportData();
                if (res.status) {
                    setProducts(res.data_product || []);
                    setUsers(res.data_users || []);
                }
            } catch (err) {
                console.log(err);
            }
        };
        loadData();
    }, [supportData]);

    const [formData, setFormData] = useState({
        username: '',
        date_request: '',
        date_deadline: '',
    });

    const [details, setDetails] = useState<PurchaseRequisitionDetail[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [toast, setToast] = useState<{ visible: boolean; message: string; type: ToastType; title?: string }>({
        visible: false,
        message: '',
        type: 'success'
    });

    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
    const [modalActionType, setModalActionType] = useState<'save' | 'ajukan' | null>(null);

    useEffect(() => {
        if (route.params?.showSuccessToast) {
            setToast({
                visible: true,
                type: 'success',
                message: route.params.successMessage || 'Data berhasil disimpan!'
            });
            // Clear params to avoid loop
            navigation.setParams({ showSuccessToast: undefined, successMessage: undefined });
        }
    }, [route.params?.showSuccessToast]);

    useEffect(() => {
        if (id) {
            loadDetail(id);
        }
        return () => {
            resetDetail();
        };
    }, [id, loadDetail, resetDetail]);

    useEffect(() => {
        if (currentDetail) {
            setFormData({
                username: currentDetail.username,
                date_request: currentDetail.date_request,
                date_deadline: currentDetail.date_deadline,
            });
            setDetails(currentDetail.details || []);
        }
    }, [currentDetail]);

    const isSubmitted = currentDetail?.status_pr === 'PR';

    const handleAddProduct = () => {
        if (!isEditMode) return;
        setEditingIndex(null);
        setIsModalVisible(true);
    };

    const handleEditProduct = (index: number) => {
        setEditingIndex(index);
        setIsModalVisible(true);
    };

    const handleRemoveProduct = (index: number) => {
        if (!isEditMode) return;
        setDetails(prev => prev.filter((_, i) => i !== index));
        setToast({ visible: true, type: 'success', message: 'Barang berhasil dihapus' });
    };

    const handleSaveProduct = (product: any) => {
        if (!isEditMode) return;
        if (editingIndex !== null) {
            setDetails(prev => {
                const newDetails = [...prev];
                newDetails[editingIndex] = { ...newDetails[editingIndex], ...product };
                return newDetails;
            });
            setToast({ visible: true, type: 'success', message: 'Barang berhasil diupdate' });
        } else {
            setDetails(prev => [...prev, { ...product, qty_po: 0 }]);
            setToast({ visible: true, type: 'success', message: 'Barang berhasil ditambahkan' });
        }
    };

    const handleSubmit = async () => {
        const errorMsg = validateForm(formData, details);
        if (errorMsg) {
            setToast({ visible: true, type: 'error', message: errorMsg, title: 'Success' });
            return;
        }
        setModalActionType('save');
        setIsConfirmModalVisible(true);
    };

    const confirmSave = async () => {
        setIsConfirmModalVisible(false);
        try {
            const res = await update(id, {
                ...formData,
                details
            });
            if (res.status || res.id_pr) {
                setToast({ visible: true, type: 'success', message: 'Purchase Requisition berhasil diupdate' });
                setIsEditMode(false);
                loadDetail(id); // Reload the updated data
            } else {
                setToast({ visible: true, type: 'error', message: res.message || 'Gagal menyimpan data' });
            }
        } catch (error: any) {
            setToast({ visible: true, type: 'error', message: error.message || 'Gagal menyimpan data' });
        }
    };

    const handleAjukan = () => {
        setModalActionType('ajukan');
        setIsConfirmModalVisible(true);
    };

    const confirmAjukan = async () => {
        setIsConfirmModalVisible(false);
        try {
            const res = await ajukan(id);
            navigation.replace('PurchaseRequisitionEditScreen', {
                id: id,
                showSuccessToast: true,
                successMessage: 'PR berhasil diajukan!'
            });
        } catch (error: any) {
            setToast({ visible: true, type: 'error', message: error.message || 'Gagal mengajukan PR' });
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            className="flex-1 bg-gray-50"
        >
            <ModalConfirm
                visible={isConfirmModalVisible}
                title={modalActionType === 'ajukan' ? "Konfirmasi Ajukan" : "Konfirmasi Simpan"}
                message={modalActionType === 'ajukan' ? "Apakah Anda yakin ingin mengajukan PR ini?" : "Apakah Anda yakin ingin menyimpan perubahan PR ini?"}
                confirmText={modalActionType === 'ajukan' ? "Ya, Ajukan" : "Ya, Simpan"}
                cancelText="Batal"
                onConfirm={modalActionType === 'ajukan' ? confirmAjukan : confirmSave}
                onCancel={() => setIsConfirmModalVisible(false)}
            />

            <ToastMessages
                visible={toast.visible}
                title={toast.title || (toast.type === 'error' ? 'Error' : 'Sukses')}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(prev => ({ ...prev, visible: false }))}
            />

            <HeaderNavigator
                title={isLoadingDetail ? 'MEMUAT DATA...' : isEditMode ? `EDIT PURCHASE REQUISITION` : `DETAIL PURCHASE REQUISITION`}
                showBackButton={true}
                onBackPress={() => navigation.goBack()}
            />

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
                refreshControl={
                    <RefreshControl refreshing={isLoadingDetail} onRefresh={() => id && loadDetail(id)} colors={[theme.colors.primary]} />
                }
            >
                {isLoadingDetail ? (
                    <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>
                        <PurchaseRequisitionEditSkeleton />
                    </Animated.View>
                ) : (
                    <Animated.View key="content" entering={FadeIn.duration(600)} className="p-4">

                        <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
                            {/* PR Information */}
                            <View className="flex-row justify-between items-center mb-4 border-b border-gray-100 pb-4">
                                <View>
                                    <Text className="text-[16px] font-bold text-gray-800 mt-1">{currentDetail?.code_pr}</Text>
                                </View>
                                <View className="bg-blue-100 px-2.5 py-1 rounded-md">
                                    <Text className="text-[10px] font-bold uppercase text-blue-700">{currentDetail?.status_pr === 'PR' ? 'SUBMITTED' : (currentDetail?.status_pr)}</Text>
                                </View>
                            </View>

                            {/* Header Section */}
                            <Text className="text-sm font-bold text-gray-700 mb-2 mt-2">Responsible <Text className="text-red-500">*</Text></Text>
                            <View className={`border rounded-xl mb-4 ${!isEditMode ? 'bg-gray-100 border-gray-200' : 'bg-white border-gray-200'}`}>
                                <Dropdown
                                    style={{ height: 50, paddingHorizontal: 16 }}
                                    data={users.map(u => ({ label: u.nm_users || u.username, value: u.username }))}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Pilih Responsible"
                                    search
                                    searchPlaceholder="Cari User..."
                                    value={formData.username}
                                    onChange={opt => setFormData(prev => ({ ...prev, username: opt.value }))}
                                    disable={!isEditMode}
                                />
                            </View>

                            <View className="flex-row justify-between mb-2">
                                <View className="flex-1 mr-2">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Requisition Date</Text>
                                    <TextInput
                                        className="bg-gray-100 px-4 py-3 rounded-xl border border-gray-200 text-gray-500"
                                        value={formData.date_request}
                                        editable={false}
                                    />
                                </View>
                                <View className="flex-1 ml-2">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Deadline</Text>
                                    <TextInput
                                        className="bg-gray-100 px-4 py-3 rounded-xl border border-gray-200 text-gray-500"
                                        value={formData.date_deadline}
                                        editable={false}
                                    />
                                </View>
                            </View>

                            <View className="h-px bg-gray-200 my-4" />

                            {/* Products List */}
                            <View className="flex-row justify-between items-center mb-4">
                                <Text className="font-bold text-gray-800">Daftar Barang</Text>
                                {isEditMode && (
                                    <TouchableOpacity
                                        onPress={handleAddProduct}
                                        className="flex-row items-center px-3 py-1.5 rounded-lg"
                                        style={{ backgroundColor: theme.colors.primary }}
                                    >
                                        <Plus size={16} color="#ffffff" />
                                        <Text className="text-white font-bold ml-1 text-xs">Tambah</Text>
                                    </TouchableOpacity>
                                )}
                            </View>

                            {/* Products Table */}
                            <ProductTable details={details} onEditProduct={handleEditProduct} />
                        </View>

                        <Animated.View entering={FadeInUp.delay(100)}>
                            {isEditMode ? (
                                <View className="flex-row gap-4">
                                    <Button
                                        variant="outline"
                                        onPress={() => {
                                            setIsEditMode(false);
                                            if (currentDetail) {
                                                setFormData({
                                                    username: currentDetail.username,
                                                    date_request: currentDetail.date_request,
                                                    date_deadline: currentDetail.date_deadline,
                                                });
                                                setDetails(currentDetail.details || []);
                                            }
                                        }}
                                        className="flex-1 h-14 rounded-xl flex-row items-center justify-center"
                                    >
                                        <X color={theme.colors.primary} size={20} className="mr-2" />
                                        <Text className="font-bold text-lg" style={{ color: theme.colors.primary }}>Batal</Text>
                                    </Button>

                                    <Button
                                        onPress={handleSubmit}
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
                                <View className="flex-row gap-4">
                                    <Button
                                        onPress={() => setIsEditMode(true)}
                                        className="flex-1 h-14 rounded-2xl flex-row items-center justify-center bg-gray-800"
                                    >
                                        <Pencil color="white" size={20} className="mr-2" />
                                        <Text className="text-white font-bold text-lg">Edit</Text>
                                    </Button>

                                    {!isSubmitted && (
                                        <Button
                                            onPress={handleAjukan}
                                            className="flex-1 h-14 rounded-2xl flex-row items-center justify-center bg-green-500"
                                        >
                                            <Send color="white" size={20} className="mr-2" />
                                            <Text className="text-white font-bold text-lg">Ajukan PR</Text>
                                        </Button>
                                    )}
                                </View>
                            )}
                        </Animated.View>
                    </Animated.View>
                )}
            </ScrollView>

            <ProductModal
                visible={isModalVisible}
                onDismiss={() => setIsModalVisible(false)}
                onSave={handleSaveProduct}
                onDelete={editingIndex !== null ? () => handleRemoveProduct(editingIndex) : undefined}
                productsList={products}
                initialData={editingIndex !== null ? details[editingIndex] : null}
                isReadOnly={!isEditMode}
            />
        </KeyboardAvoidingView>
    );
}
