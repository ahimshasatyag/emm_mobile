import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform, RefreshControl, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Save, Edit3, X, Trash2 } from 'lucide-react-native';
import Animated, { FadeInUp, FadeOut, FadeIn, LinearTransition } from 'react-native-reanimated';
import { Dropdown } from 'react-native-element-dropdown';
import { theme } from '../../../theme/theme';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { useProductsn } from '../hooks/useProductsn';
import { ProductsnEditSkeleton } from '../skeleton/ProductsnEditSkeleton';
import { Button } from '../../../components/ui/button';
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
    const [isEditing, setIsEditing] = useState(false);

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

    const handleCancel = () => {
        setIsEditing(false);
        loadData();
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
            setIsEditing(false);
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
                title={isInitializing || isRefreshing ? "MEMUAT DATA..." : (isEditing ? "EDIT PRODUCT SN" : "DETAIL PRODUCT SN")}
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
                            key={`form-container-${isEditing}`}
                            entering={FadeInUp.delay(50)}
                            layout={LinearTransition.springify()}
                            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6"
                        >
                            {/* PRODUCT DROPDOWN */}
                            <View className="mb-5">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Product <Text className="text-red-500">*</Text></Text>
                                <View className={`border rounded-xl bg-gray-50 ${!isEditing ? 'opacity-70 bg-gray-100' : ''}`} style={{ borderColor: focusedField === 'id_product' ? theme.colors.primary : '#E5E7EB' }}>
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
                                        disable={!isEditing}
                                        search
                                        searchPlaceholder="Search product..."
                                    />
                                </View>
                            </View>

                            {/* SN INPUT */}
                            <View className="mb-5">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Serial Number (SN) <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className={`bg-gray-50 border rounded-xl px-4 h-14 text-gray-900 font-medium ${!isEditing ? 'opacity-70 bg-gray-100' : ''}`}
                                    style={{ borderColor: focusedField === 'sn' ? theme.colors.primary : '#E5E7EB' }}
                                    value={sn}
                                    onChangeText={setSn}
                                    onFocus={() => setFocusedField('sn')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="Masukkan SN"
                                    editable={isEditing}
                                />
                            </View>

                            {/* QTY INPUT */}
                            <View className="mb-5">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Quantity (QTY) <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className={`bg-gray-50 border rounded-xl px-4 h-14 text-gray-900 font-medium ${!isEditing ? 'opacity-70 bg-gray-100' : ''}`}
                                    style={{ borderColor: focusedField === 'nqty' ? theme.colors.primary : '#E5E7EB' }}
                                    value={nqty}
                                    onChangeText={setNqty}
                                    onFocus={() => setFocusedField('nqty')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="Masukkan Quantity"
                                    keyboardType="numeric"
                                    editable={isEditing}
                                />
                            </View>
                        </Animated.View>

                        <Animated.View
                            key={`actions-${isEditing}`}
                            entering={FadeInUp.delay(100)}
                            layout={LinearTransition.springify()}
                            className="flex-row space-x-3"
                        >
                            {!isEditing ? (
                                <>
                                    <Button
                                        variant="outline"
                                        onPress={() => setIsModalDeleteVisible(true)}
                                        className="h-14 w-14 rounded-2xl flex items-center justify-center border-red-200 bg-red-50"
                                    >
                                        <Trash2 color="#EF4444" size={24} />
                                    </Button>
                                    <Button
                                        onPress={() => setIsEditing(true)}
                                        className="flex-1 h-14 rounded-2xl flex-row items-center justify-center bg-indigo-600"
                                        style={{ elevation: 2, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                                    >
                                        <Edit3 color="white" size={20} className="mr-2" />
                                        <Text className="text-white font-bold text-lg">Edit</Text>
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        variant="outline"
                                        onPress={handleCancel}
                                        className="flex-1 h-14 rounded-xl flex-row items-center justify-center"
                                    >
                                        <X color={theme.colors.primary} size={20} className="mr-2" />
                                        <Text className="font-bold text-lg" style={{ color: theme.colors.primary }}>Batal</Text>
                                    </Button>

                                    <Button
                                        onPress={handleSave}
                                        disabled={isSaving}
                                        className="flex-1 h-14 rounded-xl flex-row items-center justify-center bg-indigo-600"
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
                                </>
                            )}
                        </Animated.View>
                    </Animated.View>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
