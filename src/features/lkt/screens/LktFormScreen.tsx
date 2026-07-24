import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Animated, { FadeInDown, FadeOut, Layout } from 'react-native-reanimated';
import { Dropdown } from "react-native-element-dropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Save, X, Calendar, UploadCloud, CornerDownRight } from 'lucide-react-native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { theme } from '../../../theme/theme';
import { useLkt } from '../hooks/useLkt';
import { LktFormSkeleton } from '../skeleton/LktFormSkeleton';
import { formatDate } from '../../../utils/helpers/date';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';
import { formatInputNumber } from '../../../utils/helpers/money';

export function LktFormScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const cstCode = route.params?.cstCode || 'CST/---/--/----'; // Passed from CST

    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const onRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => {
            setIsRefreshing(false);
        }, 1000);
    };

    const { validateLktForm } = useLkt();

    const [toast, setToast] = useState<{ visible: boolean; type: ToastType; message: string }>({
        visible: false,
        type: 'success',
        message: ''
    });

    const [showConfirmModal, setShowConfirmModal] = useState(false);

    // Form State
    const [catatanKerusakan, setCatatanKerusakan] = useState('');
    const [description, setDescription] = useState('');
    const [estimationDay, setEstimationDay] = useState('1');
    const [transportAmount, setTransportAmount] = useState('0');
    const [serviceAmount, setServiceAmount] = useState('0');
    const [accommodationAmount, setAccommodationAmount] = useState('0');
    const [typeTransport, setTypeTransport] = useState('');
    const [startingDate, setStartingDate] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const transportOptions = [
        { label: 'Mobil', value: 'Mobil' },
        { label: 'Motor', value: 'Motor' },
        { label: 'Lain - lain', value: 'Lain - lain' }
    ];

    const handleSubmit = async () => {
        const errorMsg = validateLktForm({ typeTransport, description, startingDate });
        if (errorMsg) {
            setToast({ visible: true, type: 'error', message: errorMsg });
            return;
        }

        setShowConfirmModal(true);
    };

    const handleConfirmSave = () => {
        setShowConfirmModal(false);
        setIsLoading(true);
        // Simulasi request API
        setTimeout(() => {
            setIsLoading(false);
            navigation.replace('LktEditScreen', {
                id: 'LKT-123',
                showSuccessToast: true,
                successMessage: 'LKT berhasil ditambahkan'
            });
        }, 1000);
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
                visible={showConfirmModal}
                title="Konfirmasi Simpan"
                message="Apakah Anda yakin ingin menyimpan data LKT ini?"
                confirmText="Ya, Simpan!"
                cancelText="Batal!"
                onCancel={() => setShowConfirmModal(false)}
                onConfirm={handleConfirmSave}
            />

            <HeaderNavigator
                title={isLoading ? "MENYIMPAN DATA..." : (isRefreshing ? "MEMUAT DATA..." : "TAMBAH LKT")}
                showBackButton={true}
                onBackPress={() => navigation.goBack()}
            />

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />}
            >
                {(isLoading || isRefreshing) ? (
                    <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>
                        <LktFormSkeleton />
                    </Animated.View>
                ) : (
                    <Animated.View key="content" entering={FadeInDown.springify()} layout={Layout.springify()} className="space-y-4">

                        {/* Unified Form Card */}
                        <View className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                            {/* Header Info */}
                            <View className="mb-4">
                                <Text className="text-lg font-extrabold text-slate-800">{cstCode}</Text>
                                <View className="flex-row items-center mt-2 ml-1">
                                    <CornerDownRight color="#334155" size={22} strokeWidth={3} className="mr-2" style={{ marginTop: -8 }} />
                                    <Text className="text-base font-bold text-slate-800">LKT-EMM/---/--/-----</Text>
                                </View>
                            </View>

                            <Text className="text-base font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Laporan Kerusakan</Text>

                            <View className="mb-5">
                                <Text className="text-xs font-bold text-gray-700 mb-2">Catatan Kerusakan</Text>
                                <TextInput
                                    className="bg-gray-100 border border-gray-200 rounded-lg p-3 text-sm text-gray-600"
                                    style={{ minHeight: 80 }}
                                    placeholder="Catatan kerusakan dari CST..."
                                    multiline={true}
                                    numberOfLines={3}
                                    textAlignVertical="top"
                                    value={catatanKerusakan}
                                    onChangeText={setCatatanKerusakan}
                                    editable={false}
                                />
                            </View>

                            <View className="mb-5">
                                <Text className="text-xs font-bold text-gray-700 mb-2">Tambahan Catatan Kerusakan <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-800"
                                    style={{ minHeight: 80 }}
                                    placeholder="Masukkan catatan tambahan..."
                                    multiline={true}
                                    numberOfLines={3}
                                    textAlignVertical="top"
                                    value={description}
                                    onChangeText={setDescription}
                                />
                            </View>

                            <View className="mb-5">
                                <Text className="text-xs font-bold text-gray-700 mb-2">Images <Text className="text-gray-400 font-normal">(Max 500kb)</Text></Text>
                                <TouchableOpacity className="bg-gray-50 border border-gray-200 border-dashed rounded-lg p-4 items-center justify-center">
                                    <UploadCloud color="#9CA3AF" size={24} />
                                    <Text className="text-xs text-gray-500 mt-2 font-medium">Klik untuk Upload Foto</Text>
                                </TouchableOpacity>
                            </View>

                            <View className="flex-row space-x-3 mb-5">
                                <View className="flex-1">
                                    <Text className="text-xs font-bold text-gray-700 mb-2">Start Date <Text className="text-red-500">*</Text></Text>
                                    <TouchableOpacity
                                        className="bg-gray-50 border border-gray-200 rounded-lg h-12 flex-row items-center px-3"
                                        onPress={() => setShowDatePicker(true)}
                                    >
                                        <Calendar color="#9CA3AF" size={18} />
                                        <Text className="ml-2 text-sm text-gray-800 flex-1">
                                            {startingDate ? formatDate(startingDate) : 'Pilih Tanggal'}
                                        </Text>
                                    </TouchableOpacity>
                                    {showDatePicker && (
                                        <DateTimePicker
                                            value={startingDate || new Date()}
                                            mode="date"
                                            display="default"
                                            onChange={(event, date) => {
                                                setShowDatePicker(false);
                                                if (date) setStartingDate(date);
                                            }}
                                        />
                                    )}
                                </View>
                                <View className="flex-1">
                                    <Text className="text-xs font-bold text-gray-700 mb-2">Estimation Day</Text>
                                    <TextInput
                                        className="bg-gray-50 border border-gray-200 rounded-lg h-12 px-3 text-sm text-gray-800"
                                        keyboardType="numeric"
                                        value={estimationDay}
                                        onChangeText={setEstimationDay}
                                    />
                                </View>
                            </View>

                            <View className="flex-row space-x-3 mb-5">
                                <View className="flex-1">
                                    <Text className="text-xs font-bold text-gray-700 mb-2">Transport</Text>
                                    <TextInput
                                        className="bg-gray-50 border border-gray-200 rounded-lg h-12 px-3 text-sm text-gray-800"
                                        keyboardType="numeric"
                                        value={transportAmount}
                                        onChangeText={(text) => setTransportAmount(formatInputNumber(text))}
                                        onBlur={() => { if (!transportAmount) setTransportAmount('0'); }}
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-xs font-bold text-gray-700 mb-2">Type Transport <Text className="text-red-500">*</Text></Text>
                                    <Dropdown
                                        style={{ height: 48, backgroundColor: '#F9FAFB', borderColor: '#E5E7EB', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12 }}
                                        data={transportOptions}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Pilih Transport"
                                        value={typeTransport}
                                        onChange={(item) => setTypeTransport(item.value)}
                                        placeholderStyle={{ color: '#9CA3AF', fontSize: 14 }}
                                        selectedTextStyle={{ color: '#1F2937', fontSize: 14 }}
                                    />
                                </View>
                            </View>

                            <View className="flex-row space-x-3 mb-2">
                                <View className="flex-1">
                                    <Text className="text-xs font-bold text-gray-700 mb-2">Service Amount</Text>
                                    <TextInput
                                        className="bg-gray-50 border border-gray-200 rounded-lg h-12 px-3 text-sm text-gray-800"
                                        keyboardType="numeric"
                                        value={serviceAmount}
                                        onChangeText={(text) => setServiceAmount(formatInputNumber(text))}
                                        onBlur={() => { if (!serviceAmount) setServiceAmount('0'); }}
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-xs font-bold text-gray-700 mb-2">Accommodation</Text>
                                    <TextInput
                                        className="bg-gray-50 border border-gray-200 rounded-lg h-12 px-3 text-sm text-gray-800"
                                        keyboardType="numeric"
                                        value={accommodationAmount}
                                        onChangeText={(text) => setAccommodationAmount(formatInputNumber(text))}
                                        onBlur={() => { if (!accommodationAmount) setAccommodationAmount('0'); }}
                                    />
                                </View>
                            </View>

                        </View>

                        {/* Action Buttons */}
                        <View className="flex-row space-x-3 mt-4">
                            <TouchableOpacity
                                className="flex-1 flex-row items-center justify-center h-12 rounded-xl"
                                style={{ backgroundColor: theme.colors.primary }}
                                onPress={handleSubmit}
                            >
                                <Save color="white" size={18} />
                                <Text className="font-bold text-white ml-2">Save LKT</Text>
                            </TouchableOpacity>
                        </View>

                    </Animated.View>
                )}
            </ScrollView>
        </View>
    );
}
