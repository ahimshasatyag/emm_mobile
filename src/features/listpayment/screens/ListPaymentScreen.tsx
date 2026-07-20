import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { ListPaymentCard } from '../components/ListPaymentCard';
import { ListPaymentSkeleton, ListPaymentSummaryTableRowSkeleton } from '../skeleton/ListPaymentSkeleton';
import { useListPayment } from '../hooks/useListPayment';
import { theme } from '../../../theme/theme';
import { Calendar, Filter, Check, Download } from 'lucide-react-native';
import { Dropdown } from 'react-native-element-dropdown';

const DUMMY_CUSTOMERS = [
    { label: 'Semua Customer', value: '' },
    { label: 'PT DUMMY CUSTOMER', value: 'CUST-001' },
    { label: 'CV MAJU JAYA', value: 'CUST-002' },
];

const DUMMY_PRODUCTS = [
    { label: 'Semua Product', value: '' },
    { label: 'Produk Dummy', value: 'PRD001' },
    { label: 'Produk Dummy 2', value: 'PRD002' },
];

export function ListPaymentScreen() {
    const navigation = useNavigation<any>();
    const { items, summary, isLoading, error, periode, ckPeriode, idCustomer, idProduct, handleSearch, setPeriode, setCkPeriode, setIdCustomer, setIdProduct } = useListPayment();

    const [isInitializing, setIsInitializing] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const onRefresh = useCallback(async () => {
        setIsRefreshing(true);
        handleSearch();
        setIsRefreshing(false);
    }, [handleSearch]);

    const navigateToDetail = (id_so: string) => {
        navigation.navigate('ListPaymentDetailScreen', { id: id_so });
    };

    const renderHeader = () => (
        <View className="mt-3 mb-4">
            <View className="mb-2">
                <View className="mb-3">
                    <View className="border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
                        <Dropdown
                            style={{ height: 48, paddingHorizontal: 16 }}
                            data={DUMMY_CUSTOMERS}
                            labelField="label"
                            valueField="value"
                            placeholder="Pilih Customer"
                            value={idCustomer}
                            onChange={(item) => setIdCustomer(item.value)}
                            search
                            searchPlaceholder="Cari customer..."
                        />
                    </View>
                </View>

                <View className="mb-2">
                    <View className="border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
                        <Dropdown
                            style={{ height: 48, paddingHorizontal: 16 }}
                            data={DUMMY_PRODUCTS}
                            labelField="label"
                            valueField="value"
                            placeholder="Pilih Product"
                            value={idProduct}
                            onChange={(item) => setIdProduct(item.value)}
                            search
                            searchPlaceholder="Cari product..."
                        />
                    </View>
                </View>

                <View>
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center flex-1 mr-2">
                            {!ckPeriode && (
                                <View className="flex-1 flex-row items-center border border-gray-200 rounded-xl px-3 py-2 bg-gray-50">
                                    <Calendar size={18} color="#9ca3af" className="mr-2" />
                                    <TextInput
                                        value={periode}
                                        onChangeText={setPeriode}
                                        placeholder="YYYY-MM"
                                        className="flex-1 py-0 text-gray-800 text-sm"
                                        placeholderTextColor="#9ca3af"
                                    />
                                </View>
                            )}

                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => setCkPeriode(!ckPeriode)}
                                className="flex-row items-center ml-3"
                            >
                                <View className={`w-5 h-5 rounded-md border ${ckPeriode ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white'} items-center justify-center mr-2`}>
                                    {ckPeriode && <Check size={14} color="white" />}
                                </View>
                                <Text className="text-gray-700 text-sm">All</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={handleSearch}
                            style={{ backgroundColor: theme.colors.primary }}
                            className="px-4 py-2 rounded-xl flex-row items-center justify-center h-10"
                        >
                            <Filter size={16} color="white" className="mr-2" />
                            <Text className="text-white font-bold text-sm">Search</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );

    const renderSummaryTable = () => {
        if (!summary || summary.length === 0) return null;

        const getSummary = (kat: string, type: string) => {
            return summary.find(s => s.kategori === kat && s.type_kategori === type) || { product_price: 0, nqty: 0 };
        };

        const totalMonth = summary.filter(s => s.kategori === 'month').reduce((acc, curr) => acc + curr.product_price, 0);
        const qtyMonth = summary.filter(s => s.kategori === 'month').reduce((acc, curr) => acc + curr.nqty, 0);
        const totalYtd = summary.filter(s => s.kategori === 'ytd').reduce((acc, curr) => acc + curr.product_price, 0);
        const qtyYtd = summary.filter(s => s.kategori === 'ytd').reduce((acc, curr) => acc + curr.nqty, 0);

        const renderRow = (name: string, code: string, qty: number, total: number, isTotal: boolean = false) => (
            <View key={code} className={`flex-row border-b border-gray-200 ${isTotal ? 'bg-gray-100' : 'bg-white'}`}>
                <View style={{ flex: 2 }} className="flex-row p-2 border-r border-gray-200 items-center">
                    <Text className={`flex-1 text-xs text-gray-700 ${isTotal ? 'font-bold' : ''}`}>{name}</Text>
                    {!isTotal && <Text className="w-8 text-xs border-l border-gray-200 text-gray-500 text-center">{code}</Text>}
                </View>
                <View style={{ flex: 0.5 }} className="p-2 border-r border-gray-200 items-end justify-center">
                    <Text className={`text-xs text-gray-700 ${isTotal ? 'font-bold' : ''}`}>{qty}</Text>
                </View>
                <View style={{ flex: 1.5 }} className="p-2 border-r border-gray-200 items-end justify-center">
                    <Text className={`text-xs text-gray-700 ${isTotal ? 'font-bold' : ''}`}>Rp {total.toLocaleString('id-ID')}</Text>
                </View>
            </View>
        );

        const renderHeaderRow = (title: string) => (
            <View className="flex-row bg-gray-200 border-b border-gray-200">
                <View style={{ flex: 2 }} className="p-2 border-r border-gray-200 justify-center">
                    <Text className="font-bold text-gray-700 text-center text-xs">{title}</Text>
                </View>
                <View style={{ flex: 0.5 }} className="p-2 border-r border-gray-200 justify-center items-center">
                    <Text className="font-bold text-gray-700 text-xs">Qty</Text>
                </View>
                <View style={{ flex: 1.5 }} className="p-2 border-r border-gray-200 justify-center items-center">
                    <Text className="font-bold text-gray-700 text-xs">Total Val</Text>
                </View>
            </View>
        );

        return (
            <View className="px-4 mt-10 pb-24">
                <TouchableOpacity className="bg-green-600 px-4 py-2 rounded-xl flex-row items-center justify-center self-start">
                    <Download size={16} color="white" className="mr-2" />
                    <Text className="text-white font-bold text-sm">Click export to Excel</Text>
                </TouchableOpacity>
                <View className="rounded-xl mt-4 border border-gray-200 overflow-hidden bg-white shadow-sm">
                    {renderHeaderRow('Bulan Ini')}
                    {isLoading || isInitializing ? (
                        <ListPaymentSummaryTableRowSkeleton section="bln" />
                    ) : (
                        <>
                            {renderRow('Print Pack', 'PP_BLN', getSummary('month', 'PP').nqty, getSummary('month', 'PP').product_price)}
                            {renderRow('Plastic', 'PL_BLN', getSummary('month', 'PL').nqty, getSummary('month', 'PL').product_price)}
                            {renderRow('Auxiliary', 'AX_BLN', getSummary('month', 'AX').nqty, getSummary('month', 'AX').product_price)}
                            {renderRow('Total', 'TOT_BLN', qtyMonth, totalMonth, true)}
                        </>
                    )}

                    {renderHeaderRow('Year to Date')}
                    {isLoading || isInitializing ? (
                        <ListPaymentSummaryTableRowSkeleton section="ytd" />
                    ) : (
                        <>
                            {renderRow('Print Pack', 'PP_YTD', getSummary('ytd', 'PP').nqty, getSummary('ytd', 'PP').product_price)}
                            {renderRow('Plastic', 'PL_YTD', getSummary('ytd', 'PL').nqty, getSummary('ytd', 'PL').product_price)}
                            {renderRow('Auxiliary', 'AX_YTD', getSummary('ytd', 'AX').nqty, getSummary('ytd', 'AX').product_price)}
                            {renderRow('Total', 'TOT_YTD', qtyYtd, totalYtd, true)}
                        </>
                    )}
                </View>
            </View>
        );
    };

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator title="LIST PAYMENT" />

            <View className="flex-1 pt-4">
                <View className="px-4 bg-gray-50">
                    {renderHeader()}
                </View>

                {error ? (
                    <View className="flex-1 justify-center items-center p-5">
                        <Text className="text-red-500 text-center">{error}</Text>
                    </View>
                ) : (
                    <FlatList
                        data={[{ id: 'table_container' }]}
                        keyExtractor={(i) => i.id}
                        refreshControl={
                            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
                        }
                        renderItem={() => (
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-2">
                                <View>
                                    {/* Table Header */}
                                    <View className="flex-row bg-gray-200 rounded-t-xl overflow-hidden border border-gray-200">
                                        <Text className="w-12 py-3 px-2 font-bold text-[11px] text-gray-700 text-center">No</Text>
                                        <Text className="w-24 py-3 px-2 font-bold text-[11px] text-gray-700 text-center">Tipe</Text>
                                        <Text className="w-24 py-3 px-2 font-bold text-[11px] text-gray-700 text-center">Tgl SO</Text>
                                        <Text className="w-32 py-3 px-2 font-bold text-[11px] text-gray-700">Kode SO</Text>
                                        <Text className="w-40 py-3 px-2 font-bold text-[11px] text-gray-700">Customer</Text>
                                        <Text className="w-32 py-3 px-2 font-bold text-[11px] text-gray-700">Produk</Text>
                                        <Text className="w-24 py-3 px-2 font-bold text-[11px] text-gray-700 text-center">Mata Uang</Text>
                                        <Text className="w-24 py-3 px-2 font-bold text-[11px] text-gray-700 text-right">Harga Unit</Text>
                                        <Text className="w-16 py-3 px-2 font-bold text-[11px] text-gray-700 text-center">Qty</Text>
                                        <Text className="w-28 py-3 px-2 font-bold text-[11px] text-gray-700 text-right">Subtotal</Text>
                                        <Text className="w-32 py-3 px-2 font-bold text-[11px] text-gray-700 text-center">Invoice</Text>
                                        <Text className="w-48 py-3 px-2 font-bold text-[11px] text-gray-700">Detail Payment</Text>
                                        <Text className="w-32 py-3 px-2 font-bold text-[11px] text-gray-700">Tipe Pembayaran</Text>
                                        <Text className="w-32 py-3 px-2 font-bold text-[11px] text-gray-700">Term</Text>
                                        <Text className="w-32 py-3 px-2 font-bold text-[11px] text-gray-700">Sales</Text>
                                    </View>

                                    {/* Table Body */}
                                    {isLoading || isInitializing ? (
                                        <ListPaymentSkeleton />
                                    ) : items.length > 0 ? items.map((item, index) => (
                                        <ListPaymentCard
                                            key={item.id_so}
                                            item={item}
                                            index={index}
                                            onPress={() => navigateToDetail(item.id_so)}
                                        />
                                    )) : (
                                        <View className="py-10 bg-white border border-t-0 border-gray-100 rounded-b-xl items-center justify-center">
                                            <Text className="text-gray-500">Tidak ada data ditemukan</Text>
                                        </View>
                                    )}
                                </View>
                            </ScrollView>
                        )}
                        ListFooterComponent={renderSummaryTable}
                        contentContainerStyle={{ paddingBottom: 100 }}
                    />
                )}
            </View>
        </View>
    );
}
