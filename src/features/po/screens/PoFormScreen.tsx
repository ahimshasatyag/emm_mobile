import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { Save, Calendar, Plus } from 'lucide-react-native';
import Animated, { FadeInUp, FadeIn, FadeOut } from 'react-native-reanimated';
import { theme } from '../../../theme/theme';
import { PoFormSkeleton } from '../skeleton/PoFormSkeleton';
import { PurchaseOrderTable } from '../components/PurchaseOrderTable';
import { IncshipmentInvoiceTable } from '../components/IncshipmentInvoiceTable';
import { usePo } from '../hooks/usePo';
import { formatDate, formatDateServer } from '../../../utils/helpers/date';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';
import { PurchaseOrderModal } from '../components/PurchaseOrderModal';

export function PoFormScreen() {
    const navigation = useNavigation<any>();
    const { validateForm, supportData, getMataUangDefault, create, isSaving } = usePo();

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

    const [activeTab, setActiveTab] = useState<'po' | 'incoming'>('po');
    const [selectedDetail, setSelectedDetail] = useState<any>(null);

    const [toast, setToast] = useState<{ visible: boolean; message: string; type: ToastType; title?: string }>({
        visible: false,
        message: '',
        type: 'success'
    });

    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
    const [isProductModalVisible, setIsProductModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const loadSupportData = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await supportData();
            if (data?.status) {
                setSuppliers(data.data_supplier?.map((s: any) => ({ label: s.nm_suppliers, value: s.id_suppliers })) || []);
                setWarehouses(data.data_gudang?.map((g: any) => ({ label: g.nm_gudang, value: g.id_gudang })) || []);
                setCurrencies(data.mata_uangs?.map((m: any) => ({ label: m.name, value: m.id_mata_uang })) || []);
                setProducts(data.data_product || []);

                // Usually location is the same as warehouse or a specific table, 
                // but PoController's supportData doesn't return m_product_lokasi, we will use warehouses as a fallback if locations are empty
                if (data.data_lokasi) {
                    setLocations(data.data_lokasi.map((l: any) => ({ label: l.nm_product_lokasi, value: l.id_product_lokasi })));
                } else {
                    setLocations(data.data_gudang?.map((g: any) => ({ label: g.nm_gudang, value: g.id_gudang })) || []);
                }
            }
        } catch (error) {
            console.error(error);
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
            if (res?.status && res?.id_mata_uang) {
                setCurrency(res.id_mata_uang);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSaveConfirm = async () => {
        setIsConfirmModalVisible(false);

        try {
            const formData = new FormData();
            formData.append('id_suppliers', supplier || '');
            formData.append('nm_suppliers', supplierName);
            formData.append('id_gudang', warehouse || '');
            formData.append('mata_uang', currency || '');
            formData.append('partner_ref', supplierRef);
            formData.append('notes', notes);

            // Format dates for backend: YYYY-MM-DD
            if (orderDate) formData.append('date_po', formatDateServer(orderDate));
            if (expectedDate) formData.append('date_schdl', formatDateServer(expectedDate));
            if (incDestination) formData.append('id_product_lokasi', incDestination);

            formData.append('jml', poDetails.length.toString());

            poDetails.forEach((detail, index) => {
                const i = index + 1;
                formData.append(`id_product${i}`, detail.id_product);
                formData.append(`code_product${i}`, detail.code_product || '');
                formData.append(`nm_product${i}`, detail.nm_product || '');
                formData.append(`product_deskripsi${i}`, detail.product_deskripsi || '');
                formData.append(`notes${i}`, detail.notes || '');
                formData.append(`product_price${i}`, detail.product_price?.toString() || '0');
                formData.append(`nqty${i}`, detail.qty?.toString() || '0');
            });

            await create(formData);

            setToast({
                visible: true,
                message: "PO Berhasil Dibuat",
                type: 'success',
                title: 'Sukses'
            });

            setTimeout(() => {
                navigation.goBack();
            }, 1500);

        } catch (error: any) {
            setToast({
                visible: true,
                message: error.message || "Gagal menyimpan PO",
                type: 'error',
                title: 'Error'
            });
        }
    };

    const handleSave = () => {
        const validation = validateForm(supplier, warehouse, orderDate, poDetails);
        if (!validation.isValid) {
            setToast({
                visible: true,
                message: validation.message,
                type: 'error',
                title: 'Validasi Gagal'
            });
            return;
        }
        setIsConfirmModalVisible(true);
    };

    const handleSaveProduct = (product: any) => {
        const newDetail = {
            id_po_dtl: selectedDetail?.id_po_dtl || `temp-${Date.now()}`,
            id_po: '',
            id_product: product.id_product,
            code_product: product.code_product,
            nm_product: product.nm_product,
            product_deskripsi: product.product_deskripsi,
            qty: product.qty || 1,
            product_price: product.product_price || 0,
            notes: product.notes || '',
            satuan: product.nm_product_satuan || ''
        };
        
        if (selectedDetail) {
            const newDetails = [...poDetails];
            const index = poDetails.findIndex(p => p.id_po_dtl === selectedDetail.id_po_dtl);
            if (index >= 0) newDetails[index] = newDetail;
            else newDetails.push(newDetail);
            setPoDetails(newDetails);
        } else {
            setPoDetails([...poDetails, newDetail]);
        }
        setIsProductModalVisible(false);
        setSelectedDetail(null);
    };

    const handleRemoveProduct = () => {
        if (selectedDetail) {
            setPoDetails(poDetails.filter(p => p.id_po_dtl !== selectedDetail.id_po_dtl));
            setIsProductModalVisible(false);
            setSelectedDetail(null);
        }
    };

    if (isLoading) {
        return (
            <Animated.View exiting={FadeOut.duration(300)} className="flex-1 bg-gray-50">
                <HeaderNavigator title="TAMBAH PO" showBackButton onBackPress={() => navigation.goBack()} />
                <PoFormSkeleton />
            </Animated.View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator
                title="TAMBAH PO"
                showBackButton
                onBackPress={() => navigation.goBack()}
            />

            <ToastMessages
                visible={toast.visible}
                message={toast.message}
                type={toast.type}
                title={toast.title}
                onHide={() => setToast(prev => ({ ...prev, visible: false }))}
            />

            <ModalConfirm
                visible={isConfirmModalVisible}
                title="Konfirmasi Simpan"
                message="Apakah Anda yakin ingin menyimpan PO ini?"
                confirmText={isSaving ? "Menyimpan..." : "Ya, Simpan"}
                cancelText="Batal"
                onConfirm={handleSaveConfirm}
                onCancel={() => !isSaving && setIsConfirmModalVisible(false)}
            />

            <PurchaseOrderModal
                visible={isProductModalVisible}
                onDismiss={() => {
                    setIsProductModalVisible(false);
                    setSelectedDetail(null);
                }}
                productsList={products}
                onSave={handleSaveProduct}
                onDelete={selectedDetail ? handleRemoveProduct : undefined}
                initialData={selectedDetail}
                isReadOnly={false}
            />

            <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
                <Animated.View entering={FadeInUp.delay(100).duration(400)} className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
                    <View className="p-4 space-y-4">
                        <View className="space-y-4">
                            <View>
                                <Text className="text-sm font-bold text-gray-700 mb-2">Supplier <Text className="text-red-500">*</Text></Text>
                                <View className="border border-gray-200 rounded-xl bg-white mb-4">
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
                                    className="px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 mb-4"
                                    value={supplierRef}
                                    onChangeText={setSupplierRef}
                                    placeholder="Masukkan referensi supplier..."
                                />
                            </View>

                            <View>
                                <Text className="text-sm font-bold text-gray-700 mb-2">Mata Uang <Text className="text-red-500">*</Text></Text>
                                <View className="border border-gray-200 rounded-xl bg-white mb-4">
                                    <Dropdown
                                        style={{ height: 48, paddingHorizontal: 16 }}
                                        data={currencies}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Pilih Mata Uang"
                                        value={currency}
                                        onChange={item => setCurrency(item.value)}
                                    />
                                </View>
                            </View>

                            <View>
                                <Text className="text-sm font-bold text-gray-700 mb-2">Gudang <Text className="text-red-500">*</Text></Text>
                                <View className="border border-gray-200 rounded-xl bg-white mb-4">
                                    <Dropdown
                                        style={{ height: 48, paddingHorizontal: 16 }}
                                        data={warehouses}
                                        labelField="label"
                                        valueField="value"
                                        search
                                        searchPlaceholder="Cari gudang..."
                                        placeholder="Pilih Gudang"
                                        value={warehouse}
                                        onChange={item => setWarehouse(item.value)}
                                    />
                                </View>
                            </View>

                            <View>
                                <Text className="text-sm font-bold text-gray-700 mb-2">Tanggal PO <Text className="text-red-500">*</Text></Text>
                                <TouchableOpacity
                                    onPress={() => setShowOrderDatePicker(true)}
                                    className="border border-gray-200 rounded-xl bg-white mb-4 flex-row justify-between items-center"
                                    style={{ height: 48, paddingHorizontal: 16 }}
                                >
                                    <Text className="text-gray-900">{formatDate(orderDate)}</Text>
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
                                <Text className="text-sm font-bold text-gray-700 mb-2">Notes</Text>
                                <TextInput
                                    className="px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900"
                                    value={notes}
                                    onChangeText={setNotes}
                                    placeholder="Tambahkan catatan jika ada..."
                                    multiline
                                    numberOfLines={3}
                                    textAlignVertical="top"
                                />
                            </View>
                        </View>
                    </View>
                </Animated.View>

                {/* TABS AND TAB CONTENT */}
                <Animated.View entering={FadeIn.delay(300).duration(500)} className="mb-8">
                    <View className="flex-row bg-white border-t border-gray-100 px-2 pt-2 rounded-t-2xl">
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
                            <Text className="font-bold text-center" style={{ color: activeTab === 'incoming' ? theme.colors.primary : '#9ca3af' }}>Incoming Shipment</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="bg-white rounded-b-2xl min-h-[150px] pb-4">
                        {activeTab === 'po' && (
                            <View>
                                <View className="px-4 py-3 flex-row justify-between items-center border-b border-gray-50 mb-2">
                                    <Text className="font-bold text-gray-800">Daftar Barang</Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setSelectedDetail(null);
                                            setIsProductModalVisible(true);
                                        }}
                                        className="px-3 py-1.5 rounded-lg flex-row items-center"
                                        style={{ backgroundColor: theme.colors.primaryContainer }}
                                    >
                                        <Plus size={16} color={theme.colors.primary} className="mr-1" />
                                        <Text className="text-xs font-bold" style={{ color: theme.colors.primary }}>Tambah Barang</Text>
                                    </TouchableOpacity>
                                </View>
                                <PurchaseOrderTable
                                    details={poDetails}
                                    onEditProduct={(index) => {
                                        setSelectedDetail(poDetails[index]);
                                        setIsProductModalVisible(true);
                                    }}
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
                                    isEditMode={true}
                                />
                            </View>
                        )}
                    </View>
                </Animated.View>
            </ScrollView>

            {/* Bottom Actions */}
            <View className="bg-white border-t border-gray-100 p-4 pb-6">
                <TouchableOpacity
                    className="w-full py-4 rounded-xl items-center flex-row justify-center shadow-sm"
                    style={{ backgroundColor: theme.colors.primary }}
                    onPress={handleSave}
                    disabled={isSaving}
                >
                    <Save size={20} color="white" className="mr-2" />
                    <Text className="text-white font-bold text-base">
                        {isSaving ? 'Menyimpan...' : 'Simpan Purchase Order'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
