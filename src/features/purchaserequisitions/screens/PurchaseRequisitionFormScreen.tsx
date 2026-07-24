import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Save, Plus, Trash2, Package } from 'lucide-react-native';
import { usePurchaseRequisitions, validateForm } from '../hooks/usePurchaseRequisitions';
import { PurchaseRequisitionDetail } from '../types/purchaserequisitions';
import { theme } from '../../../theme/theme';
import Animated, { FadeInUp, FadeIn, FadeOut } from 'react-native-reanimated';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { ProductModal } from '../components/ProductModal';
import { ProductTable } from '../components/ProductTable';
import { Button } from '../../../components/ui/button';
import { PurchaseRequisitionFormSkeleton } from '../skeleton/PurchaseRequisitionFormSkeleton';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';

const DUMMY_PRODUCTS = [
    { id_product: 'PRD001', code_product: 'P001', nm_product: 'Laptop Dell XPS 13', satuan: 'Unit' },
    { id_product: 'PRD002', code_product: 'P002', nm_product: 'Mouse Wireless Logitech', satuan: 'Pcs' },
    { id_product: 'PRD003', code_product: 'P003', nm_product: 'Kertas HVS A4', satuan: 'Rim' }
];

export function PurchaseRequisitionFormScreen() {
    const navigation = useNavigation<any>();
    const { create, isSaving } = usePurchaseRequisitions();

    const [formData, setFormData] = useState({
        username: 'admin', // Dummy default
        date_request: new Date().toISOString().split('T')[0],
        date_deadline: new Date().toISOString().split('T')[0],
    });

    const [details, setDetails] = useState<PurchaseRequisitionDetail[]>([]);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    
    const [isSaveModalVisible, setIsSaveModalVisible] = useState(false);
    const [toast, setToast] = useState<{ visible: boolean; message: string; type: ToastType; title?: string }>({
        visible: false,
        message: '',
        type: 'success'
    });

    const onRefresh = useCallback(() => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 1000);
    }, []);

    const handleAddProduct = () => {
        setEditingIndex(null);
        setIsModalVisible(true);
    };

    const handleEditProduct = (index: number) => {
        setEditingIndex(index);
        setIsModalVisible(true);
    };

    const handleRemoveProduct = (index: number) => {
        setDetails(prev => prev.filter((_, i) => i !== index));
        setToast({ visible: true, type: 'success', message: 'Barang berhasil dihapus' });
    };

    const handleSaveProduct = (product: any) => {
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
            setToast({ visible: true, type: 'error', message: errorMsg, title: 'Validasi' });
            return;
        }
        setIsSaveModalVisible(true);
    };

    const confirmSave = async () => {
        setIsSaveModalVisible(false);
        try {
            await create({
                ...formData,
                details
            });
            const newId = Date.now().toString(); // Simulate returning new ID
            navigation.replace('PurchaseRequisitionEditScreen', { 
                id: newId, 
                showSuccessToast: true, 
                successMessage: 'Purchase Requisition berhasil dibuat!' 
            });
        } catch (error) {
            setToast({ visible: true, type: 'error', message: 'Gagal menyimpan data', title: 'Error' });
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            className="flex-1 bg-gray-50"
        >
            <ModalConfirm
                visible={isSaveModalVisible}
                title="Konfirmasi Simpan"
                message="Apakah Anda yakin ingin menyimpan PR ini?"
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

            <HeaderNavigator title={isRefreshing ? "MEMUAT DATA..." : "TAMBAH PR"} showBackButton={true} />

            <ScrollView 
                className="flex-1" 
                showsVerticalScrollIndicator={false} 
                contentContainerStyle={{ paddingBottom: 100 }}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
                }
            >
                {isRefreshing ? (
                    <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>
                        <PurchaseRequisitionFormSkeleton />
                    </Animated.View>
                ) : (
                    <Animated.View key="content" entering={FadeIn.duration(600)} className="p-4">
                        <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
                        {/* Header Section */}
                        <Text className="text-sm font-bold text-gray-700 mb-2">Responsible <Text className="text-red-500">*</Text></Text>
                        <TextInput
                            className="bg-gray-100 px-4 py-3 rounded-xl border border-gray-200 text-gray-900 mb-4"
                            value={formData.username}
                            onChangeText={t => setFormData(prev => ({ ...prev, username: t }))}
                            placeholder="Responsible User"
                        />

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
                            <TouchableOpacity
                                onPress={handleAddProduct}
                                className="flex-row items-center px-3 py-1.5 rounded-lg"
                                style={{ backgroundColor: theme.colors.primary }}
                            >
                                <Plus size={16} color="#ffffff" />
                                <Text className="text-white font-bold ml-1 text-xs">Tambah</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Products Table */}
                        <ProductTable details={details} onEditProduct={handleEditProduct} />
                </View>

                <Animated.View entering={FadeInUp.delay(100)}>
                        <Button
                            onPress={handleSubmit}
                            disabled={isSaving}
                            className="w-full h-14 rounded-2xl flex-row items-center justify-center"
                            style={{ elevation: 4, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                        >
                            {isSaving ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <>
                                    <Save color="white" size={20} className="mr-2" />
                                    <Text className="text-white font-bold text-lg">Simpan PR</Text>
                                </>
                            )}
                        </Button>
                        </Animated.View>
                    </Animated.View>
                )}
            </ScrollView>

            <ProductModal
                visible={isModalVisible}
                onDismiss={() => setIsModalVisible(false)}
                onSave={handleSaveProduct}
                onDelete={editingIndex !== null ? () => handleRemoveProduct(editingIndex) : undefined}
                productsList={DUMMY_PRODUCTS}
                initialData={editingIndex !== null ? details[editingIndex] : null}
            />
        </KeyboardAvoidingView>
    );
}
