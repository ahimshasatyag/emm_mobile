import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { Save, Calendar, X } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { theme } from '../../../theme/theme';
import { useCsr } from '../hooks/useCsr';
import { usePaginatedDropdown } from '../hooks/usePaginatedDropdown';
import { Button } from '../../../components/ui/button';
import Animated, { FadeInDown, FadeOut, Layout } from 'react-native-reanimated';
import { Dropdown } from 'react-native-element-dropdown';
import { useSelector } from 'react-redux';
import { RootState } from '../../../stores';
import { CsrFormSkeleton } from '../skeleton/CsrFormSkeleton';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';
import { formatDate } from '../../../utils/helpers/date';
import { getBarcodeData } from '../api/csr.api';

export function CsrFormScreen() {
    const navigation = useNavigation<any>();
    const auth = useSelector((state: RootState) => state.auth);
    const user = auth?.user;
    const { submitRequest, isLoading, validateForm, formOptions, fetchOptions } = useCsr();
    const [isFetchingBarcode, setIsFetchingBarcode] = useState(false);

    useEffect(() => {
        fetchOptions();
    }, [fetchOptions]);

    const [modalVisible, setModalVisible] = useState(false);
    const [toast, setToast] = useState<{ visible: boolean; type: ToastType; message: string }>({
        visible: false,
        type: 'success',
        message: ''
    });

    const [showDatePicker, setShowDatePicker] = useState<{ field: string, visible: boolean }>({ field: '', visible: false });

    const handleDateChange = (event: any, selectedDate?: Date, forceField?: string) => {
        const field = forceField || showDatePicker.field;
        setShowDatePicker({ field: '', visible: false });
        if (event.type === 'set' && selectedDate && field) {
            const year = selectedDate.getFullYear();
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const day = String(selectedDate.getDate()).padStart(2, '0');
            handleChange(field, `${year}-${month}-${day}`);

            if (field === 'warranty_start') {
                const d12 = new Date(selectedDate);
                d12.setMonth(d12.getMonth() + 12);
                const fmt = (d: Date) => `${d.getDate()}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
                handleChange('warranty_time', `12 Month (${fmt(d12)})`);

                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const start = new Date(selectedDate);
                start.setHours(0, 0, 0, 0);
                const end = new Date(d12);
                end.setHours(0, 0, 0, 0);

                if (today >= start && today <= end) {
                    handleChange('warranty_status', 'GARANSI');
                } else {
                    handleChange('warranty_status', 'TIDAK GARANSI');
                }
            }
        }
    };

    const handleBarcodeLookup = async () => {
        if (!formData.sn_number) return;
        setIsFetchingBarcode(true);
        try {
            const result = await getBarcodeData(formData.sn_number);
            if (result.status && result.data) {
                const data = result.data;

                if (data.id_product) {
                    const matchedProduct = formOptions?.products?.find((p: any) => String(p.value) === String(data.id_product));
                    handleChange('id_product', matchedProduct ? matchedProduct.value : data.id_product);
                }
                if (data.code_do) handleChange('do_code', data.code_do);
                if (data.status_so) handleChange('status_so', data.status_so);

                if (data.id_customers) {
                    const matchedCustomer = formOptions?.customers?.find((c: any) => String(c.value) === String(data.id_customers));
                    handleChange('id_customers', matchedCustomer ? matchedCustomer.value : data.id_customers);
                    
                    if (data.provinsi === 31) {
                        handleChange('lokasi', 'Dalam Kota');
                    } else if (data.provinsi !== null && data.provinsi !== undefined && data.provinsi !== '') {
                        handleChange('lokasi', 'Luar Kota');
                    }
                }

                if (data.date_delivery) {
                    const deliveryDate = new Date(data.date_delivery);
                    if (!isNaN(deliveryDate.getTime())) {
                        handleDateChange({ type: 'set' }, deliveryDate, 'warranty_start');
                    }
                }

                setToast({ visible: true, type: 'success', message: 'Data ditemukan & berhasil diisi.' });
            }
        } catch (error: any) {
            setToast({ visible: true, type: 'error', message: error.response?.data?.message || 'Barcode tidak ditemukan' });
        } finally {
            setIsFetchingBarcode(false);
        }
    };

    const [formData, setFormData] = useState({
        id_customers: '',
        date_request: (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; })(),
        id_product: '',
        sn_number: '',
        sts_pasang: '',
        do_code: '',
        status_so: '',
        warranty_start: '',
        warranty_time: '',
        warranty_status: '',
        id_karyawan: '',
        lokasi: '',
        lap_kerusakan: '',
        link_foto: '' // use link_foto instead of image to match payload expectation
    });

    const customersOptions = formOptions?.customers || [];
    const karyawanOptions = formOptions?.karyawan || [];
    const productsOptions = formOptions?.products || [];

    const pCustomers = usePaginatedDropdown(customersOptions, formData.id_customers);
    const pKaryawan = usePaginatedDropdown(karyawanOptions, formData.id_karyawan);
    const pProducts = usePaginatedDropdown(productsOptions, formData.id_product);

    const renderFooter = (loading: boolean) => {
        if (!loading) return null;
        return (
            <View style={{ paddingVertical: 10 }}>
                <ActivityIndicator size="small" color="#9e0b0f" />
            </View>
        );
    };

    const handleChange = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 0.8,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            handleChange('link_foto', result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        // Create an alias for validation to match the required fields
        const validationPayload = {
            ...formData,
            customers: formData.id_customers, 
        };
        const errorMsg = validateForm(validationPayload);
        if (errorMsg) {
            setToast({ visible: true, type: 'error', message: errorMsg });
            return;
        }

        setModalVisible(true);
    };

    const handleConfirmSave = async () => {
        setModalVisible(false);
        try {
            const result = await submitRequest({ 
                ...formData, 
                csr_by: user?.name || user?.username || 'Unknown User',
            });

            navigation.replace('CsrEditScreen', { id: result.data?.id_afs_csr || result.id || result.kode, showSuccessToast: true, successMessage: 'Data CSR berhasil ditambahkan.' });
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
                title={isLoading ? "MENYIMPAN DATA..." : "TAMBAH CSR"}
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
            >
                {isLoading && !formOptions.customers?.length ? (
                    <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>
                        <CsrFormSkeleton />
                    </Animated.View>
                ) : (
                    <View key="content" className="space-y-4">
                        <Animated.View entering={FadeInDown.delay(100).springify()} layout={Layout.springify()}>
                            <View className="bg-white rounded-3xl p-5 mb-6 shadow-sm border border-gray-100">
                                <Text className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Product To Service</Text>

                                <View className="mb-4">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Serial Number</Text>
                                    <View className="flex-row justify-between items-center mb-2" style={{ position: "absolute", right: 10, top: 40, zIndex: 1 }}>{isFetchingBarcode && <ActivityIndicator size="small" color="#9e0b0f" />}</View>
                                    <TextInput 
                                        className="bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 text-gray-800" 
                                        placeholder="Masukkan Serial Number" 
                                        placeholderTextColor="#9ca3af" 
                                        value={formData.sn_number} 
                                        onChangeText={(text) => handleChange('sn_number', text)} 
                                        onBlur={handleBarcodeLookup} 
                                        onSubmitEditing={handleBarcodeLookup} 
                                        returnKeyType="search" 
                                    />
                                </View>
                                <View className="mb-4">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Product Name <Text className="text-red-500">*</Text></Text>
                                    <View className="border border-gray-200 rounded-xl bg-gray-50">
                                        <Dropdown
                                            style={{ height: 48, paddingHorizontal: 16 }}
                                            search={true}
                                            searchPlaceholder="Cari..."
                                            onChangeText={(text) => pProducts.setSearchQuery(text)}
                                            data={pProducts.paginatedData}
                                            flatListProps={{ onEndReached: pProducts.loadMore, onEndReachedThreshold: 0.5, ListFooterComponent: () => renderFooter(pProducts.loading) }}
                                            labelField="label"
                                            valueField="value"
                                            placeholder="Select Product"
                                            value={formData.id_product}
                                            onChange={item => { handleChange('id_product', item.value); pProducts.setSearchQuery(''); }}
                                            selectedTextStyle={{ color: '#111827', fontSize: 14 }}
                                            placeholderStyle={{ color: '#9ca3af', fontSize: 14 }}
                                        />
                                    </View>
                                </View>
                                <View className="mb-4">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Delivery Order</Text>
                                    <TextInput className="bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 text-gray-800" placeholder="Masukkan DO" placeholderTextColor="#9ca3af" value={formData.do_code} onChangeText={(text) => handleChange('do_code', text)} />
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
                                        <TextInput className="bg-gray-100 px-4 py-3 rounded-xl border border-gray-200 text-gray-500" value={formData.warranty_time} onChangeText={(text) => handleChange('warranty_time', text)} editable={false} />
                                    </View>
                                </View>
                                <View className="mb-4 flex-row">
                                    <View className="flex-1 mr-2">
                                        <Text className="text-sm font-bold text-gray-700 mb-2">Status SO</Text>
                                        <TextInput className="bg-gray-100 px-4 py-3 rounded-xl border border-gray-200 text-gray-500" value={formData.status_so} onChangeText={(text) => handleChange('status_so', text)} editable={false} />
                                    </View>
                                    <View className="flex-1 ml-2">
                                        <Text className="text-sm font-bold text-gray-700 mb-2">Warranty Status</Text>
                                        <TextInput className="bg-gray-100 px-4 py-3 rounded-xl border border-gray-200 text-gray-500" value={formData.warranty_status} onChangeText={(text) => handleChange('warranty_status', text)} editable={false} />
                                    </View>
                                </View>

                                {/* --- Customer Fields --- */}
                                <Text className="text-lg font-bold text-gray-800 mt-6 mb-4 border-b border-gray-100 pb-2">Customer</Text>
                                <View className="mb-4">
                                    <Text className="text-sm font-bold text-gray-700 mb-2 mt-2">Customers Name <Text className="text-red-500">*</Text></Text>
                                    <View className="border border-gray-200 rounded-xl bg-gray-50">
                                        <Dropdown
                                            style={{ height: 48, paddingHorizontal: 16 }}
                                            search={true}
                                            searchPlaceholder="Cari..."
                                            onChangeText={(text) => pCustomers.setSearchQuery(text)}
                                            data={pCustomers.paginatedData}
                                            flatListProps={{ onEndReached: pCustomers.loadMore, onEndReachedThreshold: 0.5, ListFooterComponent: () => renderFooter(pCustomers.loading) }}
                                            labelField="label"
                                            valueField="value"
                                            placeholder="Select Customer"
                                            value={formData.id_customers}
                                            onChange={item => {
                                                handleChange('id_customers', item.value);
                                                pCustomers.setSearchQuery('');
                                                if (item.provinsi === 31) {
                                                    handleChange('lokasi', 'Dalam Kota');
                                                } else if (item.provinsi !== null && item.provinsi !== undefined && item.provinsi !== '') {
                                                    handleChange('lokasi', 'Luar Kota');
                                                }
                                            }}
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
                                            search={true}
                                            searchPlaceholder="Cari..."
                                            onChangeText={(text) => pKaryawan.setSearchQuery(text)}
                                            data={pKaryawan.paginatedData}
                                            flatListProps={{ onEndReached: pKaryawan.loadMore, onEndReachedThreshold: 0.5, ListFooterComponent: () => renderFooter(pKaryawan.loading) }}
                                            labelField="label"
                                            valueField="value"
                                            placeholder="Select Requestor"
                                            value={formData.id_karyawan}
                                            onChange={item => { handleChange('id_karyawan', item.value); pKaryawan.setSearchQuery(''); }}
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
                                        className="bg-gray-50 px-4 py-4 rounded-xl border border-gray-200 text-gray-900"
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
                                    <View className="relative w-24 h-24">
                                        <TouchableOpacity
                                            onPress={() => pickImage()}
                                            className="w-full h-full bg-gray-50 border border-gray-300 border-dashed rounded-xl items-center justify-center overflow-hidden"
                                        >
                                            {formData.link_foto ? (
                                                <Image source={{ uri: formData.link_foto }} className="w-full h-full" resizeMode="cover" />
                                            ) : (
                                                <Text className="text-gray-400 text-xs font-medium">Upload Image</Text>
                                            )}
                                        </TouchableOpacity>
                                        {formData.link_foto ? (
                                            <TouchableOpacity
                                                style={{ position: 'absolute', top: -8, right: -8, backgroundColor: '#EF4444', borderRadius: 12, padding: 4, zIndex: 10 }}
                                                onPress={() => handleChange('link_foto', '')}
                                            >
                                                <X color="white" size={14} />
                                            </TouchableOpacity>
                                        ) : null}
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
                )}
            </ScrollView>
        </View>
    );
}
