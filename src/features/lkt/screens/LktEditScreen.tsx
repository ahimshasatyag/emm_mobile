import React, { useEffect, useState, useCallback } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity, TextInput,
    RefreshControl, Image, ActivityIndicator
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../stores';
import {
    Check, X, CornerDownLeft, Pencil, Save, Plus, Trash2, UploadCloud,
    Calendar, Printer, Car, Eye
} from 'lucide-react-native';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { useLkt } from '../hooks/useLkt';
import { LktHeaderViewScreen } from './LktHeaderViewScreen';
import { RealisasiListView } from './RealisasiListScreen';
import { SparepartModal } from '../components/SparepartModal';
import { ImageModal } from '../components/ImageModal';
import { LktEditSkeleton } from '../skeleton/LktEditSkeleton';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';
import { ModalCancel } from '../../../components/ui/ModalCancel';
import { formatRp, formatInputNumber } from '../../../utils/helpers/money';
import { getAfsImageUrl } from '../../../utils/helpers/image';

export function LktEditScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { id: lktCode, showSuccessToast, successMessage } = route.params || {};

    const user = useSelector((state: RootState) => state.auth.user);
    const {
        currentLkt, isLoading, error,
        loadLktDetail, handleUpdateLkt, handleDoneLkt, handleCancelLkt,
        resetCurrentLkt, validateLktForm
    } = useLkt();

    const [toast, setToast] = useState<{ visible: boolean; type: ToastType; message: string }>({
        visible: false, type: 'success', message: ''
    });
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState<'perbaikan' | 'realisasi'>('perbaikan');
    const [isEditing, setIsEditing] = useState(false);
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [isImageModalVisible, setIsImageModalVisible] = useState(false);
    const [bastUri, setBastUri] = useState<string | null>(null);
    const [isBastModalVisible, setIsBastModalVisible] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Form states
    const [description, setDescription] = useState('');
    const [estimationDay, setEstimationDay] = useState('1');
    const [startingDate, setStartingDate] = useState('');
    const [serviceAmount, setServiceAmount] = useState('0');
    const [transportAmount, setTransportAmount] = useState('0');
    const [accommodationAmount, setAccommodationAmount] = useState('0');
    const [typeTransport, setTypeTransport] = useState('Mobil');
    const [parts, setParts] = useState<any[]>([]);

    // Modals
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isSaveModalVisible, setIsSaveModalVisible] = useState(false);
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
    const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);

    const transportOptions = [
        { label: 'Mobil', value: 'Mobil' },
        { label: 'Motor', value: 'Motor' },
        { label: 'Lain - lain', value: 'Lain - lain' }
    ];

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) setImageUri(result.assets[0].uri);
    };

    useEffect(() => {
        if (showSuccessToast && successMessage) {
            setToast({ visible: true, type: 'success', message: successMessage });
            navigation.setParams({ showSuccessToast: undefined, successMessage: undefined });
        }
    }, [showSuccessToast, successMessage]);

    useEffect(() => {
        if (lktCode) loadLktDetail(lktCode);
        return () => { resetCurrentLkt(); };
    }, [lktCode]);

    useEffect(() => {
        if (currentLkt) {
            setDescription(currentLkt.description || '');
            setEstimationDay(String(currentLkt.estimation_day || 1));
            setStartingDate(currentLkt.starting_date ? currentLkt.starting_date.slice(0, 10) : '');
            setServiceAmount(formatInputNumber(String(currentLkt.service_amount || 0)));
            setTransportAmount(formatInputNumber(String(currentLkt.transport_amount || 0)));
            setAccommodationAmount(formatInputNumber(String(currentLkt.accommodation_amount || 0)));
            setTypeTransport(currentLkt.actual_transport || 'Mobil');
            setParts(currentLkt.parts ? [...currentLkt.parts] : []);
            // Image: if it's a filename (not a full URL), prefix with server path
            const img = currentLkt.image;
            if (img && (img.startsWith('http') || img.startsWith('file://'))) {
                setImageUri(img);
            } else {
                setImageUri(img ? getAfsImageUrl(img) : null);
            }

            const bastImg = currentLkt.bast;
            if (bastImg && (bastImg.startsWith('http') || bastImg.startsWith('file://'))) {
                setBastUri(bastImg);
            } else {
                setBastUri(bastImg ? getAfsImageUrl(bastImg) : null);
            }
        }
    }, [currentLkt]);

    const handleRefresh = useCallback(async () => {
        setIsRefreshing(true);
        if (lktCode) await loadLktDetail(lktCode);
        setIsRefreshing(false);
    }, [lktCode]);

    const isCancelled = currentLkt?.f_cancel === 1;
    const isDone = currentLkt?.flag_done === 'DONE' || currentLkt?.flag_done === 'CLOSE';
    const isLktOnProgress = currentLkt?.flag_done === 'ON PROGRESS';
    const isReadOnly = isDone || isCancelled;
    const hasRealisasiClose = currentLkt?.realisasi_list?.some(r => r.status === 'CLOSE');

    const handleSave = async () => {
        setIsSaveModalVisible(false);
        if (!lktCode) return;

        const errorMsg = validateLktForm({ typeTransport, description, startingDate });
        if (errorMsg) {
            setToast({ visible: true, type: 'error', message: errorMsg });
            return;
        }

        const payload = {
            description,
            estimation_day: parseInt(estimationDay) || 1,
            starting_date: startingDate,
            service_amount: parseInt(serviceAmount.replace(/\D/g, '')) || 0,
            transport_amount: parseInt(transportAmount.replace(/\D/g, '')) || 0,
            accommodation_amount: parseInt(accommodationAmount.replace(/\D/g, '')) || 0,
            type_transport: typeTransport,
            image: imageUri?.startsWith('file://') ? imageUri : undefined,
            parts,
            updated_by: user?.nm_karyawan,
            user_id: user?.id,
            id_users_level: user?.id_users_level,
        };

        const result = await handleUpdateLkt(lktCode, payload);
        if (result.success) {
            setToast({ visible: true, type: 'success', message: 'Data berhasil disimpan' });
            setIsEditing(false);
            loadLktDetail(lktCode);
        } else {
            setToast({ visible: true, type: 'error', message: result.message || 'Gagal menyimpan' });
        }
    };

    const onDone = async () => {
        setIsConfirmModalVisible(false);
        const result = await handleDoneLkt(lktCode!, {
            done_by: user?.nm_karyawan,
            user_id: user?.id,
            id_users_level: user?.id_users_level,
        });
        if (result.success) {
            setToast({ visible: true, type: 'success', message: 'LKT berhasil di-Proses' });
            loadLktDetail(lktCode!);
        } else {
            setToast({ visible: true, type: 'error', message: result.message || 'Gagal' });
        }
    };

    const onCancel = async () => {
        setIsCancelModalVisible(false);
        const result = await handleCancelLkt(lktCode!, {
            cancel_by: user?.nm_karyawan,
            user_id: user?.id,
            id_users_level: user?.id_users_level,
        });
        if (result.success) {
            setToast({ visible: true, type: 'success', message: 'LKT berhasil dibatalkan' });
            setTimeout(() => navigation.navigate('Drawer', { screen: 'LktListScreen' }), 1000);
        } else {
            setToast({ visible: true, type: 'error', message: result.message || 'Gagal' });
        }
    };

    const renderButtons = () => (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-4"
            contentContainerStyle={{ flexDirection: 'row', alignItems: 'center' }}
        >
            <TouchableOpacity
                className="bg-blue-400 px-3 py-2 rounded flex-row items-center mr-2"
                onPress={() => {
                        if (isEditing) {
                            setIsEditing(false);
                        } else {
                            if (currentLkt?.cst_code) {
                                navigation.navigate('CstEditScreen', { id: currentLkt.cst_code });
                            } else {
                                navigation.goBack();
                            }
                        }
                }}
            >
                <CornerDownLeft size={14} color="white" />
                <Text className="text-white text-xs font-bold ml-1">Back</Text>
            </TouchableOpacity>

            {!isReadOnly && !isLktOnProgress && (
                <TouchableOpacity
                    className={`px-3 py-2 rounded flex-row items-center mr-2 ${isEditing ? 'bg-emerald-500' : 'bg-amber-500'}`}
                    onPress={() => {
                        if (isEditing) setIsSaveModalVisible(true);
                        else setIsEditing(true);
                    }}
                >
                    {isEditing ? <Save size={14} color="white" /> : <Pencil size={14} color="white" />}
                    <Text className="text-white text-xs font-bold ml-1">{isEditing ? 'Save' : 'Edit'}</Text>
                </TouchableOpacity>
            )}

            {!isEditing && (
                <>
                    {!isReadOnly && !isLktOnProgress && (
                        <>
                            <TouchableOpacity
                                className="bg-emerald-500 px-3 py-2 rounded flex-row items-center mr-2"
                                onPress={() => setIsConfirmModalVisible(true)}
                            >
                                <Check size={14} color="white" />
                                <Text className="text-white text-xs font-bold ml-1">Done</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="bg-red-500 px-3 py-2 rounded flex-row items-center mr-2"
                                onPress={() => setIsCancelModalVisible(true)}
                            >
                                <X size={14} color="white" />
                                <Text className="text-white text-xs font-bold ml-1">Cancel</Text>
                            </TouchableOpacity>
                        </>
                    )}

                    {isLktOnProgress && hasRealisasiClose && (
                        <TouchableOpacity
                            className="bg-teal-500 px-3 py-2 rounded flex-row items-center mr-2"
                            onPress={() => navigation.navigate('LktEditCloseScreen', { lktCode })}
                        >
                            <Check size={14} color="white" />
                            <Text className="text-white text-xs font-bold ml-1">Close LKT</Text>
                        </TouchableOpacity>
                    )}

                    {!isCancelled && (
                        <>
                            <TouchableOpacity
                                className="bg-sky-500 px-3 py-2 rounded flex-row items-center mr-2"
                                onPress={() => navigation.navigate('LktPrintLabel', { lktCode })}
                            >
                                <Printer size={14} color="white" />
                                <Text className="text-white text-xs font-bold ml-1">Print Label</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="bg-purple-500 px-3 py-2 rounded flex-row items-center mr-2"
                                onPress={() => navigation.navigate('LktPrintDinas', { lktCode })}
                            >
                                <Car size={14} color="white" />
                                <Text className="text-white text-xs font-bold ml-1">Perjalanan Dinas</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="bg-orange-500 px-3 py-2 rounded flex-row items-center mr-2"
                                onPress={() => navigation.navigate('LktPrintBast', { lktCode })}
                            >
                                <Printer size={14} color="white" />
                                <Text className="text-white text-xs font-bold ml-1">Print BAST</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="bg-indigo-500 px-3 py-2 rounded flex-row items-center mr-2"
                                onPress={() => navigation.navigate('LktViewBast', { lktCode, cstCode: currentLkt?.cst_code })}
                            >
                                <Eye size={14} color="white" />
                                <Text className="text-white text-xs font-bold ml-1">View BAST</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </>
            )}
        </ScrollView>
    );

    if (activeTab === 'realisasi') {
        return (
            <RealisasiListView
                setActiveTab={setActiveTab}
                lktCode={lktCode}
                lktDetail={currentLkt}
            />
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

            <ImageModal
                visible={isBastModalVisible}
                imageUrl={bastUri}
                onClose={() => setIsBastModalVisible(false)}
            />

            <ModalConfirm
                visible={isSaveModalVisible}
                title="Konfirmasi"
                message="Apakah Anda yakin ingin menyimpan perubahan?"
                confirmText="Ya, Simpan"
                cancelText="Batal"
                onConfirm={handleSave}
                onCancel={() => setIsSaveModalVisible(false)}
            />
            <ModalConfirm
                visible={isConfirmModalVisible}
                title="Done LKT"
                message="Tandai LKT ini sebagai ON PROGRESS?"
                confirmText="Ya, Done!"
                cancelText="Batal"
                onConfirm={onDone}
                onCancel={() => setIsConfirmModalVisible(false)}
            />
            <ModalCancel
                visible={isCancelModalVisible}
                title="Batalkan LKT"
                message="Membatalkan LKT akan mereset CST dan CSR ke OUTSTANDING. Lanjutkan?"
                confirmText="Ya, Batalkan!"
                cancelText="Kembali"
                onConfirm={onCancel}
                onCancel={() => setIsCancelModalVisible(false)}
            />

            <LktHeaderViewScreen
                activeTab={activeTab}
                setActiveTab={(tab) => { if (isEditing) setIsEditing(false); setActiveTab(tab); }}
                titleHeader={isLoading ? 'MEMUAT DATA...' : (isEditing ? 'EDIT LKT' : 'DETAIL LKT')}
                cstCode={currentLkt?.cst_code}
                lktCode={currentLkt?.lkt_code}
                onBackPress={() => {
                    if (isEditing) {
                        setIsEditing(false);
                    } else {
                        navigation.navigate('Drawer', { screen: 'LktListScreen' });
                    }
                }}
            >
                {(isLoading && !currentLkt) ? (
                    <LktEditSkeleton />
                ) : (
                    <ScrollView
                        className="flex-1 pt-2"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 100 }}
                        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} colors={['#0ea5e9']} />}
                    >
                        {error && !currentLkt ? (
                            <View className="py-20 items-center">
                                <Text className="text-red-500 font-bold mb-2">Gagal Memuat</Text>
                                <Text className="text-gray-400 text-xs text-center">{error}</Text>
                            </View>
                        ) : currentLkt ? (
                            <View>
                                {renderButtons()}

                                <Text className={`font-bold mb-4 text-xs italic ${isCancelled ? 'text-red-600' : isDone ? 'text-green-600' : 'text-blue-600'}`}>
                                    Status : ({isCancelled ? 'CANCELLED' : currentLkt?.flag_done || 'DRAFT'})
                                </Text>

                                <Text className="text-base font-bold text-gray-900 mb-2">Laporan Kerusakan</Text>

                                <View className="bg-white p-4 rounded-xl border border-gray-300 mb-4">
                                    {/* Lap Kerusakan (read-only) */}
                                    <View className="mb-5">
                                        <Text className="text-xs font-bold text-gray-700 mb-2">Catatan Kerusakan</Text>
                                        <View className="bg-gray-100 p-3 rounded-lg border border-gray-200">
                                            <Text className="text-sm text-gray-800">{currentLkt.lap_kerusakan || '-'}</Text>
                                        </View>
                                    </View>

                                    {/* Description editable */}
                                    <View className="mb-5">
                                        <Text className="text-xs font-bold text-gray-700 mb-2">Tambahan Catatan Kerusakan</Text>
                                        <TextInput
                                            className={`p-3 border border-gray-300 rounded-lg text-sm text-gray-800 ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
                                            style={{ minHeight: 80, textAlignVertical: 'top' }}
                                            multiline
                                            value={description}
                                            onChangeText={setDescription}
                                            editable={isEditing}
                                        />
                                    </View>

                                    {/* Teknisi */}
                                    <View className="mb-5">
                                        <Text className="text-xs font-bold text-gray-700 mb-2">Nama Teknisi</Text>
                                        <View className="bg-blue-50 p-3 border border-blue-200 rounded-lg">
                                            <Text className="text-sm text-blue-700 font-bold">
                                                {(() => {
                                                    const valid = currentLkt.realisasi_list?.filter(
                                                        r => ['ON PROGRESS', 'CLOSE'].includes(r.status?.toUpperCase?.() || '') && r.f_cancel !== 1
                                                    ) || [];
                                                    const names = valid.flatMap(r => r.teknisi_list?.map(t => t.nm_karyawan) || []);
                                                    const unique = [...new Set(names.filter(Boolean))];
                                                    return unique.length > 0 ? unique.join(', ') : '-';
                                                })()}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Image */}
                                    <View className="mb-5">
                                        <Text className="text-xs font-bold text-gray-700 mb-2">Images</Text>
                                        <TouchableOpacity
                                            className="bg-gray-50 border border-gray-300 border-dashed rounded-lg items-center justify-center overflow-hidden h-28"
                                            onPress={isEditing ? pickImage : undefined}
                                        >
                                            {imageUri ? (
                                                <View className="w-full h-full relative">
                                                    <Image source={{ uri: imageUri }} className="w-full h-full" resizeMode="cover" />
                                                    {isEditing && (
                                                        <TouchableOpacity
                                                            className="absolute top-2 right-2 bg-red-500 rounded-full p-1"
                                                            onPress={() => setImageUri(null)}
                                                        >
                                                            <X color="white" size={14} />
                                                        </TouchableOpacity>
                                                    )}
                                                </View>
                                            ) : (
                                                <View className="items-center justify-center p-4">
                                                    <UploadCloud size={22} color={isEditing ? '#6b7280' : '#d1d5db'} />
                                                    <Text className={`text-xs mt-1 ${isEditing ? 'text-gray-500' : 'text-gray-300'}`}>
                                                        {isEditing ? 'Klik untuk Upload Foto' : 'Tidak ada gambar'}
                                                    </Text>
                                                </View>
                                            )}
                                        </TouchableOpacity>
                                    </View>

                                    <View className="h-px bg-gray-200 mb-5" />

                                    {/* Serial Number */}
                                    <View className="mb-5">
                                        <Text className="text-xs font-bold text-gray-700 mb-2">Serial Number / Barcode</Text>
                                        <View className="bg-gray-100 px-3 py-2 border border-gray-200 rounded-lg">
                                            <Text className="text-sm text-gray-800">{currentLkt.barcode || '-'}</Text>
                                        </View>
                                    </View>

                                    {/* Estimation Day + Start Date */}
                                    <View className="flex-row space-x-3 mb-5">
                                        <View className="flex-1">
                                            <Text className="text-xs font-bold text-gray-700 mb-2">Estimation Day</Text>
                                            <TextInput
                                                className={`px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-800 ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
                                                value={estimationDay}
                                                onChangeText={setEstimationDay}
                                                editable={isEditing}
                                                keyboardType="numeric"
                                            />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-xs font-bold text-gray-700 mb-2">Start Date <Text className="text-red-500">*</Text></Text>
                                            <TouchableOpacity
                                                className={`border border-gray-300 rounded-lg h-[42px] flex-row items-center px-3 ${!isEditing ? 'bg-gray-100' : 'bg-white'}`}
                                                onPress={() => isEditing && setShowDatePicker(true)}
                                            >
                                                <Calendar color="#9CA3AF" size={16} />
                                                <Text className="ml-2 text-sm text-gray-800">{startingDate || 'Pilih'}</Text>
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
                                    </View>

                                    {/* Amounts */}
                                    <View className="flex-row space-x-3 mb-5">
                                        <View className="flex-1">
                                            <Text className="text-xs font-bold text-gray-700 mb-2">Service Amount</Text>
                                            <View className={`flex-row items-center px-3 border border-gray-300 rounded-lg h-[42px] ${isEditing ? 'bg-white' : 'bg-gray-100'}`}>
                                                <Text className="text-sm text-gray-500 mr-2">Rp</Text>
                                                <TextInput
                                                    className="flex-1 text-sm text-gray-800 p-0"
                                                    value={serviceAmount}
                                                    onChangeText={v => setServiceAmount(formatInputNumber(v))}
                                                    editable={isEditing}
                                                    keyboardType="numeric"
                                                />
                                            </View>
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-xs font-bold text-gray-700 mb-2">Transport</Text>
                                            <View className={`flex-row items-center px-3 border border-gray-300 rounded-lg h-[42px] ${isEditing ? 'bg-white' : 'bg-gray-100'}`}>
                                                <Text className="text-sm text-gray-500 mr-2">Rp</Text>
                                                <TextInput
                                                    className="flex-1 text-sm text-gray-800 p-0"
                                                    value={transportAmount}
                                                    onChangeText={v => setTransportAmount(formatInputNumber(v))}
                                                    editable={isEditing}
                                                    keyboardType="numeric"
                                                />
                                            </View>
                                        </View>
                                    </View>

                                    <View className="flex-row space-x-3 mb-5">
                                        <View className="flex-1">
                                            <Text className="text-xs font-bold text-gray-700 mb-2">Type Transport <Text className="text-red-500">*</Text></Text>
                                            <View className={`border border-gray-300 rounded-lg justify-center h-[42px] ${isEditing ? 'bg-white' : 'bg-gray-100'}`}>
                                                <Dropdown
                                                    style={{ paddingHorizontal: 12 }}
                                                    data={transportOptions}
                                                    labelField="label"
                                                    valueField="value"
                                                    placeholder="Pilih"
                                                    value={typeTransport}
                                                    onChange={item => setTypeTransport(item.value)}
                                                    selectedTextStyle={{ color: '#1F2937', fontSize: 14 }}
                                                    disable={!isEditing}
                                                />
                                            </View>
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-xs font-bold text-gray-700 mb-2">Accommodation</Text>
                                            <View className={`flex-row items-center px-3 border border-gray-300 rounded-lg h-[42px] ${isEditing ? 'bg-white' : 'bg-gray-100'}`}>
                                                <Text className="text-sm text-gray-500 mr-2">Rp</Text>
                                                <TextInput
                                                    className="flex-1 text-sm text-gray-800 p-0"
                                                    value={accommodationAmount}
                                                    onChangeText={v => setAccommodationAmount(formatInputNumber(v))}
                                                    editable={isEditing}
                                                    keyboardType="numeric"
                                                />
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                {/* Parts Table */}
                                <View className="border border-gray-200 rounded mt-2 bg-white">
                                    {isEditing && (
                                        <View className="p-2 border-b border-gray-200 bg-gray-50">
                                            <TouchableOpacity
                                                className="bg-emerald-500 px-3 py-1.5 rounded flex-row items-center self-start"
                                                onPress={() => setIsModalVisible(true)}
                                            >
                                                <Plus size={14} color="white" />
                                                <Text className="text-white text-xs font-bold ml-1">Add Part</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                    <ScrollView horizontal>
                                        <View>
                                            <View className="flex-row border-b border-gray-200 bg-gray-50">
                                                <Text className="text-[10px] font-bold text-gray-700 w-8 p-2 text-center">No</Text>
                                                <Text className="text-[10px] font-bold text-gray-700 w-40 p-2 border-l border-gray-200">Nama Part</Text>
                                                <Text className="text-[10px] font-bold text-gray-700 w-32 p-2 border-l border-gray-200">Harga</Text>
                                                <Text className="text-[10px] font-bold text-gray-700 w-16 p-2 text-center border-l border-gray-200">Qty</Text>
                                                <Text className="text-[10px] font-bold text-gray-700 w-32 p-2 border-l border-gray-200">Sub Total</Text>
                                                <Text className="text-[10px] font-bold text-gray-700 w-16 p-2 text-center border-l border-gray-200">Aksi</Text>
                                            </View>
                                            {parts.length === 0 ? (
                                                <View className="py-4 items-center">
                                                    <Text className="text-gray-400 text-xs italic">Belum ada part</Text>
                                                </View>
                                            ) : parts.map((part, i) => (
                                                <View key={i} className="flex-row border-b border-gray-200">
                                                    <Text className="text-[10px] text-gray-800 w-8 p-2 text-center">{i + 1}</Text>
                                                    <Text className="text-[10px] text-gray-800 w-40 p-2 border-l border-gray-200">{part.nama_part}</Text>
                                                    <Text className="text-[10px] text-gray-800 w-32 p-2 border-l border-gray-200">{formatRp(part.harga)}</Text>
                                                    <Text className="text-[10px] text-gray-800 w-16 p-2 text-center border-l border-gray-200">{part.qty}</Text>
                                                    <Text className="text-[10px] text-gray-800 w-32 p-2 border-l border-gray-200">{formatRp(part.qty * part.harga)}</Text>
                                                    <View className="w-16 p-2 border-l border-gray-200 items-center justify-center">
                                                        {isEditing && (
                                                            <TouchableOpacity onPress={() => setParts(prev => prev.filter((_, idx) => idx !== i))}>
                                                                <Trash2 size={14} color="#ef4444" />
                                                            </TouchableOpacity>
                                                        )}
                                                    </View>
                                                </View>
                                            ))}
                                            <View className="flex-row">
                                                <Text className="text-[10px] font-bold text-gray-700 w-96 p-2 text-right">Total</Text>
                                                <Text className="text-xs font-bold text-gray-800 w-32 p-2 border-l border-gray-200">
                                                    {formatRp(parts.reduce((s, p) => s + (p.qty * p.harga), 0))}
                                                </Text>
                                                <View className="w-16 p-2 border-l border-gray-200" />
                                            </View>
                                        </View>
                                    </ScrollView>
                                </View>
                            </View>
                        ) : null}
                    </ScrollView>
                )}
            </LktHeaderViewScreen>

            <SparepartModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onSave={(data) => {
                    setParts(prev => [...prev, {
                        nama_part: data.nama_part,
                        qty: parseInt(data.qty) || 0,
                        harga: parseInt(data.harga) || 0
                    }]);
                    setIsModalVisible(false);
                }}
            />
        </View>
    );
}
