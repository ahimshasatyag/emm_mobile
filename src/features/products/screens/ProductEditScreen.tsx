import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform, TouchableOpacity, Alert, RefreshControl, Image } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Save, Plus, Trash2, Edit3, UploadCloud, ImageIcon, X } from 'lucide-react-native';
import { useProductForm } from '../hooks/useProductForm';
import { theme } from '../../../theme/theme';
import Animated, { FadeInUp, FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { Button } from '../../../components/ui/button';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { ProductFormSkeleton } from '../skeleton/ProductFormSkeleton';

export function ProductEditScreen() {
    const navigation = useNavigation();
    const route = useRoute<any>();
    const id = route.params?.id;

    const [isEditing, setIsEditing] = useState(false);

    const { 
        formData, categories, subCategories, brands, satuans,
        isLoading, isSaving, error, 
        updateField, addOption, removeOption, updateOption, loadInitialData, save 
    } = useProductForm(id);

    useEffect(() => {
        if (id) {
            loadInitialData(id);
        }
    }, [id]);

    const onRefresh = () => {
        if (id) {
            loadInitialData(id);
            setIsEditing(false);
        }
    };

    const onSavePress = async () => {
        const success = await save();
        if (success) {
            Alert.alert('Sukses', 'Data produk berhasil diperbarui', [
                { text: 'OK', onPress: () => {
                    setIsEditing(false);
                    loadInitialData(id);
                } }
            ]);
        }
    };

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator 
                title={isLoading ? "MEMUAT DATA..." : (isEditing ? "EDIT PRODUCT" : "DETAIL PRODUCT")} 
                showBackButton 
                onBackPress={() => navigation.goBack()} 
            />

            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                className="flex-1"
            >
                <ScrollView 
                    className="flex-1"
                    contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} colors={[theme.colors.primary]} />}
                >
                    {isLoading ? (
                        <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>
                            <ProductFormSkeleton />
                        </Animated.View>
                    ) : (
                        <>
                        <Animated.View key="content" entering={FadeIn.duration(600)}>
                        {error && (
                            <View className="bg-red-50 p-4 rounded-xl mb-6 border border-red-100">
                                <Text className="text-red-600 font-medium">{error}</Text>
                            </View>
                        )}

                        <View className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-6" pointerEvents={isEditing ? 'auto' : 'none'}>
                            
                             {/* Photo Upload Area */}
                             <View className="mb-6 flex-row items-center justify-center">
                                <TouchableOpacity 
                                    activeOpacity={0.7}
                                    onPress={() => isEditing && Alert.alert('Simulasi', 'Fitur unggah foto belum diimplementasikan di versi mockup')}
                                    className={`w-32 h-32 ${isEditing ? 'bg-gray-100 border-2 border-dashed border-gray-300' : 'bg-white border border-gray-200'} rounded-2xl items-center justify-center`}
                                >
                                    {formData.link_foto ? (
                                        <Image source={{ uri: formData.link_foto }} className="w-full h-full rounded-2xl" />
                                    ) : (
                                        <View className="items-center">
                                            <ImageIcon color="#9ca3af" size={32} className="mb-2" />
                                            {isEditing && <Text className="text-xs text-gray-500 font-medium">Upload Foto</Text>}
                                        </View>
                                    )}
                                </TouchableOpacity>
                            </View>

                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Product Code <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className={`bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 ${isEditing ? 'focus:border-indigo-500 text-gray-900' : 'text-gray-500'}`}
                                    value={formData.code_product}
                                    onChangeText={(t) => updateField('code_product', t)}
                                    placeholder="Masukkan kode produk"
                                    editable={isEditing}
                                />
                            </View>

                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Product Name <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className={`bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 ${isEditing ? 'focus:border-indigo-500 text-gray-900' : 'text-gray-500'}`}
                                    value={formData.nm_product}
                                    onChangeText={(t) => updateField('nm_product', t)}
                                    placeholder="Masukkan nama produk"
                                    editable={isEditing}
                                />
                            </View>

                            <View className="mb-4 flex-row gap-4">
                                <View className="flex-1">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Category <Text className="text-red-500">*</Text></Text>
                                    <View className={`border border-gray-200 rounded-xl bg-gray-50 ${!isEditing && 'opacity-70'}`}>
                                        <Dropdown
                                            style={{ height: 48, paddingHorizontal: 16 }}
                                            data={categories.map(c => ({ label: c.nm_product_kategori, value: c.id_product_kategori }))}
                                            labelField="label"
                                            valueField="value"
                                            placeholder="Select Category"
                                            value={formData.id_product_kategori}
                                            onChange={item => updateField('id_product_kategori', item.value)}
                                            selectedTextStyle={{ color: theme.colors.primary, fontWeight: 'bold' }}
                                            disable={!isEditing}
                                        />
                                    </View>
                                </View>
                                <View className="flex-1">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Sub Category <Text className="text-red-500">*</Text></Text>
                                    <View className={`border border-gray-200 rounded-xl bg-gray-50 ${!isEditing && 'opacity-70'}`}>
                                        <Dropdown
                                            style={{ height: 48, paddingHorizontal: 16 }}
                                            data={subCategories.map(c => ({ label: c.nm_product_sub_kategori, value: c.id_product_sub_kategori }))}
                                            labelField="label"
                                            valueField="value"
                                            placeholder="Select Sub Category"
                                            value={formData.id_product_sub_kategori}
                                            onChange={item => updateField('id_product_sub_kategori', item.value)}
                                            selectedTextStyle={{ color: theme.colors.primary, fontWeight: 'bold' }}
                                            disable={!isEditing}
                                        />
                                    </View>
                                </View>
                            </View>

                            <View className="mb-4 flex-row gap-4">
                                <View className="flex-1">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Brand <Text className="text-red-500">*</Text></Text>
                                    <View className={`border border-gray-200 rounded-xl bg-gray-50 ${!isEditing && 'opacity-70'}`}>
                                        <Dropdown
                                            style={{ height: 48, paddingHorizontal: 16 }}
                                            data={brands.map(b => ({ label: b.nm_product_brand, value: b.id_product_brand }))}
                                            labelField="label"
                                            valueField="value"
                                            placeholder="Select Brand"
                                            value={formData.id_product_brand}
                                            onChange={item => updateField('id_product_brand', item.value)}
                                            selectedTextStyle={{ color: theme.colors.primary, fontWeight: 'bold' }}
                                            disable={!isEditing}
                                        />
                                    </View>
                                </View>
                                <View className="flex-1">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Satuan <Text className="text-red-500">*</Text></Text>
                                    <View className={`border border-gray-200 rounded-xl bg-gray-50 ${!isEditing && 'opacity-70'}`}>
                                        <Dropdown
                                            style={{ height: 48, paddingHorizontal: 16 }}
                                            data={satuans.map(s => ({ label: s.nm_product_satuan, value: s.id_product_satuan }))}
                                            labelField="label"
                                            valueField="value"
                                            placeholder="Select Satuan"
                                            value={formData.id_product_satuan}
                                            onChange={item => updateField('id_product_satuan', item.value)}
                                            selectedTextStyle={{ color: theme.colors.primary, fontWeight: 'bold' }}
                                            disable={!isEditing}
                                        />
                                    </View>
                                </View>
                            </View>

                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Deskripsi <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className={`bg-gray-50 p-4 rounded-xl border border-gray-200 ${isEditing ? 'focus:border-indigo-500 text-gray-900' : 'text-gray-500'} h-24`}
                                    value={formData.product_deskripsi}
                                    onChangeText={(t) => updateField('product_deskripsi', t)}
                                    placeholder="Masukkan deskripsi produk"
                                    multiline={true}
                                    numberOfLines={4}
                                    textAlignVertical="top"
                                    editable={isEditing}
                                />
                            </View>

                            <View className="mb-6">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Brosur</Text>
                                <TouchableOpacity 
                                    activeOpacity={0.7}
                                    onPress={() => isEditing && Alert.alert('Simulasi', 'Fitur upload PDF belum diimplementasikan')}
                                    className={`bg-gray-100 p-4 rounded-xl border border-gray-200 flex-row items-center justify-center ${isEditing ? 'border-dashed' : 'opacity-70'}`}
                                >
                                    <UploadCloud color="#6b7280" size={20} className="mr-2" />
                                    <Text className="text-gray-600 font-bold">{isEditing ? 'Upload Brosur (PDF)' : 'Download Brosur (PDF)'}</Text>
                                </TouchableOpacity>
                                {formData.link_brosur ? <Text className="text-xs text-indigo-600 mt-2 font-medium">{formData.link_brosur}</Text> : null}
                            </View>

                            <View className="mb-2">
                                <View className="flex-row items-center justify-between mb-4">
                                    <Text className="text-sm font-bold text-gray-700">Options / Varian</Text>
                                    {isEditing && (
                                        <TouchableOpacity 
                                            onPress={addOption}
                                            className="bg-indigo-100 px-3 py-1.5 rounded-lg flex-row items-center"
                                        >
                                            <Plus color={theme.colors.primary} size={16} className="mr-1" />
                                            <Text className="text-indigo-700 font-bold text-xs">Tambah</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                                
                                {formData.options.map((opt, index) => (
                                    <View key={index} className="flex-row items-center mb-3">
                                        <View className="w-8 h-10 bg-gray-100 rounded-l-xl items-center justify-center border-y border-l border-gray-200">
                                            <Text className="font-bold text-gray-500">{index + 1}</Text>
                                        </View>
                                        <TextInput
                                            className={`flex-1 bg-white px-4 h-10 border-y border-gray-200 ${isEditing ? 'text-gray-900' : 'text-gray-500'} ${!isEditing && 'border-r rounded-r-xl'}`}
                                            value={opt.nm_product_opt}
                                            onChangeText={(t) => updateOption(index, t)}
                                            placeholder="Nama Option"
                                            editable={isEditing}
                                        />
                                        {isEditing && (
                                            <TouchableOpacity 
                                                onPress={() => removeOption(index)}
                                                className="w-12 h-10 bg-red-50 rounded-r-xl items-center justify-center border-y border-r border-red-200"
                                            >
                                                <Trash2 color="#ef4444" size={18} />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                ))}
                                {formData.options.length === 0 && (
                                    <View className="py-4 items-center border border-dashed border-gray-300 rounded-xl bg-gray-50">
                                        <Text className="text-gray-400 text-xs font-medium">Belum ada option/varian yang ditambahkan.</Text>
                                    </View>
                                )}
                            </View>

                        </View>
                    </Animated.View>

                    <Animated.View entering={FadeInUp.delay(100)}>
                        {!isEditing ? (
                            <Button
                                onPress={() => setIsEditing(true)}
                                className="w-full h-14 rounded-2xl flex-row items-center justify-center bg-indigo-600"
                                style={{ elevation: 4, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                            >
                                <Edit3 color="white" size={20} className="mr-2" />
                                <Text className="text-white font-bold text-lg">Edit</Text>
                            </Button>
                        ) : (
                            <View className="flex-row gap-4">
                                <Button
                                    variant="outline"
                                    onPress={() => {
                                        setIsEditing(false);
                                        loadInitialData(id);
                                    }}
                                    className="flex-1 h-14 rounded-xl flex-row items-center justify-center"
                                >
                                    <X color={theme.colors.primary} size={20} className="mr-2" />
                                    <Text className="font-bold text-lg" style={{ color: theme.colors.primary }}>Batal</Text>
                                </Button>
                                <Button
                                    onPress={onSavePress}
                                    disabled={isSaving}
                                    className="flex-1 h-14 rounded-2xl flex-row items-center justify-center bg-green-600"
                                    style={{ elevation: 4, shadowColor: '#16a34a', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
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
                            </View>
                        )}
                    </Animated.View>
                    </>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
