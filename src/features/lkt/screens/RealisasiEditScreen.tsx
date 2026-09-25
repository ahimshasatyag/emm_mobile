import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Switch, RefreshControl, Image, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../stores';
import { CornerDownLeft, Save, UploadCloud, Check, X, Pencil, Calendar } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { MultiSelect } from "react-native-element-dropdown";
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { RealisasiEditSkeleton } from '../skeleton/RealisasiEditSkeleton';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';
import { ModalCancel } from '../../../components/ui/ModalCancel';
import { useLkt } from '../hooks/useLkt';
import { formatRp, formatInputNumber } from '../../../utils/helpers/money';
import { Realisasi } from '../types/lkt.types';
import { ImageModal } from '../components/ImageModal';
import { formatDate } from '../../../utils/helpers/date';
import { getAfsImageUrl } from '../../../utils/helpers/image';

export function RealisasiEditScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { lktCode, lktSubCode, showSuccessToast, successMessage } = route.params || {};

    const user = useSelector((state: RootState) => state.auth.user);
    const {
        currentLkt, loadLktDetail, loadTeknisiOptions, teknisiOptions,
        handleUpdateRealisasi, handleConfirmRealisasi, handleCloseRealisasi, handleCancelRealisasi,
        validateRealisasiForm
    } = useLkt();

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [toast, setToast] = useState<{ visible: boolean; type: ToastType; message: string }>({ visible: false, type: 'success', message: '' });
    const [isSaveModalVisible, setIsSaveModalVisible] = useState(false);
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
    const [isCloseModalVisible, setIsCloseModalVisible] = useState(false);
    const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);

    // Image
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [isImageModalVisible, setIsImageModalVisible] = useState(false);

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

    // State
    const [actualDescription, setActualDescription] = useState('');
    const [selectedTeknisiIds, setSelectedTeknisiIds] = useState<number[]>([]);
    const [actualDay, setActualDay] = useState('1');
    const [isDaring, setIsDaring] = useState(false);
    const [transportAmount, setTransportAmount] = useState('0');
    const [trainingAmount, setTrainingAmount] = useState('0');
    const [startingDate, setStartingDate] = useState(new Date().toISOString().split('T')[0]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [serviceAmount, setServiceAmount] = useState('0');
    const [accommodationAmount, setAccommodationAmount] = useState('0');
    const [bongkarAmount, setBongkarAmount] = useState('0');
    const [lapPenyelesaian, setLapPenyelesaian] = useState('');

    // Data realisasi
    const realisasi: Realisasi | undefined = currentLkt?.realisasi_list?.find(r => String(r.lkt_sub_code) === String(lktSubCode));

    useEffect(() => {
        loadTeknisiOptions();
        if (lktCode) {
            loadLktDetail(lktCode);
        }
    }, [lktCode]);

    useEffect(() => {
        if (showSuccessToast && successMessage) {
            setToast({ visible: true, type: 'success', message: successMessage });
            navigation.setParams({ showSuccessToast: undefined, successMessage: undefined });
        }
    }, [showSuccessToast, successMessage]);

    useEffect(() => {
        if (realisasi) {
            setActualDescription(realisasi.actual_description || '');
            setActualDay(String(realisasi.actual_day || 1));
            setIsDaring(realisasi.flag_daring === 1);
            setStartingDate(realisasi.actual_starting_date ? realisasi.actual_starting_date.slice(0, 10) : '');
            setServiceAmount(formatInputNumber(String(realisasi.actual_service_amount || 0)));
            setTransportAmount(formatInputNumber(String(realisasi.actual_transport_amount || 0)));
            setAccommodationAmount(formatInputNumber(String(realisasi.actual_accommodation_amount || 0)));
            setTrainingAmount(formatInputNumber(String(realisasi.actual_training || 0)));
            setBongkarAmount(formatInputNumber(String(realisasi.actual_bongkar || 0)));
            setSelectedTeknisiIds(realisasi.teknisi_list?.map(t => t.id_karyawan) || []);

            if (realisasi.image) {
                if (realisasi.image.startsWith('http') || realisasi.image.startsWith('file://')) {
                    setImageUri(realisasi.image);
                } else {
                    setImageUri(getAfsImageUrl(realisasi.image));
                }
            } else {
                setImageUri(null);
            }
        }
    }, [realisasi]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        if (lktCode) await loadLktDetail(lktCode);
        setIsRefreshing(false);
    };

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
        setIsLoading(true);

        const payload = {
            actual_starting_date: startingDate,
            actual_day: parseInt(actualDay, 10) || 1,
            actual_description: actualDescription,
            actual_service_amount: parseAmount(serviceAmount),
            actual_transport_amount: parseAmount(transportAmount),
            actual_accommodation_amount: parseAmount(accommodationAmount),
            actual_training: parseAmount(trainingAmount),
            actual_bongkar: parseAmount(bongkarAmount),
            flag_daring: isDaring,
            teknisi_ids: selectedTeknisiIds,
            image: imageUri?.startsWith('file://') ? imageUri : undefined,
            updated_by: user?.nm_karyawan,
        };

        const result = await handleUpdateRealisasi(lktSubCode, payload);
        setIsLoading(false);

        if (result.success) {
            setToast({ visible: true, type: 'success', message: 'Realisasi berhasil diubah' });
            setIsEditing(false);
            if (lktCode) loadLktDetail(lktCode);
        } else {
            setToast({ visible: true, type: 'error', message: result.message || 'Gagal mengubah' });
        }
    };

    const confirmAction = async (action: 'confirm' | 'close' | 'cancel') => {
        if (action === 'close' && !lapPenyelesaian.trim()) {
            setToast({ visible: true, type: 'error', message: 'Laporan penyelesaian wajib diisi!' });
            return;
        }

        setIsLoading(true);
        setIsConfirmModalVisible(false);
        setIsCloseModalVisible(false);
        setIsCancelModalVisible(false);

        let result;
        const payload: any = { user_id: user?.id, id_users_level: user?.id_users_level };

        if (action === 'confirm') result = await handleConfirmRealisasi(lktSubCode, payload);
        if (action === 'close') result = await handleCloseRealisasi(lktSubCode, { ...payload, lap_penyelesaian: lapPenyelesaian });
        if (action === 'cancel') result = await handleCancelRealisasi(lktSubCode, payload);

        setIsLoading(false);

        if (result?.success) {
            setToast({ visible: true, type: 'success', message: `Berhasil!` });
            if (lktCode) loadLktDetail(lktCode);
            if (action === 'cancel') setTimeout(() => navigation.goBack(), 1000);
        } else {
            setToast({ visible: true, type: 'error', message: result?.message || 'Gagal' });
        }
    };

    const statusUpper = (realisasi?.status || '').toUpperCase();
    const isCancelled = realisasi?.f_cancel === 1;
    const isClosed = statusUpper === 'CLOSE';
    const isDraft = statusUpper === 'DRAFT' || !realisasi?.status;
    const isOnProgress = statusUpper === 'ON PROGRESS';

    const renderActionButtons = () => {
        if (isCancelled || isClosed) return null;

        if (isDraft) {
            if (!isEditing) {
                return (
                    <View className="flex-row mb-6">
                        <TouchableOpacity className="bg-amber-500 px-3 py-2 rounded-lg flex-row items-center mr-2" onPress={() => setIsEditing(true)}>
                            <Pencil size={14} color="white" />
                            <Text className="text-white text-xs font-bold ml-1">Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="bg-emerald-500 px-3 py-2 rounded-lg flex-row items-center mr-2"
                            onPress={() => setIsConfirmModalVisible(true)}
                        >
                            <Check size={14} color="white" />
                            <Text className="text-white text-xs font-bold ml-1">Confirm</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="bg-rose-500 px-3 py-2 rounded-lg flex-row items-center mr-2"
                            onPress={() => setIsCancelModalVisible(true)}
                        >
                            <X size={14} color="white" />
                            <Text className="text-white text-xs font-bold ml-1">Cancel</Text>
                        </TouchableOpacity>
                    </View>
                );
            } else {
                return (
                    <View className="flex-row mb-6">
                        <TouchableOpacity className="bg-blue-500 px-3 py-2 rounded-lg flex-row items-center mr-2" onPress={() => setIsEditing(false)}>
                            <CornerDownLeft size={14} color="white" />
                            <Text className="text-white text-xs font-bold ml-1">Back</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-emerald-500 px-3 py-2 rounded-lg flex-row items-center mr-2" onPress={handlePreSave}>
                            <Save size={14} color="white" />
                            <Text className="text-white text-xs font-bold ml-1">Save</Text>
                        </TouchableOpacity>
                    </View>
                );
            }
        }

        if (isOnProgress) {
            return (
                <View className="flex-row mb-6">
                    <TouchableOpacity
                        className="bg-emerald-500 px-3 py-2 rounded-lg flex-row items-center mr-2"
                        onPress={() => setIsCloseModalVisible(true)}
                    >
                        <Check size={14} color="white" />
                        <Text className="text-white text-xs font-bold ml-1">Close</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="bg-rose-500 px-3 py-2 rounded-lg flex-row items-center mr-2"
                        onPress={() => setIsCancelModalVisible(true)}
                    >
                        <X size={14} color="white" />
                        <Text className="text-white text-xs font-bold ml-1">Cancel</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return null;
    };

    const getStatusColor = () => {
        if (isCancelled) return 'text-rose-600';
        if (isClosed) return 'text-emerald-600';
        if (isOnProgress) return 'text-amber-600';
        return 'text-blue-600';
    };

    const teknisiData = teknisiOptions.map(t => ({ label: t.nm_karyawan, value: t.id_karyawan }));

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 bg-gray-50">
            <ToastMessages
                visible={toast.visible}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast(prev => ({ ...prev, visible: false }))}
            />

            <ImageModal
                visible={isImageModalVisible}
                imageUrl={imageUri}
                onClose={() => setIsImageModalVisible(false)}
                onPickImage={isEditing ? () => { setIsImageModalVisible(false); pickImage(); } : undefined}
            />

            <ModalConfirm
                visible={isSaveModalVisible}
                title="Konfirmasi"
                message="Simpan perubahan realisasi visit?"
                confirmText="Ya, Simpan"
                cancelText="Batal"
                onConfirm={handleConfirmSave}
                onCancel={() => setIsSaveModalVisible(false)}
            />
            <ModalConfirm
                visible={isConfirmModalVisible}
                title="Konfirmasi"
                message="Konfirmasi realisasi menjadi ON PROGRESS?"
                confirmText="Ya, Konfirmasi"
                cancelText="Batal"
                onConfirm={() => confirmAction('confirm')}
                onCancel={() => setIsConfirmModalVisible(false)}
            />
            <ModalConfirm
                visible={isCloseModalVisible}
                title="Tutup Realisasi"
                message="Tutup (CLOSE) realisasi visit ini?"
                confirmText="Ya, Tutup"
                cancelText="Batal"
                onConfirm={() => confirmAction('close')}
                onCancel={() => {
                    setIsCloseModalVisible(false);
                    setLapPenyelesaian('');
                }}
            >
                <View className="mt-2 w-full text-left">
                    <Text className="text-xs font-bold text-gray-700 mb-1">Laporan Penyelesaian <Text className="text-red-500">*</Text></Text>
                    <TextInput
                        className="bg-gray-50 border border-gray-300 rounded-lg p-3 text-sm text-gray-800"
                        style={{ minHeight: 80, textAlignVertical: 'top' }}
                        multiline
                        placeholder="Masukkan laporan penyelesaian..."
                        value={lapPenyelesaian}
                        onChangeText={setLapPenyelesaian}
                    />
                </View>
            </ModalConfirm>
            <ModalCancel
                visible={isCancelModalVisible}
                title="Batalkan Realisasi"
                message="Batalkan realisasi visit ini?"
                confirmText="Ya, Batalkan"
                cancelText="Kembali"
                onConfirm={() => confirmAction('cancel')}
                onCancel={() => setIsCancelModalVisible(false)}
            />

            <HeaderNavigator
                title={isRefreshing ? "MEMUAT..." : (isEditing ? "EDIT VISIT" : "DETAIL VISIT")}
                showBackButton={true}
                onBackPress={() => navigation.goBack()}
            />

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 12, paddingBottom: 100 }}
                refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} colors={['#0ea5e9']} />}
            >
                {(!realisasi && isLoading) ? (
                    <RealisasiEditSkeleton />
                ) : (
                    <Animated.View entering={FadeInDown.springify()} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">

                        {/* Header Info */}
                        <View className="mb-4">
                            <Text className="text-xl font-extrabold text-slate-800">{currentLkt?.cst_code}</Text>
                            <Text className="text-base font-bold text-slate-600 mt-1">{currentLkt?.lkt_code}</Text>
                        </View>

                        {renderActionButtons()}

                        <Text className={`text-xs font-bold mb-4 italic ${getStatusColor()}`}>
                            status : ({isCancelled ? 'CANCELLED' : realisasi?.status || 'DRAFT'})
                        </Text>

                        <Text className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Laporan Kerusakan</Text>

                        <View className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-4">
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

                            <View className="mb-4">
                                <Text className="text-xs font-bold text-gray-700 mb-1">Actual Catatan Kerusakan <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className={`p-3 border border-gray-300 rounded-lg text-sm text-gray-800 ${!isEditing ? 'bg-gray-100' : 'bg-white'}`}
                                    style={{ minHeight: 80, textAlignVertical: 'top' }}
                                    multiline
                                    value={actualDescription}
                                    onChangeText={setActualDescription}
                                    placeholder="Masukkan actual catatan..."
                                    editable={isEditing}
                                />
                            </View>

                            <View className="mb-4">
                                <Text className="text-xs font-bold text-gray-700 mb-1">Images</Text>
                                <TouchableOpacity
                                    className={`border border-gray-300 border-dashed rounded-lg h-24 items-center justify-center overflow-hidden ${!isEditing ? 'bg-gray-100' : 'bg-white'}`}
                                    onPress={imageUri ? () => setIsImageModalVisible(true) : (isEditing ? pickImage : undefined)}
                                    disabled={!isEditing && !imageUri}
                                >
                                    {imageUri ? (
                                        <View className="w-full h-full relative">
                                            <Image source={{ uri: imageUri }} className="w-full h-full" resizeMode="cover" />
                                            {isEditing && (
                                                <TouchableOpacity
                                                    className="absolute top-2 right-2 bg-red-500 rounded-full p-1 shadow-sm"
                                                    onPress={() => setImageUri(null)}
                                                >
                                                    <X color="white" size={14} />
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    ) : (
                                        <View className="flex-1 items-center justify-center">
                                            <UploadCloud size={24} color={isEditing ? "#9ca3af" : "#d1d5db"} />
                                            <Text className={`text-xs mt-2 ${isEditing ? 'text-gray-500' : 'text-gray-400'}`}>Tap to upload image</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            </View>

                            <View className="mb-4">
                                <Text className="text-xs font-bold text-gray-700 mb-1">Nama Teknisi <Text className="text-red-500">*</Text></Text>
                                <View className={`border border-gray-300 rounded-lg min-h-[42px] py-1 ${!isEditing ? 'bg-gray-100' : 'bg-white'}`}>
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
                                        disable={!isEditing}
                                    />
                                </View>
                            </View>

                            <View className="flex-row mb-4">
                                <View className="flex-1 mr-3">
                                    <Text className="text-xs font-bold text-gray-700 mb-1">Actual Day <Text className="text-red-500">*</Text></Text>
                                    <TextInput
                                        className={`px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-800 ${!isEditing ? 'bg-gray-100' : 'bg-white'}`}
                                        value={actualDay}
                                        onChangeText={setActualDay}
                                        keyboardType="numeric"
                                        editable={isEditing}
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-xs font-bold text-gray-700 mb-1">Daring</Text>
                                    <View className="h-[42px] justify-center items-start">
                                        <Switch
                                            value={isDaring}
                                            onValueChange={handleDaringChange}
                                            trackColor={{ false: "#d1d5db", true: "#059669" }}
                                            disabled={!isEditing}
                                        />
                                    </View>
                                </View>
                            </View>

                            {/* Transport + Training */}
                            <View className="flex-row mb-4">
                                <View className="flex-1 mr-3">
                                    <Text className="text-xs font-bold text-gray-700 mb-1">Transport</Text>
                                    <View className={`flex-row items-center px-3 border border-gray-300 rounded-lg h-[42px] ${(!isEditing || isDaring) ? 'bg-gray-100' : 'bg-white'}`}>
                                        <Text className="text-sm text-gray-500 mr-2">Rp</Text>
                                        <TextInput
                                            className="flex-1 text-sm text-gray-800 p-0"
                                            value={transportAmount}
                                            onChangeText={(val) => setTransportAmount(formatInputNumber(val))}
                                            keyboardType="numeric"
                                            editable={isEditing && !isDaring}
                                        />
                                    </View>
                                </View>
                                <View className="flex-1">
                                    <Text className="text-xs font-bold text-gray-700 mb-1">Training</Text>
                                    <View className={`flex-row items-center px-3 border border-gray-300 rounded-lg h-[42px] ${(!isEditing || isDaring) ? 'bg-gray-100' : 'bg-white'}`}>
                                        <Text className="text-sm text-gray-500 mr-2">Rp</Text>
                                        <TextInput
                                            className="flex-1 text-sm text-gray-800 p-0"
                                            value={trainingAmount}
                                            onChangeText={(val) => setTrainingAmount(formatInputNumber(val))}
                                            keyboardType="numeric"
                                            editable={isEditing && !isDaring}
                                        />
                                    </View>
                                </View>
                            </View>

                            {/* Start Date + Service Amount */}
                            <View className="flex-row mb-4">
                                <View className="flex-1 mr-3">
                                    <Text className="text-xs font-bold text-gray-700 mb-1">Start Date</Text>
                                    <TouchableOpacity
                                        className={`border border-gray-300 rounded-lg h-[42px] flex-row items-center px-3 ${!isEditing ? 'bg-gray-100' : 'bg-white'}`}
                                        onPress={() => isEditing && setShowDatePicker(true)}
                                    >
                                        <Calendar color="#9CA3AF" size={16} />
                                        <Text className="ml-2 text-sm text-gray-800">{startingDate ? formatDate(new Date(startingDate)) : 'Pilih Tanggal'}</Text>
                                    </TouchableOpacity>
                                    {showDatePicker && isEditing && (
                                        <DateTimePicker
                                            value={startingDate ? new Date(startingDate) : new Date()}
                                            mode="date"
                                            display="default"
                                            onChange={(_, date) => {
                                                setShowDatePicker(false);
                                                if (date) {
                                                    const y = date.getFullYear();
                                                    const m = String(date.getMonth() + 1).padStart(2, '0');
                                                    const d = String(date.getDate()).padStart(2, '0');
                                                    setStartingDate(`${y}-${m}-${d}`);
                                                }
                                            }}
                                        />
                                    )}
                                </View>
                                <View className="flex-1">
                                    <Text className="text-xs font-bold text-gray-700 mb-1">Service Amount</Text>
                                    <View className={`flex-row items-center px-3 border border-gray-300 rounded-lg h-[42px] ${(!isEditing || isDaring) ? 'bg-gray-100' : 'bg-white'}`}>
                                        <Text className="text-sm text-gray-500 mr-2">Rp</Text>
                                        <TextInput
                                            className="flex-1 text-sm text-gray-800 p-0"
                                            value={serviceAmount}
                                            onChangeText={(val) => setServiceAmount(formatInputNumber(val))}
                                            keyboardType="numeric"
                                            editable={isEditing && !isDaring}
                                        />
                                    </View>
                                </View>
                            </View>

                            {/* Accommodation + Bongkar */}
                            <View className="flex-row">
                                <View className="flex-1 mr-3">
                                    <Text className="text-xs font-bold text-gray-700 mb-1">Accommodation</Text>
                                    <View className={`flex-row items-center px-3 border border-gray-300 rounded-lg h-[42px] ${(!isEditing || isDaring) ? 'bg-gray-100' : 'bg-white'}`}>
                                        <Text className="text-sm text-gray-500 mr-2">Rp</Text>
                                        <TextInput
                                            className="flex-1 text-sm text-gray-800 p-0"
                                            value={accommodationAmount}
                                            onChangeText={(val) => setAccommodationAmount(formatInputNumber(val))}
                                            keyboardType="numeric"
                                            editable={isEditing && !isDaring}
                                        />
                                    </View>
                                </View>
                                <View className="flex-1">
                                    <Text className="text-xs font-bold text-gray-700 mb-1">Bongkar</Text>
                                    <View className={`flex-row items-center px-3 border border-gray-300 rounded-lg h-[42px] ${(!isEditing || isDaring) ? 'bg-gray-100' : 'bg-white'}`}>
                                        <Text className="text-sm text-gray-500 mr-2">Rp</Text>
                                        <TextInput
                                            className="flex-1 text-sm text-gray-800 p-0"
                                            value={bongkarAmount}
                                            onChangeText={(val) => setBongkarAmount(formatInputNumber(val))}
                                            keyboardType="numeric"
                                            editable={isEditing && !isDaring}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Animated.View>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
