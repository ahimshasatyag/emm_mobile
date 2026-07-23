import React, { useState } from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Save, Calendar } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { theme } from '../../../theme/theme';
import { useCsr } from '../hooks/useCsr';
import { Button } from '../../../components/ui/button';
import Animated, { FadeInDown, FadeOut, Layout } from 'react-native-reanimated';
import { Dropdown } from 'react-native-element-dropdown';
import { CsrFormSkeleton } from '../skeleton/CsrFormSkeleton';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';
import { formatDate } from '../../../utils/helpers/date';

export function CsrFormScreen() {
    const navigation = useNavigation<any>();
    const { submitRequest, isLoading, validateForm } = useCsr();

    const [modalVisible, setModalVisible] = useState(false);
    const [toast, setToast] = useState<{ visible: boolean; type: ToastType; message: string }>({
        visible: false,
        type: 'success',
        message: ''
    });

    const [showDatePicker, setShowDatePicker] = useState<{ field: string, visible: boolean }>({ field: '', visible: false });

    const handleDateChange = (event: any, selectedDate?: Date) => {
        const field = showDatePicker.field;
        setShowDatePicker({ field: '', visible: false });
        if (event.type === 'set' && selectedDate && field) {
            handleChange(field, selectedDate.toISOString().split('T')[0]);
        }
    };

    // Dummy form state
    const [formData, setFormData] = useState({
        customers: 'C001',
        date_request: new Date().toISOString().split('T')[0],
        id_product: '',
        sn_number: '',
        sts_pasang: 'Pasang Baru',
        do_code: '',
        mesin_lama: '',
        status_so: '',
        warranty_start: '',
        warranty_time: '',
        warranty_status: '',
        id_karyawan: 'K001',
        lokasi: '',
        lap_kerusakan: '',
    });

    const DUMMY_CUSTOMERS = [
        { label: 'PT. Maju Mundur', value: 'C001' },
        { label: 'CV. Sejahtera', value: 'C002' },
        { label: 'Toko Budi', value: 'C003' },
    ];

    const DUMMY_KARYAWAN = [
        { label: 'Budi Santoso', value: 'K001' },
        { label: 'Andi Hermawan', value: 'K002' },
        { label: 'Siti Aminah', value: 'K003' },
    ];

    const DUMMY_PRODUCTS = [
        { label: 'Mesin EDC Verifone', value: 'Mesin EDC Verifone' },
        { label: 'Printer Thermal', value: 'Printer Thermal' },
        { label: 'Scanner Barcode', value: 'Scanner Barcode' },
    ];

    const [isRefreshing, setIsRefreshing] = useState(false);

    const onRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => {
            setIsRefreshing(false);
        }, 1000);
    };

    const handleChange = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        const errorMsg = validateForm(formData);
        if (errorMsg) {
            setToast({ visible: true, type: 'error', message: errorMsg });
            return;
        }

        setModalVisible(true);
    };

    const handleConfirmSave = async () => {
        setModalVisible(false);
        try {
            const result = await submitRequest(formData);
            navigation.replace('CsrEditScreen', { id: result.id, showSuccessToast: true, successMessage: 'Data CSR berhasil ditambahkan.' });
        } catch (error: any) {
            setToast({ visible: true, type: 'error', message: error.message || 'Gagal menyimpan data' });
        }
    };

    return (
        <View className="flex-1 bg-gray-50">
            <ToastMessages
                visible={toast.visible}
                title='Validasi'
                type={toast.type}
                message={toast.message}
                onClose={() => setToast(prev => ({ ...prev, visible: false }))}
            />

            <ModalConfirm
                visible={modalVisible}
                title="Konfirmasi"
                message="Apakah Anda yakin ingin menyimpan data CSR ini?"
                confirmText="Ya, Simpan!"
                cancelText="Batal"
                onConfirm={handleConfirmSave}
                onCancel={() => setModalVisible(false)}
            />

            <HeaderNavigator
                title={isLoading ? "MENYIMPAN DATA..." : (isRefreshing ? "MEMUAT DATA..." : "TAMBAH CSR")}
                showBackButton={true}
                onBackPress={() => navigation.goBack()}
            />
            {showDatePicker.visible && (
                <DateTimePicker
                    value={formData[showDatePicker.field as keyof typeof formData] ? new Date(formData[showDatePicker.field as keyof typeof formData]) : new Date()}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                />
            )}

            <ScrollView
                className="flex-1 px-4 pt-4"
                contentContainerStyle={{ paddingBottom: 40 }}
                refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />}
            >
                {(isLoading || isRefreshing) ? (
                    <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>
                        <CsrFormSkeleton />
                    </Animated.View>
                ) : (
                    <>
                        <View key="content" className="space-y-4">
                            <Animated.View entering={FadeInDown.delay(100).springify()} layout={Layout.springify()}>
                                {/* SECTION: Product To Service */}
                                <View className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
                                    <Text className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Product To Service</Text>

                                    <View>
                                        {/* --- Product To Service Fields --- */}
                                        <View className="mb-4">
                                            <Text className="text-sm font-bold text-gray-700 mb-2">Serial Number</Text>
                                            <TextInput
                                                className="bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 focus:border-[#9e0b0f] text-gray-900"
                                                value={formData.sn_number}
                                                onChangeText={(text) => handleChange('sn_number', text)}
                                            />
                                        </View>
                                        <View className="mb-4">
                                            <Text className="text-sm font-bold text-gray-700 mb-2">Product Name <Text className="text-red-500">*</Text></Text>
                                            <View className="border border-gray-200 rounded-xl bg-gray-50">
                                                <Dropdown
                                                    style={{ height: 48, paddingHorizontal: 16 }}
                                                    data={DUMMY_PRODUCTS}
                                                    labelField="label"
                                                    valueField="value"
                                                    placeholder="Select Product"
                                                    value={formData.id_product}
                                                    onChange={item => handleChange('id_product', item.value)}
                                                    selectedTextStyle={{ color: '#111827', fontSize: 14 }}
                                                    placeholderStyle={{ color: '#9ca3af', fontSize: 14 }}
                                                />
                                            </View>
                                        </View>
                                        <View className="mb-4">
                                            <Text className="text-sm font-bold text-gray-700 mb-2">Delivery Order</Text>
                                            <TextInput
                                                className="bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 focus:border-[#9e0b0f] text-gray-900"
                                                value={formData.do_code}
                                                onChangeText={(text) => handleChange('do_code', text)}
                                            />
                                        </View>
                                        <View className="mb-4 flex-row">
                                            <View className="flex-1 mr-2">
                                                <Text className="text-sm font-bold text-gray-700 mb-2">Status SO</Text>
                                                <TextInput
                                                    className="bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 focus:border-[#9e0b0f] text-gray-900"
                                                    value={formData.status_so}
                                                    onChangeText={(text) => handleChange('status_so', text)}
                                                />
                                            </View>
                                            <View className="flex-1 ml-2">
                                                <Text className="text-sm font-bold text-gray-700 mb-2">Warranty Status</Text>
                                                <TextInput
                                                    className="bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 focus:border-[#9e0b0f] text-gray-900"
                                                    value={formData.warranty_status}
                                                    onChangeText={(text) => handleChange('warranty_status', text)}
                                                />
                                            </View>
                                        </View>
                                        <View className="mb-4 flex-row">
                                            <View className="flex-1 mr-2">
                                                <Text className="text-sm font-bold text-gray-700 mb-2">Warranty Start</Text>
                                                <TouchableOpacity
                                                    className="bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 flex-row items-center justify-between"
                                                    onPress={() => setShowDatePicker({ field: 'warranty_start', visible: true })}
                                                >
                                                    <Text className={formData.warranty_start ? "text-gray-900" : "text-gray-400"}>
                                                        {formData.warranty_start ? formatDate(new Date(formData.warranty_start)) : "Select Date"}
                                                    </Text>
                                                    <Calendar size={20} color="#9ca3af" />
                                                </TouchableOpacity>
                                            </View>
                                            <View className="flex-1 ml-2">
                                                <Text className="text-sm font-bold text-gray-700 mb-2">Warranty Time</Text>
                                                <TextInput
                                                    className="bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 focus:border-[#9e0b0f] text-gray-900"
                                                    value={formData.warranty_time}
                                                    onChangeText={(text) => handleChange('warranty_time', text)}
                                                />
                                            </View>
                                        </View>

                                        {/* --- Customer Fields --- */}
                                        <Text className="text-lg font-bold text-gray-800 mt-6 mb-4 border-b border-gray-100 pb-2">Customer</Text>
                                        <View className="mb-4">
                                            <Text className="text-sm font-bold text-gray-700 mb-2 mt-2">Customers Name <Text className="text-red-500">*</Text></Text>
                                            <View className="border border-gray-200 rounded-xl bg-gray-50">
                                                <Dropdown
                                                    style={{ height: 48, paddingHorizontal: 16 }}
                                                    data={DUMMY_CUSTOMERS}
                                                    labelField="label"
                                                    valueField="value"
                                                    placeholder="Select Customer"
                                                    value={formData.customers}
                                                    onChange={item => handleChange('customers', item.value)}
                                                    selectedTextStyle={{ color: '#111827', fontSize: 14 }}
                                                    placeholderStyle={{ color: '#9ca3af', fontSize: 14 }}
                                                />
                                            </View>
                                        </View>
                                        <View className="mb-4">
                                            <Text className="text-sm font-bold text-gray-700 mb-2">Requestor <Text className="text-red-500">*</Text></Text>
                                            <View className="border border-gray-200 rounded-xl bg-gray-50">
                                                <Dropdown
                                                    style={{ height: 48, paddingHorizontal: 16 }}
                                                    data={DUMMY_KARYAWAN}
                                                    labelField="label"
                                                    valueField="value"
                                                    placeholder="Select Requestor"
                                                    value={formData.id_karyawan}
                                                    onChange={item => handleChange('id_karyawan', item.value)}
                                                    selectedTextStyle={{ color: '#111827', fontSize: 14 }}
                                                    placeholderStyle={{ color: '#9ca3af', fontSize: 14 }}
                                                />
                                            </View>
                                        </View>
                                        <View className="mb-4 flex-row justify-between">
                                            <View className="flex-1 mr-2">
                                                <Text className="text-sm font-bold text-gray-700 mb-2">Created Date</Text>
                                                <TextInput
                                                    className="bg-gray-100 px-4 py-3 rounded-xl border border-gray-200 text-gray-500"
                                                    value={formatDate(new Date())}
                                                    editable={false}
                                                />
                                            </View>
                                            <View className="flex-1 ml-2">
                                                <Text className="text-sm font-bold text-gray-700 mb-2">Date Request</Text>
                                                <TouchableOpacity
                                                    className="bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 flex-row items-center justify-between"
                                                    onPress={() => setShowDatePicker({ field: 'date_request', visible: true })}
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
                                                <TouchableOpacity className="flex-row items-center mr-8" onPress={() => handleChange('lokasi', 'Dalam Kota')}>
                                                    <View className={`w-5 h-5 rounded-full border items-center justify-center mr-2 ${formData.lokasi === 'Dalam Kota' ? 'border-[#9e0b0f]' : 'border-gray-300'}`}>
                                                        {formData.lokasi === 'Dalam Kota' && <View className="w-2.5 h-2.5 rounded-full bg-[#9e0b0f]" />}
                                                    </View>
                                                    <Text className="text-gray-700 font-medium">Dalam Kota</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity className="flex-row items-center" onPress={() => handleChange('lokasi', 'Luar Kota')}>
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
                                                <TouchableOpacity className="flex-row items-center mr-8" onPress={() => handleChange('sts_pasang', 'Pasang Baru')}>
                                                    <View className={`w-5 h-5 rounded-full border items-center justify-center mr-2 ${formData.sts_pasang === 'Pasang Baru' ? 'border-[#9e0b0f]' : 'border-gray-300'}`}>
                                                        {formData.sts_pasang === 'Pasang Baru' && <View className="w-2.5 h-2.5 rounded-full bg-[#9e0b0f]" />}
                                                    </View>
                                                    <Text className="text-gray-700 font-medium">Pasang Baru</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity className="flex-row items-center" onPress={() => handleChange('sts_pasang', 'Service')}>
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
                                                className="bg-gray-50 px-4 py-4 rounded-xl border border-gray-200 focus:border-[#9e0b0f] text-gray-900"
                                                style={{ minHeight: 120 }}
                                                value={formData.lap_kerusakan}
                                                onChangeText={(text) => handleChange('lap_kerusakan', text)}
                                                multiline
                                                numberOfLines={5}
                                                textAlignVertical="top"
                                            />
                                        </View>
                                        <View className="mb-4">
                                            <Text className="text-sm font-bold text-gray-700 mb-2">Images</Text>
                                            <View className="w-24 h-24 bg-gray-50 border border-gray-300 border-dashed rounded-xl items-center justify-center">
                                                <Text className="text-gray-400 text-xs font-medium">No Image</Text>
                                            </View>
                                        </View>

                                    </View>
                                </View>
                            </Animated.View>

                            <Animated.View entering={FadeInDown.delay(400).springify()} layout={Layout.springify()}>
                                <View className="mt-2 mb-2 space-y-3">
                                    <Button
                                        onPress={handleSave}
                                        disabled={isLoading}
                                        className="w-full h-14 rounded-2xl flex-row items-center justify-center bg-green-600"
                                        style={{ elevation: 4, shadowColor: '#16a34a', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                                    >
                                        <Save color="white" size={20} className="mr-2" />
                                        <Text className="text-white font-bold text-lg">Simpan Data</Text>
                                    </Button>
                                </View>
                            </Animated.View>
                        </View>
                    </>
                )}
            </ScrollView>
        </View>
    );
}
