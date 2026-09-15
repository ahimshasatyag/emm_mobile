import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, RefreshControl } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { Save, Calendar, Plus } from 'lucide-react-native';
import Animated, { FadeInUp, FadeIn, FadeOut } from 'react-native-reanimated';
import { Button } from '../../../components/ui/button';
import { theme } from '../../../theme/theme';
import { QuotationsAPFormSkeleton } from '../skeleton/QuotationsAPFormSkeleton';
import { PurchaseOrderTable } from '../components/PurchaseOrderTable';
import { IncshipmentInvoiceTable } from '../components/IncshipmentInvoiceTable';
import { PurchaseOrderModal } from '../components/PurchaseOrderModal';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';
import { useQuotationsAP } from '../hooks/useQuotationsAP';
import { formatDate, formatDateServer } from '../../../utils/helpers/date';

export function QuotationsAPFormScreen() {
    const navigation = useNavigation<any>();
    const { validateForm, supportData, getMataUangDefault, create, isSaving } = useQuotationsAP();
    
    const [activeTab, setActiveTab] = useState<'po' | 'incoming'>('po');
    const [poDetails, setPoDetails] = useState<any[]>([]);

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

    const [toast, setToast] = useState<{ visible: boolean; message: string; type: ToastType; title?: string }>({
        visible: false,
        message: '',
        type: 'error'
    });

    const [isConfirmVisible, setIsConfirmVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDetail, setSelectedDetail] = useState<any>(null);

    const loadSupportData = useCallback(async () => {
        setIsLoading(true);
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
        } finally {
            setIsLoading(false);
        }
    }, [supportData]);

    useEffect(() => {
        loadSupportData();
    }, [loadSupportData]);

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

    const handleSave = () => {
        const errorMsg = validateForm({
            id_suppliers: supplier,
            id_gudang: warehouse,
            date_po: orderDate
        }, poDetails.length);

        if (errorMsg) {
            setToast({ visible: true, type: 'error', message: errorMsg });
            return;
        }

        setIsConfirmVisible(true);
    };

    const confirmSave = async () => {
        setIsConfirmVisible(false);
        
        const formData = new FormData();
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
            const res = await create(formData);
            navigation.replace('QuotationsAPListScreen', {
                timestamp: Date.now(),
                showToast: true,
                toastMessage: res?.message || 'Quotation AP berhasil dibuat!',
                toastType: 'success'
            });
        } catch (error: any) {
            setToast({ visible: true, type: 'error', message: error || 'Gagal menyimpan Quotation AP' });
        }
    };

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
                visible={isConfirmVisible}
                title="Konfirmasi Simpan"
                message="Apakah Anda yakin ingin menyimpan Quotation AP ini?"
                confirmText={isSaving ? "Menyimpan..." : "Ya, Simpan"}
                cancelText="Batal"
                onConfirm={confirmSave}
                onCancel={() => !isSaving && setIsConfirmVisible(false)}
            />
            <HeaderNavigator
                title={isLoading ? "MEMUAT DATA..." : "TAMBAH QUOTATION AP"}
                showBackButton
                onBackPress={() => navigation.goBack()}
            />

            <ScrollView
                className="flex-1 px-4 pt-4"
                refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadSupportData} colors={[theme.colors.primary]} />}
            >
                {isLoading ? (
                    <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>
                        <QuotationsAPFormSkeleton />
                    </Animated.View>
                ) : (
                    <Animated.View key="content" entering={FadeIn.duration(600)}>
                        <Animated.View entering={FadeInUp.duration(400)} className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
                            <View className="p-4 space-y-4">
                                <View>
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Supplier <Text className="text-red-500">*</Text></Text>
                                    <View className="border border-gray-200 rounded-xl bg-gray-50 mb-4">
                                        <Dropdown
                                            style={{ height: 48, paddingHorizontal: 16 }}
                                            data={suppliers}
                                            labelField="label"
                                            valueField="value"
                                            search
                                            searchPlaceholder="Cari supplier..."
                                            placeholder="Pilih Supplier"
                                            value={supplier}
                                            onChange={handleSupplierChange}
                                        />
                                    </View>
                                </View>

                                <View>
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Supplier Reference</Text>
                                    <TextInput
                                        className="bg-white px-4 py-3 rounded-xl border border-gray-200 text-gray-900 mb-4"
                                        placeholder="Masukkan referensi supplier..."
                                        placeholderTextColor="#9CA3AF"
                                        value={supplierRef}
                                        onChangeText={setSupplierRef}
                                    />
                                </View>

                                <View>
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Mata Uang <Text className="text-red-500">*</Text></Text>
                                    <View className="border border-gray-200 rounded-xl bg-gray-50 mb-4">
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
                                        />
                                    </View>
                                </View>

                                <View>
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Order Date <Text className="text-red-500">*</Text></Text>
                                    <TouchableOpacity
                                        onPress={() => setShowOrderDatePicker(true)}
                                        className="bg-gray-100 px-4 py-3 rounded-xl border border-gray-200 mb-4 flex-row justify-between items-center"
                                    >
                                        <Text className="text-gray-700">{formatDate(orderDate)}</Text>
                                        <Calendar size={20} color="#9CA3AF" />
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
                                    <View className="border border-gray-200 rounded-xl bg-gray-50 mb-4">
                                        <Dropdown
                                            style={{ height: 48, paddingHorizontal: 16 }}
                                            data={warehouses}
                                            labelField="label"
                                            valueField="value"
                                            search
                                            searchPlaceholder="Cari destination warehouse..."
                                            placeholder="Pilih Destination Warehouse"
                                            value={warehouse}
                                            onChange={item => setWarehouse(item.value)}
                                        />
                                    </View>
                                </View>

                                <View>
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Notes</Text>
                                    <TextInput
                                        className="bg-gray-100 p-4 rounded-xl border border-gray-200 text-gray-900 h-24 mb-4"
                                        placeholder="Masukkan catatan..."
                                        placeholderTextColor="#9CA3AF"
                                        multiline
                                        textAlignVertical="top"
                                        value={notes}
                                        onChangeText={setNotes}
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
                                    <IncshipmentInvoiceTable
                                        details={locations}
                                        destination={incDestination}
                                        onDestinationChange={setIncDestination}
                                        expectedDate={expectedDate}
                                        onExpectedDateChange={setExpectedDate}
                                    />
                                )}
                            </View>
                        </Animated.View>

                        <Animated.View entering={FadeInUp.delay(100)} className="mb-8">
                            <Button
                                onPress={handleSave}
                                disabled={isSaving}
                                className={`w-full h-14 rounded-2xl flex-row items-center justify-center ${isSaving ? 'opacity-50' : ''}`}
                                style={{ elevation: 4, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                            >
                                <Save color="white" size={20} className="mr-2" />
                                <Text className="text-white font-bold text-lg">{isSaving ? 'Menyimpan...' : 'Simpan'}</Text>
                            </Button>
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
            />
        </View>
    );
}
