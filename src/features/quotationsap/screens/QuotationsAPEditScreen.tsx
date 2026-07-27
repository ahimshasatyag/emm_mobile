import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, RefreshControl } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { Save, X, Pencil, Calendar, Plus, CheckCircle, XCircle } from 'lucide-react-native';
import Animated, { FadeInUp, FadeIn, FadeOut } from 'react-native-reanimated';
import { Button } from '../../../components/ui/button';
import { theme } from '../../../theme/theme';
import { useQuotationsAP } from '../hooks/useQuotationsAP';
import { QuotationsAPEditSkeleton } from '../skeleton/QuotationsAPEditSkeleton';
import { ErrorState } from '../../../components/shared/ErrorState';
import { PurchaseOrderTable } from '../components/PurchaseOrderTable';
import { IncshipmentInvoiceTable } from '../components/IncshipmentInvoiceTable';
import { PurchaseOrderModal } from '../components/PurchaseOrderModal';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';
import { ModalCancel } from '../../../components/ui/ModalCancel';

const DUMMY_PRODUCTS = [
    { id_product: 'P001', code_product: 'BRG-001', nm_product: 'Laptop Asus ROG', deskripsi: 'Laptop Gaming Asus ROG Strix', satuan: 'Unit', price: 15000000 },
    { id_product: 'P002', code_product: 'BRG-002', nm_product: 'Mouse Logitech MX Master', deskripsi: 'Mouse Wireless Premium', satuan: 'Pcs', price: 1500000 },
    { id_product: 'P003', code_product: 'BRG-003', nm_product: 'Keyboard Keychron K2', deskripsi: 'Mechanical Keyboard 84 keys', satuan: 'Pcs', price: 1200000 },
];

const DUMMY_SUPPLIERS = [
    { label: 'PT Supplier A', value: 'S001' },
    { label: 'CV Supplier B', value: 'S002' },
];

const DUMMY_CURRENCIES = [
    { label: 'IDR - Rupiah', value: 'IDR' },
    { label: 'USD - US Dollar', value: 'USD' },
];

const DUMMY_WAREHOUSES = [
    { label: 'Gudang Utama', value: 'W001' },
    { label: 'Gudang Cabang', value: 'W002' },
];

export function QuotationsAPEditScreen() {
    const navigation = useNavigation<any>();
    const { validateForm } = useQuotationsAP();
    const route = useRoute<any>();
    const { id } = route.params;
    const [activeTab, setActiveTab] = useState<'po' | 'incoming'>('po');

    // Form states
    const [supplier, setSupplier] = useState<string | null>(null);
    const [supplierRef, setSupplierRef] = useState('');
    const [currency, setCurrency] = useState<string | null>(null);
    const [warehouse, setWarehouse] = useState<string | null>(null);
    const [orderDate, setOrderDate] = useState<Date>(new Date());
    const [showOrderDatePicker, setShowOrderDatePicker] = useState(false);

    // Incoming Shipment states
    const [incDestination, setIncDestination] = useState<string | null>(null);
    const [expectedDate, setExpectedDate] = useState<Date>(new Date());

    // Modal state for Confirm PO
    const [isConfirmPOVisible, setIsConfirmPOVisible] = useState(false);
    const [isCancelPOVisible, setIsCancelPOVisible] = useState(false);

    const [toast, setToast] = useState<{ visible: boolean; message: string; type: ToastType; title?: string }>({
        visible: false,
        message: '',
        type: 'error'
    });

    const [isEditMode, setIsEditMode] = useState(false);

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
        if (id !== 'NEW-QAP-001') {
            loadDetail(id);
        }
        return () => {
            clearSelection();
        };
    }, [id, loadDetail, clearSelection]);

    useEffect(() => {
        if (route.params?.toast) {
            setToast(route.params.toast);
        }
    }, [route.params?.toast]);

    const isDummy = id === 'NEW-QAP-001';
    const displayItem = React.useMemo(() => {
        return isDummy ? {
            id_po: 'NEW-QAP-001',
            code_po: 'QAP-NEW',
            nm_supplier: 'Data Baru (Draft)',
            status: 'Draft',
            date_po: new Date().toISOString(),
            details: []
        } as any : selectedItem;
    }, [isDummy, selectedItem]);

    const isLoading = isLoadingDetail || (!displayItem && !isDummy);

    // Load initial details when displayItem is loaded
    useEffect(() => {
        if (displayItem?.details) {
            setPoDetails(displayItem.details);
        }
        if (displayItem?.date_po) {
            // attempt to parse if valid, else keep current
            const parsedDate = new Date(displayItem.date_po);
            if (!isNaN(parsedDate.getTime())) {
                setOrderDate(parsedDate);
            }
        }
    }, [displayItem]);

    const handleSave = () => {
        const errorMsg = validateForm({
            supplier, supplierRef, currency, warehouse, orderDate, expectedDate, incDestination
        });

        if (errorMsg) {
            setToast({ visible: true, type: 'error', message: errorMsg });
            return;
        }

        navigation.goBack();
    };

    const confirmPO = () => {
        setIsConfirmPOVisible(false);
        navigation.replace('PoEditScreen', {
            id: 'NEW-PO-001',
            toast: {
                visible: true,
                type: 'success',
                message: 'PO berhasil dikonfirmasi!'
            }
        });
    };

    const cancelPO = () => {
        setIsCancelPOVisible(false);
        setIsEditMode(false);
        setToast({ visible: true, type: 'success', message: 'PO telah dibatalkan!' });
    };

    if (error && !isLoadingDetail) {
        return (
            <View className="flex-1 bg-gray-50">
                <HeaderNavigator
                    title="EDIT QUOTATION AP"
                    showBackButton
                    onBackPress={() => navigation.goBack()}
                />
                <ErrorState error={error} onRetry={() => loadDetail(id)} />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50">
            <ToastMessages
                visible={toast.visible}
                title={toast.title || (toast.type === 'error' ? 'Validasi' : 'Sukses')}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(prev => ({ ...prev, visible: false }))}
            />

            <ModalConfirm
                visible={isConfirmPOVisible}
                title="Konfirmasi"
                message="Apakah Anda yakin ingin mengkonfirmasi PO ini?"
                confirmText="Ya, Confirm"
                cancelText="Batal"
                onConfirm={confirmPO}
                onCancel={() => setIsConfirmPOVisible(false)}
            />

            <ModalCancel
                visible={isCancelPOVisible}
                title="Batalkan PO"
                message="Apakah Anda yakin ingin membatalkan PO ini?"
                confirmText="Ya, Batalkan!"
                cancelText="Kembali"
                onConfirm={cancelPO}
                onCancel={() => setIsCancelPOVisible(false)}
            />
            <HeaderNavigator
                title={isLoading ? "MEMUAT DATA..." : isEditMode ? `EDIT ${displayItem?.code_po}` : `DETAIL ${displayItem?.code_po}`}
                showBackButton
                onBackPress={() => navigation.goBack()}
            />

            <ScrollView
                className="flex-1 px-4 pt-4"
                refreshControl={
                    <RefreshControl refreshing={isLoadingDetail} onRefresh={() => id && !isDummy && loadDetail(id)} colors={[theme.colors.primary]} />
                }
            >
                {isLoading ? (
                    <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>
                        <QuotationsAPEditSkeleton />
                    </Animated.View>
                ) : (
                    <Animated.View key="content" entering={FadeIn.duration(600)}>
                        <Animated.View entering={FadeInUp.duration(400)} className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
                            <View className="p-4 space-y-4">
                                <View className="space-y-4">
                                    <View>
                                        <Text className="text-sm font-bold text-gray-700 mb-2">Supplier <Text className="text-red-500">*</Text></Text>
                                        <View className="border border-gray-200 rounded-xl bg-gray-50 mb-4">
                                            <Dropdown
                                                style={{ height: 48, paddingHorizontal: 16 }}
                                                data={DUMMY_SUPPLIERS}
                                                labelField="label"
                                                valueField="value"
                                                search
                                                searchPlaceholder="Cari supplier..."
                                                placeholder={displayItem.nm_suppliers || "Pilih Supplier"}
                                                value={supplier}
                                                onChange={item => setSupplier(item.value)}
                                                disable={!isEditMode}
                                            />
                                        </View>
                                    </View>

                                    <View>
                                        <Text className="text-sm font-bold text-gray-700 mb-2">Supplier Reference <Text className="text-red-500">*</Text></Text>
                                        <TextInput
                                            className={`px-4 py-3 rounded-xl border mb-4 ${isEditMode ? 'bg-white border-gray-200 text-gray-900' : 'bg-gray-100 border-gray-200 text-gray-500'}`}
                                            value={isEditMode ? supplierRef : "REF-12345"}
                                            onChangeText={setSupplierRef}
                                            editable={isEditMode}
                                            placeholder="Masukkan referensi supplier..."
                                        />
                                    </View>

                                    <View>
                                        <Text className="text-sm font-bold text-gray-700 mb-2">Mata Uang <Text className="text-red-500">*</Text></Text>
                                        <View className="border border-gray-200 rounded-xl bg-gray-50 mb-4">
                                            <Dropdown
                                                style={{ height: 48, paddingHorizontal: 16 }}
                                                data={DUMMY_CURRENCIES}
                                                labelField="label"
                                                valueField="value"
                                                search
                                                searchPlaceholder="Cari mata uang..."
                                                placeholder="IDR"
                                                value={currency}
                                                onChange={item => setCurrency(item.value)}
                                                disable={!isEditMode}
                                            />
                                        </View>
                                    </View>

                                    <View>
                                        <Text className="text-sm font-bold text-gray-700 mb-2">Order Date <Text className="text-red-500">*</Text></Text>
                                        <TouchableOpacity
                                            onPress={() => isEditMode && setShowOrderDatePicker(true)}
                                            className={`px-4 py-3 rounded-xl border border-gray-200 mb-4 flex-row justify-between items-center ${isEditMode ? 'bg-gray-50' : 'bg-gray-100'}`}
                                        >
                                            <Text className="text-gray-900">
                                                {orderDate.toISOString().split('T')[0]}
                                            </Text>
                                            <Calendar size={20} color="#9CA3AF" />
                                        </TouchableOpacity>
                                        {showOrderDatePicker && (
                                            <DateTimePicker
                                                value={orderDate}
                                                mode="date"
                                                display="default"
                                                onChange={(event, selectedDate) => {
                                                    setShowOrderDatePicker(false);
                                                    if (selectedDate) {
                                                        setOrderDate(selectedDate);
                                                    }
                                                }}
                                            />
                                        )}
                                    </View>

                                    <View>
                                        <Text className="text-sm font-bold text-gray-700 mb-2">Destination Warehouse <Text className="text-red-500">*</Text></Text>
                                        <View className="border border-gray-200 rounded-xl bg-gray-50 mb-4">
                                            <Dropdown
                                                style={{ height: 48, paddingHorizontal: 16 }}
                                                data={DUMMY_WAREHOUSES}
                                                labelField="label"
                                                valueField="value"
                                                search
                                                searchPlaceholder="Cari destination warehouse..."
                                                placeholder="Gudang Utama"
                                                value={warehouse}
                                                onChange={item => setWarehouse(item.value)}
                                                disable={!isEditMode}
                                            />
                                        </View>
                                    </View>

                                    <View>
                                        <Text className="text-sm font-bold text-gray-700 mb-2">Notes</Text>
                                        <TextInput
                                            className={`p-4 rounded-xl border h-24 mb-4 ${isEditMode ? 'bg-gray-50 border-gray-200 text-gray-900' : 'bg-gray-100 border-gray-200 text-gray-500'}`}
                                            value={displayItem.notes || '-'}
                                            editable={isEditMode}
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

                            <View className="bg-white rounded-b-2xl min-h-[150px] pb-4">
                                {activeTab === 'po' && (
                                    <View>
                                        <View className="px-4 py-3 flex-row justify-between items-center border-b border-gray-50 mb-2">
                                            <Text className="font-bold text-gray-800">Daftar Barang</Text>
                                            {isEditMode && (
                                                <TouchableOpacity
                                                    onPress={handleAddProduct}
                                                    className="px-3 py-1.5 rounded-lg flex-row items-center"
                                                    style={{ backgroundColor: theme.colors.primaryContainer }}
                                                >
                                                    <Plus size={16} color={theme.colors.primary} className="mr-1" />
                                                    <Text className="text-xs font-bold" style={{ color: theme.colors.primary }}>Tambah Barang</Text>
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                        <PurchaseOrderTable
                                            details={poDetails}
                                            onEditProduct={handleEditProduct}
                                        />
                                    </View>
                                )}

                                {activeTab === 'incoming' && (
                                    <View>
                                        <IncshipmentInvoiceTable
                                            details={[]}
                                            destination={incDestination}
                                            onDestinationChange={setIncDestination}
                                            expectedDate={expectedDate}
                                            onExpectedDateChange={setExpectedDate}
                                        />
                                    </View>
                                )}
                            </View>
                        </Animated.View>

                        <Animated.View entering={FadeInUp.delay(100)} className="mb-8">
                            {isEditMode ? (
                                <View className="flex-row gap-4">
                                    <Button
                                        variant="outline"
                                        onPress={() => setIsEditMode(false)}
                                        className="flex-1 h-14 rounded-xl flex-row items-center justify-center"
                                    >
                                        <X color={theme.colors.primary} size={20} className="mr-2" />
                                        <Text className="font-bold text-lg" style={{ color: theme.colors.primary }}>Batal</Text>
                                    </Button>
                                    <Button
                                        onPress={handleSave}
                                        className="flex-1 h-14 rounded-2xl flex-row items-center justify-center"
                                        style={{ elevation: 4, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                                    >
                                        <Save color="white" size={20} className="mr-2" />
                                        <Text className="text-white font-bold text-lg">Simpan</Text>
                                    </Button>
                                </View>
                            ) : (
                                <View className="mt-2 space-y-3">
                                    <Button
                                        onPress={() => setIsEditMode(true)}
                                        className="w-full h-14 rounded-2xl flex-row items-center justify-center bg-[#9e0b0f]"
                                        style={{ elevation: 4, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                                    >
                                        <Pencil color="white" size={20} className="mr-2" />
                                        <Text className="text-white font-bold text-lg">Edit Data</Text>
                                    </Button>

                                    <View className="flex-row space-x-3 mt-1">
                                        <TouchableOpacity
                                            className="bg-gray-800 flex-1 flex-row justify-center items-center py-3.5 rounded-xl shadow-sm"
                                            activeOpacity={0.8}
                                            onPress={() => setIsConfirmPOVisible(true)}
                                        >
                                            <CheckCircle color="#fff" size={20} />
                                            <Text className="text-white font-bold ml-2 text-sm">Confirm PO</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            className="bg-red-500 flex-1 flex-row justify-center items-center py-3.5 rounded-xl shadow-sm"
                                            activeOpacity={0.8}
                                            onPress={() => setIsCancelPOVisible(true)}
                                        >
                                            <XCircle color="#fff" size={20} />
                                            <Text className="text-white font-bold ml-2 text-sm">Cancel PO</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        </Animated.View>
                    </Animated.View>
                )}
            </ScrollView>

            <PurchaseOrderModal
                visible={modalVisible}
                onDismiss={() => setModalVisible(false)}
                onSave={handleSaveProduct}
                onDelete={selectedDetail ? handleDeleteProduct : undefined}
                productsList={DUMMY_PRODUCTS}
                initialData={selectedDetail}
                isReadOnly={!isEditMode}
            />
        </View>
    );
}
