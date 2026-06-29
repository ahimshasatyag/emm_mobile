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
import { ProductSubCategoryFormSkeleton } from '../skeleton/ProductSubCategoryFormSkeleton';

export function ProductSubCategoryEditScreen() {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const dispatch = useDispatch<any>();
    
    const { subCategories, editSubCategory, isLoading, categories, loadSubCategories } = useProductSubCategories();
    
    const subCategoryId = route.params?.id;
    const [formData, setFormData] = useState<ProductSubCategoryFormData>({
        id_product_kategori: '',
        nm_product_sub_kategori: ''
    });
    const [isInitializing, setIsInitializing] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

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
        } else if (!isLoading) {
            Alert.alert('Error', 'Sub Kategori tidak ditemukan', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        }
    }, [subCategoryId, subCategories, isLoading, navigation]);

    const handleSave = async () => {
        if (!formData.id_product_kategori) {
            Alert.alert('Error', 'Kategori wajib dipilih!');
            return;
        }
        if (!formData.nm_product_sub_kategori.trim()) {
            Alert.alert('Error', 'Nama Sub Kategori wajib diisi!');
            return;
        }

        try {
            await editSubCategory(subCategoryId, formData);
            Alert.alert('Sukses', 'Sub Kategori berhasil diperbarui', [
                { text: 'OK', onPress: () => setIsEditing(false) }
            ]);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Gagal menyimpan sub kategori');
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

            <ScrollView 
                className="flex-1"
                contentContainerStyle={{ padding: 16, paddingTop: 24, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={() => { loadSubCategories(); dispatch(fetchCategories()); }} colors={[theme.colors.primary]} />
                }
            >
                {isInitializing || isLoading ? (
                    <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>
                        <ProductSubCategoryFormSkeleton />
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
                                <Text className="text-sm font-bold text-gray-700 mb-2">Kode Sub Kategori</Text>
                                <TextInput
                                    className="bg-gray-100 px-4 py-3 rounded-xl border border-gray-200 text-gray-500"
                                    value={currentSubCategory?.kode_product_sub_kategori || ''}
                                    editable={false}
                                />
                            </View>
                            
                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Category <Text className="text-red-500">*</Text></Text>
                                <View className={`border border-gray-200 rounded-xl bg-gray-50 ${!isEditing && 'opacity-70'}`}>
                                    <Dropdown
                                        style={{ height: 48, paddingHorizontal: 16 }}
                                        data={categories.map(c => ({ label: c.nm_product_kategori, value: c.id_product_kategori }))}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Select Category"
                                        value={formData.id_product_kategori}
                                        onChange={item => setFormData({ ...formData, id_product_kategori: item.value })}
                                        selectedTextStyle={{ color: theme.colors.primary, fontWeight: 'bold' }}
                                        disable={!isEditing}
                                    />
                                </View>
                            </View>

                            <View>
                                <Text className="text-sm font-bold text-gray-700 mb-2">Sub Category Name <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className={`px-4 py-3 rounded-xl border ${isEditing ? 'bg-gray-50 border-gray-200 focus:border-indigo-500 text-gray-900' : 'bg-gray-100 border-gray-200 text-gray-500'}`}
                                    placeholder="Masukkan nama sub kategori"
                                    value={formData.nm_product_sub_kategori}
                                    onChangeText={(text) => setFormData({ ...formData, nm_product_sub_kategori: text })}
                                    editable={isEditing}
                                />
                            </View>
                        </Animated.View>

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
                                </>
                            )}
                        </Animated.View>
                    </Animated.View>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
