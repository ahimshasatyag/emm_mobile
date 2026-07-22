import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, ActivityIndicator, TextInput, KeyboardAvoidingView, Platform, RefreshControl } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { Save, Edit2, X, ArrowLeft } from 'lucide-react-native';
import { theme } from '../../../theme/theme';
import { useProductSubCategories } from '../hooks/useProductSubCategories';
import { ProductSubCategoryFormData } from '../types/productsubcategory.types';
import Animated, { FadeInUp, LinearTransition, FadeIn, FadeOut } from 'react-native-reanimated';
import { Button } from '../../../components/ui/button';
import { Dropdown } from 'react-native-element-dropdown';
import { useDispatch } from 'react-redux';
import { fetchCategories } from '../../productcategory/stores/productCategorySlice';
import { ProductSubCategoryEditSkeleton } from '../skeleton/ProductSubCategoryEditSkeleton';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';

export function ProductSubCategoryEditScreen() {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const dispatch = useDispatch<any>();

    const { subCategories, editSubCategory, isLoading, categories, loadSubCategories, formData, setFormData, validateForm } = useProductSubCategories();

    const subCategoryId = route.params?.id;
    const [isInitializing, setIsInitializing] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    const [isModalConfirmVisible, setIsModalConfirmVisible] = useState(false);
    const [toastState, setToastState] = useState({
        visible: false,
        type: 'success' as ToastType,
        message: ''
    });

    const [focusedField, setFocusedField] = useState<string | null>(null);

    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        if (!isLoading) {
            setIsRefreshing(false);
        }
    }, [isLoading]);

    const handleRefresh = () => {
        setIsRefreshing(true);
        loadSubCategories();
        dispatch(fetchCategories());
    };

    useEffect(() => {
        if (categories.length === 0) {
            dispatch(fetchCategories());
        }
    }, [dispatch, categories.length]);

    useEffect(() => {
        const subCategory = subCategories.find(c => c.id_product_sub_kategori === subCategoryId);
        if (subCategory) {
            setFormData({
                id_product_kategori: subCategory.id_product_kategori,
                nm_product_sub_kategori: subCategory.nm_product_sub_kategori
            });
            setIsInitializing(false);

            if (route.params?.showSuccessToast) {
                setToastState({
                    visible: true,
                    type: 'success',
                    message: 'Sub Kategori berhasil ditambahkan'
                });
                navigation.setParams({ showSuccessToast: undefined });
            }
        } else if (!isLoading) {
            Alert.alert('Error', 'Sub Kategori tidak ditemukan', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        }
    }, [subCategoryId, subCategories, isLoading, navigation]);

    const handleSavePress = () => {
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
            await editSubCategory(subCategoryId, formData);
            setToastState({
                visible: true,
                type: 'success',
                message: 'Sub Kategori berhasil diperbarui'
            });
            setIsEditing(false);
        } catch (error: any) {
            setToastState({
                visible: true,
                type: 'error',
                message: error.message || 'Gagal menyimpan sub kategori'
            });
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        const subCategory = subCategories.find(c => c.id_product_sub_kategori === subCategoryId);
        if (subCategory) {
            setFormData({
                id_product_kategori: subCategory.id_product_kategori,
                nm_product_sub_kategori: subCategory.nm_product_sub_kategori
            });
        }
    };



    const currentSubCategory = subCategories.find(c => c.id_product_sub_kategori === subCategoryId);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            className="flex-1 bg-gray-50"
        >
            <HeaderNavigator
                title={isInitializing || isLoading ? "MEMUAT DATA..." : (isEditing ? "EDIT SUB KATEGORI" : "DETAIL SUB KATEGORI")}
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
                title="Konfirmasi"
                message="Apakah Anda yakin ingin menyimpan perubahan sub kategori produk ini?"
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
                {isInitializing || isRefreshing ? (
                    <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>
                        <ProductSubCategoryEditSkeleton />
                    </Animated.View>
                ) : (
                    <Animated.View key="content" entering={FadeIn.duration(600)}>
                        <Animated.View
                            key={`form-container-${isEditing}`}
                            entering={FadeInUp.delay(50)}
                            layout={LinearTransition.springify()}
                            className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-4"
                            style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }}
                        >

                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Category <Text className="text-red-500">*</Text></Text>
                                <View
                                    className={`border rounded-xl bg-gray-50 ${!isEditing && 'opacity-70'}`}
                                    style={{ borderColor: focusedField === 'category' ? theme.colors.primary : '#e5e7eb' }}
                                >
                                    <Dropdown
                                        style={{ height: 48, paddingHorizontal: 16 }}
                                        data={categories.map(c => ({ label: c.nm_product_kategori, value: c.id_product_kategori }))}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Select Category"
                                        value={formData.id_product_kategori}
                                        onChange={item => setFormData({ ...formData, id_product_kategori: item.value })}
                                        disable={!isEditing}
                                        onFocus={() => isEditing && setFocusedField('category')}
                                        onBlur={() => setFocusedField(null)}
                                    />
                                </View>
                            </View>

                            <View>
                                <Text className="text-sm font-bold text-gray-700 mb-2">Sub Category Name <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className={`px-4 py-3 rounded-xl border ${isEditing ? 'bg-gray-50 text-gray-900' : 'bg-gray-100 text-gray-500'}`}
                                    style={{ borderColor: focusedField === 'name' ? theme.colors.primary : '#e5e7eb' }}
                                    placeholder="Masukkan nama sub kategori"
                                    value={formData.nm_product_sub_kategori}
                                    onChangeText={(text) => setFormData({ ...formData, nm_product_sub_kategori: text })}
                                    editable={isEditing}
                                    onFocus={() => isEditing && setFocusedField('name')}
                                    onBlur={() => setFocusedField(null)}
                                />
                            </View>
                        </Animated.View>
                    </Animated.View>
                )}

                {!isInitializing && (
                    <Animated.View
                        key={`actions-${isEditing}`}
                        entering={FadeInUp.delay(100)}
                        layout={LinearTransition.springify()}
                        className="flex-row mt-4 gap-3"
                    >
                            {!isEditing ? (
                                <Button
                                    onPress={() => setIsEditing(true)}
                                    className="flex-1 h-14 rounded-xl flex-row items-center justify-center"
                                    style={{ elevation: 2, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                                >
                                    <Edit2 color="white" size={20} className="mr-2" />
                                    <Text className="text-white font-bold text-lg">Edit Sub Kategori</Text>
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
                                        onPress={handleSavePress}
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
                                </>
                            )}
                    </Animated.View>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
