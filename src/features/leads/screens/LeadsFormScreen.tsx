import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation } from '@react-navigation/native';
import { Save } from 'lucide-react-native';
import { useLeadsForm } from '../hooks/useLeadsForm';
import { theme } from '../../../theme/theme';
import Animated, { FadeInUp, FadeIn, FadeOut } from 'react-native-reanimated';
import { Button } from '../../../components/ui/button';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { LeadsFormSkeleton } from '../skeleton/LeadsFormSkeleton';
import { ProductModal } from '../components/ProductModal';
import { VisitModal } from '../components/VisitModal';
import { TabProduct } from '../components/TabProduct';
import { TabVisit } from '../components/TabVisit';
import { formatRp as formatRupiah } from '../../../utils/helpers/money';

export function LeadsFormScreen() {
    const navigation = useNavigation();
    const {
        formData, customers, productsList,
        isLoading, isSaving, error,
        updateField, addProductRow, removeProductRow, updateProductRow,
        addVisitRow, removeVisitRow, updateVisitRow,
        refreshOptions, save
    } = useLeadsForm();

    const [activeTab, setActiveTab] = useState<'product' | 'visit'>('product');
    const [isProductModalVisible, setIsProductModalVisible] = useState(false);
    const [editingProductIndex, setEditingProductIndex] = useState<number | null>(null);
    const [isVisitModalVisible, setIsVisitModalVisible] = useState(false);
    const [editingVisitIndex, setEditingVisitIndex] = useState<number | null>(null);

    const handleSaveProduct = (product: any) => {
        if (editingProductIndex !== null) {
            const updatedProducts = [...formData.products];
            updatedProducts[editingProductIndex] = product;
            updateField('products', updatedProducts);
        } else {
            updateField('products', [...formData.products, product]);
        }
    };

    const openAddProductModal = () => {
        setEditingProductIndex(null);
        setIsProductModalVisible(true);
    };

    const openEditProductModal = (index: number) => {
        setEditingProductIndex(index);
        setIsProductModalVisible(true);
    };

    const handleSaveVisit = (visit: any) => {
        if (editingVisitIndex !== null) {
            const updatedVisits = [...formData.visits];
            updatedVisits[editingVisitIndex] = visit;
            updateField('visits', updatedVisits);
        } else {
            updateField('visits', [...formData.visits, visit]);
        }
    };

    const openAddVisitModal = () => {
        setEditingVisitIndex(null);
        setIsVisitModalVisible(true);
    };

    const openEditVisitModal = (index: number) => {
        setEditingVisitIndex(index);
        setIsVisitModalVisible(true);
    };

    const onSavePress = async () => {
        const success = await save();
        if (success) {
            Alert.alert('Sukses', 'Data Leads berhasil disimpan', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        }
    };

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator
                title={isLoading ? "MEMUAT DATA..." : "TAMBAH LEADS"}
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
                    refreshControl={
                        <RefreshControl refreshing={isLoading} onRefresh={refreshOptions} colors={[theme.colors.primary]} />
                    }
                >
                    {isLoading ? (
                        <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>
                            <LeadsFormSkeleton />
                        </Animated.View>
                    ) : (
                        <>
                            <Animated.View key="content" entering={FadeIn.duration(600)}>
                                {error && (
                                    <View className="bg-red-50 p-4 rounded-xl mb-6 border border-red-100">
                                        <Text className="text-red-600 font-medium">{error}</Text>
                                    </View>
                                )}

                                <View className="bg-white rounded-3xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
                                    <View className="p-6">

                                        <View className="mb-4">
                                            <Text className="text-sm font-bold text-gray-700 mb-2">Customer <Text className="text-red-500">*</Text></Text>
                                            <View className="border border-gray-200 rounded-xl bg-gray-50">
                                                <Dropdown
                                                    style={{ height: 48, paddingHorizontal: 16 }}
                                                    data={customers.map(c => ({ label: c.nm_customers, value: c.id_customers }))}
                                                    labelField="label"
                                                    valueField="value"
                                                    search
                                                    searchPlaceholder="Cari customer..."
                                                    placeholder="Pilih Customer"
                                                    value={formData.id_customers}
                                                    onChange={item => updateField('id_customers', item.value)}
                                                />
                                            </View>
                                        </View>

                                        <View className="mb-4">
                                            <Text className="text-sm font-bold text-gray-700 mb-2">Customer Address</Text>
                                            <TextInput
                                                className="bg-gray-100 px-4 py-3 rounded-xl border border-gray-200 text-gray-500"
                                                value={formData.customers_address}
                                                editable={false}
                                                multiline
                                                numberOfLines={3}
                                                textAlignVertical="top"
                                                placeholder="Alamat akan terisi otomatis"
                                            />
                                        </View>

                                        <View className="mb-4">
                                            <Text className="text-sm font-bold text-gray-700 mb-2">Notes</Text>
                                            <TextInput
                                                className="bg-gray-50 p-4 rounded-xl border border-gray-200 focus:border-indigo-500 text-gray-900 h-24"
                                                value={formData.notes}
                                                onChangeText={(t) => updateField('notes', t)}
                                                placeholder="Masukkan catatan"
                                                multiline={true}
                                                numberOfLines={3}
                                                textAlignVertical="top"
                                            />
                                        </View>

                                        <View className="mb-4">
                                            <Text className="text-sm font-bold text-gray-700 mb-2">Kurs</Text>
                                            <TextInput
                                                className="bg-gray-100 px-4 py-3 rounded-xl border border-gray-200 text-gray-500 font-bold"
                                                value={formatRupiah(formData.kurs)}
                                                editable={false}
                                            />
                                        </View>

                                    </View>

                                    {/* TABS AND TAB CONTENT */}
                                    <View className="flex-row bg-white border-y border-gray-100 px-2 pt-2">
                                        <TouchableOpacity
                                            onPress={() => setActiveTab('product')}
                                            className={`flex-1 py-3 items-center border-b-2`}
                                            style={{ borderColor: activeTab === 'product' ? theme.colors.primary : 'transparent' }}
                                        >
                                            <Text className="font-bold" style={{ color: activeTab === 'product' ? theme.colors.primary : '#9ca3af' }}>Product</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => setActiveTab('visit')}
                                            className={`flex-1 py-3 items-center border-b-2`}
                                            style={{ borderColor: activeTab === 'visit' ? theme.colors.primary : 'transparent' }}
                                        >
                                            <Text className="font-bold" style={{ color: activeTab === 'visit' ? theme.colors.primary : '#9ca3af' }}>Visit</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <View className="p-4">
                                        {/* PRODUCT TAB CONTENT */}
                                        {activeTab === 'product' && (
                                            <TabProduct
                                                isEditMode={true}
                                                openAddProductModal={openAddProductModal}
                                                formData={formData}
                                                productsList={productsList}
                                                openEditProductModal={openEditProductModal}
                                            />
                                        )}

                                        {/* VISIT TAB CONTENT */}
                                        {activeTab === 'visit' && (
                                            <TabVisit
                                                isEditMode={true}
                                                openAddVisitModal={openAddVisitModal}
                                                formData={formData}
                                                openEditVisitModal={openEditVisitModal}
                                            />
                                        )}
                                    </View>
                                </View>
                            </Animated.View>

                            <Animated.View entering={FadeInUp.delay(100)}>
                                <Button
                                    onPress={onSavePress}
                                    disabled={isSaving}
                                    className="w-full h-14 rounded-2xl flex-row items-center justify-center"
                                    style={{ elevation: 4, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
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
                        </>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
            <ProductModal
                visible={isProductModalVisible}
                onDismiss={() => setIsProductModalVisible(false)}
                onSave={handleSaveProduct}
                onDelete={editingProductIndex !== null ? () => removeProductRow(editingProductIndex) : undefined}
                productsList={productsList}
                initialData={editingProductIndex !== null ? formData.products[editingProductIndex] : null}
            />
            <VisitModal
                visible={isVisitModalVisible}
                onDismiss={() => setIsVisitModalVisible(false)}
                onSave={handleSaveVisit}
                onDelete={editingVisitIndex !== null ? () => removeVisitRow(editingVisitIndex) : undefined}
                initialData={editingVisitIndex !== null ? formData.visits[editingVisitIndex] : null}
            />
        </View>
    );
}
