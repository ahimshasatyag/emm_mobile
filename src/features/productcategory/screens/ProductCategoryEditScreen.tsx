import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, ActivityIndicator, TextInput, KeyboardAvoidingView, Platform, RefreshControl } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { Save, Edit2, X } from 'lucide-react-native';
import { theme } from '../../../theme/theme';
import { useProductCategories } from '../hooks/useProductCategories';
import { ProductCategoryFormData } from '../types/productcategory.types';
import Animated, { FadeInUp, LinearTransition, FadeIn, FadeOut } from 'react-native-reanimated';
import { Button } from '../../../components/ui/button';
import { ProductCategoryFormSkeleton } from '../skeleton/ProductCategoryFormSkeleton';

export function ProductCategoryEditScreen() {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { categories, editCategory, isLoading, refreshData } = useProductCategories();
    
    const categoryId = route.params?.id;
    const [formData, setFormData] = useState<ProductCategoryFormData>({
        nm_product_kategori: ''
    });
    const [isInitializing, setIsInitializing] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const category = categories.find(c => c.id_product_kategori === categoryId);
        if (category) {
            setFormData({
                nm_product_kategori: category.nm_product_kategori
            });
            setIsInitializing(false);
        } else {
            Alert.alert('Error', 'Kategori tidak ditemukan', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        }
    }, [categoryId, categories]);

    const handleSave = async () => {
        if (!formData.nm_product_kategori.trim()) {
            Alert.alert('Error', 'Category Name wajib diisi!');
            return;
        }

        try {
            await editCategory(categoryId, formData);
            Alert.alert('Sukses', 'Kategori berhasil diperbarui', [
                { text: 'OK', onPress: () => setIsEditing(false) }
            ]);
        } catch (error) {
            // Error is handled by hook
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        const category = categories.find(c => c.id_product_kategori === categoryId);
        if (category) {
            setFormData({
                nm_product_kategori: category.nm_product_kategori
            });
        }
    };



    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator 
                title={isInitializing || isLoading ? "MEMUAT DATA..." : (isEditing ? "EDIT KATEGORI" : "DETAIL KATEGORI")} 
                showBackButton={true} 
                onBackPress={() => navigation.goBack()} 
            />

            <ScrollView 
                className="flex-1"
                contentContainerStyle={{ padding: 16, paddingTop: 24, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={refreshData} colors={[theme.colors.primary]} />
                }
            >
                {isInitializing || isLoading ? (
                    <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>
                        <ProductCategoryFormSkeleton />
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
                                <Text className="text-sm font-bold text-gray-700 mb-2">Kode Kategori</Text>
                                <TextInput
                                    className="bg-gray-100 px-4 py-3 rounded-xl border border-gray-200 text-gray-500"
                                    value={categories.find(c => c.id_product_kategori === categoryId)?.kode_product_kategori || ''}
                                    editable={false}
                                />
                            </View>
                            <View>
                                <Text className="text-sm font-bold text-gray-700 mb-2">Category Name <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className={`px-4 py-3 rounded-xl border ${isEditing ? 'bg-gray-50 border-gray-200 focus:border-indigo-500 text-gray-900' : 'bg-gray-100 border-gray-200 text-gray-500'}`}
                                    placeholder="Masukkan nama kategori"
                                    value={formData.nm_product_kategori}
                                    onChangeText={(text) => setFormData({ ...formData, nm_product_kategori: text })}
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
                                    <Text className="text-white font-bold text-lg">Edit Kategori</Text>
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
        </View>
    );
}
