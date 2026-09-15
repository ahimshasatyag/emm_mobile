import React, { useEffect, useState, useCallback, useMemo } from 'react';
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
import { parseISO } from 'date-fns';
import { formatDate, formatDateServer } from '../../../utils/helpers/date';

export function QuotationsAPEditScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { id } = route.params;

    const {
        validateForm, supportData, getMataUangDefault,
        update, confirm, cancel, selectedItem, isLoadingDetail, error, loadDetail, clearSelection, isSaving
    } = useQuotationsAP();

    const [activeTab, setActiveTab] = useState<'po' | 'incoming'>('po');

    // Support Data states
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [warehouses, setWarehouses] = useState<any[]>([]);
    const [currencies, setCurrencies] = useState<any[]>([]);
    const [locations, setLocations] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);

    // Form states
    const [supplier, setSupplier] = useState<string | null>(null);
    const [supplierName, setSupplierName] = useState<string>('');
    const [supplierRef, setSupplierRef] = useState('');
    const [currency, setCurrency] = useState<string | null>(null);
    const [warehouse, setWarehouse] = useState<string | null>(null);
    const [orderDate, setOrderDate] = useState<Date>(new Date());
    const [showOrderDatePicker, setShowOrderDatePicker] = useState(false);
    const [notes, setNotes] = useState('');

    // Incoming Shipment states
    const [incDestination, setIncDestination] = useState<string | null>(null);
    const [expectedDate, setExpectedDate] = useState<Date>(new Date());

    // Modal state for Confirm/Cancel PO
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

    const loadSupport = useCallback(async () => {
        try {
            const res = await supportData();
            if (res?.status) {
                setSuppliers(res.data_supplier?.map((s: any) => ({ label: s.nm_suppliers, value: s.id_suppliers, data: s })) || []);
                setWarehouses(res.data_gudang?.map((g: any) => ({ label: g.nm_gudang, value: g.id_gudang })) || []);
                setCurrencies(res.mata_uangs?.map((m: any) => ({ label: m.name, value: m.id_mata_uang })) || []);
                setLocations(res.data_lokasi?.map((l: any) => ({ label: l.complete_name || l.nm_product_lokasi, value: l.id_product_lokasi })) || []);
                setProducts(res.data_product || []);
            }
        } catch (error: any) {
            setToast({ visible: true, type: 'error', message: 'Gagal memuat data pendukung' });
        }
    }, [supportData]);

    useEffect(() => {
        loadSupport();
    }, [loadSupport]);

    useEffect(() => {
        if (id) {
            loadDetail(id);
        }
        return () => {
            clearSelection();
        };
    }, [id, loadDetail, clearSelection]);

    useEffect(() => {
        if (route.params?.toast) {
            setToast(route.params.toast);
            navigation.setParams({ toast: undefined });
        }
    }, [route.params?.toast, navigation]);

    const displayItem = useMemo(() => selectedItem, [selectedItem]);
    const isLoading = isLoadingDetail || !displayItem;

    // Load initial details when displayItem is loaded
    useEffect(() => {
        if (displayItem) {
            setSupplier(displayItem.id_suppliers || null);
            setSupplierName(displayItem.nm_suppliers || '');
            setSupplierRef(displayItem.partner_ref || '');
            setCurrency(displayItem.mata_uang || null);
            setWarehouse(displayItem.id_gudang || null);
            setNotes(displayItem.notes || '');
            setIncDestination(displayItem.id_product_lokasi || null);

            if (displayItem.date_po) {
                const parsedDate = parseISO(displayItem.date_po);
                if (!isNaN(parsedDate.getTime())) setOrderDate(parsedDate);
            }
            if (displayItem.date_schdl) {
                const parsedDate = parseISO(displayItem.date_schdl);
                if (!isNaN(parsedDate.getTime())) setExpectedDate(parsedDate);
            }
            if (displayItem.details) {
                setPoDetails(displayItem.details.map((d: any) => ({
                    ...d,
                    qty: d.nqty,
                })));
            }
        }
    }, [displayItem]);

    const handleSupplierChange = async (item: any) => {
        setSupplier(item.value);
        setSupplierName(item.label);
        try {
            const res = await getMataUangDefault(item.value);
            if (res?.status && res.data?.id_mata_uang) {
                setCurrency(res.data.id_mata_uang);
            }
        } catch (e) { }
    };

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

    const handleSave = async () => {
        const errorMsg = validateForm({
            id_suppliers: supplier,
            id_gudang: warehouse,
            date_po: orderDate
        }, poDetails.length);

        if (errorMsg) {
            setToast({ visible: true, type: 'error', message: errorMsg });
            return;
        }

        const formData = new FormData();
        formData.append('_method', 'PUT'); // For Laravel
        formData.append('date_po', formatDateServer(orderDate));
        formData.append('date_schdl', formatDateServer(expectedDate));
        formData.append('id_suppliers', supplier || '');
        formData.append('nm_suppliers', supplierName);
        formData.append('id_gudang', warehouse || '');
        formData.append('mata_uang', currency || '');
        formData.append('partner_ref', supplierRef);
        formData.append('notes', notes);
        formData.append('id_product_lokasi', incDestination || '');
        formData.append('jml', poDetails.length.toString());

        poDetails.forEach((detail, index) => {
            const i = index + 1;
            formData.append(`id_product${i}`, detail.id_product);
            formData.append(`code_product${i}`, detail.code_product || '');
            formData.append(`nm_product${i}`, detail.nm_product || '');
            formData.append(`product_deskripsi${i}`, detail.product_deskripsi || '');
            formData.append(`notes${i}`, detail.notes || '');
            formData.append(`product_price${i}`, detail.product_price?.toString() || '0');
            formData.append(`nqty${i}`, detail.qty?.toString() || '1');

            if (detail.options && Array.isArray(detail.options)) {
                detail.options.filter((o: any) => o.selected !== false).forEach((opt: any) => {
                    formData.append(`options${i}[]`, detail.id_product);
                    formData.append(`nm_product_opt${i}[]`, opt.nm_product_opt);
                    formData.append(`harga${i}[]`, opt.harga);
                });
            }
        });

        try {
            const res = await update(id, formData, displayItem?.code_po);
            setIsEditMode(false);
            setToast({ visible: true, type: 'success', message: res?.message || 'Quotation AP berhasil diperbarui' });
            loadDetail(id); // Reload to get fresh data
        } catch (error: any) {
            setToast({ visible: true, type: 'error', message: error || 'Gagal memperbarui Quotation AP' });
        }
    };

    const confirmPO = async () => {
        setIsConfirmPOVisible(false);
        try {
            const res = await confirm(id, displayItem?.code_po);
            setToast({ visible: true, type: 'success', message: res?.message || 'PO berhasil dikonfirmasi!' });
            loadDetail(id);
        } catch (error: any) {
            setToast({ visible: true, type: 'error', message: error || 'Gagal mengkonfirmasi PO' });
        }
    };

    const cancelPO = async () => {
        setIsCancelPOVisible(false);
        try {
            const res = await cancel(id, displayItem?.code_po);
            setToast({ visible: true, type: 'success', message: res?.message || 'PO telah dibatalkan!' });
            loadDetail(id);
        } catch (error: any) {
            setToast({ visible: true, type: 'error', message: error || 'Gagal membatalkan PO' });
        }
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
                confirmText={isSaving ? "Memproses..." : "Ya, Confirm"}
                cancelText="Batal"
                onConfirm={confirmPO}
                onCancel={() => !isSaving && setIsConfirmPOVisible(false)}
            />

            <ModalCancel
                visible={isCancelPOVisible}
                title="Batalkan PO"
                message="Apakah Anda yakin ingin membatalkan PO ini?"
                confirmText={isSaving ? "Memproses..." : "Ya, Batalkan!"}
                cancelText="Kembali"
                onConfirm={cancelPO}
                onCancel={() => !isSaving && setIsCancelPOVisible(false)}
            />
            <HeaderNavigator
                title={isLoading ? "MEMUAT DATA..." : isEditMode ? `EDIT QUOTATION AP` : `DETAIL QUOTATION AP`}
                showBackButton
                onBackPress={() => navigation.goBack()}
            />

            <ScrollView
                className="flex-1 px-4 pt-4"
                refreshControl={
                    <RefreshControl refreshing={isLoadingDetail} onRefresh={() => id && loadDetail(id)} colors={[theme.colors.primary]} />
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
                                <View className="flex-row justify-between items-center mb-1 pb-3 border-b border-gray-100">
                                    <View>
                                        <Text className="text-lg font-bold text-gray-900">{displayItem?.code_po}</Text>
                                    </View>
                                    <View className="items-end">
                                        <View className={`px-3 py-1 rounded-full border ${displayItem?.status_po === 'QUOTATION' ? 'bg-green-50 border-green-200' : displayItem?.status_po === 'DRAFT' ? 'bg-yellow-50 border-yellow-200' : displayItem?.status_po === 'CANCEL' ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
                                            <Text className={`text-xs font-bold ${displayItem?.status_po === 'QUOTATION' ? 'text-green-700' : displayItem?.status_po === 'DRAFT' ? 'text-yellow-700' : displayItem?.status_po === 'CANCEL' ? 'text-red-700' : 'text-gray-700'}`}>
                                                {displayItem?.status_po}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <View className="space-y-4">
                                    <View>
                                        <Text className="text-sm font-bold text-gray-700 mb-2">Supplier <Text className="text-red-500">*</Text></Text>
                                        <View className={`border rounded-xl mb-4 ${isEditMode ? 'bg-white border-gray-200' : 'bg-gray-100 border-gray-200'}`}>
                                            <Dropdown
                                                style={{ height: 48, paddingHorizontal: 16 }}
                                                data={suppliers}
                                                labelField="label"
                                                valueField="value"
                                                search
                                                searchPlaceholder="Cari supplier..."
                                                placeholder={displayItem?.nm_suppliers || "Pilih Supplier"}
                                                value={supplier}
                                                onChange={handleSupplierChange}
                                                disable={!isEditMode}
                                            />
                                        </View>
                                    </View>

                                    <View>
                                        <Text className="text-sm font-bold text-gray-700 mb-2">Supplier Reference</Text>
                                        <TextInput
                                            className={`px-4 py-3 rounded-xl border mb-4 ${isEditMode ? 'bg-white border-gray-200 text-gray-900' : 'bg-gray-100 border-gray-200 text-gray-500'}`}
                                            value={supplierRef}
                                            onChangeText={setSupplierRef}
                                            editable={isEditMode}
                                            placeholder="Masukkan referensi supplier..."
                                        />
                                    </View>

                                    <View>
                                        <Text className="text-sm font-bold text-gray-700 mb-2">Mata Uang <Text className="text-red-500">*</Text></Text>
                                        <View className={`border rounded-xl mb-4 ${isEditMode ? 'bg-white border-gray-200' : 'bg-gray-100 border-gray-200'}`}>
                                            <Dropdown
                                                style={{ height: 48, paddingHorizontal: 16 }}
                                                data={currencies}
                                                labelField="label"
                                                valueField="value"
                                                search
                                                searchPlaceholder="Cari mata uang..."
                                                placeholder="Pilih Mata Uang"
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
                                            className={`px-4 py-3 rounded-xl border border-gray-200 mb-4 flex-row justify-between items-center ${isEditMode ? 'bg-white' : 'bg-gray-100'}`}
                                        >
                                            <View className="flex-row items-center">
                                                <Calendar size={16} color="#9ca3af" className="mr-2" />
                                                <Text className={isEditMode ? 'text-gray-900' : 'text-gray-500'}>
                                                    {formatDate(orderDate)}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                        {showOrderDatePicker && (
                                            <DateTimePicker
                                                value={orderDate}
                                                mode="date"
                                                display="default"
                                                onChange={(event, selectedDate) => {
                                                    setShowOrderDatePicker(false);
                                                    if (selectedDate) setOrderDate(selectedDate);
                                                }}
                                            />
                                        )}
                                    </View>

                                    <View>
                                        <Text className="text-sm font-bold text-gray-700 mb-2">Destination Warehouse <Text className="text-red-500">*</Text></Text>
                                        <View className={`border rounded-xl mb-4 ${isEditMode ? 'bg-white border-gray-200' : 'bg-gray-100 border-gray-200'}`}>
                                            <Dropdown
                                                style={{ height: 48, paddingHorizontal: 16 }}
                                                data={warehouses}
                                                labelField="label"
                                                valueField="value"
                                                search
                                                searchPlaceholder="Cari destination warehouse..."
                                                placeholder="Pilih Gudang"
                                                value={warehouse}
                                                onChange={item => setWarehouse(item.value)}
                                                disable={!isEditMode}
                                            />
                                        </View>
                                    </View>

                                    <View>
                                        <Text className="text-sm font-bold text-gray-700 mb-2">Notes</Text>
                                        <TextInput
                                            className={`p-4 rounded-xl border h-24 mb-4 ${isEditMode ? 'bg-white border-gray-200 text-gray-900' : 'bg-gray-100 border-gray-200 text-gray-500'}`}
                                            value={notes}
                                            onChangeText={setNotes}
                                            editable={isEditMode}
                                            multiline
                                            textAlignVertical="top"
                                            placeholder={isEditMode ? "Masukkan catatan..." : "-"}
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
                                            details={locations}
                                            destination={incDestination}
                                            onDestinationChange={setIncDestination}
                                            expectedDate={expectedDate}
                                            onExpectedDateChange={setExpectedDate}
                                            isEditMode={isEditMode}
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
                                        disabled={isSaving}
                                        className="flex-1 h-14 rounded-xl flex-row items-center justify-center"
                                    >
                                        <X color={theme.colors.primary} size={20} className="mr-2" />
                                        <Text className="font-bold text-lg" style={{ color: theme.colors.primary }}>Batal</Text>
                                    </Button>
                                    <Button
                                        onPress={handleSave}
                                        disabled={isSaving}
                                        className={`flex-1 h-14 rounded-2xl flex-row items-center justify-center ${isSaving ? 'opacity-50' : ''}`}
                                        style={{ elevation: 4, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                                    >
                                        <Save color="white" size={20} className="mr-2" />
                                        <Text className="text-white font-bold text-lg">{isSaving ? 'Menyimpan...' : 'Simpan'}</Text>
                                    </Button>
                                </View>
                            ) : (
                                <View className="mt-2 space-y-3">
                                    {displayItem?.status_po !== 'CONFIRM' && displayItem?.status_po !== 'CANCEL' && (
                                        <Button
                                            onPress={() => setIsEditMode(true)}
                                            className="w-full h-14 rounded-2xl flex-row items-center justify-center bg-[#9e0b0f]"
                                            style={{ elevation: 4, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                                        >
                                            <Pencil color="white" size={20} className="mr-2" />
                                            <Text className="text-white font-bold text-lg">Edit Data</Text>
                                        </Button>
                                    )}

                                    {displayItem?.status_po === 'DRAFT' && (
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
                                    )}
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
                productsList={products}
                initialData={selectedDetail}
                isReadOnly={!isEditMode}
            />
        </View>
    );
}
