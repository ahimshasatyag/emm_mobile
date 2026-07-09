import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { FileText, Save, X, Edit, Trash2, Calendar, Plus } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Button } from '../../../components/ui/button';
import { theme } from '../../../theme/theme';
import { useQuotationsAP } from '../hooks/useQuotationsAP';
import { QuotationsAPEditSkeleton } from '../skeleton/QuotationsAPEditSkeleton';
import { ErrorState } from '../../../components/shared/ErrorState';
import { PurchaseOrderTable } from '../components/PurchaseOrderTable';
import { IncshipmentInvoiceTable } from '../components/IncshipmentInvoiceTable';
import { PurchaseOrderModal } from '../components/PurchaseOrderModal';

// Dummy data for products
const DUMMY_PRODUCTS = [
    { id_product: 'P001', code_product: 'BRG-001', nm_product: 'Laptop Asus ROG', deskripsi: 'Laptop Gaming Asus ROG Strix', satuan: 'Unit', price: 15000000 },
    { id_product: 'P002', code_product: 'BRG-002', nm_product: 'Mouse Logitech MX Master', deskripsi: 'Mouse Wireless Premium', satuan: 'Pcs', price: 1500000 },
    { id_product: 'P003', code_product: 'BRG-003', nm_product: 'Keyboard Keychron K2', deskripsi: 'Mechanical Keyboard 84 keys', satuan: 'Pcs', price: 1200000 },
];

export function QuotationsAPEditScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { id } = route.params;
    const [activeTab, setActiveTab] = useState<'po' | 'incoming'>('po');

    // Modal states
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDetail, setSelectedDetail] = useState<any>(null);
    const [poDetails, setPoDetails] = useState<any[]>([]);

    const handleAddProduct = () => {
        setSelectedDetail(null);
        setModalVisible(true);
    };

    const handleEditProduct = (index: number) => {
        setSelectedDetail(poDetails[index]);
        setModalVisible(true);
    };

    const handleDeleteProduct = () => {
        if (selectedDetail) {
            setPoDetails(poDetails.filter(p => p.id_product !== selectedDetail.id_product));
            setModalVisible(false);
            setSelectedDetail(null);
        }
    };

    const handleSaveProduct = (product: any) => {
        if (selectedDetail) {
            const newDetails = [...poDetails];
            const index = poDetails.findIndex(p => p.id_product === product.id_product);
            if (index >= 0) newDetails[index] = product;
            else newDetails.push(product);
            setPoDetails(newDetails);
        } else {
            setPoDetails([...poDetails, product]);
        }
    };

    const {
        selectedItem,
        isLoadingDetail,
        error,
        loadDetail,
        clearSelection
    } = useQuotationsAP();

    useEffect(() => {
        loadDetail(id);
        return () => {
            clearSelection();
        };
    }, [id, loadDetail, clearSelection]);

    // Load initial details when selectedItem is loaded
    useEffect(() => {
        if (selectedItem?.details) {
            setPoDetails(selectedItem.details);
        }
    }, [selectedItem]);

    const handleSave = () => {
        navigation.goBack();
    };

    const handleCancel = () => {
        // Silently go back without triggering refresh on list screen 
        // since we handle the timestamp logic there
        navigation.goBack();
    };

    if (error && !isLoadingDetail) {
        return (
            <View className="flex-1 bg-gray-50">
                <HeaderNavigator title="EDIT QUOTATION AP" />
                <ErrorState error={error} onRetry={() => loadDetail(id)} />
            </View>
        );
    }

    if (isLoadingDetail || !selectedItem) {
        return (
            <View className="flex-1 bg-white">
                <HeaderNavigator title="EDIT QUOTATION AP" />
                <QuotationsAPEditSkeleton />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator title={`EDIT ${selectedItem.code_po}`} />

            <ScrollView className="flex-1 px-4 pt-4">
                <Animated.View entering={FadeInUp.duration(400)} className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
                    <View className="p-4 space-y-4">
                        <View className="flex-row items-center border-b border-gray-100 pb-3 mb-2">
                            <View className="w-8 h-8 rounded-full bg-blue-50 items-center justify-center mr-3">
                                <FileText size={16} color={theme.colors.primary} />
                            </View>
                            <Text className="text-base font-bold text-gray-900">Data Quotation</Text>
                        </View>

                        <View className="space-y-4">
                            <View>
                                <Text className="text-sm font-bold text-gray-700 mb-2">Supplier <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className="bg-gray-100 px-4 py-3 rounded-xl border border-gray-200 text-gray-900 mb-4"
                                    value={selectedItem.nm_suppliers}
                                    editable={false}
                                />
                            </View>

                            <View>
                                <Text className="text-sm font-bold text-gray-700 mb-2">Supplier Reference <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className="bg-gray-100 px-4 py-3 rounded-xl border border-gray-200 text-gray-900 mb-4"
                                    value="REF-12345"
                                    editable={false}
                                />
                            </View>

                            <View>
                                <Text className="text-sm font-bold text-gray-700 mb-2">Mata Uang <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className="bg-gray-100 px-4 py-3 rounded-xl border border-gray-200 text-gray-900 mb-4"
                                    value="IDR"
                                    editable={false}
                                />
                            </View>

                            <View>
                                <Text className="text-sm font-bold text-gray-700 mb-2">Order Date <Text className="text-red-500">*</Text></Text>
                                <View className="bg-gray-100 px-4 py-3 rounded-xl border border-gray-200 mb-4 flex-row justify-between items-center">
                                    <TextInput
                                        className="flex-1 text-gray-900 p-0"
                                        value={selectedItem.date_po}
                                        editable={false}
                                    />
                                    <Calendar size={20} color="#9CA3AF" />
                                </View>
                            </View>

                            <View>
                                <Text className="text-sm font-bold text-gray-700 mb-2">Destination Warehouse <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className="bg-gray-100 px-4 py-3 rounded-xl border border-gray-200 text-gray-900 mb-4"
                                    value="Gudang Utama"
                                    editable={false}
                                />
                            </View>

                            <View>
                                <Text className="text-sm font-bold text-gray-700 mb-2">Status <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className="bg-gray-100 px-4 py-3 rounded-xl border border-gray-200 text-gray-900 mb-4"
                                    value={selectedItem.status_po}
                                    editable={false}
                                />
                            </View>

                            <View>
                                <Text className="text-sm font-bold text-gray-700 mb-2">Notes</Text>
                                <TextInput
                                    className="bg-gray-100 p-4 rounded-xl border border-gray-200 text-gray-900 h-24 mb-4"
                                    value={selectedItem.notes || '-'}
                                    editable={false}
                                    multiline
                                    textAlignVertical="top"
                                />
                            </View>
                        </View>
                    </View>

                    {/* TABS AND TAB CONTENT */}
                    <View className="flex-row bg-white border-t border-gray-100 px-2 pt-2">
                        <TouchableOpacity
                            onPress={() => setActiveTab('po')}
                            className={`flex-1 py-3 items-center border-b-2`}
                            style={{ borderColor: activeTab === 'po' ? theme.colors.primary : 'transparent' }}
                        >
                            <Text className="font-bold" style={{ color: activeTab === 'po' ? theme.colors.primary : '#9ca3af' }}>Purchase Order</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setActiveTab('incoming')}
                            className={`flex-1 py-3 items-center border-b-2`}
                            style={{ borderColor: activeTab === 'incoming' ? theme.colors.primary : 'transparent' }}
                        >
                            <Text className="font-bold text-center" style={{ color: activeTab === 'incoming' ? theme.colors.primary : '#9ca3af' }}>Incoming Shipment & Invoice</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                {/* Tab Content Rendering */}
                {activeTab === 'po' && (
                    <Animated.View entering={FadeInUp.delay(100).duration(400)} className="pb-6">
                        <View className="px-4 py-3 flex-row justify-between items-center border-b border-gray-50 mb-2">
                            <Text className="font-bold text-gray-800">Daftar Barang</Text>
                            <TouchableOpacity
                                onPress={handleAddProduct}
                                className="px-3 py-1.5 rounded-lg flex-row items-center"
                                style={{ backgroundColor: theme.colors.primaryContainer }}
                            >
                                <Plus size={16} color={theme.colors.primary} className="mr-1" />
                                <Text className="text-xs font-bold" style={{ color: theme.colors.primary }}>Tambah Barang</Text>
                            </TouchableOpacity>
                        </View>
                        <PurchaseOrderTable
                            details={poDetails}
                            onEditProduct={handleEditProduct}
                        />
                    </Animated.View>
                )}

                {activeTab === 'incoming' && (
                    <Animated.View entering={FadeInUp.delay(100).duration(400)} className="pb-6">
                        <IncshipmentInvoiceTable details={[]} />
                    </Animated.View>
                )}

                <Animated.View entering={FadeInUp.delay(100)} className="mb-8">
                    <Button
                        onPress={handleSave}
                        className="w-full h-14 rounded-2xl flex-row items-center justify-center"
                        style={{ elevation: 4, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                    >
                        <Save color="white" size={20} className="mr-2" />
                        <Text className="text-white font-bold text-lg">Simpan</Text>
                    </Button>
                </Animated.View>
            </ScrollView>

            <PurchaseOrderModal
                visible={modalVisible}
                onDismiss={() => setModalVisible(false)}
                onSave={handleSaveProduct}
                onDelete={selectedDetail ? handleDeleteProduct : undefined}
                productsList={DUMMY_PRODUCTS}
                initialData={selectedDetail}
            />
        </View>
    );
}
