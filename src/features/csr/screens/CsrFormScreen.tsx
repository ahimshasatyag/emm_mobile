import React, { useState } from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Save } from 'lucide-react-native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { theme } from '../../../theme/theme';
import { useCsr } from '../hooks/useCsr';
import { Button } from '../../../components/ui/button';
import Animated, { FadeInDown, FadeOut, Layout } from 'react-native-reanimated';
import { Dropdown } from 'react-native-element-dropdown';
import { CsrFormSkeleton } from '../skeleton/CsrFormSkeleton';

export function CsrFormScreen() {
    const navigation = useNavigation<any>();
    const { submitRequest, isLoading } = useCsr();

    // Dummy form state
    const [formData, setFormData] = useState({
        customers: 'C001',
        date_request: new Date().toISOString().split('T')[0],
        product_name: '',
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

    const DUMMY_PRODUCTS = [
        { label: 'Mesin EDC Verifone', value: 'Mesin EDC Verifone' },
        { label: 'Printer Thermal', value: 'Printer Thermal' },
        { label: 'Scanner Barcode', value: 'Scanner Barcode' },
    ];

    const [isRefreshing, setIsRefreshing] = useState(false);

    const onRefresh = () => {
        setIsRefreshing(true);
        // Simulate loading external data for the form (e.g. customer lists, product lists)
        setTimeout(() => {
            setIsRefreshing(false);
        }, 1000);
    };

    const handleChange = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        if (!formData.customers || !formData.id_product || !formData.lokasi || !formData.lap_kerusakan) {
            Alert.alert('Perhatian', 'Harap lengkapi semua field yang wajib diisi.');
            return;
        }

        try {
            await submitRequest(formData);
            Alert.alert('Sukses', 'Data CSR berhasil ditambahkan.', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Gagal menyimpan data');
        }
    };

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator 
                title={isLoading ? "MENYIMPAN DATA..." : (isRefreshing ? "MEMUAT DATA..." : "TAMBAH CSR")}
                showBackButton={true}
                onBackPress={() => navigation.goBack()}
            />

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
                                <View className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                    <Text className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Product To Service</Text>

                                    <View className="space-y-3">
                                        <View>
                                            <Text className="text-gray-500 text-xs mb-1">Serial Number</Text>
                                            <TextInput
                                                className="border border-gray-200 rounded-lg px-3 py-2 text-gray-800 bg-gray-50"
                                                value={formData.sn_number}
                                                onChangeText={(text) => handleChange('sn_number', text)}
                                            />
                                        </View>
                                        <View>
                                            <Text className="text-gray-500 text-xs mb-1">Product Name <Text className="text-red-500">*</Text></Text>
                                            <View className="border border-gray-200 rounded-lg bg-gray-50 h-[42px] justify-center">
                                                <Dropdown
                                                    style={{ paddingHorizontal: 12 }}
                                                    data={DUMMY_PRODUCTS}
                                                    labelField="label"
                                                    valueField="value"
                                                    placeholder="Select Product"
                                                    value={formData.product_name}
                                                    onChange={item => handleChange('product_name', item.value)}
                                                    selectedTextStyle={{ color: '#1f2937', fontSize: 14 }}
                                                    placeholderStyle={{ color: '#9ca3af', fontSize: 14 }}
                                                />
                                            </View>
                                        </View>
                                        <View>
                                            <Text className="text-gray-500 text-xs mb-1">Delivery Order</Text>
                                            <TextInput
                                                className="border border-gray-200 rounded-lg px-3 py-2 text-gray-800 bg-gray-50"
                                                value={formData.do_code}
                                                onChangeText={(text) => handleChange('do_code', text)}
                                            />
                                        </View>
                                        <View className="flex-row">
                                            <View className="flex-1 mr-2">
                                                <Text className="text-gray-500 text-xs mb-1">Status SO</Text>
                                                <TextInput
                                                    className="border border-gray-200 rounded-lg px-3 py-2 text-gray-800 bg-gray-50"
                                                    value={formData.status_so}
                                                    onChangeText={(text) => handleChange('status_so', text)}
                                                />
                                            </View>
                                            <View className="flex-1 ml-2">
                                                <Text className="text-gray-500 text-xs mb-1">Warranty Status</Text>
                                                <TextInput
                                                    className="border border-gray-200 rounded-lg px-3 py-2 text-gray-800 bg-gray-50"
                                                    value={formData.warranty_status}
                                                    onChangeText={(text) => handleChange('warranty_status', text)}
                                                />
                                            </View>
                                        </View>
                                        <View className="flex-row">
                                            <View className="flex-1 mr-2">
                                                <Text className="text-gray-500 text-xs mb-1">Warranty Start</Text>
                                                <TextInput
                                                    className="border border-gray-200 rounded-lg px-3 py-2 text-gray-800 bg-gray-50"
                                                    value={formData.warranty_start}
                                                    onChangeText={(text) => handleChange('warranty_start', text)}
                                                />
                                            </View>
                                            <View className="flex-1 ml-2">
                                                <Text className="text-gray-500 text-xs mb-1">Warranty Time</Text>
                                                <TextInput
                                                    className="border border-gray-200 rounded-lg px-3 py-2 text-gray-800 bg-gray-50"
                                                    value={formData.warranty_time}
                                                    onChangeText={(text) => handleChange('warranty_time', text)}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </Animated.View>

                            <Animated.View entering={FadeInDown.delay(200).springify()} layout={Layout.springify()}>
                                {/* SECTION: Customer */}
                                <View className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                    <Text className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Customer</Text>

                                    <View className="space-y-3">
                                        <View>
                                            <Text className="text-gray-500 text-xs mb-1">Customers Name <Text className="text-red-500">*</Text></Text>
                                            <View className="border border-gray-200 rounded-lg bg-gray-50 h-[42px] justify-center">
                                                <Dropdown
                                                    style={{ paddingHorizontal: 12 }}
                                                    data={DUMMY_CUSTOMERS}
                                                    labelField="label"
                                                    valueField="value"
                                                    placeholder="Select Customer"
                                                    value={formData.customers}
                                                    onChange={item => handleChange('customers', item.value)}
                                                    selectedTextStyle={{ color: '#1f2937', fontSize: 14 }}
                                                    placeholderStyle={{ color: '#9ca3af', fontSize: 14 }}
                                                />
                                            </View>
                                        </View>
                                        <View>
                                            <Text className="text-gray-500 text-xs mb-1">Requestor <Text className="text-red-500">*</Text></Text>
                                            <TextInput
                                                className="border border-gray-200 rounded-lg px-3 py-2 text-gray-800 bg-gray-50"
                                                value={formData.id_karyawan}
                                                onChangeText={(text) => handleChange('id_karyawan', text)}
                                            />
                                        </View>
                                        <View className="flex-row justify-between">
                                            <View className="flex-1 mr-2">
                                                <Text className="text-gray-500 text-xs mb-1">Created Date</Text>
                                                <TextInput
                                                    className="border border-gray-200 rounded-lg px-3 py-2 text-gray-800 bg-gray-100"
                                                    value={new Date().toISOString().split('T')[0]}
                                                    editable={false}
                                                />
                                            </View>
                                            <View className="flex-1 ml-2">
                                                <Text className="text-gray-500 text-xs mb-1">Date Request</Text>
                                                <TextInput
                                                    className="border border-gray-200 rounded-lg px-3 py-2 text-gray-800 bg-gray-50"
                                                    value={formData.date_request}
                                                    onChangeText={(text) => handleChange('date_request', text)}
                                                />
                                            </View>
                                        </View>
                                        <View>
                                            <Text className="text-gray-500 text-xs mb-1">Lokasi <Text className="text-red-500">*</Text></Text>
                                            <View className="flex-row items-center space-x-4 mt-1">
                                                <TouchableOpacity className="flex-row items-center mr-4" onPress={() => handleChange('lokasi', 'Dalam Kota')}>
                                                    <View className={`w-4 h-4 rounded-full border items-center justify-center mr-2 ${formData.lokasi === 'Dalam Kota' ? 'border-blue-500' : 'border-gray-300'}`}>
                                                        {formData.lokasi === 'Dalam Kota' && <View className="w-2 h-2 rounded-full bg-blue-500" />}
                                                    </View>
                                                    <Text className="text-gray-700 text-sm">Dalam Kota</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity className="flex-row items-center" onPress={() => handleChange('lokasi', 'Luar Kota')}>
                                                    <View className={`w-4 h-4 rounded-full border items-center justify-center mr-2 ${formData.lokasi === 'Luar Kota' ? 'border-blue-500' : 'border-gray-300'}`}>
                                                        {formData.lokasi === 'Luar Kota' && <View className="w-2 h-2 rounded-full bg-blue-500" />}
                                                    </View>
                                                    <Text className="text-gray-700 text-sm">Luar Kota</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <View>
                                            <Text className="text-gray-500 text-xs mb-1">Status Pemasangan <Text className="text-red-500">*</Text></Text>
                                            <View className="flex-row items-center space-x-4 mt-1">
                                                <TouchableOpacity className="flex-row items-center mr-4" onPress={() => handleChange('sts_pasang', 'Pasang Baru')}>
                                                    <View className={`w-4 h-4 rounded-full border items-center justify-center mr-2 ${formData.sts_pasang === 'Pasang Baru' ? 'border-blue-500' : 'border-gray-300'}`}>
                                                        {formData.sts_pasang === 'Pasang Baru' && <View className="w-2 h-2 rounded-full bg-blue-500" />}
                                                    </View>
                                                    <Text className="text-gray-700 text-sm">Pasang Baru</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity className="flex-row items-center" onPress={() => handleChange('sts_pasang', 'Service')}>
                                                    <View className={`w-4 h-4 rounded-full border items-center justify-center mr-2 ${formData.sts_pasang === 'Service' ? 'border-blue-500' : 'border-gray-300'}`}>
                                                        {formData.sts_pasang === 'Service' && <View className="w-2 h-2 rounded-full bg-blue-500" />}
                                                    </View>
                                                    <Text className="text-gray-700 text-sm">Service</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </Animated.View>

                            <Animated.View entering={FadeInDown.delay(300).springify()} layout={Layout.springify()}>
                                {/* SECTION: Laporan Kerusakan */}
                                <View className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                    <Text className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Laporan Kerusakan</Text>

                                    <View className="space-y-3">
                                        <View>
                                            <Text className="text-gray-500 text-xs mb-1">Catatan Kerusakan <Text className="text-red-500">*</Text></Text>
                                            <TextInput
                                                className="border border-gray-200 rounded-lg px-3 py-3 text-gray-800 bg-gray-50"
                                                style={{ minHeight: 100 }}
                                                value={formData.lap_kerusakan}
                                                onChangeText={(text) => handleChange('lap_kerusakan', text)}
                                                multiline
                                                numberOfLines={5}
                                                textAlignVertical="top"
                                            />
                                        </View>
                                        <View>
                                            <Text className="text-gray-500 text-xs mb-1">Images</Text>
                                            <View className="w-16 h-16 bg-gray-100 border border-gray-200 rounded-lg items-center justify-center">
                                                <Text className="text-gray-400 text-xs">No Image</Text>
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
