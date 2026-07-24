import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Switch, RefreshControl } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CornerDownLeft, Save, UploadCloud } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Dropdown } from "react-native-element-dropdown";
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { RealiasasiFormSkeleton } from '../skeleton/RealiasasiFormSkeleton';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';
import { useLkt } from '../hooks/useLkt';
import { formatInputNumber } from '../../../utils/helpers/money';

export function RealisasiFormScreen() {
    const navigation = useNavigation<any>();

    const { validateRealisasiForm } = useLkt();

    const [toast, setToast] = useState<{ visible: boolean; type: ToastType; message: string }>({
        visible: false,
        type: 'success',
        message: ''
    });

    // State
    const [actualDescription, setActualDescription] = useState('');
    const [nmTeknisi, setNmTeknisi] = useState([]);
    const [actualDay, setActualDay] = useState('1');
    const [isDaring, setIsDaring] = useState(false);
    const [isSaveModalVisible, setIsSaveModalVisible] = useState(false);

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleRefresh = () => {
        setIsRefreshing(true);
        // Simulate data refresh
        setTimeout(() => setIsRefreshing(false), 1000);
    };

    const [transportAmount, setTransportAmount] = useState('0');
    const [trainingAmount, setTrainingAmount] = useState('0');
    const [startingDate, setStartingDate] = useState(new Date().toISOString().split('T')[0]);
    const [serviceAmount, setServiceAmount] = useState('0');
    const [accommodationAmount, setAccommodationAmount] = useState('0');
    const [bongkarAmount, setBongkarAmount] = useState('0');

    // Dummy Dropdown Options
    const teknisiOptions = [
        { label: 'Agung', value: 'Agung' },
        { label: 'Budi', value: 'Budi' },
        { label: 'Candra', value: 'Candra' },
    ];

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

    const handleSave = () => {
        const errorMsg = validateRealisasiForm({ nmTeknisi, actualDay, actualDescription });
        if (errorMsg) {
            setToast({ visible: true, type: 'error', message: errorMsg });
            return;
        }
        setIsSaveModalVisible(true);
    };

    return (
        <View className="flex-1 bg-gray-50">
            <ToastMessages
                visible={toast.visible}
                type={toast.type}
                message={toast.message}
                title="Validasi"
                onClose={() => setToast(prev => ({ ...prev, visible: false }))}
            />
            <ModalConfirm
                visible={isSaveModalVisible}
                title="Konfirmasi Simpan"
                message="Apakah Anda yakin ingin menyimpan laporan realisasi visit ini?"
                confirmText="Ya, Simpan"
                cancelText="Batal"
                onConfirm={() => {
                    setIsSaveModalVisible(false);
                    setTimeout(() => {
                        navigation.replace('RealisasiEdit', { 
                            showSuccessToast: true, 
                            successMessage: 'Realisasi berhasil ditambahkan' 
                        });
                    }, 100);
                }}
                onCancel={() => setIsSaveModalVisible(false)}
            />
            <HeaderNavigator
                title={isRefreshing ? "MEMUAT DATA..." : "TAMBAH LAPORAN VISIT"}
                showBackButton={true}
                onBackPress={() => navigation.goBack()}
            />

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 12, paddingBottom: 100 }}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} colors={['#0ea5e9']} />
                }
            >
                {(isLoading || isRefreshing) ? (
                    <RealiasasiFormSkeleton />
                ) : (
                    <Animated.View entering={FadeInDown.springify()} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">

                        {/* Header Info */}
                        <View className="mb-4">
                            <Text className="text-xl font-extrabold text-slate-800">CST-EMM/2025/07/03624</Text>
                            <Text className="text-base font-bold text-slate-600 mt-1">LKT-EMM/2025/07/03646</Text>
                        </View>

                        {/* Action Buttons */}
                        <View className="flex-row mb-6">
                            <TouchableOpacity
                                className="bg-emerald-500 px-4 py-2 rounded-lg flex-row items-center"
                                onPress={handleSave}
                            >
                                <Save size={16} color="white" />
                                <Text className="text-white text-sm font-bold ml-2">Save</Text>
                            </TouchableOpacity>
                        </View>

                        <Text className="text-lg font-bold text-gray-800 mb-4">Laporan Kerusakan</Text>

                        {/* Form Fields */}
                        <View className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-4">
                            <View className="mb-4">
                                <Text className="text-xs font-bold text-gray-700 mb-1">Catatan Kerusakan</Text>
                                <Text className="text-sm text-gray-800 bg-gray-100 p-3 rounded-lg border border-gray-200">
                                    Pengecekan mesin X-Ray tidak menyala
                                </Text>
                            </View>

                            <View className="mb-4">
                                <Text className="text-xs font-bold text-gray-700 mb-1">Tambahan Catatan Kerusakan</Text>
                                <Text className="text-sm text-gray-800 bg-gray-100 p-3 rounded-lg border border-gray-200">
                                    Segera ditangani
                                </Text>
                            </View>

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
                            <View className="mb-4">
                                <Text className="text-xs font-bold text-gray-700 mb-1">Images</Text>
                                <TouchableOpacity className="bg-white border border-gray-300 border-dashed rounded-lg h-24 items-center justify-center">
                                    <UploadCloud size={24} color="#9ca3af" />
                                    <Text className="text-xs text-gray-500 mt-2">Tap to upload image</Text>
                                    <Text className="text-[10px] text-red-500 mt-1">ukuran image max 500kb</Text>
                                </TouchableOpacity>
                            </View>
                            <View className="mb-4">
                                <Text className="text-xs font-bold text-gray-700 mb-1">Nama Teknisi <Text className="text-red-500">*</Text></Text>
                                <View className="bg-white border border-gray-300 rounded-lg justify-center h-[42px]">
                                    <Dropdown
                                        style={{ paddingHorizontal: 12 }}
                                        data={teknisiOptions}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Pilih Teknisi"
                                        value={nmTeknisi.length > 0 ? nmTeknisi[0] : null}
                                        onChange={(item) => setNmTeknisi([item.value as never])}
                                        selectedTextStyle={{ color: '#1F2937', fontSize: 14 }}
                                    />
                                </View>
                            </View>

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
                                    <View className="h-[42px] justify-center items-start">
                                        <Switch
                                            value={isDaring}
                                            onValueChange={handleDaringChange}
                                            trackColor={{ false: "#d1d5db", true: "#059669" }}
                                        />
                                    </View>
                                </View>
                            </View>

                            <View className="flex-row mb-4">
                                <View className="flex-1 mr-3">
                                    <Text className="text-xs font-bold text-gray-700 mb-1">Transport</Text>
                                    <View className={`flex-row items-center px-3 border border-gray-300 rounded-lg h-[42px] ${isDaring ? 'bg-gray-100' : 'bg-white'}`}>
                                        <Text className="text-sm text-gray-500 mr-2">Rp</Text>
                                        <TextInput
                                            className="flex-1 text-sm text-gray-800 p-0"
                                            value={transportAmount}
                                            onChangeText={(val) => setTransportAmount(formatInputNumber(val))}
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
                                            onChangeText={(val) => setTrainingAmount(formatInputNumber(val))}
                                            keyboardType="numeric"
                                            editable={!isDaring}
                                        />
                                    </View>
                                </View>
                            </View>

                            <View className="flex-row mb-4">
                                <View className="flex-1 mr-3">
                                    <Text className="text-xs font-bold text-gray-700 mb-1">Start Date</Text>
                                    <TextInput
                                        className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-800"
                                        value={startingDate}
                                        onChangeText={setStartingDate}
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-xs font-bold text-gray-700 mb-1">Service Amount</Text>
                                    <View className={`flex-row items-center px-3 border border-gray-300 rounded-lg h-[42px] ${isDaring ? 'bg-gray-100' : 'bg-white'}`}>
                                        <Text className="text-sm text-gray-500 mr-2">Rp</Text>
                                        <TextInput
                                            className="flex-1 text-sm text-gray-800 p-0"
                                            value={serviceAmount}
                                            onChangeText={(val) => setServiceAmount(formatInputNumber(val))}
                                            keyboardType="numeric"
                                            editable={!isDaring}
                                        />
                                    </View>
                                </View>
                            </View>

                            <View className="flex-row">
                                <View className="flex-1 mr-3">
                                    <Text className="text-xs font-bold text-gray-700 mb-1">Acomodation</Text>
                                    <View className={`flex-row items-center px-3 border border-gray-300 rounded-lg h-[42px] ${isDaring ? 'bg-gray-100' : 'bg-white'}`}>
                                        <Text className="text-sm text-gray-500 mr-2">Rp</Text>
                                        <TextInput
                                            className="flex-1 text-sm text-gray-800 p-0"
                                            value={accommodationAmount}
                                            onChangeText={(val) => setAccommodationAmount(formatInputNumber(val))}
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
                                            onChangeText={(val) => setBongkarAmount(formatInputNumber(val))}
                                            keyboardType="numeric"
                                            editable={!isDaring}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Animated.View>
                )}
            </ScrollView>
        </View>
    );
}
