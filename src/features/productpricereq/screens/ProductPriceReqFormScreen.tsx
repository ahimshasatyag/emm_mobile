import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Save } from 'lucide-react-native';
import { theme } from '../../../theme/theme';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { useProductPriceReq } from '../hooks/useProductPriceReq';
import { ProductPriceReqFormSkeleton } from '../skeleton/ProductPriceReqFormSkeleton';
import { Dropdown } from 'react-native-element-dropdown';
import Animated, { FadeInUp, LinearTransition, FadeIn, FadeOut } from 'react-native-reanimated';
import { Button } from '../../../components/ui/button';
import { ToastMessages } from '../../../components/ui/ToastMessages';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';

export function ProductPriceReqFormScreen() {
    const navigation = useNavigation<any>();

    const {
        isActionLoading,
        products,
        loadProducts,
        resetDetail,
        createNewRequest,
        validateForm
    } = useProductPriceReq();

    const [isInitializing, setIsInitializing] = useState(true);
    const [selectedProductId, setSelectedProductId] = useState<string>('');
    const [isModalVisible, setIsModalVisible] = useState(false);

    const [toast, setToast] = useState<{ show: boolean, message: string, type: 'success' | 'error' | 'warning' }>({
        show: false,
        message: '',
        type: 'success'
    });

    const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
        setToast({ show: true, message, type });
    };

    useEffect(() => {
        const init = async () => {
            setIsInitializing(true);
            try {
                await loadProducts();
                resetDetail();
                await new Promise(res => setTimeout(res, 600));
            } catch (error: any) {
                showToast(error.message, 'error');
            } finally {
                setIsInitializing(false);
            }
        };
        init();
        return () => resetDetail();
    }, []);

    const handleSave = async () => {
        const errorMsg = validateForm(selectedProductId);
        if (errorMsg) {
            showToast(errorMsg, 'error');
            return;
        }
        setIsModalVisible(true);
    };

    const confirmSave = async () => {
        setIsModalVisible(false);
        try {
            const newId = await createNewRequest({ id_product: selectedProductId });
            if (newId) {
                navigation.replace('ProductPriceReqEditScreen', {
                    id: newId,
                    showSuccessToast: true
                });
            }
        } catch (error: any) {
            showToast(error.message, 'error');
        }
    };

    const isLoading = isInitializing;

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            className="flex-1 bg-gray-50"
        >
            <HeaderNavigator
                title={isLoading ? "MEMUAT DATA..." : "TAMBAH PRODUCT PRICE REQUEST"}
                showBackButton={true}
                onBackPress={() => navigation.goBack()}
            />

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 16, paddingTop: 24, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {isLoading ? (
                    <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>
                        <ProductPriceReqFormSkeleton />
                    </Animated.View>
                ) : (
                    <Animated.View key="content" entering={FadeIn.duration(600)}>
                        <Animated.View
                            entering={FadeInUp.delay(50)}
                            layout={LinearTransition.springify()}
                            className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-4"
                            style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }}
                        >
                            <View className="mb-2">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Pilih Produk <Text className="text-red-500">*</Text></Text>
                                <View className="border border-gray-200 rounded-xl bg-gray-50">
                                    <Dropdown
                                        style={{ height: 48, paddingHorizontal: 16 }}
                                        data={products.map(p => ({ label: `${p.code_product} | ${p.nm_product}`, value: p.id_product }))}
                                        search
                                        searchPlaceholder="Cari kode atau nama produk..."
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Pilih Produk..."
                                        value={selectedProductId}
                                        onChange={item => setSelectedProductId(item.value)}
                                        selectedTextStyle={{ color: '#111827', fontSize: 14 }}
                                        placeholderStyle={{ color: '#9CA3AF', fontSize: 14 }}
                                        inputSearchStyle={{ height: 40, fontSize: 14, borderRadius: 8 }}
                                    />
                                </View>
                            </View>
                        </Animated.View>

                        <Animated.View
                            entering={FadeInUp.delay(100)}
                            layout={LinearTransition.springify()}
                            className="flex-row mt-4 gap-3"
                        >

                            <Button
                                onPress={handleSave}
                                disabled={isActionLoading}
                                className="flex-1 h-14 rounded-xl flex-row items-center justify-center"
                                style={{ elevation: 2, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                            >
                                {isActionLoading ? (
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

            <ToastMessages
                visible={toast.show}
                title='Validasi'
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(prev => ({ ...prev, show: false }))}
            />

            <ModalConfirm
                visible={isModalVisible}
                title="Konfirmasi"
                message="Apakah Anda yakin ingin membuat pengajuan harga untuk produk ini?"
                confirmText="Ya!"
                cancelText="Batal!"
                onConfirm={confirmSave}
                onCancel={() => setIsModalVisible(false)}
            />
        </KeyboardAvoidingView>
    );
}
