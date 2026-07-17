import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import DateTimePicker from "@react-native-community/datetimepicker";
import { Dropdown } from 'react-native-element-dropdown';
import { Calendar, Save, ArrowLeft } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut, FadeInUp } from 'react-native-reanimated';

import { useKasBankIn } from '../hooks/useKasBankIn';
import { KasBankInHeader, KasBankInDetail } from '../types/kasbankin.types';
import { KasBankInDetailTable } from '../components/KasBankInDetailTable';
import { KasBankInDetailModal } from '../components/KasBankInDetailModal';
import { KasBankInFormSkeleton } from '../skeleton/KasBankInFormSkeleton';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';
import { Button } from '../../../components/ui/button';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { theme } from '../../../theme/theme';
import { formatRp } from '../../../utils/helpers/money';

export const KasBankInFormScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { id } = route.params || {};

    const {
        banks, coas, sos,
        currentHeader, currentDetails,
        isLoading, isSubmitting,
        loadMasterData, loadKasBankInById, submitKasBankIn, resetCurrent
    } = useKasBankIn();

    const [isInitializing, setIsInitializing] = useState(true);
    const [headerData, setHeaderData] = useState<Partial<KasBankInHeader>>({
        type_kb: 'k',
        f_dp: false,
        v_amount: 0,
        d_bank: new Date().toISOString().split('T')[0],
    });
    const [detailData, setDetailData] = useState<Partial<KasBankInDetail>[]>([]);

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isConfirmVisible, setIsConfirmVisible] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [editingDetailIndex, setEditingDetailIndex] = useState<number | null>(null);
    const [editingDetailData, setEditingDetailData] = useState<Partial<KasBankInDetail> | null>(null);

    const onRefresh = useCallback(async () => {
        setIsRefreshing(true);
        try {
            await loadMasterData();
            if (id) {
                await loadKasBankInById(id);
            }
            await new Promise(resolve => setTimeout(resolve, 500));
        } finally {
            setIsRefreshing(false);
        }
    }, [id, loadMasterData, loadKasBankInById]);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const init = async () => {
                setIsInitializing(true);
                try {
                    await loadMasterData();
                    if (id) {
                        await loadKasBankInById(id);
                    } else {
                        resetCurrent();
                    }
                    // Simulate loading delay for skeleton
                    await new Promise(resolve => setTimeout(resolve, 500));
                } catch (e) {
                    console.error("Failed to init form", e);
                } finally {
                    if (isActive) setIsInitializing(false);
                }
            };

            init();

            return () => {
                isActive = false;
                resetCurrent();
            };
        }, [id])
    );

    useEffect(() => {
        if (id && currentHeader) {
            setHeaderData(currentHeader);
            setDetailData(currentDetails.length ? currentDetails : []);
        } else if (!id) {
            setHeaderData({
                type_kb: 'k',
                f_dp: false,
                v_amount: 0,
                d_bank: new Date().toISOString().split('T')[0],
            });
            setDetailData([]);
        }
    }, [id, currentHeader, currentDetails]);

    const handleSave = async () => {
        if (!headerData.id_bank) {
            Alert.alert("Validasi", "Bank/Kas harus dipilih!");
            return;
        }
        if (headerData.f_dp && !headerData.id_so) {
            Alert.alert("Validasi", "No. SO harus dipilih jika tipe DP!");
            return;
        }
        if (detailData.length === 0) {
            Alert.alert("Validasi", "Minimal 1 detail COA harus diisi!");
            return;
        }

        const totalDetail = detailData.reduce((sum, item) => sum + (item.v_amount || 0), 0);
        if (totalDetail !== (headerData.v_amount || 0)) {
            Alert.alert("Validasi", "Total nilai detail harus sama dengan Total (Amount)!");
            return;
        }

        setIsConfirmVisible(true);
    };

    const confirmSave = async () => {
        setIsConfirmVisible(false);
        try {
            await submitKasBankIn({ header: headerData, details: detailData });
            navigation.goBack();
        } catch (error: any) {
            Alert.alert("Error", error.message || "Gagal menyimpan data");
        }
    };

    const handleSaveDetail = (data: Partial<KasBankInDetail>) => {
        setDetailData(prev => {
            const newData = [...prev];
            if (editingDetailIndex !== null) {
                newData[editingDetailIndex] = { ...newData[editingDetailIndex], ...data };
            } else {
                newData.push(data);
            }

            const total = newData.reduce((sum, item) => sum + (item.v_amount || 0), 0);
            setHeaderData(h => ({ ...h, v_amount: total }));

            return newData;
        });
        setEditingDetailIndex(null);
        setEditingDetailData(null);
    };

    const handleRowClick = (detail: Partial<KasBankInDetail>, index: number) => {
        setEditingDetailIndex(index);
        setEditingDetailData(detail);
        setIsDetailModalVisible(true);
    };

    const handleDeleteDetail = () => {
        if (editingDetailIndex !== null) {
            setDetailData(prev => {
                const newData = prev.filter((_, i) => i !== editingDetailIndex);
                const total = newData.reduce((sum, item) => sum + (item.v_amount || 0), 0);
                setHeaderData(h => ({ ...h, v_amount: total }));
                return newData;
            });
            setEditingDetailIndex(null);
            setEditingDetailData(null);
        }
    };

    const handleAddClick = () => {
        setEditingDetailIndex(null);
        setEditingDetailData(null);
        setIsDetailModalVisible(true);
    };



    const typeOptions = [
        { label: 'Kas', value: 'k' },
        { label: 'Bank', value: 'b' },
    ];

    const bankOptions = banks.map(b => ({ label: b.nm_bank, value: b.id_bank }));
    const soOptions = sos.map(s => ({ label: `${s.code_so} - ${s.nm_customers}`, value: s.id_so }));

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            className="flex-1 bg-gray-50"
        >
            <HeaderNavigator
                title={isInitializing || isLoading || isRefreshing ? "MEMUAT DATA..." : 'TAMBAH PENERIMAAN KAS DAN BANK'}
                showBackButton={true}
            />

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
                }
            >
                {(isInitializing || isLoading || isRefreshing) ? (
                    <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>
                        <KasBankInFormSkeleton />
                    </Animated.View>
                ) : (
                    <Animated.View key="content" entering={FadeIn.duration(600)} className="p-4">
                        {/* Header Section */}
                        <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
                            <Text className="text-gray-800 font-bold text-lg mb-4">Informasi Utama</Text>

                            {/* Bank Dropdown */}
                            <View className="mb-4">
                                <Text className="text-xs text-gray-500 mb-1">Kas / Bank</Text>
                                <View className="border border-gray-200 rounded-xl bg-gray-50 h-12 justify-center">
                                    <Dropdown
                                        style={{ height: 48, paddingHorizontal: 16 }}
                                        placeholderStyle={{ fontSize: 14, color: '#9CA3AF' }}
                                        selectedTextStyle={{ fontSize: 14, color: '#1F2937' }}
                                        data={bankOptions}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Pilih Bank/Kas"
                                        value={headerData.id_bank}
                                        onChange={(selected) => setHeaderData({ ...headerData, id_bank: selected.value })}
                                    />
                                </View>
                            </View>

                            {/* Type and DP */}
                            <View className="flex-row space-x-2 mb-4">
                                <View className="flex-1 mr-2">
                                    <Text className="text-xs text-gray-500 mb-1">Tipe</Text>
                                    <View className="border border-gray-200 rounded-xl bg-gray-50 h-12 justify-center">
                                        <Dropdown
                                            style={{ height: 48, paddingHorizontal: 16 }}
                                            placeholderStyle={{ fontSize: 14, color: '#9CA3AF' }}
                                            selectedTextStyle={{ fontSize: 14, color: '#1F2937' }}
                                            data={typeOptions}
                                            labelField="label"
                                            valueField="value"
                                            value={headerData.type_kb}
                                            onChange={(selected) => setHeaderData({ ...headerData, type_kb: selected.value as any })}
                                        />
                                    </View>
                                </View>
                                <View className="flex-1 ml-2 justify-center">
                                    <TouchableOpacity
                                        className={`h-12 flex-row items-center justify-center rounded-xl border ${headerData.f_dp ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}
                                        onPress={() => setHeaderData({ ...headerData, f_dp: !headerData.f_dp })}
                                    >
                                        <View className={`w-5 h-5 rounded border items-center justify-center mr-2 ${headerData.f_dp ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
                                            {headerData.f_dp && <View className="w-2.5 h-2.5 bg-white rounded-sm" />}
                                        </View>
                                        <Text className={`text-sm font-medium ${headerData.f_dp ? 'text-blue-700' : 'text-gray-600'}`}>
                                            Down Payment
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* SO Dropdown (if DP is true) */}
                            {headerData.f_dp && (
                                <View className="mb-4">
                                    <Text className="text-xs text-gray-500 mb-1">Referensi Sales Order</Text>
                                    <View className="border border-gray-200 rounded-xl bg-gray-50 h-12 justify-center">
                                        <Dropdown
                                            style={{ height: 48, paddingHorizontal: 16 }}
                                            placeholderStyle={{ fontSize: 14, color: '#9CA3AF' }}
                                            selectedTextStyle={{ fontSize: 14, color: '#1F2937' }}
                                            data={soOptions}
                                            labelField="label"
                                            valueField="value"
                                            search
                                            searchPlaceholder="Cari SO..."
                                            placeholder="Pilih SO"
                                            value={headerData.id_so}
                                            onChange={(selected) => setHeaderData({ ...headerData, id_so: selected.value })}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Date */}
                            <View className="mb-4">
                                <Text className="text-xs text-gray-500 mb-1">Tanggal</Text>
                                <TouchableOpacity
                                    className="bg-gray-50 flex-row items-center px-4 h-12 rounded-xl border border-gray-200"
                                    onPress={() => setShowDatePicker(true)}
                                >
                                    <Calendar color="#9CA3AF" size={18} />
                                    <Text className="flex-1 ml-2 text-gray-800 text-sm">
                                        {headerData.d_bank}
                                    </Text>
                                </TouchableOpacity>
                                {showDatePicker && (
                                    <DateTimePicker
                                        value={headerData.d_bank ? new Date(headerData.d_bank) : new Date()}
                                        mode="date"
                                        display="default"
                                        onChange={(event, date) => {
                                            setShowDatePicker(false);
                                            if (date) {
                                                setHeaderData({ ...headerData, d_bank: date.toISOString().split('T')[0] });
                                            }
                                        }}
                                    />
                                )}
                            </View>

                            {/* Total Amount */}
                            <View className="mb-4">
                                <Text className="text-xs text-gray-500 mb-1">Total Amount</Text>
                                <View className="bg-gray-100 flex-row items-center px-4 h-12 rounded-xl border border-gray-200">
                                    <Text className="flex-1 text-gray-800 font-bold">
                                        {formatRp(headerData.v_amount || 0)}
                                    </Text>
                                </View>
                            </View>

                            {/* Deskripsi */}
                            <View className="mb-2">
                                <Text className="text-xs text-gray-500 mb-1">Keterangan Umum</Text>
                                <TextInput
                                    className="border border-gray-200 rounded-xl bg-gray-50 p-4 text-gray-800"
                                    placeholder="Tuliskan keterangan..."
                                    value={headerData.deskripsi || ''}
                                    onChangeText={(text) => setHeaderData({ ...headerData, deskripsi: text })}
                                    multiline
                                    numberOfLines={3}
                                    textAlignVertical="top"
                                    style={{ minHeight: 80 }}
                                />
                            </View>

                            {/* Details Section */}
                            <View className="mt-2 border-t border-gray-100 pt-2 -mx-4">
                                <KasBankInDetailTable
                                    details={detailData}
                                    coas={coas}
                                    onRowClick={handleRowClick}
                                    onAddDetail={handleAddClick}
                                />
                            </View>
                        </View>

                        <Animated.View entering={FadeInUp.delay(100)}>
                            <Button
                                onPress={handleSave}
                                disabled={isSubmitting}
                                className="w-full h-14 rounded-2xl flex-row items-center justify-center"
                                style={{ backgroundColor: theme.colors.primary, opacity: isSubmitting ? 0.7 : 1 }}
                            >
                                {isSubmitting ? (
                                    <ActivityIndicator color="#ffffff" />
                                ) : (
                                    <>
                                        <Save size={20} color="#ffffff" />
                                        <Text className="text-white font-bold ml-2 text-base">Simpan Kas/Bank</Text>
                                    </>
                                )}
                            </Button>
                        </Animated.View>
                    </Animated.View>
                )}
            </ScrollView>

            <ModalConfirm
                visible={isConfirmVisible}
                title="Konfirmasi Simpan"
                message="Apakah Anda yakin data Kas/Bank Masuk ini sudah benar?"
                onConfirm={confirmSave}
                onCancel={() => setIsConfirmVisible(false)}
            />

            <KasBankInDetailModal
                visible={isDetailModalVisible}
                onDismiss={() => setIsDetailModalVisible(false)}
                onSave={handleSaveDetail}
                onDelete={handleDeleteDetail}
                coas={coas}
                initialData={editingDetailData}
            />
        </KeyboardAvoidingView>
    );
};
