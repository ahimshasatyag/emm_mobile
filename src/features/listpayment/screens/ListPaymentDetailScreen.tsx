import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { theme } from '../../../theme/theme';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { ListPaymentItem } from '../types/listpayment.types';
import { ListPaymentDetailSkeleton } from '../skeleton/ListPaymentDetailSkeleton';
import { formatRp } from '../../../utils/helpers/money';

export function ListPaymentDetailScreen() {
    const navigation = useNavigation();
    const route = useRoute<any>();
    const id = route.params?.id;

    const { items, isLoading } = useAppSelector((state) => state.listpayment);
    const [currentDetail, setCurrentDetail] = useState<ListPaymentItem | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        if (id && items) {
            const found = items.find(i => i.id_so === id);
            setCurrentDetail(found || null);
        }
    }, [id, items]);

    const onRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 500);
    };

    const grandTotal = currentDetail ? parseFloat(currentDetail.subtotal) : 0;
    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator
                title={(isLoading && !currentDetail) || isRefreshing ? "MEMUAT DATA..." : "DETAIL PAYMENT"}
                showBackButton
                onBackPress={() => navigation.goBack()}
            />

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
                }
            >
                {isLoading || isRefreshing ? (
                    <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>

                        <ListPaymentDetailSkeleton />
                    </Animated.View>
                ) : !currentDetail ? (

                    <View className="py-20 items-center justify-center">
                        <Text className="text-gray-500">Data Payment tidak ditemukan</Text>
                    </View>
                ) : (
                    <Animated.View key="content" entering={FadeIn.duration(400)}>
                        {/* Status Box */}
                        <View className="bg-blue-50 p-4 rounded-2xl mb-4 border border-blue-100 flex-row justify-between items-center">
                            <Text className="text-blue-800 font-bold text-lg">{currentDetail.type_kategori}</Text>
                            <Text className="text-blue-600 text-sm font-medium">{currentDetail.date_so}</Text>
                        </View>

                        {/* General & Payment Info Combined Card */}
                        <View className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-4">

                            <Text className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Informasi Umum</Text>

                            <View className="mb-2">
                                <View className="mb-3 flex-row">
                                    <Text className="w-1/3 text-gray-500 text-sm">Salesperson</Text>
                                    <Text className="w-2/3 text-gray-900 text-sm font-medium">: {currentDetail.nm_karyawan}</Text>
                                </View>
                                <View className="mb-3 flex-row">
                                    <Text className="w-1/3 text-gray-500 text-sm">Delivery To</Text>
                                    <Text className="w-2/3 text-gray-900 text-sm font-medium">: {currentDetail.nm_customers}</Text>
                                </View>
                                <View className="mb-3 flex-row">
                                    <Text className="w-1/3 text-gray-500 text-sm">Alamat Pembeli</Text>
                                    <Text className="w-2/3 text-gray-900 text-sm font-medium">: -</Text>
                                </View>
                                <View className="mb-3 flex-row">
                                    <Text className="w-1/3 text-gray-500 text-sm">Mata Uang</Text>
                                    <Text className="w-2/3 text-gray-900 text-sm font-medium">: {currentDetail.vcurrency}</Text>
                                </View>
                                <View className="mb-3 flex-row">
                                    <Text className="w-1/3 text-gray-500 text-sm">Kurs</Text>
                                    <Text className="w-2/3 text-gray-900 text-sm font-medium">: 1</Text>
                                </View>
                                <View className="mb-3 flex-row">
                                    <Text className="w-1/3 text-gray-500 text-sm">PPN</Text>
                                    <Text className="w-2/3 text-gray-900 text-sm font-medium">: {parseFloat(currentDetail.tax_amount) > 0 ? 'Ya' : 'Tidak'}</Text>
                                </View>
                                <View className="mb-3 flex-row">
                                    <Text className="w-1/3 text-gray-500 text-sm">Est. Kirim</Text>
                                    <Text className="w-2/3 text-gray-900 text-sm font-medium">: {currentDetail.date_delivery}</Text>
                                </View>
                                <View className="mb-3 flex-row">
                                    <Text className="w-1/3 text-gray-500 text-sm">Delivery Term</Text>
                                    <Text className="w-2/3 text-gray-900 text-sm font-medium">: -</Text>
                                </View>
                            </View>

                            <Text className="text-lg font-bold text-gray-900 mt-2 mb-4 border-b border-gray-100 pb-2">Informasi Pembayaran</Text>

                            <View className="mb-2">
                                <View className="mb-3 flex-row">
                                    <Text className="w-1/3 text-gray-500 text-sm">Tanggal</Text>
                                    <Text className="w-2/3 text-gray-900 text-sm font-medium">: {currentDetail.date_so}</Text>
                                </View>
                                <View className="mb-3 flex-row">
                                    <Text className="w-1/3 text-gray-500 text-sm">Metode Payment</Text>
                                    <Text className="w-2/3 text-gray-900 text-sm font-medium">: {currentDetail.nm_type_pembayaran}</Text>
                                </View>

                                {/* Exact DP & Tenor box design from ListSO */}
                                <View className="bg-white p-4 mb-3 border border-gray-100 rounded-xl">
                                    <View className="flex-row mb-4">
                                        <View className="flex-row flex-1 items-center">
                                            <Text className="text-gray-700 text-xs w-1/2">DP %</Text>
                                            <Text className="text-gray-900 text-xs">0</Text>
                                        </View>
                                        <View className="flex-row flex-1 items-center justify-between">
                                            <Text className="text-gray-700 text-xs text-center w-1/2">DP RP</Text>
                                            <Text className="text-gray-900 text-xs text-right">0</Text>
                                        </View>
                                    </View>
                                    <View className="flex-row">
                                        <View className="flex-row flex-1 items-center">
                                            <Text className="text-gray-700 text-xs w-1/2">TENOR</Text>
                                            <Text className="text-gray-900 text-xs">0</Text>
                                        </View>
                                        <View className="flex-row flex-1 items-center justify-between">
                                            <Text className="text-gray-700 text-xs font-bold mr-4">X</Text>
                                            <Text className="text-gray-700 text-xs text-center w-1/3">Cicilan RP</Text>
                                            <Text className="text-gray-900 text-xs text-right">0</Text>
                                        </View>
                                    </View>
                                </View>

                                <View className="mb-3 flex-row">
                                    <Text className="w-1/3 text-gray-500 text-sm">Tipe Pembayaran</Text>
                                    <Text className="w-2/3 text-gray-900 text-sm font-medium">: {currentDetail.nm_type_pembayaran}</Text>
                                </View>
                                <View className="mb-3 flex-row">
                                    <Text className="w-1/3 text-gray-500 text-sm">Waktu Bayar</Text>
                                    <Text className="w-2/3 text-gray-900 text-sm font-medium">: {currentDetail.term_pembayaran}</Text>
                                </View>
                                <View className="mb-3 flex-row">
                                    <Text className="w-1/3 text-gray-500 text-sm">Keterangan</Text>
                                    <Text className="w-2/3 text-gray-900 text-sm font-medium">: {currentDetail.keterangan || '-'}</Text>
                                </View>
                                <View className="mb-3 flex-row">
                                    <Text className="w-1/3 text-gray-500 text-sm">Dibuat Oleh</Text>
                                    <Text className="w-2/3 text-gray-900 text-sm font-medium">: {currentDetail.nm_karyawan}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Items Table */}
                        <View className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-4">
                            <Text className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Daftar Barang</Text>

                            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                                <View>
                                    {/* Table Header matching ListSO */}
                                    <View className="flex-row bg-gray-200 rounded-t-xl overflow-hidden border border-gray-200">
                                        <Text className="w-10 py-3 px-2 font-bold text-[11px] text-gray-700 text-center">No</Text>
                                        <Text className="w-48 py-3 px-2 font-bold text-[11px] text-gray-700">Produk</Text>
                                        <Text className="w-32 py-3 px-2 font-bold text-[11px] text-gray-700 text-right">Harga</Text>
                                        <Text className="w-16 py-3 px-2 font-bold text-[11px] text-gray-700 text-center">Qty</Text>
                                        <Text className="w-24 py-3 px-2 font-bold text-[11px] text-gray-700 text-center">Satuan</Text>
                                        <Text className="w-28 py-3 px-2 font-bold text-[11px] text-gray-700 text-center">Delivery Term</Text>
                                        <Text className="w-36 py-3 px-2 font-bold text-[11px] text-gray-700 text-center">Status Barang</Text>
                                        <Text className="w-32 py-3 px-2 font-bold text-[11px] text-gray-700 text-right">Subtotal</Text>
                                    </View>

                                    {/* Table Row matching ListSO item structure */}
                                    <View className="flex-row items-center border-b border-gray-200 border-x bg-white">
                                        <Text className="w-10 py-3 px-2 text-[11px] text-gray-700 text-center">1</Text>
                                        <View className="w-48 py-2 px-2 justify-center">
                                            <Text className="text-gray-900 font-bold text-[11px]" numberOfLines={2}>{currentDetail.nm_product}</Text>
                                            <Text className="text-gray-500 text-[10px] mt-0.5">{currentDetail.code_product}</Text>
                                        </View>
                                        <Text className="w-32 py-3 px-2 text-[11px] text-gray-800 font-medium text-right">{formatRp(currentDetail.harga_ppn)}</Text>
                                        <Text className="w-16 py-3 px-2 text-[11px] text-gray-800 font-medium text-center">{currentDetail.tot_qty}</Text>
                                        <Text className="w-24 py-3 px-2 text-[11px] text-gray-800 font-medium text-center">-</Text>
                                        <Text className="w-28 py-3 px-2 text-[11px] text-gray-800 font-medium text-center">-</Text>

                                        {/* Status Barang matching exact ListSO UI */}
                                        <View className="w-36 py-2 px-2 items-center justify-center">
                                            <View className="flex-row items-center">
                                                <Text className="text-[10px] font-bold mr-1.5 text-green-600">READY</Text>
                                                <View className="flex-row bg-gray-200 rounded border border-gray-200 overflow-hidden">
                                                    <View className="px-1 py-0.5 bg-gray-200">
                                                        <Text className="text-[10px] text-green-600">0</Text>
                                                    </View>
                                                    <View className="w-[1px] bg-white" />
                                                    <View className="px-1 py-0.5 bg-gray-200">
                                                        <Text className="text-[10px] text-green-600">Bulan</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                        <Text className="w-32 py-3 px-2 text-blue-600 font-bold text-[11px] text-right">{formatRp(currentDetail.subtotal)}</Text>
                                    </View>
                                </View>
                            </ScrollView>

                            {/* Grand Total */}
                            <View className="flex-row justify-between items-center mt-2">
                                <Text className="text-gray-800 font-bold text-base">GRAND TOTAL</Text>
                                <Text className="text-blue-600 font-bold text-xl">{formatRp(grandTotal)}</Text>
                            </View>
                        </View>
                    </Animated.View>
                )}
            </ScrollView>
        </View>
    );
}
