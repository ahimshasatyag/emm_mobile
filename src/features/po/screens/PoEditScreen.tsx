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
import { usePo } from '../hooks/usePo';
import { PoEditSkeleton } from '../skeleton/PoEditSkeleton';
import { ErrorState } from '../../../components/shared/ErrorState';
import { PoTable } from '../components/PoTable';
import { IncshipmentTab } from '../components/IncshipmentTab';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';
import { ModalCancel } from '../../../components/ui/ModalCancel';
import { parseISO } from 'date-fns';
import { formatDate, formatDateServer } from '../../../utils/helpers/date';
import { PurchaseOrderModal } from '../../quotationsap/components/PurchaseOrderModal';

export function PoEditScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { id } = route.params;

    const {
        validateForm, supportData, getMataUangDefault,
        update, confirm, cancel, selectedItem, isLoadingDetail, error, loadDetail, clearSelection, isSaving
    } = usePo();

    const [isEditMode, setIsEditMode] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [isConfirmPOVisible, setIsConfirmPOVisible] = useState(false);
    const [isCancelPOVisible, setIsCancelPOVisible] = useState(false);
    const [isProductModalVisible, setIsProductModalVisible] = useState(false);
    const [isSaveChangesVisible, setIsSaveChangesVisible] = useState(false);

    const [toast, setToast] = useState<{ visible: boolean; message: string; type: ToastType; title?: string }>({
        visible: false,
        message: '',
        type: 'success'
    });

    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [warehouses, setWarehouses] = useState<any[]>([]);
    const [currencies, setCurrencies] = useState<any[]>([]);
    const [locations, setLocations] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);

    const [supplier, setSupplier] = useState<string | null>(null);
    const [supplierName, setSupplierName] = useState<string>('');
    const [supplierRef, setSupplierRef] = useState('');
    const [currency, setCurrency] = useState<string | null>(null);
    const [warehouse, setWarehouse] = useState<string | null>(null);
    const [orderDate, setOrderDate] = useState<Date>(new Date());
    const [showOrderDatePicker, setShowOrderDatePicker] = useState(false);
    const [notes, setNotes] = useState('');

    const [incDestination, setIncDestination] = useState<string | null>(null);
    const [expectedDate, setExpectedDate] = useState<Date>(new Date());

    const [poDetails, setPoDetails] = useState<any[]>([]);

    const loadSupportData = useCallback(async () => {
        try {
            const data = await supportData();
            if (data?.status) {
                setSuppliers(data.data_supplier?.map((s: any) => ({ label: s.nm_suppliers, value: s.id_suppliers })) || []);
                setWarehouses(data.data_gudang?.map((g: any) => ({ label: g.nm_gudang, value: g.id_gudang })) || []);
                setCurrencies(data.mata_uangs?.map((m: any) => ({ label: m.name, value: m.id_mata_uang })) || []);
                setProducts(data.data_product || []);
                if (data.data_lokasi) {
                    setLocations(data.data_lokasi.map((l: any) => ({ label: l.nm_product_lokasi, value: l.id_product_lokasi })));
                } else {
                    setLocations(data.data_gudang?.map((g: any) => ({ label: g.nm_gudang, value: g.id_gudang })) || []);
                }
            }
        } catch (err) {
            console.error(err);
        }
    }, [supportData]);

    const initialize = useCallback(async () => {
        setIsLoading(true);
        try {
            await Promise.all([
                loadSupportData(),
                loadDetail(id, 'initial'),
                new Promise(resolve => setTimeout(resolve, 800))
            ]);
        } finally {
            setIsLoading(false);
        }
    }, [id, loadDetail, loadSupportData]);

    useEffect(() => {
        initialize();
        return () => {
            clearSelection();
        };
    }, [initialize, clearSelection]);

    useEffect(() => {
        if (selectedItem) {
            setSupplier(selectedItem.id_suppliers || null);
            setSupplierName(selectedItem.nm_suppliers || '');
            setSupplierRef(selectedItem.partner_ref || '');
            setCurrency(selectedItem.id_mata_uang || null);
            setWarehouse(selectedItem.id_gudang || null);
            setNotes(selectedItem.notes || '');
            setIncDestination(selectedItem.id_product_lokasi || null);

            if (selectedItem.date_po) {
                const parsedDate = parseISO(selectedItem.date_po);
                if (!isNaN(parsedDate.getTime())) setOrderDate(parsedDate);
            }
            if (selectedItem.date_schdl) {
                const parsedDate = parseISO(selectedItem.date_schdl);
                if (!isNaN(parsedDate.getTime())) setExpectedDate(parsedDate);
            }

            setPoDetails(selectedItem.details || []);
        }
    }, [selectedItem]);

    const handleSupplierChange = async (item: any) => {
        setSupplier(item.value);
        setSupplierName(item.label);
        try {
            const res = await getMataUangDefault(item.value);
            if (res?.status && res?.id_mata_uang) {
                setCurrency(res.id_mata_uang);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddProduct = (product: any) => {
        const newDetail = {
            id_po_dtl: `temp-${Date.now()}`,
            id_po: id,
            id_product: product.id_product,
            code_product: product.code_product,
            nm_product: product.nm_product,
            product_deskripsi: product.product_deskripsi,
            qty: product.qty || 1,
            product_price: product.product_price || 0,
            notes: product.notes || '',
            satuan: product.nm_product_satuan || ''
        };
        setPoDetails([...poDetails, newDetail]);
        setIsProductModalVisible(false);
    };

    const handleRemoveProduct = (index: number) => {
        const newDetails = [...poDetails];
        newDetails.splice(index, 1);
        setPoDetails(newDetails);
    };

    const saveChanges = async () => {
        const validation = validateForm(supplier, warehouse, orderDate, poDetails);
        if (!validation.isValid) {
            setToast({ visible: true, message: validation.message, type: 'error', title: 'Validasi Gagal' });
            return;
        }

        setIsSaveChangesVisible(false);

        try {
            const formData = new FormData();
            formData.append('id_suppliers', supplier || '');
            formData.append('nm_suppliers', supplierName);
            formData.append('id_gudang', warehouse || '');
            formData.append('mata_uang', currency || '');
            formData.append('partner_ref', supplierRef);
            formData.append('notes', notes);
            
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

            await update(id, formData, selectedItem?.code_po);
            
            setToast({
                visible: true,
                message: "PO berhasil diperbarui",
                type: 'success',
                title: 'Sukses'
            });
            setIsEditMode(false);
            loadDetail(id, 'refresh');

        } catch (err: any) {
            setToast({
                visible: true,
                message: err?.message || "Gagal memperbarui PO",
                type: 'error',
                title: 'Error'
            });
        }
    };

    const confirmPO = async () => {
        setIsConfirmPOVisible(false);
        try {
            await confirm(id, selectedItem?.code_po);
            setToast({
                visible: true,
                message: "PO berhasil dikonfirmasi",
                type: 'success',
                title: 'Sukses'
            });
            loadDetail(id, 'refresh');
        } catch (err: any) {
            setToast({
                visible: true,
                message: err?.message || "Gagal konfirmasi PO",
                type: 'error',
                title: 'Error'
            });
        }
    };

    const cancelPO = async () => {
        setIsCancelPOVisible(false);
        try {
            await cancel(id, selectedItem?.code_po);
            setToast({
                visible: true,
                message: "PO berhasil dibatalkan",
                type: 'success',
                title: 'Sukses'
            });
            loadDetail(id, 'refresh');
        } catch (err: any) {
            setToast({
                visible: true,
                message: err?.message || "Gagal membatalkan PO",
                type: 'error',
                title: 'Error'
            });
        }
    };

    if (error && !isLoading && !isLoadingDetail) {
        return (
            <View className="flex-1 bg-gray-50">
                <HeaderNavigator title="DETAIL PO" showBackButton onBackPress={() => navigation.goBack()} />
                <ErrorState error={error} onRetry={() => loadDetail(id, 'refresh')} />
            </View>
        );
    }

    const canEditOrConfirm = selectedItem?.status_po === 'DRAFT PO' || selectedItem?.status_po === 'DRAFT';

    return (
        <View className="flex-1 bg-gray-50">
            <ToastMessages
                visible={toast.visible}
                title={toast.title}
                message={toast.message}
                type={toast.type}
                onHide={() => setToast(prev => ({ ...prev, visible: false }))}
            />

            <ModalConfirm
                visible={isSaveChangesVisible}
                title="Simpan Perubahan"
                message="Apakah Anda yakin ingin menyimpan perubahan pada PO ini?"
                confirmText={isSaving ? "Menyimpan..." : "Ya, Simpan"}
                cancelText="Batal"
                onConfirm={saveChanges}
                onCancel={() => !isSaving && setIsSaveChangesVisible(false)}
            />

            <ModalConfirm
                visible={isConfirmPOVisible}
                title="Konfirmasi PO"
                message="Apakah Anda yakin ingin mengkonfirmasi PO ini? (Status akan menjadi PO PURCHASE)"
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

            <PurchaseOrderModal 
                visible={isProductModalVisible}
                onClose={() => setIsProductModalVisible(false)}
                products={products}
                onAddProduct={handleAddProduct}
            />

            <HeaderNavigator
                title={isLoading ? "MEMUAT DATA..." : isEditMode ? `EDIT PO` : `DETAIL PO`}
                showBackButton
                onBackPress={() => navigation.goBack()}
            />

            <ScrollView
                className="flex-1 px-4 pt-4"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isLoadingDetail} onRefresh={() => id && loadDetail(id)} colors={[theme.colors.primary]} />
                }
            >
                {isLoading ? (
                    <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>
                        <PoEditSkeleton />
                    </Animated.View>
                ) : (
                    <Animated.View key="content" entering={FadeIn.duration(600)}>
                        <Animated.View entering={FadeInUp.duration(400)} className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
                            <View className="p-4 space-y-4">
                                <View className="flex-row justify-between items-center mb-1 pb-3 border-b border-gray-100">
                                    <View>
                                        <Text className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Nomor PO</Text>
                                        <Text className="text-lg font-black text-gray-900">{selectedItem?.code_po || '-'}</Text>
                                    </View>
                                    <View className="items-end">
                                        <Text className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Status</Text>
                                        <View className={`px-3 py-1 rounded-full border ${selectedItem?.status_po === 'PO PURCHASE' ? 'bg-green-50 border-green-200' : selectedItem?.status_po === 'DRAFT PO' ? 'bg-yellow-50 border-yellow-200' : selectedItem?.status_po === 'CANCEL' ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
                                            <Text className={`text-xs font-bold ${selectedItem?.status_po === 'PO PURCHASE' ? 'text-green-700' : selectedItem?.status_po === 'DRAFT PO' ? 'text-yellow-700' : selectedItem?.status_po === 'CANCEL' ? 'text-red-700' : 'text-gray-700'}`}>
                                                {selectedItem?.status_po || 'UNKNOWN'}
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
                                                placeholder={selectedItem?.nm_suppliers || "Pilih Supplier"}
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
                                                placeholder={selectedItem?.mata_uang || "Pilih Mata Uang"}
                                                value={currency}
                                                onChange={item => setCurrency(item.value)}
                                                disable={!isEditMode}
                                            />
                                        </View>
                                    </View>

                                    <View>
                                        <Text className="text-sm font-bold text-gray-700 mb-2">Gudang <Text className="text-red-500">*</Text></Text>
                                        <View className={`border rounded-xl mb-4 ${isEditMode ? 'bg-white border-gray-200' : 'bg-gray-100 border-gray-200'}`}>
                                            <Dropdown
                                                style={{ height: 48, paddingHorizontal: 16 }}
                                                data={warehouses}
                                                labelField="label"
                                                valueField="value"
                                                search
                                                searchPlaceholder="Cari gudang..."
                                                placeholder={selectedItem?.nm_gudang || "Pilih Gudang"}
                                                value={warehouse}
                                                onChange={item => setWarehouse(item.value)}
                                                disable={!isEditMode}
                                            />
                                        </View>
                                    </View>

                                    <View>
                                        <Text className="text-sm font-bold text-gray-700 mb-2">Tanggal PO <Text className="text-red-500">*</Text></Text>
                                        <TouchableOpacity 
                                            onPress={() => isEditMode && setShowOrderDatePicker(true)}
                                            className={`border rounded-xl mb-4 flex-row justify-between items-center ${isEditMode ? 'bg-white border-gray-200' : 'bg-gray-100 border-gray-200'}`}
                                            style={{ height: 48, paddingHorizontal: 16 }}
                                            disabled={!isEditMode}
                                        >
                                            <Text className={isEditMode ? 'text-gray-900' : 'text-gray-500'}>{formatDate(orderDate)}</Text>
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
                                            className={`px-4 py-3 rounded-xl border ${isEditMode ? 'bg-white border-gray-200 text-gray-900' : 'bg-gray-100 border-gray-200 text-gray-500'}`}
                                            value={notes}
                                            onChangeText={setNotes}
                                            editable={isEditMode}
                                            placeholder="Tambahkan catatan jika ada..."
                                            multiline
                                            numberOfLines={3}
                                            textAlignVertical="top"
                                        />
                                    </View>
                                </View>
                            </View>
                        </Animated.View>

                        <Animated.View entering={FadeIn.delay(200).duration(500)}>
                            <PoTable 
                                items={poDetails} 
                                isReadOnly={!isEditMode} 
                                onAdd={() => setIsProductModalVisible(true)}
                                onRemove={handleRemoveProduct}
                            />
                        </Animated.View>

                        <Animated.View entering={FadeIn.delay(300).duration(500)} className="mb-8">
                            <Text className="text-sm font-bold text-gray-800 mb-2">Informasi Pengiriman</Text>
                            <View className="bg-white rounded-2xl border border-gray-200">
                                <IncshipmentTab 
                                    expectedDate={expectedDate}
                                    setExpectedDate={setExpectedDate}
                                    destination={incDestination}
                                    setDestination={setIncDestination}
                                    destinations={locations}
                                    isEditMode={isEditMode}
                                />
                            </View>
                        </Animated.View>
                    </Animated.View>
                )}
            </ScrollView>

            {!isLoading && (
                <View className="bg-white border-t border-gray-100 p-4 pb-6 flex-row justify-between space-x-3">
                    {isEditMode ? (
                        <>
                            <TouchableOpacity
                                onPress={() => setIsEditMode(false)}
                                className="flex-1 bg-gray-100 py-3 rounded-xl items-center flex-row justify-center"
                                disabled={isSaving}
                            >
                                <X size={20} color="#374151" className="mr-2" />
                                <Text className="font-bold text-gray-700">Batal Edit</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setIsSaveChangesVisible(true)}
                                className="flex-1 py-3 rounded-xl items-center flex-row justify-center"
                                style={{ backgroundColor: theme.colors.primary }}
                                disabled={isSaving}
                            >
                                <Save size={20} color="white" className="mr-2" />
                                <Text className="font-bold text-white">Simpan</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            {canEditOrConfirm && (
                                <View className="flex-1 flex-row space-x-3">
                                    <Button
                                        variant="outline"
                                        className="flex-1 border-gray-300"
                                        onPress={() => setIsEditMode(true)}
                                        icon={<Pencil size={20} color="#374151" />}
                                    >
                                        Edit
                                    </Button>

                                    <Button
                                        variant="primary"
                                        className="flex-1 bg-green-600"
                                        onPress={() => setIsConfirmPOVisible(true)}
                                        icon={<CheckCircle size={20} color="white" />}
                                    >
                                        Confirm
                                    </Button>
                                </View>
                            )}

                            {canEditOrConfirm && (
                                <Button
                                    variant="danger"
                                    className="w-[120px] ml-3"
                                    onPress={() => setIsCancelPOVisible(true)}
                                    icon={<XCircle size={20} color="white" />}
                                >
                                    Cancel
                                </Button>
                            )}

                            {!canEditOrConfirm && (
                                <View className="flex-1 items-center justify-center py-2">
                                    <Text className="text-gray-500 font-medium text-sm">Tidak ada aksi tersedia untuk status {selectedItem?.status_po}</Text>
                                </View>
                            )}
                        </>
                    )}
                </View>
            )}
        </View>
    );
}
