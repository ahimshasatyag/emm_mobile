import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Save, CheckCircle, XCircle, Edit3, X } from 'lucide-react-native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { useCsr } from '../hooks/useCsr';
import { Button } from '../../../components/ui/button';
import { theme } from '../../../theme/theme';
import Animated, { FadeInUp, FadeIn, FadeOut } from 'react-native-reanimated';
import { CsrFormSkeleton } from '../skeleton/CsrFormSkeleton';

export function CsrEditScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { id } = route.params || {};

    const { currentRequest, loadRequestById, editRequest, submitConfirmCsr, submitCancelCsr, isLoading, resetCurrentRequest } = useCsr();

    const [isEditing, setIsEditing] = useState(false);

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

    useEffect(() => {
        if (id) {
            loadRequestById(id);
        }
        return () => resetCurrentRequest();
    }, [id, loadRequestById, resetCurrentRequest]);

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

    const handleUpdate = async () => {
        try {
            await editRequest(id, formData);
            Alert.alert('Sukses', 'Data CSR berhasil diupdate.', [
                { text: 'OK' }
            ]);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Gagal mengupdate data');
        }
    };

    const handleConfirm = () => {
        Alert.alert('Konfirmasi CSR', 'Apakah Anda yakin ingin mengkonfirmasi CSR ini?', [
            { text: 'Batal', style: 'cancel' },
            {
                text: 'Ya, Konfirmasi',
                onPress: async () => {
                    try {
                        await submitConfirmCsr(id);
                        Alert.alert('Sukses', 'CSR berhasil dikonfirmasi.');
                        navigation.goBack();
                    } catch (error: any) {
                        Alert.alert('Error', error.message);
                    }
                }
            }
        ]);
    };

    const handleCancel = () => {
        Alert.alert('Cancel CSR', 'Masukkan alasan pembatalan (opsional):', [
            { text: 'Batal', style: 'cancel' },
            {
                text: 'Batalkan CSR',
                onPress: async () => {
                    try {
                        await submitCancelCsr(id, 'Dibatalkan oleh user');
                        Alert.alert('Sukses', 'CSR berhasil dibatalkan.');
                        navigation.goBack();
                    } catch (error: any) {
                        Alert.alert('Error', error.message);
                    }
                }
            }
        ]);
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
                        <CsrFormSkeleton />
                    </Animated.View>
                ) : (
                    currentRequest && (
                        <>
                            <Animated.View key="content" entering={FadeIn.duration(600)}>
                                <View className="space-y-4">
                                    {/* Header Status */}
                                    <View className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex-row justify-between items-center">
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

                                    {/* SECTION: Customer */}
                                    <View className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                        <Text className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Customer</Text>

                                        <View className="space-y-3">
                                            <View>
                                                <Text className="text-gray-500 text-xs mb-1">Customers Name</Text>
                                                <TextInput
                                                    className={`border border-gray-200 rounded-lg px-3 py-2 text-gray-800 ${isReadOnly ? 'bg-gray-100' : 'bg-gray-50'}`}
                                                    value={formData.customers}
                                                    onChangeText={(text) => handleChange('customers', text)}
                                                    editable={!isReadOnly}
                                                />
                                            </View>
                                            <View>
                                                <Text className="text-gray-500 text-xs mb-1">Requestor <Text className="text-red-500">*</Text></Text>
                                                <TextInput
                                                    className={`border border-gray-200 rounded-lg px-3 py-2 text-gray-800 ${isReadOnly ? 'bg-gray-100' : 'bg-gray-50'}`}
                                                    value={currentRequest.nm_karyawan}
                                                    editable={false}
                                                />
                                            </View>
                                            <View className="flex-row justify-between">
                                                <View className="flex-1 mr-2">
                                                    <Text className="text-gray-500 text-xs mb-1">Created Date</Text>
                                                    <TextInput
                                                        className="border border-gray-200 rounded-lg px-3 py-2 text-gray-800 bg-gray-100"
                                                        value={currentRequest.csr_date}
                                                        editable={false}
                                                    />
                                                </View>
                                                <View className="flex-1 ml-2">
                                                    <Text className="text-gray-500 text-xs mb-1">Date Request</Text>
                                                    <TextInput
                                                        className={`border border-gray-200 rounded-lg px-3 py-2 text-gray-800 ${isReadOnly ? 'bg-gray-100' : 'bg-gray-50'}`}
                                                        value={formData.date_request}
                                                        onChangeText={(text) => handleChange('date_request', text)}
                                                        editable={!isReadOnly}
                                                    />
                                                </View>
                                            </View>
                                            <View>
                                                <Text className="text-gray-500 text-xs mb-1">Lokasi <Text className="text-red-500">*</Text></Text>
                                                <View className="flex-row items-center space-x-4 mt-1">
                                                    <TouchableOpacity className="flex-row items-center mr-4" onPress={() => !isReadOnly && handleChange('lokasi', 'Dalam Kota')}>
                                                        <View className={`w-4 h-4 rounded-full border items-center justify-center mr-2 ${formData.lokasi === 'Dalam Kota' ? 'border-blue-500' : 'border-gray-300'}`}>
                                                            {formData.lokasi === 'Dalam Kota' && <View className="w-2 h-2 rounded-full bg-blue-500" />}
                                                        </View>
                                                        <Text className="text-gray-700 text-sm">Dalam Kota</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity className="flex-row items-center" onPress={() => !isReadOnly && handleChange('lokasi', 'Luar Kota')}>
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
                                                    <TouchableOpacity className="flex-row items-center mr-4" onPress={() => !isReadOnly && handleChange('sts_pasang', 'Pasang Baru')}>
                                                        <View className={`w-4 h-4 rounded-full border items-center justify-center mr-2 ${formData.sts_pasang === 'Pasang Baru' ? 'border-blue-500' : 'border-gray-300'}`}>
                                                            {formData.sts_pasang === 'Pasang Baru' && <View className="w-2 h-2 rounded-full bg-blue-500" />}
                                                        </View>
                                                        <Text className="text-gray-700 text-sm">Pasang Baru</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity className="flex-row items-center" onPress={() => !isReadOnly && handleChange('sts_pasang', 'Service')}>
                                                        <View className={`w-4 h-4 rounded-full border items-center justify-center mr-2 ${formData.sts_pasang === 'Service' ? 'border-blue-500' : 'border-gray-300'}`}>
                                                            {formData.sts_pasang === 'Service' && <View className="w-2 h-2 rounded-full bg-blue-500" />}
                                                        </View>
                                                        <Text className="text-gray-700 text-sm">Service</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    </View>

                                    {/* SECTION: Laporan Kerusakan */}
                                    <View className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                        <Text className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Laporan Kerusakan</Text>

                                        <View className="space-y-3">
                                            <View>
                                                <Text className="text-gray-500 text-xs mb-1">Catatan Kerusakan <Text className="text-red-500">*</Text></Text>
                                                <TextInput
                                                    className={`border border-gray-200 rounded-lg px-3 py-3 text-gray-800 ${isReadOnly ? 'bg-gray-100' : 'bg-gray-50'}`}
                                                    style={{ minHeight: 100 }}
                                                    value={formData.lap_kerusakan}
                                                    onChangeText={(text) => handleChange('lap_kerusakan', text)}
                                                    multiline
                                                    numberOfLines={5}
                                                    textAlignVertical="top"
                                                    editable={!isReadOnly}
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

                                    {/* SECTION: Product To Service */}
                                    <View className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                        <Text className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Product To Service</Text>

                                        <View className="space-y-3">
                                            <View className="flex-row">
                                                <View className="flex-1 mr-2">
                                                    <Text className="text-gray-500 text-xs mb-1">Serial Number</Text>
                                                    <TextInput
                                                        className={`border border-gray-200 rounded-lg px-3 py-2 text-gray-800 ${isReadOnly ? 'bg-gray-100' : 'bg-gray-50'}`}
                                                        value={formData.sn_number}
                                                        onChangeText={(text) => handleChange('sn_number', text)}
                                                        editable={!isReadOnly}
                                                    />
                                                </View>
                                                <View className="flex-1 ml-2">
                                                    <Text className="text-gray-500 text-xs mb-1">Product Name</Text>
                                                    <TextInput
                                                        className={`border border-gray-200 rounded-lg px-3 py-2 text-gray-800 bg-gray-100`}
                                                        value={currentRequest.nm_product}
                                                        editable={false}
                                                    />
                                                </View>
                                            </View>

                                            <View className="flex-row">
                                                <View className="flex-1 mr-2">
                                                    <Text className="text-gray-500 text-xs mb-1">Product Category</Text>
                                                    <TextInput
                                                        className="border border-gray-200 rounded-lg px-3 py-2 text-gray-800 bg-gray-100"
                                                        value="Graphic Machinery" // Dummy
                                                        editable={false}
                                                    />
                                                </View>
                                                <View className="flex-1 ml-2">
                                                    <Text className="text-gray-500 text-xs mb-1">Delivery Order</Text>
                                                    <TextInput
                                                        className={`border border-gray-200 rounded-lg px-3 py-2 text-gray-800 ${isReadOnly ? 'bg-gray-100' : 'bg-gray-50'}`}
                                                        value={formData.do_code}
                                                        onChangeText={(text) => handleChange('do_code', text)}
                                                        editable={!isReadOnly}
                                                    />
                                                </View>
                                            </View>

                                            <View>
                                                <Text className="text-gray-500 text-xs mb-1">Internal Notes SO</Text>
                                                <TextInput
                                                    className={`border border-gray-200 rounded-lg px-3 py-2 text-gray-800 ${isReadOnly ? 'bg-gray-100' : 'bg-gray-50'}`}
                                                    value="" // Dummy
                                                    editable={!isReadOnly}
                                                />
                                            </View>

                                            {/* Warranty Info Box */}
                                            <View className="bg-blue-50 p-3 rounded-lg border border-blue-100 mt-2 space-y-2">
                                                <View className="flex-row justify-between">
                                                    <Text className="text-gray-600 text-xs">Warranty Start</Text>
                                                    <Text className="text-gray-800 text-xs font-semibold">{currentRequest.csr_date}</Text>
                                                </View>
                                                <View className="flex-row justify-between">
                                                    <Text className="text-gray-600 text-xs">Warranty Time</Text>
                                                    <Text className="text-gray-800 text-xs font-semibold">12 Months</Text>
                                                </View>
                                                <View className="flex-row justify-between">
                                                    <Text className="text-gray-600 text-xs">Warranty End</Text>
                                                    <Text className="text-gray-800 text-xs font-semibold">2027-05-06</Text>
                                                </View>
                                                <View className="flex-row justify-between">
                                                    <Text className="text-gray-600 text-xs">Warranty Status</Text>
                                                    <Text className="text-green-600 text-xs font-bold">GARANSI</Text>
                                                </View>
                                                <View className="flex-row justify-between">
                                                    <Text className="text-gray-600 text-xs">Keterangan SO</Text>
                                                    <Text className="text-gray-800 text-xs font-semibold">-</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>

                                    {/* SECTION: CST List */}
                                    <View className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                        <Text className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">CST List</Text>
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
                                                    className="w-full h-14 rounded-2xl flex-row items-center justify-center bg-indigo-600"
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
                                                onPress={async () => {
                                                    await handleUpdate();
                                                    setIsEditing(false);
                                                }}
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

        </View>
    );
}
