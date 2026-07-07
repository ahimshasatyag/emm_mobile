import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { useListSO } from '../hooks/useListSO';
import { ListSODetailSkeleton } from '../skeleton/ListSODetailSkeleton';
import { theme } from '../../../theme/theme';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export function ListSODetailScreen() {
    const navigation = useNavigation();
    const route = useRoute<any>();
    const id = route.params?.id;

    const { currentDetail, isLoadingDetail, loadDetail, resetDetail } = useListSO();

    useEffect(() => {
        if (id) {
            loadDetail(id);
        }
        return () => resetDetail();
    }, [id, loadDetail, resetDetail]);

    const onRefresh = () => {
        if (id) {
            loadDetail(id);
        }
    };

    const formatCurrency = (value: string | number) => {
        const num = typeof value === 'string' ? parseFloat(value) : value;
        return num.toLocaleString('id-ID');
    };

    // Calculate grand total from items safely
    const grandTotal = currentDetail?.items?.reduce((acc, item) => acc + item.subtotal, 0) || 0;

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator
                title={isLoadingDetail && !currentDetail ? "MEMUAT DATA..." : "DETAIL SO"}
                showBackButton
                onBackPress={() => navigation.goBack()}
            />

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isLoadingDetail} onRefresh={onRefresh} colors={[theme.colors.primary]} />
                }
            >
                {isLoadingDetail ? (
                    <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>
                        <ListSODetailSkeleton />
                    </Animated.View>
                ) : !currentDetail ? (
                    <View className="py-20 items-center justify-center">
                        <Text className="text-gray-500">Data SO tidak ditemukan</Text>
                    </View>
                ) : (
                    <Animated.View key="content" entering={FadeIn.duration(400)}>
                    {/* Status Box */}
                    <View className="bg-blue-50 p-4 rounded-2xl mb-4 border border-blue-100 flex-row justify-between items-center">
                        <Text className="text-blue-800 font-bold text-lg">{currentDetail.status_so}</Text>
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
                                <Text className="w-2/3 text-gray-900 text-sm font-medium">: {currentDetail.customers_address}</Text>
                            </View>
                            <View className="mb-3 flex-row">
                                <Text className="w-1/3 text-gray-500 text-sm">Mata Uang</Text>
                                <Text className="w-2/3 text-gray-900 text-sm font-medium">: {currentDetail.vcurrency}</Text>
                            </View>
                            <View className="mb-3 flex-row">
                                <Text className="w-1/3 text-gray-500 text-sm">Kurs</Text>
                                <Text className="w-2/3 text-gray-900 text-sm font-medium">: {formatCurrency(currentDetail.nkurs)}</Text>
                            </View>
                            <View className="mb-3 flex-row">
                                <Text className="w-1/3 text-gray-500 text-sm">PPN</Text>
                                <Text className="w-2/3 text-gray-900 text-sm font-medium">: {currentDetail.flag_ppn === 1 ? 'Ya' : 'Tidak'}</Text>
                            </View>
                            <View className="mb-3 flex-row">
                                <Text className="w-1/3 text-gray-500 text-sm">Est. Kirim</Text>
                                <Text className="w-2/3 text-gray-900 text-sm font-medium">: {currentDetail.date_estimasi}</Text>
                            </View>
                            <View className="mb-3 flex-row">
                                <Text className="w-1/3 text-gray-500 text-sm">Delivery Term</Text>
                                <Text className="w-2/3 text-gray-900 text-sm font-medium">: {currentDetail.delivery_term}</Text>
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

                            <View className="bg-white p-4 mb-3 border border-gray-100 rounded-xl">
                                <View className="flex-row mb-4">
                                    <View className="flex-row flex-1 items-center">
                                        <Text className="text-gray-700 text-xs w-1/2">DP %</Text>
                                        <Text className="text-gray-900 text-xs">{currentDetail.ndp_persen}</Text>
                                    </View>
                                    <View className="flex-row flex-1 items-center justify-between">
                                        <Text className="text-gray-700 text-xs text-center w-1/2">DP RP</Text>
                                        <Text className="text-gray-900 text-xs text-right">{formatCurrency(currentDetail.ndp_amount)}</Text>
                                    </View>
                                </View>
                                <View className="flex-row">
                                    <View className="flex-row flex-1 items-center">
                                        <Text className="text-gray-700 text-xs w-1/2">TENOR</Text>
                                        <Text className="text-gray-900 text-xs">{currentDetail.ntenor}</Text>
                                    </View>
                                    <View className="flex-row flex-1 items-center justify-between">
                                        <Text className="text-gray-700 text-xs font-bold mr-4">X</Text>
                                        <Text className="text-gray-700 text-xs text-center w-1/3">Cicilan RP</Text>
                                        <Text className="text-gray-900 text-xs text-right">{formatCurrency(currentDetail.ntenor_amount)}</Text>
                                    </View>
                                </View>
                            </View>

                            <View className="mb-3 flex-row">
                                <Text className="w-1/3 text-gray-500 text-sm">Tipe Pembayaran</Text>
                                <Text className="w-2/3 text-gray-900 text-sm font-medium">: {currentDetail.nm_cara_pembayaran}</Text>
                            </View>
                            <View className="mb-3 flex-row">
                                <Text className="w-1/3 text-gray-500 text-sm">Waktu Bayar</Text>
                                <Text className="w-2/3 text-gray-900 text-sm font-medium">: {currentDetail.nm_waktu_bayar}</Text>
                            </View>
                            <View className="mb-3 flex-row">
                                <Text className="w-1/3 text-gray-500 text-sm">Keterangan</Text>
                                <Text className="w-2/3 text-gray-900 text-sm font-medium">: {currentDetail.keterangan}</Text>
                            </View>
                            <View className="mb-3 flex-row">
                                <Text className="w-1/3 text-gray-500 text-sm">Dibuat Oleh</Text>
                                <Text className="w-2/3 text-gray-900 text-sm font-medium">: {currentDetail.nm_users}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Items */}
                    <View className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-4">
                        <Text className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Daftar Barang</Text>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                            <View>
                                {/* Table Header */}
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

                                {/* Table Rows */}
                                {currentDetail.items.map((item, index) => {
                                    const textColor = item.status_barang === 'READY' ? 'text-green-600' : item.status_barang === 'INDENT' ? 'text-blue-700' : 'text-orange-500';

                                    return (
                                        <View key={index} className={`flex-row items-center border-b border-gray-200 border-x ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                            <Text className="w-10 py-3 px-2 text-[11px] text-gray-700 text-center">{index + 1}</Text>
                                            <View className="w-48 py-2 px-2 justify-center">
                                                <Text className="text-gray-900 font-bold text-[11px]" numberOfLines={2}>{item.nm_product}</Text>
                                                <Text className="text-gray-500 text-[10px] mt-0.5">{item.code_product}</Text>
                                            </View>
                                            <Text className="w-32 py-3 px-2 text-[11px] text-gray-800 font-medium text-right">{formatCurrency(item.product_price)}</Text>
                                            <Text className="w-16 py-3 px-2 text-[11px] text-gray-800 font-medium text-center">{item.nqty}</Text>
                                            <Text className="w-24 py-3 px-2 text-[11px] text-gray-800 font-medium text-center">{item.nm_product_satuan}</Text>
                                            <Text className="w-28 py-3 px-2 text-[11px] text-gray-800 font-medium text-center">{item.delivery_term || '-'}</Text>
                                            <View className="w-36 py-2 px-2 items-center justify-center">
                                                <View className="flex-row items-center">
                                                    <Text className={`text-[10px] font-bold mr-1.5 ${textColor}`}>
                                                        {item.status_barang}
                                                    </Text>
                                                    <View className="flex-row bg-gray-200 rounded border border-gray-200 overflow-hidden">
                                                        <View className="px-1 py-0.5 bg-gray-200">
                                                            <Text className={`text-[10px] ${textColor}`}>{item.indent_amount || 0}</Text>
                                                        </View>
                                                        <View className="w-[1px] bg-white" />
                                                        <View className="px-1 py-0.5 bg-gray-200">
                                                            <Text className={`text-[10px] ${textColor}`}>Bulan</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                            <Text className="w-32 py-3 px-2 text-blue-600 font-bold text-[11px] text-right">{formatCurrency(item.subtotal)}</Text>
                                        </View>
                                    );
                                })}
                            </View>
                        </ScrollView>

                        {/* Grand Total */}
                        <View className="flex-row justify-between items-center mt-2">
                            <Text className="text-gray-800 font-bold text-base">GRAND TOTAL</Text>
                            <Text className="text-blue-600 font-bold text-xl">{formatCurrency(grandTotal)}</Text>
                        </View>
                    </View>
                </Animated.View>
                )}
            </ScrollView>
        </View>
    );
}
