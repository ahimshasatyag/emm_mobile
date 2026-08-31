import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ruler, Save, Edit3, X } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut, FadeInDown, FadeInUp, LinearTransition } from 'react-native-reanimated';
import { theme } from '../../../theme/theme';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { Button } from '../../../components/ui/button';
import { useProductUnits } from '../hooks/useProductUnits';
import { ProductUnitEditSkeleton } from '../skeleton/ProductUnitEditSkeleton';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';

export function ProductUnitEditScreen() {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { allUnits, editUnit, loadUnits, isLoading, formData, setFormData, validateForm } = useProductUnits();

    const unitId = route.params?.id;

    const [isEditing, setIsEditing] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isModalConfirmVisible, setIsModalConfirmVisible] = useState(false);

    const [toastState, setToastState] = useState({
        visible: false,
        type: 'success' as ToastType,
        message: ''
    });

    useEffect(() => {
        if (!isLoading) {
            setIsRefreshing(false);
        }
    }, [isLoading]);

    const handleRefresh = () => {
        setIsRefreshing(true);
        loadUnits();
    };

    useEffect(() => {
        const unit = allUnits.find(u => String(u.id_product_satuan) === String(unitId));
        if (unit) {
            setFormData({ nm_product_satuan: unit.nm_product_satuan });
            setIsInitializing(false);

            if (route.params?.showSuccessToast) {
                setToastState({
                    visible: true,
                    type: 'success',
                    message: 'Satuan berhasil ditambahkan'
                });
                navigation.setParams({ showSuccessToast: undefined });
            }
        } else {
            // Wait for units to load if not available
            loadUnits();
        }
    }, [unitId, allUnits, loadUnits, route.params?.showSuccessToast, navigation]);

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
            await editUnit(unitId, formData);
            setToastState({
                visible: true,
                type: 'success',
                message: 'Satuan berhasil diperbarui'
            });
            setIsEditing(false);
        } catch (error: any) {
            setToastState({
                visible: true,
                type: 'error',
                message: error.message || 'Gagal memperbarui satuan'
            });
        }
    };

    const handleCancel = () => {
        const unit = allUnits.find(u => String(u.id_product_satuan) === String(unitId));
        if (unit) {
            setFormData({ nm_product_satuan: unit.nm_product_satuan });
            setIsEditing(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            className="flex-1 bg-gray-50"
        >
            <HeaderNavigator
                title={isInitializing || isLoading ? "MEMUAT DATA..." : (isEditing ? "EDIT SATUAN" : "DETAIL SATUAN")}
                showBackButton={true}
            />

            <ToastMessages
                visible={toastState.visible}
                type={toastState.type}
                title={toastState.type === 'success' ? 'Sukses' : 'Error'}
                message={toastState.message}
                onClose={() => setToastState({ ...toastState, visible: false })}
            />

            <ModalConfirm
                visible={isModalConfirmVisible}
                title="Konfirmasi Edit"
                message="Apakah Anda yakin ingin menyimpan perubahan pada satuan ini?"
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
                    <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} colors={[theme.colors.primary]} />
                }
            >
                {(isInitializing || isRefreshing) ? (
                    <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>
                        <ProductUnitEditSkeleton />
                    </Animated.View>
                ) : (
                    <Animated.View key="content" entering={FadeIn.duration(600)}>
                        <Animated.View
                            key={`form-container-${isEditing}`}
                            entering={FadeInUp.delay(50)}
                            layout={LinearTransition.springify()}
                            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6"
                        >

                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2 ml-1">
                                    Nama Satuan <Text className="text-red-500">*</Text>
                                </Text>
                                <TextInput
                                    className={`bg-gray-50 border border-gray-200 rounded-xl px-4 h-14 text-gray-900 font-medium ${!isEditing ? 'opacity-70 bg-gray-100' : ''}`}
                                    placeholder="Contoh: PCS, LITER, KG"
                                    value={formData.nm_product_satuan}
                                    onChangeText={(text) => setFormData({ ...formData, nm_product_satuan: text })}
                                    editable={isEditing && !isLoading}
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
                                <Button
                                    onPress={() => setIsEditing(true)}
                                    className="flex-1 h-14 rounded-2xl flex-row items-center justify-center bg-indigo-600"
                                    style={{ elevation: 2, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                                >
                                    <Edit3 color="white" size={20} className="mr-2" />
                                    <Text className="text-white font-bold text-lg">Edit</Text>
                                </Button>
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
                                        disabled={isLoading}
                                        className="flex-1 h-14 rounded-xl flex-row items-center justify-center bg-indigo-600"
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
                                </>
                            )}
                        </Animated.View>
                    </Animated.View>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
