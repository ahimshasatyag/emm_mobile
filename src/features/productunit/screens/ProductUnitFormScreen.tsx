import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Save } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp, FadeIn, FadeOut } from 'react-native-reanimated';
import { theme } from '../../../theme/theme';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { Button } from '../../../components/ui/button';
import { useProductUnits } from '../hooks/useProductUnits';
import { ProductUnitFormData } from '../types/productunit.types';
import { ProductUnitFormSkeleton } from '../skeleton/ProductUnitFormSkeleton';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';

export function ProductUnitFormScreen() {
    const navigation = useNavigation<any>();
    const { addUnit, isLoading, formData, setFormData, validateForm } = useProductUnits();

    const [isRefreshing, setIsRefreshing] = useState(false);

    const [isModalConfirmVisible, setIsModalConfirmVisible] = useState(false);
    const [toastState, setToastState] = useState({
        visible: false,
        type: 'success' as ToastType,
        message: ''
    });

    const handleRefresh = () => {
        setIsRefreshing(true);
        // Simulate fetch for form initialization
        setTimeout(() => {
            setIsRefreshing(false);
        }, 800);
    };

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
            const result = await addUnit(formData);
            navigation.replace('ProductUnitEdit', {
                id: result.unit.id_product_satuan,
                showSuccessToast: true
            });
        } catch (error: any) {
            setToastState({
                visible: true,
                type: 'error',
                message: error.message || 'Gagal menyimpan satuan produk'
            });
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            className="flex-1 bg-gray-50"
        >
            <ToastMessages
                visible={toastState.visible}
                type={toastState.type}
                title={toastState.type === 'success' ? 'Sukses' : 'Validasi'}
                message={toastState.message}
                onClose={() => setToastState({ ...toastState, visible: false })}
            />

            <ModalConfirm
                visible={isModalConfirmVisible}
                title="Konfirmasi"
                message="Apakah Anda yakin ingin menyimpan satuan produk ini?"
                confirmText="Ya, Simpan"
                cancelText="Batal"
                onCancel={() => setIsModalConfirmVisible(false)}
                onConfirm={confirmSave}
            />

            <HeaderNavigator title="TAMBAH UNIT" showBackButton={true} />

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 16, paddingTop: 24, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} colors={[theme.colors.primary]} />
                }
            >
                {isRefreshing ? (
                    <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>
                        <ProductUnitFormSkeleton />
                    </Animated.View>
                ) : (
                    <Animated.View key="content" entering={FadeInDown.duration(400).springify()}>

                        <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">


                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2 ml-1">
                                    Nama Satuan <Text className="text-red-500">*</Text>
                                </Text>
                                <TextInput
                                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 h-14 text-gray-900 font-medium"
                                    placeholder="Enter unit..."
                                    value={formData.nm_product_satuan}
                                    onChangeText={(text) => setFormData({ ...formData, nm_product_satuan: text })}
                                    editable={!isLoading}
                                />
                            </View>
                        </View>

                        <Animated.View entering={FadeInUp.delay(200).springify()}>
                            <Button
                                onPress={handleSave}
                                disabled={isLoading}
                                className="h-14 rounded-2xl flex-row items-center justify-center bg-indigo-600"
                                style={{ elevation: 2, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <>
                                        <Save color="white" size={20} className="mr-2" />
                                        <Text className="text-white font-bold text-lg">Simpan Satuan</Text>
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
