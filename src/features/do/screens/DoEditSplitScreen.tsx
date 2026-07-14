import React, { useState, useCallback } from 'react';
import { View, ScrollView, Text, TextInput, Alert, TouchableOpacity, RefreshControl } from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { useDo } from '../hooks/useDo';
import { theme } from '../../../theme/theme';
import { X, Save } from 'lucide-react-native';
import { Button } from '../../../components/ui/button';
import { DoProductTable } from '../components/DoProductTable';
import { DoEditSplitSkeleton } from '../skeleton/DoEditSplitSkeleton';


export const DoEditSplitScreen = () => {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { id } = route.params || { id: null };
    const { detail, loadingDetail, getDetail, submitAction, resetDetail, error } = useDo();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // State for checkbox selection
    const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

    const onToggleSelect = useCallback((itemId: string | number) => {
        setSelectedIds(prev => {
            if (prev.includes(itemId)) {
                return prev.filter(id => id !== itemId);
            } else {
                return [...prev, itemId];
            }
        });
    }, []);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        if (id) await getDetail(id);
        setRefreshing(false);
    }, [id, getDetail]);

    useFocusEffect(
        useCallback(() => {
            if (id) getDetail(id);
            return () => {
                resetDetail();
                setSelectedIds([]);
            };
        }, [id, getDetail, resetDetail])
    );

    const handleSave = () => {
        if (selectedIds.length === 0) {
            Alert.alert('Peringatan', 'Pilih minimal 1 barang untuk di-split.');
            return;
        }
        Alert.alert(
            'Konfirmasi Simpan',
            'Apakah anda yakin ingin menyimpan split DO ini?',
            [
                { text: 'Batal', style: 'cancel' },
                {
                    text: 'Simpan',
                    onPress: () => {
                        Alert.alert('Sukses', 'Data split berhasil disimpan!');
                        navigation.goBack();
                    }
                }
            ]
        );
    };

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator title={`DETAIL ${detail?.code_do || ''}`} showBackButton={true} />

            <ScrollView
                className="flex-1"
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
                }
            >
                {loadingDetail ? (
                    <DoEditSplitSkeleton />
                ) : error ? (
                    <View className="p-8 items-center justify-center mt-10">
                        <Text className="text-red-500 text-center font-bold mb-4">{error}</Text>
                        <TouchableOpacity onPress={() => getDetail(id)} className="bg-blue-500 px-6 py-2 rounded-lg">
                            <Text className="text-white font-bold">Coba Lagi</Text>
                        </TouchableOpacity>
                    </View>
                ) : !detail ? (
                    <View className="p-8 items-center justify-center mt-10">
                        <Text className="text-gray-500 text-center font-bold">Data detail tidak ditemukan.</Text>
                    </View>
                ) : (
                    <View className="p-4">
                        {/* Info Pelanggan */}
                        <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-4">
                            <Text className="text-xs font-bold text-gray-400 mb-3 uppercase">Informasi Pelanggan</Text>

                            <View className="mb-3">
                                <Text className="text-xs text-gray-500">Customer</Text>
                                <Text className="text-sm text-gray-800">{detail.nm_customers}</Text>
                            </View>

                            <View className="mb-3">
                                <Text className="text-xs text-gray-500">Alamat</Text>
                                <Text className="text-sm text-gray-800">{detail.customers_address}</Text>
                            </View>
                            <View className="h-[1px] bg-gray-200 my-4 mx-[-16px]" />
                            <Text className="text-xs font-bold text-gray-400 mb-4 uppercase">Informasi Biaya Tambahan</Text>

                            <View className="mb-4">
                                <Text className="text-xs text-gray-500 mb-2">Biaya Freight</Text>
                                <View>
                                    <View className="flex-row items-center mb-2">
                                        <View className="w-4 h-4 rounded-full border border-gray-300 items-center justify-center mr-2">
                                            {detail.freight === '1' && <View className="w-2 h-2 rounded-full bg-gray-600" />}
                                        </View>
                                        <Text className="text-sm text-gray-800">EMM</Text>
                                    </View>
                                    <View className="flex-row items-center mb-2">
                                        <View className="w-4 h-4 rounded-full border border-gray-300 items-center justify-center mr-2">
                                            {detail.freight === '2' && <View className="w-2 h-2 rounded-full bg-gray-600" />}
                                        </View>
                                        <Text className="text-sm text-gray-800">Customer bayar ditempat</Text>
                                    </View>
                                    <View className="flex-row items-center">
                                        <View className="w-4 h-4 rounded-full border border-gray-300 items-center justify-center mr-2">
                                            {detail.freight === '3' && <View className="w-2 h-2 rounded-full bg-gray-600" />}
                                        </View>
                                        <Text className="text-sm text-gray-800 flex-shrink">
                                            Customer Charge <Text className="text-xs font-normal text-gray-400">(Sudah include di harga mesin){detail.freight === '3' && detail.freight_amount ? ` - Rp ${detail.freight_amount}` : ''}</Text>
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <View>
                                <Text className="text-xs text-gray-500 mb-2">Biaya Forklift</Text>
                                <View>
                                    <View className="flex-row items-center mb-2">
                                        <View className="w-4 h-4 rounded-full border border-gray-300 items-center justify-center mr-2">
                                            {detail.forklift === '1' && <View className="w-2 h-2 rounded-full bg-gray-600" />}
                                        </View>
                                        <Text className="text-sm text-gray-800">EMM</Text>
                                    </View>
                                    <View className="flex-row items-center mb-2">
                                        <View className="w-4 h-4 rounded-full border border-gray-300 items-center justify-center mr-2">
                                            {detail.forklift === '2' && <View className="w-2 h-2 rounded-full bg-gray-600" />}
                                        </View>
                                        <Text className="text-sm text-gray-800">Customer sediakan sendiri</Text>
                                    </View>
                                    <View className="flex-row items-center">
                                        <View className="w-4 h-4 rounded-full border border-gray-300 items-center justify-center mr-2">
                                            {detail.forklift === '3' && <View className="w-2 h-2 rounded-full bg-gray-600" />}
                                        </View>
                                        <Text className="text-sm text-gray-800 flex-shrink">
                                            Customer Charge <Text className="text-xs font-normal text-gray-400">(Sudah include di harga mesin){detail.forklift === '3' && detail.forklift_amount ? ` - Rp ${detail.forklift_amount}` : ''}</Text>
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View className="h-[1px] bg-gray-200 my-4 mx-[-16px]" />
                            <Text className="text-xs font-bold text-gray-400 mb-3 uppercase">Jadwal & Referensi</Text>

                            <View className="mb-3 flex-row justify-between">
                                <View className="flex-1 mr-2">
                                    <Text className="text-xs text-gray-500">Creation Date</Text>
                                    <Text className="text-sm font-medium text-gray-800">{detail.date_do}</Text>
                                </View>
                                <View className="flex-1">
                                    <Text className="text-xs text-gray-500">Scheduled Time</Text>
                                    <Text className="text-sm font-medium text-gray-800">{detail.date_estimasi}</Text>
                                </View>
                            </View>

                            <View className="mb-3">
                                <Text className="text-xs text-gray-500">Tanggal Delivered</Text>
                                <Text className="text-sm font-medium text-gray-800">{detail.date_delivery || '-'}</Text>
                            </View>

                            <View className="mb-3">
                                <Text className="text-xs text-gray-500">Keterangan DO</Text>
                                <Text className="text-sm text-gray-800 italic">{detail.keterangan || '-'}</Text>
                            </View>

                            <View className="mb-3">
                                <Text className="text-xs text-gray-500">Source Document (SO)</Text>
                                <Text className="text-sm font-bold text-blue-600">{detail.code_so}</Text>
                            </View>

                            <View>
                                <Text className="text-xs text-gray-500">Keterangan SO</Text>
                                <Text className="text-sm text-gray-800 italic">{detail.keterangan_so || '-'}</Text>
                            </View>
                            <View className="h-[1px] bg-gray-200 my-4 mx-[-16px]" />
                            <Text className="text-xs font-bold text-gray-400 mb-3 uppercase">Daftar Barang ({detail.items.length})</Text>
                            <View className="mx-[-16px]">
                                <DoProductTable
                                    items={detail.items}
                                    selectable={true}
                                    selectedIds={selectedIds}
                                    onToggleSelect={onToggleSelect}
                                />
                            </View>
                        </View>

                        <View className="flex-row gap-4 mb-4">
                            <Button
                                variant="outline"
                                onPress={() => navigation.goBack()}
                                className="flex-1 h-14 rounded-xl flex-row items-center justify-center"
                            >
                                <X color={theme.colors.primary} size={20} className="mr-2" />
                                <Text className="font-bold text-lg" style={{ color: theme.colors.primary }}>Batal</Text>
                            </Button>
                            <Button
                                onPress={handleSave}
                                className="flex-1 h-14 rounded-2xl flex-row items-center justify-center"
                                style={{ elevation: 4, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                            >
                                <Save color="white" size={20} className="mr-2" />
                                <Text className="text-white font-bold text-lg">Simpan</Text>
                            </Button>
                        </View>

                    </View>
                )}
            </ScrollView>
        </View>
    );
};
