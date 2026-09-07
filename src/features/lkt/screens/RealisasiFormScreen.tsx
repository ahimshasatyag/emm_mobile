import React, { useEffect, useState } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity, TextInput,
    Switch, ActivityIndicator, Image, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../stores';
import { Save, UploadCloud, X, Calendar } from 'lucide-react-native';
import { MultiSelect } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';
import { useLkt } from '../hooks/useLkt';
import { formatInputNumber } from '../../../utils/helpers/money';

export function RealisasiFormScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { lktCode, cstCode } = route.params || {};

    const user = useSelector((state: RootState) => state.auth.user);
    const {
        isLoading, currentLkt, loadLktDetail,
        handleCreateRealisasi, loadTeknisiOptions, teknisiOptions,
        validateRealisasiForm
    } = useLkt();

    const [toast, setToast] = useState<{ visible: boolean; type: ToastType; message: string }>({
        visible: false, type: 'success', message: ''
    });
    const [isSaveModalVisible, setIsSaveModalVisible] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Image
    const [imageUri, setImageUri] = useState<string | null>(null);

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert('Izin Akses', 'Izin untuk mengakses galeri foto diperlukan!');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) setImageUri(result.assets[0].uri);
    };

    // Form State
    const [actualDescription, setActualDescription] = useState('');
    const [actualDay, setActualDay] = useState('1');
    const [actualStartingDate, setActualStartingDate] = useState(new Date().toISOString().split('T')[0]);
    const [isDaring, setIsDaring] = useState(false);
    const [transportAmount, setTransportAmount] = useState('0');
    const [trainingAmount, setTrainingAmount] = useState('0');
    const [serviceAmount, setServiceAmount] = useState('0');
    const [accommodationAmount, setAccommodationAmount] = useState('0');
    const [bongkarAmount, setBongkarAmount] = useState('0');
    const [selectedTeknisiIds, setSelectedTeknisiIds] = useState<number[]>([]);

    useEffect(() => {
        loadTeknisiOptions();
        if (lktCode) loadLktDetail(lktCode);
    }, []);

    const handleDaringChange = (val: boolean) => {
        setIsDaring(val);
        if (val) {
            setTransportAmount('0');
            setServiceAmount('0');
            setTrainingAmount('0');
            setBongkarAmount('0');
            setAccommodationAmount('0');
        }
    };

    const parseAmount = (v: string) => parseInt(v.replace(/\./g, ''), 10) || 0;

    const handlePreSave = () => {
        const errorMsg = validateRealisasiForm({
            nmTeknisi: selectedTeknisiIds,
            actualDay,
            actualDescription
        });
        if (errorMsg) {
            setToast({ visible: true, type: 'error', message: errorMsg });
            return;
        }
        setIsSaveModalVisible(true);
    };

    const handleConfirmSave = async () => {
        setIsSaveModalVisible(false);
        if (!lktCode) return;

        const payload = {
            actual_starting_date: actualStartingDate,
            actual_day: parseInt(actualDay, 10) || 1,
            actual_description: actualDescription,
            actual_service_amount: parseAmount(serviceAmount),
            actual_transport_amount: parseAmount(transportAmount),
            actual_accommodation_amount: parseAmount(accommodationAmount),
            actual_training: parseAmount(trainingAmount),
            actual_bongkar: parseAmount(bongkarAmount),
            flag_daring: isDaring,
            teknisi_ids: selectedTeknisiIds,
            image: imageUri || undefined,
            added_by: user?.nm_karyawan || 'Admin',
        };

        const result = await handleCreateRealisasi(lktCode, payload);
        if (result.success) {
            navigation.replace('RealisasiEdit', {
                lktCode,
                lktSubCode: result.lkt_sub_code,
                showSuccessToast: true,
                successMessage: 'Realisasi berhasil ditambahkan'
            });
        } else {
            setToast({ visible: true, type: 'error', message: result.message || 'Gagal menyimpan realisasi' });
        }
    };

    const teknisiData = teknisiOptions.map(t => ({ label: t.nm_karyawan, value: t.id_karyawan }));

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            className="bg-gray-50"
        >
            <ToastMessages
                visible={toast.visible}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast(prev => ({ ...prev, visible: false }))}
            />
            <ModalConfirm
                visible={isSaveModalVisible}
                title="Konfirmasi Simpan"
                message="Apakah Anda yakin ingin menyimpan laporan realisasi visit ini?"
                confirmText="Ya, Simpan"
                cancelText="Batal"
                onConfirm={handleConfirmSave}
                onCancel={() => setIsSaveModalVisible(false)}
            />

            <HeaderNavigator
                title="TAMBAH LAPORAN VISIT"
                showBackButton
                onBackPress={() => navigation.goBack()}
            />

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 12, paddingBottom: 100 }}
                keyboardShouldPersistTaps="handled"
            >
                <View className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    {/* Header Info */}
                    <View className="mb-4">
                        <Text className="text-xl font-extrabold text-slate-800">{cstCode || currentLkt?.cst_code || 'CST/---/--/----'}</Text>
                        <Text className="text-base font-bold text-slate-600 mt-1">{lktCode || 'LKT/---/--/----'}</Text>
                    </View>

                    {/* Action Buttons */}
                    <View className="flex-row mb-6">
                        <TouchableOpacity
                            className="bg-emerald-500 px-4 py-2 rounded-lg flex-row items-center"
                            onPress={handlePreSave}
                            disabled={isLoading}
                        >
                            {isLoading
                                ? <ActivityIndicator color="white" size="small" />
                                : <Save size={16} color="white" />
                            }
                            <Text className="text-white text-sm font-bold ml-2">Save</Text>
                        </TouchableOpacity>
                    </View>

                    <Text className="text-lg font-bold text-gray-800 mb-4">Laporan Kerusakan</Text>

                    <View className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-4">
                        {/* Catatan Kerusakan (read-only) */}
                        <View className="mb-4">
                            <Text className="text-xs font-bold text-gray-700 mb-1">Catatan Kerusakan</Text>
                            <Text className="text-sm text-gray-800 bg-gray-100 p-3 rounded-lg border border-gray-200">
                                {currentLkt?.lap_kerusakan || '-'}
                            </Text>
                        </View>

                        <View className="mb-4">
                            <Text className="text-xs font-bold text-gray-700 mb-1">Tambahan Catatan Kerusakan</Text>
                            <Text className="text-sm text-gray-800 bg-gray-100 p-3 rounded-lg border border-gray-200">
                                {currentLkt?.description || '-'}
                            </Text>
                        </View>

                        {/* Actual Catatan */}
                        <View className="mb-4">
                            <Text className="text-xs font-bold text-gray-700 mb-1">Actual Catatan Kerusakan <Text className="text-red-500">*</Text></Text>
                            <TextInput
                                className="p-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-800"
                                style={{ minHeight: 80, textAlignVertical: 'top' }}
                                multiline
                                value={actualDescription}
                                onChangeText={setActualDescription}
                                placeholder="Masukkan actual catatan..."
                            />
                        </View>

                        {/* Images */}
                        <View className="mb-4">
                            <Text className="text-xs font-bold text-gray-700 mb-1">Images</Text>
                            <TouchableOpacity
                                className="bg-white border border-gray-300 border-dashed rounded-lg overflow-hidden h-24 items-center justify-center"
                                onPress={imageUri ? () => setImageUri(null) : pickImage}
                            >
                                {imageUri ? (
                                    <View className="w-full h-full relative">
                                        <Image source={{ uri: imageUri }} className="w-full h-full" resizeMode="cover" />
                                        <TouchableOpacity
                                            className="absolute top-2 right-2 bg-red-500 rounded-full p-1"
                                            onPress={() => setImageUri(null)}
                                        >
                                            <X color="white" size={14} />
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <View className="flex-1 items-center justify-center">
                                        <UploadCloud size={24} color="#9ca3af" />
                                        <Text className="text-xs text-gray-500 mt-2">Tap to upload image</Text>
                                        <Text className="text-[10px] text-red-500 mt-1">ukuran image max 500kb</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* Nama Teknisi */}
                        <View className="mb-4">
                            <Text className="text-xs font-bold text-gray-700 mb-1">Nama Teknisi <Text className="text-red-500">*</Text></Text>
                            <View className="bg-white border border-gray-300 rounded-lg min-h-[42px] py-1">
                                <MultiSelect
                                    style={{ paddingHorizontal: 12, minHeight: 34 }}
                                    data={teknisiData}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Pilih Teknisi"
                                    value={selectedTeknisiIds}
                                    onChange={(items: any) => setSelectedTeknisiIds(items)}
                                    selectedTextStyle={{ color: '#1F2937', fontSize: 14 }}
                                    placeholderStyle={{ color: '#9CA3AF', fontSize: 14 }}
                                    selectedStyle={{ borderRadius: 8, borderColor: '#e5e7eb', backgroundColor: '#f9fafb' }}
                                />
                            </View>
                        </View>

                        {/* Actual Day + Daring */}
                        <View className="flex-row mb-4">
                            <View className="flex-1 mr-3">
                                <Text className="text-xs font-bold text-gray-700 mb-1">Actual Day <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-800"
                                    value={actualDay}
                                    onChangeText={setActualDay}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View className="flex-1">
                                <Text className="text-xs font-bold text-gray-700 mb-1">Daring</Text>
                                <View className="h-[42px] justify-center">
                                    <Switch
                                        value={isDaring}
                                        onValueChange={handleDaringChange}
                                        trackColor={{ false: '#d1d5db', true: '#059669' }}
                                    />
                                </View>
                            </View>
                        </View>

                        {/* Start Date + Service Amount */}
                        <View className="flex-row mb-4">
                            <View className="flex-1 mr-3">
                                <Text className="text-xs font-bold text-gray-700 mb-1">Start Date</Text>
                                <TouchableOpacity
                                    className="bg-white border border-gray-300 rounded-lg h-[42px] flex-row items-center px-3"
                                    onPress={() => setShowDatePicker(true)}
                                >
                                    <Calendar color="#9CA3AF" size={16} />
                                    <Text className="ml-2 text-sm text-gray-800">{actualStartingDate}</Text>
                                </TouchableOpacity>
                                {showDatePicker && (
                                    <DateTimePicker
                                        value={actualStartingDate ? new Date(actualStartingDate) : new Date()}
                                        mode="date"
                                        display="default"
                                        onChange={(_, date) => {
                                            setShowDatePicker(false);
                                            if (date) {
                                                const y = date.getFullYear();
                                                const m = String(date.getMonth() + 1).padStart(2, '0');
                                                const d = String(date.getDate()).padStart(2, '0');
                                                setActualStartingDate(`${y}-${m}-${d}`);
                                            }
                                        }}
                                    />
                                )}
                            </View>
                            <View className="flex-1">
                                <Text className="text-xs font-bold text-gray-700 mb-1">Service Amount</Text>
                                <View className={`flex-row items-center px-3 border border-gray-300 rounded-lg h-[42px] ${isDaring ? 'bg-gray-100' : 'bg-white'}`}>
                                    <Text className="text-sm text-gray-500 mr-2">Rp</Text>
                                    <TextInput
                                        className="flex-1 text-sm text-gray-800 p-0"
                                        value={serviceAmount}
                                        onChangeText={v => setServiceAmount(formatInputNumber(v))}
                                        keyboardType="numeric"
                                        editable={!isDaring}
                                    />
                                </View>
                            </View>
                        </View>

                        {/* Transport + Training */}
                        <View className="flex-row mb-4">
                            <View className="flex-1 mr-3">
                                <Text className="text-xs font-bold text-gray-700 mb-1">Transport</Text>
                                <View className={`flex-row items-center px-3 border border-gray-300 rounded-lg h-[42px] ${isDaring ? 'bg-gray-100' : 'bg-white'}`}>
                                    <Text className="text-sm text-gray-500 mr-2">Rp</Text>
                                    <TextInput
                                        className="flex-1 text-sm text-gray-800 p-0"
                                        value={transportAmount}
                                        onChangeText={v => setTransportAmount(formatInputNumber(v))}
                                        keyboardType="numeric"
                                        editable={!isDaring}
                                    />
                                </View>
                            </View>
                            <View className="flex-1">
                                <Text className="text-xs font-bold text-gray-700 mb-1">Training</Text>
                                <View className={`flex-row items-center px-3 border border-gray-300 rounded-lg h-[42px] ${isDaring ? 'bg-gray-100' : 'bg-white'}`}>
                                    <Text className="text-sm text-gray-500 mr-2">Rp</Text>
                                    <TextInput
                                        className="flex-1 text-sm text-gray-800 p-0"
                                        value={trainingAmount}
                                        onChangeText={v => setTrainingAmount(formatInputNumber(v))}
                                        keyboardType="numeric"
                                        editable={!isDaring}
                                    />
                                </View>
                            </View>
                        </View>

                        {/* Accommodation + Bongkar */}
                        <View className="flex-row">
                            <View className="flex-1 mr-3">
                                <Text className="text-xs font-bold text-gray-700 mb-1">Accommodation</Text>
                                <View className={`flex-row items-center px-3 border border-gray-300 rounded-lg h-[42px] ${isDaring ? 'bg-gray-100' : 'bg-white'}`}>
                                    <Text className="text-sm text-gray-500 mr-2">Rp</Text>
                                    <TextInput
                                        className="flex-1 text-sm text-gray-800 p-0"
                                        value={accommodationAmount}
                                        onChangeText={v => setAccommodationAmount(formatInputNumber(v))}
                                        keyboardType="numeric"
                                        editable={!isDaring}
                                    />
                                </View>
                            </View>
                            <View className="flex-1">
                                <Text className="text-xs font-bold text-gray-700 mb-1">Bongkar</Text>
                                <View className={`flex-row items-center px-3 border border-gray-300 rounded-lg h-[42px] ${isDaring ? 'bg-gray-100' : 'bg-white'}`}>
                                    <Text className="text-sm text-gray-500 mr-2">Rp</Text>
                                    <TextInput
                                        className="flex-1 text-sm text-gray-800 p-0"
                                        value={bongkarAmount}
                                        onChangeText={v => setBongkarAmount(formatInputNumber(v))}
                                        keyboardType="numeric"
                                        editable={!isDaring}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
