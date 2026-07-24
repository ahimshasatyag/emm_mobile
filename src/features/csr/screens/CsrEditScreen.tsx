import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Save, CheckCircle, XCircle, Edit3, X } from 'lucide-react-native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { useCsr } from '../hooks/useCsr';
import { Button } from '../../../components/ui/button';
import { theme } from '../../../theme/theme';
import Animated, { FadeInUp, FadeIn, FadeOut } from 'react-native-reanimated';
import { CsrEditSkeleton } from '../skeleton/CsrEditSkeleton';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';
import { ModalCancel } from '../../../components/ui/ModalCancel';
import { formatDate } from '../../../utils/helpers/date';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar } from 'lucide-react-native';
import { Dropdown } from 'react-native-element-dropdown';

export function CsrEditScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { id, showSuccessToast, successMessage } = route.params || {};

    const [toast, setToast] = useState<{ visible: boolean; type: ToastType; message: string }>({
        visible: false,
        type: 'success',
        message: ''
    });

    const { currentRequest, loadRequestById, editRequest, submitConfirmCsr, submitCancelCsr, isLoading, resetCurrentRequest, validateForm } = useCsr();
    const [isEditing, setIsEditing] = useState(false);
    const [modalUpdateVisible, setModalUpdateVisible] = useState(false);
    const [modalConfirmVisible, setModalConfirmVisible] = useState(false);
    const [modalCancelVisible, setModalCancelVisible] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState<{ field: string, visible: boolean }>({ field: '', visible: false });

    const handleDateChange = (event: any, selectedDate?: Date) => {
        const field = showDatePicker.field;
        setShowDatePicker({ field: '', visible: false });
        if (event.type === 'set' && selectedDate && field) {
            handleChange(field, selectedDate.toISOString().split('T')[0]);
        }
    };

    const [formData, setFormData] = useState({
        customers: '',
        date_request: '',
        id_product: '',
        sn_number: '',
        sts_pasang: '',
        do_code: '',
        mesin_lama: '',
        id_karyawan: '',
        lokasi: '',
        lap_kerusakan: '',
    });

    const DUMMY_CUSTOMERS = [
        { label: 'PT Maju Bersama', value: 'C001' },
        { label: 'CV Makmur Jaya', value: 'C002' },
        { label: 'Toko Budi', value: 'C003' },
    ];

    const DUMMY_KARYAWAN = [
        { label: 'Budi Santoso', value: 'K001' },
        { label: 'Andi Hermawan', value: 'K002' },
        { label: 'Siti Aminah', value: 'K003' },
    ];

    useEffect(() => {
        if (id) {
            loadRequestById(id);
        }
        return () => resetCurrentRequest();
    }, [id, loadRequestById, resetCurrentRequest]);

    useEffect(() => {
        if (showSuccessToast && successMessage) {
            setToast({ visible: true, type: 'success', message: successMessage });
            navigation.setParams({ showSuccessToast: undefined, successMessage: undefined });
        }
    }, [showSuccessToast, successMessage, navigation]);

    useEffect(() => {
        if (currentRequest) {
            setFormData({
                customers: currentRequest.id_customers || '',
                date_request: currentRequest.csr_date || '',
                id_product: currentRequest.id_product || '',
                sn_number: currentRequest.sn_number || '',
                sts_pasang: currentRequest.sts_pasang || '',
                do_code: currentRequest.do_code || '',
                mesin_lama: currentRequest.mesin_lama || '',
                id_karyawan: currentRequest.id_karyawan || '',
                lokasi: currentRequest.lokasi || '',
                lap_kerusakan: currentRequest.lap_kerusakan || '',
            });
        }
    }, [currentRequest]);

    const handleChange = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handlePreUpdate = () => {
        const errorMsg = validateForm(formData);
        if (errorMsg) {
            setToast({ visible: true, type: 'error', message: errorMsg });
            return;
        }
        setModalUpdateVisible(true);
    };

    const handleUpdate = async () => {
        try {
            await editRequest(id, formData);
            setModalUpdateVisible(false);
            setIsEditing(false);
            setToast({ visible: true, type: 'success', message: 'Data CSR berhasil diupdate' });
        } catch (error: any) {
            setModalUpdateVisible(false);
            setToast({ visible: true, type: 'error', message: error.message || 'Gagal mengupdate data' });
        }
    };

    const handleConfirm = () => {
        setModalConfirmVisible(true);
    };

    const executeConfirm = async () => {
        try {
            await submitConfirmCsr(id);
            setModalConfirmVisible(false);

            setTimeout(() => {
                navigation.navigate('CstEditScreen', {
                    id: 'CST/2026/06/0001', // Using a valid dummy CST ID
                    showSuccessToast: true,
                    successMessage: 'CSR berhasil dikonfirmasi.'
                });
            }, 300);
        } catch (error: any) {
            setModalConfirmVisible(false);
            const errMsg = typeof error === 'string' ? error : (error?.message || 'Terjadi kesalahan saat konfirmasi');
            setToast({ visible: true, type: 'error', message: errMsg });
        }
    };

    const handleCancel = () => {
        setModalCancelVisible(true);
    };

    const executeCancel = async () => {
        try {
            await submitCancelCsr(id, 'Dibatalkan oleh user');
            setModalCancelVisible(false);
            setToast({ visible: true, type: 'success', message: 'CSR berhasil dibatalkan.' });
            setIsEditing(false);
        } catch (error: any) {
            setModalCancelVisible(false);
            const errMsg = typeof error === 'string' ? error : (error?.message || 'Terjadi kesalahan saat membatalkan CSR');
            setToast({ visible: true, type: 'error', message: errMsg });
        }
    };

    const isReadOnly = !isEditing;

    const onRefresh = () => {
        if (id) {
            loadRequestById(id);
        }
    };

    if (!currentRequest && !isLoading) {
        return (
            <View className="flex-1 bg-gray-50 justify-center items-center">
                <Text>Data tidak ditemukan</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50">
            <ToastMessages
                visible={toast.visible}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast(prev => ({ ...prev, visible: false }))}
            />

            <ModalConfirm
                visible={modalUpdateVisible}
                title="Konfirmasi Simpan"
                message="Apakah Anda yakin ingin menyimpan perubahan pada CSR ini?"
                confirmText="Ya, Simpan!"
                cancelText="Batal"
                onConfirm={handleUpdate}
                onCancel={() => setModalUpdateVisible(false)}
            />

            <ModalConfirm
                visible={modalConfirmVisible}
                title="Konfirmasi CSR"
                message="Apakah Anda yakin ingin mengkonfirmasi CSR ini?"
                confirmText="Ya!"
                cancelText="Batal"
                onConfirm={executeConfirm}
                onCancel={() => setModalConfirmVisible(false)}
            />

            <ModalCancel
                visible={modalCancelVisible}
                title="Batalkan CSR"
                message="Apakah Anda yakin ingin membatalkan CSR ini?"
                confirmText="Ya, Batalkan!"
                cancelText="Kembali"
                onConfirm={executeCancel}
                onCancel={() => setModalCancelVisible(false)}
            />

            <HeaderNavigator
                title={isLoading ? "MEMUAT DATA..." : (isEditing ? "EDIT CSR" : "DETAIL CSR")}
                showBackButton={true}
                onBackPress={() => navigation.goBack()}
            />

            <ScrollView
                className="flex-1 px-4 pt-4"
                contentContainerStyle={{ paddingBottom: 40 }}
                refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} colors={[theme.colors.primary]} />}
            >
                {isLoading ? (
                    <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>
                        <CsrEditSkeleton />
                    </Animated.View>
                ) : (
                    currentRequest && (
                        <>
                            <Animated.View key="content" entering={FadeIn.duration(600)}>
                                <View className="space-y-4">
                                    <View className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
                                        {/* Header Status */}
                                        <View className="flex-row justify-between items-center border-b border-gray-100 pb-4 mb-4">
                                            <View>
                                                <Text className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Nomor CSR</Text>
                                                <Text className="text-gray-900 font-extrabold text-lg">{currentRequest.csr_code}</Text>
                                            </View>
                                            <View className={`px-3 py-1.5 rounded-full ${currentRequest.status === 'DRAFT' ? 'bg-yellow-100' : currentRequest.status === 'CANCEL' ? 'bg-red-100' : 'bg-gray-100'}`}>
                                                <Text className={`text-xs font-bold ${currentRequest.status === 'DRAFT' ? 'text-yellow-700' : currentRequest.status === 'CANCEL' ? 'text-red-700' : 'text-gray-700'}`}>
                                                    {currentRequest.status}
                                                </Text>
                                            </View>
                                        </View>

                                        {/* --- Customer Fields --- */}
                                        <Text className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Customer</Text>
                                        <View className="mb-4">
                                            <Text className="text-sm font-bold text-gray-700 mb-2 mt-2">Customers Name</Text>
                                            <View className={`border border-gray-200 rounded-xl ${isReadOnly ? 'bg-gray-100' : 'bg-gray-50'}`}>
                                                <Dropdown
                                                    style={{ height: 48, paddingHorizontal: 16 }}
                                                    data={DUMMY_CUSTOMERS}
                                                    labelField="label"
                                                    valueField="value"
                                                    placeholder="Select Customer"
                                                    value={formData.customers}
                                                    onChange={item => !isReadOnly && handleChange('customers', item.value)}
                                                    disable={isReadOnly}
                                                    selectedTextStyle={{ color: isReadOnly ? '#6b7280' : '#111827', fontSize: 14 }}
                                                    placeholderStyle={{ color: '#9ca3af', fontSize: 14 }}
                                                />
                                            </View>
                                        </View>
                                        <View className="mb-4">
                                            <Text className="text-sm font-bold text-gray-700 mb-2">Requestor <Text className="text-red-500">*</Text></Text>
                                            <View className={`border border-gray-200 rounded-xl ${isReadOnly ? 'bg-gray-100' : 'bg-gray-50'}`}>
                                                <Dropdown
                                                    style={{ height: 48, paddingHorizontal: 16 }}
                                                    data={DUMMY_KARYAWAN}
                                                    labelField="label"
                                                    valueField="value"
                                                    placeholder="Select Requestor"
                                                    value={formData.id_karyawan}
                                                    onChange={item => !isReadOnly && handleChange('id_karyawan', item.value)}
                                                    disable={isReadOnly}
                                                    selectedTextStyle={{ color: isReadOnly ? '#6b7280' : '#111827', fontSize: 14 }}
                                                    placeholderStyle={{ color: '#9ca3af', fontSize: 14 }}
                                                />
                                            </View>
                                        </View>
                                        <View className="mb-4 flex-row justify-between">
                                            <View className="flex-1 mr-2">
                                                <Text className="text-sm font-bold text-gray-700 mb-2">Created Date</Text>
                                                <TextInput
                                                    className="bg-gray-100 px-4 py-3 rounded-xl border border-gray-200 text-gray-500"
                                                    value={currentRequest.csr_date ? formatDate(new Date(currentRequest.csr_date)) : ''}
                                                    editable={false}
                                                />
                                            </View>
                                            <View className="flex-1 ml-2">
                                                <Text className="text-sm font-bold text-gray-700 mb-2">Date Request</Text>
                                                <TouchableOpacity
                                                    className={`bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 flex-row items-center justify-between ${isReadOnly ? 'bg-gray-100' : ''}`}
                                                    onPress={() => !isReadOnly && setShowDatePicker({ field: 'date_request', visible: true })}
                                                    disabled={isReadOnly}
                                                >
                                                    <Text className={formData.date_request ? "text-gray-900" : "text-gray-400"}>
                                                        {formData.date_request ? formatDate(new Date(formData.date_request)) : "Select Date"}
                                                    </Text>
                                                    <Calendar size={20} color="#9ca3af" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <View className="mb-4">
                                            <Text className="text-sm font-bold text-gray-700 mb-2">Lokasi <Text className="text-red-500">*</Text></Text>
                                            <View className="flex-row items-center mt-1">
                                                <TouchableOpacity className="flex-row items-center mr-8" onPress={() => !isReadOnly && handleChange('lokasi', 'Dalam Kota')}>
                                                    <View className={`w-5 h-5 rounded-full border items-center justify-center mr-2 ${formData.lokasi === 'Dalam Kota' ? 'border-[#9e0b0f]' : 'border-gray-300'}`}>
                                                        {formData.lokasi === 'Dalam Kota' && <View className="w-2.5 h-2.5 rounded-full bg-[#9e0b0f]" />}
                                                    </View>
                                                    <Text className="text-gray-700 font-medium">Dalam Kota</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity className="flex-row items-center" onPress={() => !isReadOnly && handleChange('lokasi', 'Luar Kota')}>
                                                    <View className={`w-5 h-5 rounded-full border items-center justify-center mr-2 ${formData.lokasi === 'Luar Kota' ? 'border-[#9e0b0f]' : 'border-gray-300'}`}>
                                                        {formData.lokasi === 'Luar Kota' && <View className="w-2.5 h-2.5 rounded-full bg-[#9e0b0f]" />}
                                                    </View>
                                                    <Text className="text-gray-700 font-medium">Luar Kota</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <View className="mb-4">
                                            <Text className="text-sm font-bold text-gray-700 mb-2">Status Pemasangan <Text className="text-red-500">*</Text></Text>
                                            <View className="flex-row items-center mt-1">
                                                <TouchableOpacity className="flex-row items-center mr-8" onPress={() => !isReadOnly && handleChange('sts_pasang', 'Pasang Baru')}>
                                                    <View className={`w-5 h-5 rounded-full border items-center justify-center mr-2 ${formData.sts_pasang === 'Pasang Baru' ? 'border-[#9e0b0f]' : 'border-gray-300'}`}>
                                                        {formData.sts_pasang === 'Pasang Baru' && <View className="w-2.5 h-2.5 rounded-full bg-[#9e0b0f]" />}
                                                    </View>
                                                    <Text className="text-gray-700 font-medium">Pasang Baru</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity className="flex-row items-center" onPress={() => !isReadOnly && handleChange('sts_pasang', 'Service')}>
                                                    <View className={`w-5 h-5 rounded-full border items-center justify-center mr-2 ${formData.sts_pasang === 'Service' ? 'border-[#9e0b0f]' : 'border-gray-300'}`}>
                                                        {formData.sts_pasang === 'Service' && <View className="w-2.5 h-2.5 rounded-full bg-[#9e0b0f]" />}
                                                    </View>
                                                    <Text className="text-gray-700 font-medium">Service</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>

                                        {/* --- Laporan Kerusakan Fields --- */}
                                        <Text className="text-lg font-bold text-gray-800 mt-6 mb-4 border-b border-gray-100 pb-2">Laporan Kerusakan</Text>
                                        <View className="mb-4">
                                            <Text className="text-sm font-bold text-gray-700 mb-2 mt-2">Catatan Kerusakan <Text className="text-red-500">*</Text></Text>
                                            <TextInput
                                                className={`bg-gray-50 px-4 py-4 rounded-xl border border-gray-200 focus:border-[#9e0b0f] text-gray-900 ${isReadOnly ? 'bg-gray-100' : ''}`}
                                                style={{ minHeight: 120 }}
                                                value={formData.lap_kerusakan}
                                                onChangeText={(text) => handleChange('lap_kerusakan', text)}
                                                multiline
                                                numberOfLines={5}
                                                textAlignVertical="top"
                                                editable={!isReadOnly}
                                            />
                                        </View>
                                        <View className="mb-4">
                                            <Text className="text-sm font-bold text-gray-700 mb-2">Images</Text>
                                            <View className="w-24 h-24 bg-gray-50 border border-gray-300 border-dashed rounded-xl items-center justify-center">
                                                <Text className="text-gray-400 text-xs font-medium">No Image</Text>
                                            </View>
                                        </View>

                                        {/* SECTION: Product To Service */}
                                        <Text className="text-lg font-bold text-gray-800 mt-6 mb-4 border-b border-gray-100 pb-2">Product To Service</Text>

                                        {/* Product & Warranty Info Box */}
                                        <View className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-4 space-y-3">
                                            {/* Product Details */}
                                            <View className="space-y-2 border-b border-blue-200 pb-3 mb-1">
                                                <View className="flex-row justify-between">
                                                    <Text className="text-gray-600 text-xs">Serial Number</Text>
                                                    <Text className="text-gray-800 text-xs">{formData.sn_number || '-'}</Text>
                                                </View>
                                                <View className="flex-row justify-between">
                                                    <Text className="text-gray-600 text-xs">Product Name</Text>
                                                    <Text className="text-gray-800 text-xs">{currentRequest.nm_product || '-'}</Text>
                                                </View>
                                                <View className="flex-row justify-between">
                                                    <Text className="text-gray-600 text-xs">Product Category</Text>
                                                    <Text className="text-gray-800 text-xs">Graphic Machinery</Text>
                                                </View>
                                                <View className="flex-row justify-between">
                                                    <Text className="text-gray-600 text-xs">Delivery Order</Text>
                                                    <Text className="text-gray-800 text-xs">{formData.do_code || '-'}</Text>
                                                </View>
                                                <View className="flex-row justify-between">
                                                    <Text className="text-gray-600 text-xs">Internal Notes SO</Text>
                                                    <Text className="text-gray-800 text-xs">-</Text>
                                                </View>
                                            </View>

                                            {/* Warranty Details */}
                                            <View className="space-y-2">
                                                <View className="flex-row justify-between">
                                                    <Text className="text-gray-600 text-xs">Warranty Start</Text>
                                                    <Text className="text-gray-800 text-xs">{currentRequest.csr_date ? formatDate(new Date(currentRequest.csr_date)) : '-'}</Text>
                                                </View>
                                                <View className="flex-row justify-between">
                                                    <Text className="text-gray-600 text-xs">Warranty Time</Text>
                                                    <Text className="text-gray-800 text-xs">12 Months</Text>
                                                </View>
                                                <View className="flex-row justify-between">
                                                    <Text className="text-gray-600 text-xs">Warranty End</Text>
                                                    <Text className="text-gray-800 text-xs">2027-05-06</Text>
                                                </View>
                                                <View className="flex-row justify-between">
                                                    <Text className="text-gray-600 text-xs">Warranty Status</Text>
                                                    <Text className="text-green-600 text-xs">GARANSI</Text>
                                                </View>
                                                <View className="flex-row justify-between">
                                                    <Text className="text-gray-600 text-xs">Keterangan SO</Text>
                                                    <Text className="text-gray-800 text-xs">-</Text>
                                                </View>
                                            </View>
                                        </View>
                                        {/* SECTION: CST List */}
                                        <Text className="text-lg font-bold text-gray-800 mt-6 mb-4 border-b border-gray-100 pb-2">CST List</Text>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                            <View className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden min-w-[500px]">
                                                <View className="flex-row bg-gray-200 p-2 border-b border-gray-300">
                                                    <Text className="w-8 text-[10px] font-bold text-gray-600 text-center">No</Text>
                                                    <Text className="w-24 text-[10px] font-bold text-gray-600 text-center">CST Code</Text>
                                                    <Text className="w-20 text-[10px] font-bold text-gray-600 text-center">Date</Text>
                                                    <Text className="w-28 text-[10px] font-bold text-gray-600 text-center">Product Name</Text>
                                                    <Text className="w-24 text-[10px] font-bold text-gray-600 text-center">Request</Text>
                                                    <Text className="w-20 text-[10px] font-bold text-gray-600 text-center">User</Text>
                                                    <Text className="w-20 text-[10px] font-bold text-gray-600 text-center">Status</Text>
                                                </View>
                                                <View className="p-4 items-center justify-center">
                                                    <Text className="text-xs text-gray-400">No data found</Text>
                                                </View>
                                            </View>
                                        </ScrollView>
                                    </View>
                                </View>
                            </Animated.View>

                            <Animated.View entering={FadeInUp.delay(100)}>
                                {!isEditing ? (
                                    <View className="mt-2 space-y-3">
                                        {currentRequest.status === 'DRAFT' && (
                                            <>
                                                <Button
                                                    onPress={() => setIsEditing(true)}
                                                    className="w-full h-14 rounded-2xl flex-row items-center justify-center bg-[#9e0b0f]"
                                                    style={{ elevation: 4, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                                                >
                                                    <Edit3 color="white" size={20} className="mr-2" />
                                                    <Text className="text-white font-bold text-lg">Edit CSR</Text>
                                                </Button>

                                                <View className="flex-row space-x-3 mt-1">
                                                    <TouchableOpacity
                                                        className="bg-gray-800 flex-1 flex-row justify-center items-center py-3.5 rounded-xl shadow-sm"
                                                        activeOpacity={0.8}
                                                        onPress={handleConfirm}
                                                    >
                                                        <CheckCircle color="#fff" size={20} />
                                                        <Text className="text-white font-bold ml-2 text-sm">Confirm CSR</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        className="bg-red-500 flex-1 flex-row justify-center items-center py-3.5 rounded-xl shadow-sm"
                                                        activeOpacity={0.8}
                                                        onPress={handleCancel}
                                                    >
                                                        <XCircle color="#fff" size={20} />
                                                        <Text className="text-white font-bold ml-2 text-sm">Cancel CSR</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </>
                                        )}
                                    </View>
                                ) : (
                                    <View className="mt-2 space-y-3">
                                        <View className="flex-row space-x-4">
                                            <Button
                                                variant="outline"
                                                onPress={() => {
                                                    setIsEditing(false);
                                                    setFormData({
                                                        customers: currentRequest.id_customers || '',
                                                        date_request: currentRequest.csr_date || '',
                                                        id_product: currentRequest.id_product || '',
                                                        sn_number: currentRequest.sn_number || '',
                                                        sts_pasang: currentRequest.sts_pasang || '',
                                                        do_code: currentRequest.do_code || '',
                                                        mesin_lama: currentRequest.mesin_lama || '',
                                                        id_karyawan: currentRequest.id_karyawan || '',
                                                        lokasi: currentRequest.lokasi || '',
                                                        lap_kerusakan: currentRequest.lap_kerusakan || '',
                                                    });
                                                }}
                                                className="flex-1 h-14 rounded-xl flex-row items-center justify-center"
                                            >
                                                <X color={theme.colors.primary} size={20} className="mr-2" />
                                                <Text className="font-bold text-lg" style={{ color: theme.colors.primary }}>Batal</Text>
                                            </Button>
                                            <Button
                                                onPress={handlePreUpdate}
                                                className="flex-1 h-14 rounded-2xl flex-row items-center justify-center bg-green-600"
                                                style={{ elevation: 4, shadowColor: '#16a34a', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                                            >
                                                <Save color="white" size={20} className="mr-2" />
                                                <Text className="text-white font-bold text-lg">Simpan</Text>
                                            </Button>
                                        </View>
                                    </View>
                                )}
                            </Animated.View>
                        </>
                    )
                )}
            </ScrollView>

            {showDatePicker.visible && (
                <DateTimePicker
                    value={formData[showDatePicker.field as keyof typeof formData] ? new Date(formData[showDatePicker.field as keyof typeof formData]) : new Date()}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                />
            )}

        </View>
    );
}
