import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput, RefreshControl } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Check, X, FileText, CornerDownRight, Printer, Truck, Plus, Trash2, UploadCloud, CornerDownLeft, Pencil, Save } from 'lucide-react-native';
import { Dropdown } from "react-native-element-dropdown";
import { useLkt } from '../hooks/useLkt';
import { LktEditSkeleton } from '../skeleton/LktEditSkeleton';
import { LktHeaderViewScreen } from './LktHeaderViewScreen';
import { RealisasiListView } from './RealisasiListScreen';
import { SparepartModal } from '../components/SparepartModal';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';
import { ModalCancel } from '../../../components/ui/ModalCancel';
import { formatRp, formatInputNumber } from '../../../utils/helpers/money';

export function LktEditScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { id, showSuccessToast, successMessage } = route.params || {};

    const { currentLkt, isLoading, loadLktDetail, handleCloseLkt, handleCancelLkt, resetCurrentLkt, validateLktForm } = useLkt();

    const [toast, setToast] = useState<{ visible: boolean; type: ToastType; message: string }>({
        visible: false,
        type: 'success',
        message: ''
    });

    useEffect(() => {
        if (showSuccessToast && successMessage) {
            setToast({ visible: true, type: 'success', message: successMessage });
            navigation.setParams({ showSuccessToast: undefined, successMessage: undefined });
        }
    }, [showSuccessToast, successMessage, navigation]);

    const [activeTab, setActiveTab] = useState<'perbaikan' | 'realisasi'>('perbaikan');
    const [isEditing, setIsEditing] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = () => {
        setIsRefreshing(true);
        if (id) {
            loadLktDetail(id);
        }
        setTimeout(() => setIsRefreshing(false), 1000);
    };

    // Form State (Dummy/Local)
    const [tambahanCatatan, setTambahanCatatan] = useState('cek mesin');
    const [estimationDay, setEstimationDay] = useState('1');
    const [startingDate, setStartingDate] = useState('18/07/2025');
    const [serviceAmount, setServiceAmount] = useState('0');
    const [typeTransport, setTypeTransport] = useState('Mobil');
    const [transportAmount, setTransportAmount] = useState('0');
    const [accommodationAmount, setAccommodationAmount] = useState('0');

    useEffect(() => {
        if (id) {
            loadLktDetail(id);
        }
        return () => {
            resetCurrentLkt();
        };
    }, [id, loadLktDetail, resetCurrentLkt]);

    const transportOptions = [
        { label: 'Mobil', value: 'Mobil' },
        { label: 'Motor', value: 'Motor' },
        { label: 'Lain - lain', value: 'Lain - lain' }
    ];

    const [parts, setParts] = useState<any[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isSaveModalVisible, setIsSaveModalVisible] = useState(false);
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
    const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);

    const renderButtons = () => (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4" contentContainerStyle={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity className="bg-blue-400 px-3 py-2 rounded flex-row items-center mr-2" onPress={() => {
                if (isEditing) {
                    setIsEditing(false);
                } else {
                    navigation.goBack();
                }
            }}>
                <CornerDownLeft size={14} color="white" />
                <Text className="text-white text-xs font-bold ml-1">Back</Text>
            </TouchableOpacity>

            <TouchableOpacity
                className={`px-3 py-2 rounded flex-row items-center mr-2 ${isEditing ? 'bg-emerald-500' : 'bg-amber-500'}`}
                onPress={() => {
                    if (isEditing) {
                        const errorMsg = validateLktForm({ typeTransport, description: tambahanCatatan, startingDate });
                        if (errorMsg) {
                            setToast({ visible: true, type: 'error', message: errorMsg });
                            return;
                        }
                        setIsSaveModalVisible(true);
                    } else {
                        setIsEditing(true);
                    }
                }}
            >
                {isEditing ? <Save size={14} color="white" /> : <Pencil size={14} color="white" />}
                <Text className="text-white text-xs font-bold ml-1">{isEditing ? 'Save' : 'Edit'}</Text>
            </TouchableOpacity>

            {!isEditing && (
                <>
                    <TouchableOpacity
                        className="bg-emerald-500 px-3 py-2 rounded flex-row items-center mr-2"
                        onPress={() => setIsConfirmModalVisible(true)}
                    >
                        <Check size={14} color="white" />
                        <Text className="text-white text-xs font-bold ml-1">Confirm</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="bg-teal-500 px-3 py-2 rounded flex-row items-center mr-2"
                        onPress={() => navigation.navigate('LktEditCloseScreen')}
                    >
                        <Check size={14} color="white" />
                        <Text className="text-white text-xs font-bold ml-1">Close</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="bg-red-500 px-3 py-2 rounded flex-row items-center mr-2"
                        onPress={() => setIsCancelModalVisible(true)}
                    >
                        <X size={14} color="white" />
                        <Text className="text-white text-xs font-bold ml-1">Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-gray-800 px-3 py-2 rounded flex-row items-center mr-2">
                        <Printer size={14} color="white" />
                        <Text className="text-white text-xs font-bold ml-1">Print Label</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-cyan-500 px-3 py-2 rounded flex-row items-center mr-2">
                        <Truck size={14} color="white" />
                        <Text className="text-white text-xs font-bold ml-1">Perjalanan Dinas</Text>
                    </TouchableOpacity>
                </>
            )}
        </ScrollView>
    );

    if (activeTab === 'realisasi') {
        return <RealisasiListView setActiveTab={setActiveTab} />;
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
                visible={isSaveModalVisible}
                title="Konfirmasi"
                message="Apakah Anda yakin ingin menyimpan perubahan pada LKT ini?"
                confirmText="Ya, Simpan"
                cancelText="Batal"
                onConfirm={() => {
                    setIsSaveModalVisible(false);
                    setToast({ visible: true, type: 'success', message: 'Data berhasil disimpan' });
                    setIsEditing(false);
                }}
                onCancel={() => setIsSaveModalVisible(false)}
            />
            <ModalConfirm
                visible={isConfirmModalVisible}
                title="Konfirmasi LKT"
                message="Apakah Anda yakin ingin melakukan konfirmasi pada LKT ini?"
                confirmText="Ya, Confirm"
                cancelText="Batal"
                onConfirm={() => {
                    setIsConfirmModalVisible(false);
                    setToast({ visible: true, type: 'success', message: 'LKT berhasil dikonfirmasi' });
                    setIsEditing(false);
                }}
                onCancel={() => setIsConfirmModalVisible(false)}
            />
            <ModalCancel
                visible={isCancelModalVisible}
                title="Batalkan LKT"
                message="Apakah Anda yakin ingin membatalkan LKT ini? Tindakan ini tidak dapat diurungkan."
                confirmText="Ya, Batalkan"
                cancelText="Kembali"
                onConfirm={() => {
                    setIsCancelModalVisible(false);
                    setToast({ visible: true, type: 'error', message: 'LKT berhasil dibatalkan' });
                    setIsEditing(false);
                }}
                onCancel={() => setIsCancelModalVisible(false)}
            />

            <LktHeaderViewScreen
                activeTab={activeTab}
                setActiveTab={(tab) => {
                    if (isEditing) setIsEditing(false);
                    setActiveTab(tab);
                }}
                titleHeader={isLoading ? "MEMUAT DATA..." : (isEditing ? "EDIT LKT" : "DETAIL LKT")}
                onBackPress={() => {
                    if (isEditing) {
                        setIsEditing(false);
                    } else {
                        navigation.navigate('Drawer', { screen: 'LktListScreen' });
                    }
                }}
            >

                <ScrollView
                    className="flex-1 pt-2"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    refreshControl={
                        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} colors={['#0ea5e9']} />
                    }
                >
                    {(isLoading || isRefreshing) ? (
                        <LktEditSkeleton />
                    ) : (
                        <View>
                            {renderButtons()}

                            <Text className="text-blue-600 font-bold mb-4 text-xs italic">Status : (DRAFT)</Text>
                            <Text className="text-base font-bold text-gray-900 mb-2">Laporan Kerusakan</Text>

                            {/* Laporan Kerusakan Container */}
                            <View className="bg-white p-4 rounded-xl border border-gray-300 mb-4">

                                <View className="mb-5">
                                    <Text className="text-xs font-bold text-gray-700 mb-2">Catatan Kerusakan</Text>
                                    <View className="bg-gray-100 p-3 rounded-lg border border-gray-200">
                                        <Text className="text-sm text-gray-800">cek mesin</Text>
                                    </View>
                                </View>

                                <View className="mb-5">
                                    <Text className="text-xs font-bold text-gray-700 mb-2">Tambahan Catatan Kerusakan</Text>
                                    <TextInput
                                        className={`p-3 border border-gray-300 rounded-lg text-sm text-gray-800 ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
                                        style={{ minHeight: 80, textAlignVertical: 'top' }}
                                        multiline
                                        value={tambahanCatatan}
                                        onChangeText={setTambahanCatatan}
                                        editable={isEditing}
                                    />
                                </View>

                                <View className="mb-5">
                                    <Text className="text-xs font-bold text-gray-700 mb-2">Nama Teknisi</Text>
                                    <View className="bg-blue-50 p-3 border border-blue-200 rounded-lg">
                                        <Text className="text-sm text-blue-700 font-bold">Agung</Text>
                                    </View>
                                </View>

                                <View className="mb-5">
                                    <Text className="text-xs font-bold text-gray-700 mb-2">Images</Text>
                                    <View className="bg-gray-50 border border-gray-300 border-dashed rounded-lg h-12 items-center justify-center">
                                        <UploadCloud size={20} color="#9ca3af" />
                                    </View>
                                </View>

                                {/* Divider for Visual Separation */}
                                <View className="h-px bg-gray-200 mb-5" />

                                <View className="mb-5">
                                    <Text className="text-xs font-bold text-gray-700 mb-2">Serial Number</Text>
                                    <View className="bg-gray-100 px-3 py-2 border border-gray-200 rounded-lg">
                                        <Text className="text-sm text-gray-800" numberOfLines={1} adjustsFontSizeToFit>10.104.01756.28.04837</Text>
                                    </View>
                                </View>

                                <View className="flex-row space-x-3 mb-5">
                                    <View className="flex-1">
                                        <Text className="text-xs font-bold text-gray-700 mb-2">Estimation Day</Text>
                                        <TextInput
                                            className={`px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-800 ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
                                            value={estimationDay}
                                            onChangeText={setEstimationDay}
                                            editable={isEditing}
                                        />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-xs font-bold text-gray-700 mb-2">Start Date <Text className="text-red-500">*</Text></Text>
                                        <TextInput
                                            className={`px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-800 ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
                                            value={startingDate}
                                            onChangeText={setStartingDate}
                                            editable={isEditing}
                                        />
                                    </View>
                                </View>

                                <View className="flex-row space-x-3 mb-5">
                                    <View className="flex-1">
                                        <Text className="text-xs font-bold text-gray-700 mb-2">Service Amount</Text>
                                        <View className={`flex-row items-center px-3 border border-gray-300 rounded-lg h-[42px] ${isEditing ? 'bg-white' : 'bg-gray-100'}`}>
                                            <Text className="text-sm text-gray-500 mr-2">Rp</Text>
                                            <TextInput
                                                className="flex-1 text-sm text-gray-800 p-0"
                                                value={serviceAmount}
                                                onChangeText={(val) => setServiceAmount(formatInputNumber(val))}
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
                                                onChangeText={(val) => setTransportAmount(formatInputNumber(val))}
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
                                                onChange={(item) => setTypeTransport(item.value)}
                                                selectedTextStyle={{ color: '#1F2937', fontSize: 14 }}
                                                disable={!isEditing}
                                            />
                                        </View>
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-xs font-bold text-gray-700 mb-2">Acomodation</Text>
                                        <View className={`flex-row items-center px-3 border border-gray-300 rounded-lg h-[42px] ${isEditing ? 'bg-white' : 'bg-gray-100'}`}>
                                            <Text className="text-sm text-gray-500 mr-2">Rp</Text>
                                            <TextInput
                                                className="flex-1 text-sm text-gray-800 p-0"
                                                value={accommodationAmount}
                                                onChangeText={(val) => setAccommodationAmount(formatInputNumber(val))}
                                                editable={isEditing}
                                                keyboardType="numeric"
                                            />
                                        </View>
                                    </View>
                                </View>

                                <View className="mb-2">
                                    <Text className="text-xs font-bold text-gray-700 mb-2">Keterangan SO</Text>
                                    <View className="bg-yellow-50 p-3 border border-yellow-200 rounded-lg">
                                        <Text className="text-sm text-yellow-800 font-medium">DP INDEN 50%, PELUNASAN 50% SEBELUM PENGIRIMAN</Text>
                                    </View>
                                </View>

                            </View>

                            {/* Parts Table */}
                            <View className="border border-gray-200 rounded mt-2 bg-white">
                                {isEditing && (
                                    <View className="p-2 border-b border-gray-200 bg-gray-50/50">
                                        <TouchableOpacity
                                            className="bg-emerald-500 px-3 py-1.5 rounded flex-row items-center self-start"
                                            onPress={() => setIsModalVisible(true)}
                                        >
                                            <Plus size={14} color="white" />
                                            <Text className="text-white text-xs font-bold ml-1">Add New</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                                <ScrollView horizontal>
                                    <View>
                                        {/* Header */}
                                        <View className="flex-row border-b border-gray-200 bg-gray-50/50">
                                            <Text className="text-[10px] font-bold text-gray-700 w-8 p-2 text-center">No</Text>
                                            <Text className="text-[10px] font-bold text-gray-700 w-40 p-2 border-l border-gray-200">Nama Part</Text>
                                            <Text className="text-[10px] font-bold text-gray-700 w-32 p-2 border-l border-gray-200">Harga</Text>
                                            <Text className="text-[10px] font-bold text-gray-700 w-16 p-2 text-center border-l border-gray-200">Qty</Text>
                                            <Text className="text-[10px] font-bold text-gray-700 w-32 p-2 border-l border-gray-200">Sub Total</Text>
                                            <Text className="text-[10px] font-bold text-gray-700 w-20 p-2 text-center border-l border-gray-200">Action</Text>
                                        </View>
                                        {/* Body */}
                                        {parts.length === 0 ? (
                                            <View className="border-b border-gray-200 py-4 items-center">
                                                <Text className="text-gray-400 text-xs italic">Belum ada part</Text>
                                            </View>
                                        ) : (
                                            parts.map((part, index) => (
                                                <View key={index.toString()} className="flex-row border-b border-gray-200 bg-white">
                                                    <Text className="text-[10px] text-gray-800 w-8 p-2 text-center">{index + 1}</Text>
                                                    <Text className="text-[10px] text-gray-800 w-40 p-2 border-l border-gray-200">{part.nama_part}</Text>
                                                    <Text className="text-[10px] text-gray-800 w-32 p-2 border-l border-gray-200">{formatRp(part.harga)}</Text>
                                                    <Text className="text-[10px] text-gray-800 w-16 p-2 text-center border-l border-gray-200">{part.qty}</Text>
                                                    <Text className="text-[10px] text-gray-800 w-32 p-2 border-l border-gray-200">{formatRp(part.qty * part.harga)}</Text>
                                                    <View className="w-20 p-2 border-l border-gray-200 items-center justify-center">
                                                        {isEditing && (
                                                            <TouchableOpacity onPress={() => setParts(prev => prev.filter((_, i) => i !== index))}>
                                                                <Trash2 size={14} color="#ef4444" />
                                                            </TouchableOpacity>
                                                        )}
                                                    </View>
                                                </View>
                                            ))
                                        )}
                                        {/* Footer */}
                                        <View className="flex-row">
                                            <Text className="text-[10px] font-bold text-gray-700 w-96 p-2 text-right">Total Harga</Text>
                                            <Text className="text-xs font-bold text-gray-800 w-32 p-2 border-l border-gray-200">{formatRp(parts.reduce((sum, p) => sum + (p.qty * p.harga), 0))}</Text>
                                            <View className="w-20 p-2 border-l border-gray-200" />
                                        </View>
                                    </View>
                                </ScrollView>
                            </View>
                        </View>
                    )}
                </ScrollView>
            </LktHeaderViewScreen>
            <SparepartModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onSave={(data) => {
                    const newPart = {
                        nama_part: data.nama_part,
                        qty: parseInt(data.qty) || 0,
                        harga: parseInt(data.harga) || 0
                    };
                    setParts(prev => [...prev, newPart]);
                    setIsModalVisible(false);
                }}
            />
        </View>
    );
}
