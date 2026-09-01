import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, KeyboardAvoidingView, Platform, RefreshControl, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Animated, { FadeInUp, FadeOut, FadeIn, LinearTransition } from 'react-native-reanimated';
import { Dropdown } from 'react-native-element-dropdown';
import { theme } from '../../../theme/theme';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { useProductsn } from '../hooks/useProductsn';
import { ProductsnEditSkeleton } from '../skeleton/ProductsnEditSkeleton';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';

export function ProductsnEditScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const assetId = route.params?.id;

    const { productSns, supportData, editProductSn, removeProductSn, fetchInitialData, validateForm } = useProductsn();

    const [isSaving, setIsSaving] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);

    const [focusedField, setFocusedField] = useState<string | null>(null);

    const [isModalConfirmVisible, setIsModalConfirmVisible] = useState(false);
    const [isModalDeleteVisible, setIsModalDeleteVisible] = useState(false);
    const [toastState, setToastState] = useState({
        visible: false,
        type: 'success' as ToastType,
        message: ''
    });

    const [idProduct, setIdProduct] = useState<string | number>('');
    const [sn, setSn] = useState('');
    const [nqty, setNqty] = useState('1');

    const loadData = async () => {
        setIsInitializing(true);
        if (supportData.length === 0) {
            await fetchInitialData();
        }

        const asset = productSns.find(a => String(a.id_product_sn) === String(assetId));
        if (asset) {
            setIdProduct(asset.id_product);
            setSn(asset.sn || '');
            setNqty(String(asset.nqty));
        }
        setIsInitializing(false);
    };

    useEffect(() => {
        loadData();

        if (route.params?.showSuccessToast) {
            setToastState({
                visible: true,
                type: 'success',
                message: 'Data Product SN berhasil ditambahkan'
            });
            navigation.setParams({ showSuccessToast: undefined });
        }
    }, [assetId, route.params?.showSuccessToast, navigation]);

    const onRefresh = async () => {
        setIsRefreshing(true);
        await loadData();
        setIsRefreshing(false);
    };

    const handleSave = () => {
        const validationError = validateForm({ id_product: idProduct, sn, nqty: parseInt(nqty) || 0 });
        if (validationError) {
            setToastState({
                visible: true,
                type: 'error',
                message: validationError
            });
            return;
        }
        setIsModalConfirmVisible(true);
    };

    const confirmSave = async () => {
        setIsModalConfirmVisible(false);

        setIsSaving(true);
        try {
            await editProductSn(assetId, {
                id_product: idProduct,
                sn,
                nqty: parseInt(nqty) || 0
            });
            setToastState({
                visible: true,
                type: 'success',
                message: 'Data Product SN berhasil diupdate'
            });
        } catch (error: any) {
            setToastState({
                visible: true,
                type: 'error',
                message: error.message || 'Gagal menyimpan data'
            });
        } finally {
            setIsSaving(false);
        }
    };

    const confirmDelete = async () => {
        setIsModalDeleteVisible(false);
        setIsSaving(true);
        try {
            await removeProductSn(assetId);
            navigation.goBack();
        } catch (error: any) {
            setToastState({
                visible: true,
                type: 'error',
                message: error.message || 'Gagal menghapus data'
            });
            setIsSaving(false);
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 bg-gray-50">
            <HeaderNavigator
                title={isInitializing || isRefreshing ? "MEMUAT DATA..." : "DETAIL PRODUCT SN"}
                showBackButton={true}
                onBackPress={() => navigation.goBack()}
            />

            <ToastMessages
                visible={toastState.visible}
                type={toastState.type}
                title={toastState.type === 'success' ? 'Sukses' : 'Validasi'}
                message={toastState.message}
                onClose={() => setToastState({ ...toastState, visible: false })}
            />

            <ModalConfirm
                visible={isModalConfirmVisible}
                title="Konfirmasi Edit"
                message="Apakah Anda yakin ingin menyimpan perubahan pada Product SN ini?"
                confirmText="Ya, Simpan"
                cancelText="Batal"
                onCancel={() => setIsModalConfirmVisible(false)}
                onConfirm={confirmSave}
            />

            <ModalConfirm
                visible={isModalDeleteVisible}
                title="Konfirmasi Hapus"
                message="Apakah Anda yakin ingin menghapus Product SN ini? Data yang dihapus tidak dapat dikembalikan."
                confirmText="Hapus"
                cancelText="Batal"
                onCancel={() => setIsModalDeleteVisible(false)}
                onConfirm={confirmDelete}
            />

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />}
            >
                {(isInitializing) ? (
                    <Animated.View exiting={FadeOut.duration(300)}>
                        <ProductsnEditSkeleton />
                    </Animated.View>
                ) : (
                    <Animated.View entering={FadeIn.duration(600)}>
                        <Animated.View
                            key={`form-container-edit`}
                            entering={FadeInUp.delay(50)}
                            layout={LinearTransition.springify()}
                            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6"
                        >
                            {/* PRODUCT DROPDOWN */}
                            <View className="mb-5">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Product <Text className="text-red-500">*</Text></Text>
                                <View className={`border rounded-xl bg-gray-50`} style={{ borderColor: focusedField === 'id_product' ? theme.colors.primary : '#E5E7EB' }}>
                                    <Dropdown
                                        style={{ height: 56, paddingHorizontal: 16 }}
                                        data={supportData.map(p => ({ label: p.nm_product, value: p.id_product }))}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Pilih Product"
                                        value={idProduct}
                                        onChange={item => setIdProduct(item.value)}
                                        onFocus={() => setFocusedField('id_product')}
                                        onBlur={() => setFocusedField(null)}
                                        placeholderStyle={{ color: '#9CA3AF' }}
                                        search
                                        searchPlaceholder="Search product..."
                                    />
                                </View>
                            </View>

                            {/* SN INPUT */}
                            <View className="mb-5">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Serial Number (SN) <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className={`bg-gray-50 border rounded-xl px-4 h-14 text-gray-900 font-medium`}
                                    style={{ borderColor: focusedField === 'sn' ? theme.colors.primary : '#E5E7EB' }}
                                    value={sn}
                                    onChangeText={setSn}
                                    onFocus={() => setFocusedField('sn')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="Masukkan SN"
                                />
                            </View>

                            {/* STATUS DROPDOWN (mapped to QTY) */}
                            <View className="mb-5">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Status <Text className="text-red-500">*</Text></Text>
                                <View className={`border rounded-xl bg-gray-50`} style={{ borderColor: focusedField === 'nqty' ? theme.colors.primary : '#E5E7EB' }}>
                                    <Dropdown
                                        style={{ height: 56, paddingHorizontal: 16 }}
                                        data={[
                                            { label: 'SALE', value: '0' },
                                            { label: 'READY', value: '1' }
                                        ]}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Pilih Status"
                                        value={String(Number(nqty) === 0 ? 0 : 1)}
                                        onChange={item => setNqty(item.value)}
                                        onFocus={() => setFocusedField('nqty')}
                                        onBlur={() => setFocusedField(null)}
                                        placeholderStyle={{ color: '#9CA3AF' }}
                                    />
                                </View>
                            </View>
                        </Animated.View>
                    </Animated.View>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
