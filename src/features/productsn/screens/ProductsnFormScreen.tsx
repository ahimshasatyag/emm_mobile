import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Save } from 'lucide-react-native';
import Animated, { FadeInUp, FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { Dropdown } from 'react-native-element-dropdown';
import { theme } from '../../../theme/theme';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { useProductsn } from '../hooks/useProductsn';
import { Button } from '../../../components/ui/button';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';
import { ProductsnFormSkeleton } from '../skeleton/ProductsnFormSkeleton';

export function ProductsnFormScreen() {
    const navigation = useNavigation<any>();
    const { supportData, createProductSn, fetchInitialData, isLoading, validateForm } = useProductsn();

    const [isSaving, setIsSaving] = useState(false);
    const [idProduct, setIdProduct] = useState<string | number>('');
    const [sn, setSn] = useState('');
    const [nqty, setNqty] = useState('1');
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const [isModalConfirmVisible, setIsModalConfirmVisible] = useState(false);
    const [toastState, setToastState] = useState({
        visible: false,
        type: 'success' as ToastType,
        message: ''
    });

    useEffect(() => {
        if (supportData.length === 0) {
            fetchInitialData();
        }
    }, []);

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
            const result = await createProductSn({
                id_product: idProduct,
                sn,
                nqty: parseInt(nqty) || 0
            });

            navigation.replace('ProductsnEdit', {
                id: result.id_product_sn,
                showSuccessToast: true
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

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 bg-gray-50">
            <HeaderNavigator
                title={isLoading ? "MEMUAT DATA..." : "TAMBAH PRODUCT SN"}
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
                title="Konfirmasi Simpan"
                message="Apakah Anda yakin ingin menyimpan Product SN ini?"
                confirmText="Ya, Simpan"
                cancelText="Batal"
                onCancel={() => setIsModalConfirmVisible(false)}
                onConfirm={confirmSave}
            />

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={fetchInitialData} colors={[theme.colors.primary]} />
                }
            >
                {isLoading && supportData.length === 0 ? (
                    <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>
                        <ProductsnFormSkeleton />
                    </Animated.View>
                ) : (
                    <Animated.View key="content" entering={FadeIn.duration(600)}>
                        <Animated.View entering={FadeInUp.delay(50)} layout={LinearTransition.springify()}>
                            <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
                                
                                {/* PRODUCT DROPDOWN */}
                                <View className="mb-5">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Product <Text className="text-red-500">*</Text></Text>
                                    <View className="border rounded-xl bg-gray-50" style={{ borderColor: focusedField === 'id_product' ? theme.colors.primary : '#E5E7EB' }}>
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
                                        className="bg-gray-50 border rounded-xl px-4 h-14 text-gray-900 font-medium"
                                        style={{ borderColor: focusedField === 'sn' ? theme.colors.primary : '#E5E7EB' }}
                                        value={sn}
                                        onChangeText={setSn}
                                        onFocus={() => setFocusedField('sn')}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="Masukkan SN"
                                    />
                                </View>

                                {/* QTY INPUT */}
                                <View className="mb-5">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Quantity (QTY) <Text className="text-red-500">*</Text></Text>
                                    <TextInput
                                        className="bg-gray-50 border rounded-xl px-4 h-14 text-gray-900 font-medium"
                                        style={{ borderColor: focusedField === 'nqty' ? theme.colors.primary : '#E5E7EB' }}
                                        value={nqty}
                                        onChangeText={setNqty}
                                        onFocus={() => setFocusedField('nqty')}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="Masukkan Quantity"
                                        keyboardType="numeric"
                                    />
                                </View>

                            </View>

                            <Button
                                onPress={handleSave}
                                disabled={isSaving || isLoading}
                                className="h-14 rounded-2xl flex-row items-center justify-center bg-indigo-600 mb-8"
                                style={{ elevation: 2, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
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
                        </Animated.View>
                    </Animated.View>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

