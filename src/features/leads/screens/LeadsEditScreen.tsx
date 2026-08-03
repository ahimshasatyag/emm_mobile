import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Save, Pencil, X } from 'lucide-react-native';
import { useLeadsForm } from '../hooks/useLeadsForm';
import { useLeads } from '../hooks/useLeads';
import { LeadsEditSkeleton } from '../skeleton/LeadsEditSkeleton';
import { theme } from '../../../theme/theme';
import Animated, { FadeInUp, FadeIn, FadeOut } from 'react-native-reanimated';
import { Button } from '../../../components/ui/button';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { ToastMessages } from '../../../components/ui/ToastMessages';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';
import { ProductModal } from '../components/ProductModal';
import { VisitModal } from '../components/VisitModal';
import { TabProduct } from '../components/TabProduct';
import { TabVisit } from '../components/TabVisit';
import { formatRp as formatRupiah } from '../../../utils/helpers/money';

export function LeadsEditScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { id, showSuccessToast } = route.params || {};

    const { currentDetail, isLoadingDetail, loadDetail, resetDetail } = useLeads();

    useEffect(() => {
        if (id) {
            loadDetail(id);
        }
        return () => resetDetail();
    }, [id, loadDetail, resetDetail]);

    const {
        formData, customers, productsList,
        isLoading, isSaving, error,
        updateField, addProductRow, removeProductRow, updateProductRow,
        addVisitRow, removeVisitRow, updateVisitRow,
        refreshOptions, resetForm, save
    } = useLeadsForm(currentDetail || undefined);

    const [activeTab, setActiveTab] = useState<'product' | 'visit'>('product');
    const [isProductModalVisible, setIsProductModalVisible] = useState(false);
    const [editingProductIndex, setEditingProductIndex] = useState<number | null>(null);
    const [editingVisitIndex, setEditingVisitIndex] = useState<number | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [toastConfig, setToastConfig] = useState<{ visible: boolean; type: 'success' | 'error' | 'warning' | 'info'; message: string }>({ visible: false, type: 'info', message: '' });
    const [isConfirmVisible, setIsConfirmVisible] = useState(false);

    useEffect(() => {
        if (showSuccessToast) {
            setToastConfig({ visible: true, type: 'success', message: 'Data Leads berhasil disimpan' });
            navigation.setParams({ showSuccessToast: false });
        }
    }, [showSuccessToast, navigation]);

    const handleSaveProduct = (product: any) => {
        if (editingProductIndex !== null) {
            const updatedProducts = [...formData.products];
            updatedProducts[editingProductIndex] = product;
            updateField('products', updatedProducts);
            setToastConfig({ visible: true, type: 'success', message: 'Barang berhasil diubah' });
        } else {
            updateField('products', [...formData.products, product]);
            setToastConfig({ visible: true, type: 'success', message: 'Barang berhasil ditambahkan' });
        }
    };

    const openAddProductModal = () => {
        setEditingProductIndex(null);
        setIsProductModalVisible(true);
    };

    const openEditProductModal = (index: number) => {
        setEditingProductIndex(index);
        setIsProductModalVisible(true);
    };

    const handleSaveVisit = (visit: any) => {
        if (editingVisitIndex !== null) {
            const updatedVisits = [...formData.visits];
            updatedVisits[editingVisitIndex] = visit;
            updateField('visits', updatedVisits);
            setToastConfig({ visible: true, type: 'success', message: 'Visit berhasil diubah' });
        } else {
            updateField('visits', [...formData.visits, visit]);
            setToastConfig({ visible: true, type: 'success', message: 'Visit berhasil ditambahkan' });
        }
    };

    const openAddVisitModal = () => {
        setEditingVisitIndex(null);
        setIsVisitModalVisible(true);
    };

    const openEditVisitModal = (index: number) => {
        setEditingVisitIndex(index);
        setIsVisitModalVisible(true);
    };

    const onSavePress = () => {
        const errorMsg = validateForm();
        if (errorMsg) {
            setToastConfig({ visible: true, type: 'warning', message: errorMsg });
            return;
        }
        setIsConfirmVisible(true);
    };

    const handleConfirmSave = async () => {
        setIsConfirmVisible(false);
        const success = await save();
        if (success) {
            setToastConfig({ visible: true, type: 'success', message: 'Data Leads berhasil diperbarui' });
            setTimeout(() => {
                setIsEditMode(false);
            }, 1000);
        } else if (error) {
            setToastConfig({ visible: true, type: 'error', message: error });
        }
    };

    const onRefresh = () => {
        if (id) loadDetail(id);
        refreshOptions();
    };

    return (
        <View className="flex-1 bg-gray-50">
            <ToastMessages
                visible={toastConfig.visible}
                type={toastConfig.type}
                message={toastConfig.message}
                onClose={() => setToastConfig(prev => ({ ...prev, visible: false }))}
            />
            <ModalConfirm
                visible={isConfirmVisible}
                title="Konfirmasi Simpan"
                message="Apakah Anda yakin ingin menyimpan perubahan pada data Leads ini?"
                onConfirm={handleConfirmSave}
                onCancel={() => setIsConfirmVisible(false)}
                confirmText="Ya, Simpan"
                cancelText="Kembali"
            />
            <HeaderNavigator
                title={isLoadingDetail ? "MEMUAT DATA..." : isEditMode ? "EDIT LEADS" : "DETAIL LEADS"}
                showBackButton
                onBackPress={() => navigation.goBack()}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                className="flex-1"
            >
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={isLoadingDetail || isLoading} onRefresh={onRefresh} colors={[theme.colors.primary]} />
                    }
                >
                    {isLoadingDetail || isLoading ? (
                        <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>
                            <LeadsEditSkeleton />
                        </Animated.View>
                    ) : (
                        <Animated.View key="content" entering={FadeIn.duration(600)}>

                            <View className="bg-white rounded-3xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
                                <View className="p-6">

                                    <View className="mb-4">
                                        <Text className="text-sm font-bold text-gray-700 mb-2">Customer <Text className="text-red-500">*</Text></Text>
                                        <View className="border border-gray-200 rounded-xl bg-gray-50">
                                            <Dropdown
                                                style={{ height: 48, paddingHorizontal: 16 }}
                                                data={customers.map(c => ({ label: c.nm_customers, value: c.id_customers }))}
                                                labelField="label"
                                                valueField="value"
                                                search
                                                searchPlaceholder="Cari customer..."
                                                placeholder="Pilih Customer"
                                                value={formData.id_customers}
                                                onChange={item => updateField('id_customers', item.value)}
                                                disable={!isEditMode}
                                            />
                                        </View>
                                    </View>

                                    <View className="mb-4">
                                        <Text className="text-sm font-bold text-gray-700 mb-2">Customer Address</Text>
                                        <TextInput
                                            className="bg-gray-100 px-4 py-3 rounded-xl border border-gray-200 text-gray-500"
                                            value={formData.customers_address}
                                            editable={false}
                                            multiline
                                            numberOfLines={3}
                                            textAlignVertical="top"
                                            placeholder="Alamat akan terisi otomatis"
                                        />
                                    </View>

                                    <View className="mb-4">
                                        <Text className="text-sm font-bold text-gray-700 mb-2">Notes</Text>
                                        <TextInput
                                            className={`p-4 rounded-xl border h-24 ${isEditMode ? 'bg-gray-50 border-gray-200 focus:border-indigo-500 text-gray-900' : 'bg-gray-100 border-gray-200 text-gray-500'}`}
                                            value={formData.notes}
                                            onChangeText={(t) => updateField('notes', t)}
                                            placeholder="Masukkan catatan"
                                            multiline={true}
                                            numberOfLines={3}
                                            textAlignVertical="top"
                                            editable={isEditMode}
                                        />
                                    </View>

                                    <View className="mb-4">
                                        <Text className="text-sm font-bold text-gray-700 mb-2">Kurs</Text>
                                        <TextInput
                                            className="bg-gray-100 px-4 py-3 rounded-xl border border-gray-200 text-gray-500 font-bold"
                                            value={formatRupiah(formData.kurs)}
                                            editable={false}
                                        />
                                    </View>

                                </View>

                                {/* TABS AND TAB CONTENT */}
                                <View className="flex-row bg-white border-y border-gray-100 px-2 pt-2">
                                    <TouchableOpacity
                                        onPress={() => setActiveTab('product')}
                                        className={`flex-1 py-3 items-center border-b-2`}
                                        style={{ borderColor: activeTab === 'product' ? theme.colors.primary : 'transparent' }}
                                    >
                                        <Text className="font-bold" style={{ color: activeTab === 'product' ? theme.colors.primary : '#9ca3af' }}>Product</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => setActiveTab('visit')}
                                        className={`flex-1 py-3 items-center border-b-2`}
                                        style={{ borderColor: activeTab === 'visit' ? theme.colors.primary : 'transparent' }}
                                    >
                                        <Text className="font-bold" style={{ color: activeTab === 'visit' ? theme.colors.primary : '#9ca3af' }}>Visit</Text>
                                    </TouchableOpacity>
                                </View>

                                <View className="p-4">
                                    {/* PRODUCT TAB CONTENT */}
                                    {activeTab === 'product' && (
                                        <TabProduct
                                            isEditMode={isEditMode}
                                            openAddProductModal={openAddProductModal}
                                            formData={formData}
                                            productsList={productsList}
                                            openEditProductModal={openEditProductModal}
                                        />
                                    )}

                                    {/* VISIT TAB CONTENT */}
                                    {activeTab === 'visit' && (
                                        <TabVisit
                                            isEditMode={isEditMode}
                                            openAddVisitModal={openAddVisitModal}
                                            formData={formData}
                                            openEditVisitModal={openEditVisitModal}
                                        />
                                    )}
                                </View>
                            </View>

                            <Animated.View entering={FadeInUp.delay(100)}>
                                {isEditMode ? (
                                    <View className="flex-row gap-4">
                                        <Button
                                            variant="outline"
                                            onPress={() => {
                                                // Saat batal, kembalikan data ke awal tanpa refresh (loading)
                                                resetForm();
                                                setIsEditMode(false);
                                            }}
                                            className="flex-1 h-14 rounded-xl flex-row items-center justify-center"
                                        >
                                            <X color={theme.colors.primary} size={20} className="mr-2" />
                                            <Text className="font-bold text-lg" style={{ color: theme.colors.primary }}>Batal</Text>
                                        </Button>
                                        <Button
                                            onPress={onSavePress}
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
                                    <Button
                                        onPress={() => setIsEditMode(true)}
                                        className="w-full h-14 rounded-2xl flex-row items-center justify-center bg-gray-800"
                                    >
                                        <Pencil color="white" size={20} className="mr-2" />
                                        <Text className="text-white font-bold text-lg">Edit Data</Text>
                                    </Button>
                                )}
                            </Animated.View>

                        </Animated.View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
            <ProductModal
                visible={isProductModalVisible}
                onDismiss={() => setIsProductModalVisible(false)}
                onSave={handleSaveProduct}
                onDelete={editingProductIndex !== null ? () => removeProductRow(editingProductIndex) : undefined}
                productsList={productsList}
                initialData={editingProductIndex !== null ? formData.products[editingProductIndex] : null}
                isReadOnly={!isEditMode}
            />
            <VisitModal
                visible={isVisitModalVisible}
                onDismiss={() => setIsVisitModalVisible(false)}
                onSave={handleSaveVisit}
                onDelete={editingVisitIndex !== null ? () => removeVisitRow(editingVisitIndex) : undefined}
                initialData={editingVisitIndex !== null ? formData.visits[editingVisitIndex] : null}
                isReadOnly={!isEditMode}
            />
        </View>
    );
}
