import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { FileText, Save, X, ChevronDown, Calendar, Plus } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Button } from '../../../components/ui/button';
import { theme } from '../../../theme/theme';
import { PurchaseOrderTable } from '../components/PurchaseOrderTable';
import { IncshipmentInvoiceTable } from '../components/IncshipmentInvoiceTable';
import { PurchaseOrderModal } from '../components/PurchaseOrderModal';

// Dummy data for products
const DUMMY_PRODUCTS = [
    { id_product: 'P001', code_product: 'BRG-001', nm_product: 'Laptop Asus ROG', deskripsi: 'Laptop Gaming Asus ROG Strix', satuan: 'Unit', price: 15000000 },
    { id_product: 'P002', code_product: 'BRG-002', nm_product: 'Mouse Logitech MX Master', deskripsi: 'Mouse Wireless Premium', satuan: 'Pcs', price: 1500000 },
    { id_product: 'P003', code_product: 'BRG-003', nm_product: 'Keyboard Keychron K2', deskripsi: 'Mechanical Keyboard 84 keys', satuan: 'Pcs', price: 1200000 },
];

export function QuotationsAPFormScreen() {
    const navigation = useNavigation<any>();
    const [activeTab, setActiveTab] = useState<'po' | 'incoming'>('po');
    const [poDetails, setPoDetails] = useState<any[]>([]);

    // Modal states
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDetail, setSelectedDetail] = useState<any>(null);

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
            // Edit mode (not implemented yet in this basic example, just push to list for now)
            const newDetails = [...poDetails];
            const index = poDetails.findIndex(p => p.id_product === product.id_product);
            if (index >= 0) newDetails[index] = product;
            else newDetails.push(product);
            setPoDetails(newDetails);
        } else {
            // Add mode
            setPoDetails([...poDetails, product]);
        }
    };

    const handleSave = () => {
        // Implementasi save nanti
        navigation.goBack();
    };

    const handleCancel = () => {
        navigation.goBack();
    };

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator title="TAMBAH QUOTATION AP" />

            <ScrollView className="flex-1 px-4 pt-4">
                <Animated.View entering={FadeInUp.duration(400)} className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
                    <View className="p-4 space-y-4">
                        <View>
                            <Text className="text-sm font-bold text-gray-700 mb-2">Supplier <Text className="text-red-500">*</Text></Text>
                            <TouchableOpacity className="bg-gray-100 px-4 py-3 rounded-xl border border-gray-200 mb-4 flex-row justify-between items-center">
                                <Text className="text-gray-500">Pilih Supplier...</Text>
                                <ChevronDown size={20} color="#9CA3AF" />
                            </TouchableOpacity>
                        </View>

                        <View>
                            <Text className="text-sm font-bold text-gray-700 mb-2">Supplier Reference <Text className="text-red-500">*</Text></Text>
                            <TextInput
                                className="bg-gray-100 px-4 py-3 rounded-xl border border-gray-200 text-gray-900 mb-4"
                                placeholder="Masukkan referensi supplier..."
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>

                        <View>
                            <Text className="text-sm font-bold text-gray-700 mb-2">Mata Uang <Text className="text-red-500">*</Text></Text>
                            <TouchableOpacity className="bg-gray-100 px-4 py-3 rounded-xl border border-gray-200 mb-4 flex-row justify-between items-center">
                                <Text className="text-gray-500">Pilih Mata Uang...</Text>
                                <ChevronDown size={20} color="#9CA3AF" />
                            </TouchableOpacity>
                        </View>

                        <View>
                            <Text className="text-sm font-bold text-gray-700 mb-2">Order Date <Text className="text-red-500">*</Text></Text>
                            <TouchableOpacity className="bg-gray-100 px-4 py-3 rounded-xl border border-gray-200 mb-4 flex-row justify-between items-center">
                                <Text className="text-gray-500">Pilih Tanggal...</Text>
                                <Calendar size={20} color="#9CA3AF" />
                            </TouchableOpacity>
                        </View>

                        <View>
                            <Text className="text-sm font-bold text-gray-700 mb-2">Destination Warehouse <Text className="text-red-500">*</Text></Text>
                            <TouchableOpacity className="bg-gray-100 px-4 py-3 rounded-xl border border-gray-200 mb-4 flex-row justify-between items-center">
                                <Text className="text-gray-500">Pilih Destination Warehouse...</Text>
                                <ChevronDown size={20} color="#9CA3AF" />
                            </TouchableOpacity>
                        </View>

                        <View>
                            <Text className="text-sm font-bold text-gray-700 mb-2">Notes</Text>
                            <TextInput
                                className="bg-gray-100 p-4 rounded-xl border border-gray-200 text-gray-900 h-24 mb-4"
                                placeholder="Masukkan catatan..."
                                placeholderTextColor="#9CA3AF"
                                multiline
                                textAlignVertical="top"
                            />
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

                    <View className="bg-white rounded-b-2xl min-h-[150px] pb-4">
                        {activeTab === 'po' && (
                            <View>
                                <View className="px-4 py-3 flex-row justify-between items-center border-b border-gray-50">
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
                            </View>
                        )}
                        {activeTab === 'incoming' && (
                            <IncshipmentInvoiceTable details={[]} />
                        )}
                    </View>

                </Animated.View>

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
