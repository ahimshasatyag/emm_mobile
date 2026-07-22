import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, ActivityIndicator, TextInput, KeyboardAvoidingView, Platform, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { Save, ArrowLeft } from 'lucide-react-native';
import { theme } from '../../../theme/theme';
import { useProductBrands } from '../hooks/useProductBrands';
import { ProductBrandFormData } from '../types/productbrand.types';
import Animated, { FadeInUp, LinearTransition, FadeIn, FadeOut } from 'react-native-reanimated';
import { Button } from '../../../components/ui/button';
import { ProductBrandFormSkeleton } from '../skeleton/ProductBrandFormSkeleton';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';

export function ProductBrandFormScreen() {
    const navigation = useNavigation<any>();
    const { addBrand, isLoading, refreshData, formData, setFormData, validateForm } = useProductBrands();

    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [isModalConfirmVisible, setIsModalConfirmVisible] = useState(false);
    const [toastState, setToastState] = useState({
        visible: false,
        type: 'success' as ToastType,
        message: ''
    });

    const handleSave = () => {
        const error = validateForm();
        if (error) {
            setToastState({
                visible: true,
                type: 'error',
                message: error
            });
            return;
        }
        setIsModalConfirmVisible(true);
    };

    const confirmSave = async () => {
        setIsModalConfirmVisible(false);
        try {
            const result = await addBrand(formData);
            navigation.replace('ProductBrandEdit', {
                id: result.id_product_brand,
                showSuccessToast: true
            });
        } catch (error: any) {
            setToastState({
                visible: true,
                type: 'error',
                message: error.message || 'Gagal menyimpan merek produk'
            });
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            className="flex-1 bg-gray-50"
        >
            <HeaderNavigator
                title={isLoading ? "MEMUAT DATA..." : "TAMBAH MEREK"}
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
                message="Apakah Anda yakin ingin menyimpan merek produk ini?"
                confirmText="Ya, Simpan"
                cancelText="Batal"
                onCancel={() => setIsModalConfirmVisible(false)}
                onConfirm={confirmSave}
            />

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 16, paddingTop: 24, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={refreshData} colors={[theme.colors.primary]} />
                }
            >
                {isLoading ? (
                    <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>
                        <ProductBrandFormSkeleton />
                    </Animated.View>
                ) : (
                    <Animated.View key="content" entering={FadeIn.duration(600)}>
                        <Animated.View
                            entering={FadeInUp.delay(50)}
                            layout={LinearTransition.springify()}
                            className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-4"
                            style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }}
                        >
                            <View>
                                <Text className="text-sm font-bold text-gray-700 mb-2">Brand Name <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className="bg-gray-50 px-4 py-3 rounded-xl border text-gray-900"
                                    style={{ borderColor: focusedField === 'brand' ? theme.colors.primary : '#e5e7eb' }}
                                    placeholder="Masukkan nama merek"
                                    value={formData.nm_product_brand}
                                    onChangeText={(text) => setFormData({ ...formData, nm_product_brand: text })}
                                    onFocus={() => setFocusedField('brand')}
                                    onBlur={() => setFocusedField(null)}
                                />
                            </View>
                        </Animated.View>

                        <Animated.View
                            entering={FadeInUp.delay(100)}
                            layout={LinearTransition.springify()}
                            className="flex-row mt-4 gap-3"
                        >

                            <Button
                                onPress={handleSave}
                                disabled={isLoading}
                                className="flex-1 h-14 rounded-xl flex-row items-center justify-center"
                                style={{ elevation: 2, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                            >
                                {isLoading ? (
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
