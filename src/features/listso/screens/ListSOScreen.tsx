import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { ListSOCard } from '../components/ListSOCard';
import { ListSOSkeleton, ListSOSummaryTableRowSkeleton } from '../skeleton/ListSOSkeleton';
import { useListSO } from '../hooks/useListSO';
import { theme } from '../../../theme/theme';
import { Calendar, Search, Check, Filter, Download } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Dropdown } from 'react-native-element-dropdown';

const DUMMY_CUSTOMERS = [
    { label: 'Semua Customer', value: '' },
    { label: 'PT. LESTARI GEMILANG', value: 'CUST-001' },
    { label: 'CV. KARYA BERSAMA', value: 'CUST-002' },
    { label: 'BINTANG ABADI', value: 'CUST-003' },
];

const DUMMY_PRODUCTS = [
    { label: 'Semua Product', value: '' },
    { label: 'Print Pack Premium', value: 'PROD-001' },
    { label: 'Plastic Standar', value: 'PROD-002' },
    { label: 'Machinery XYZ', value: 'PROD-003' },
];

export function ListSOScreen() {
    const navigation = useNavigation<any>();
    const { items, filters, isLoadingList, loadList, updateFilters } = useListSO();

    // local states
    const [isAllPeriode, setIsAllPeriode] = useState(filters.periode === 'ALL' || filters.periode === '');
    const [periodeText, setPeriodeText] = useState(filters.periode !== 'ALL' ? filters.periode : '');
    const [customerText, setCustomerText] = useState(filters.id_customers || '');
    const [productText, setProductText] = useState(filters.id_product || '');

    useEffect(() => {
        loadList();
    }, [loadList]);

    const onRefresh = useCallback(() => {
        loadList();
    }, [loadList]);

    const handleSearch = () => {
        updateFilters({
            periode: isAllPeriode ? 'ALL' : periodeText,
            id_customers: customerText,
            id_product: productText
        });
        setTimeout(() => loadList(), 100);
    };

    const navigateToDetail = (id_so: string) => {
        navigation.navigate('ListSODetailScreen', { id: id_so });
    };

    const renderHeader = () => (
        <View className="mt-3 mb-4">
            <View className="mb-2">
                {/* Customer */}
                <View className="mb-3">
                    <View className="border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
                        <Dropdown
                            style={{ height: 48, paddingHorizontal: 16 }}
                            data={DUMMY_CUSTOMERS}
                            labelField="label"
                            valueField="value"
                            placeholder="Pilih Customer"
                            value={customerText}
                            onChange={(item) => setCustomerText(item.value)}
                            search
                            searchPlaceholder="Cari customer..."
                        />
                    </View>
                </View>

                {/* Product */}
                <View className="mb-2">
                    <View className="border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
                        <Dropdown
                            style={{ height: 48, paddingHorizontal: 16 }}
                            data={DUMMY_PRODUCTS}
                            labelField="label"
                            valueField="value"
                            placeholder="Pilih Product"
                            value={productText}
                            onChange={(item) => setProductText(item.value)}
                            search
                            searchPlaceholder="Cari product..."
                        />
                    </View>
                </View>

                {/* Periode & Search */}
                <View>
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center flex-1 mr-2">

                            {!isAllPeriode && (
                                <View className="flex-1 flex-row items-center border border-gray-200 rounded-xl px-3 py-2 bg-gray-50">
                                    <Calendar size={18} color="#9ca3af" className="mr-2" />
                                    <TextInput
                                        value={periodeText}
                                        onChangeText={setPeriodeText}
                                        placeholder="07-2026"
                                        className="flex-1 py-0 text-gray-800 text-sm"
                                        placeholderTextColor="#9ca3af"
                                    />
                                </View>
                            )}

                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => setIsAllPeriode(!isAllPeriode)}
                                className="flex-row items-center ml-3"
                            >
                                <View className={`w-5 h-5 rounded-md border ${isAllPeriode ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white'} items-center justify-center mr-2`}>
                                    {isAllPeriode && <Check size={14} color="white" />}
                                </View>
                                <Text className="text-gray-700 text-sm">All</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Search Button */}
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
        const renderRow = (name: string, code: string, isTotal: boolean = false) => (
            <View key={code} className={`flex-row border-b border-gray-200 ${isTotal ? 'bg-gray-100' : 'bg-white'}`}>
                <View style={{ flex: 2 }} className="flex-row p-2 border-r border-gray-200 items-center">
                    <Text className={`flex-1 text-xs text-gray-700 ${isTotal ? 'font-bold' : ''}`}>{name}</Text>
                    {!isTotal && <Text className="w-8 text-xs border-l border-gray-200 text-gray-500 text-center">{code}</Text>}
                </View>
                <View style={{ flex: 0.5 }} className="p-2 border-r border-gray-200 items-end justify-center">
                    <Text className={`text-xs text-gray-700 ${isTotal ? 'font-bold' : ''}`}>0</Text>
                </View>
                <View style={{ flex: 1.5 }} className="p-2 border-r border-gray-200 items-end justify-center">
                    <Text className={`text-xs text-gray-700 ${isTotal ? 'font-bold' : ''}`}>0</Text>
                </View>
                <View style={{ flex: 1.5 }} className="p-2 items-end justify-center">
                    <Text className={`text-xs text-gray-700 ${isTotal ? 'font-bold' : ''}`}>0%</Text>
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
                    <Text className="font-bold text-gray-700 text-xs">Total</Text>
                </View>
                <View style={{ flex: 1.5 }} className="p-2 justify-center items-center">
                    <Text className="font-bold text-gray-700 text-[10px]">Persentase</Text>
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
                    {/* Section 1: Bulan Ini */}
                    {renderHeaderRow('Bulan Ini')}
                    {isLoadingList ? (
                        <ListSOSummaryTableRowSkeleton section="bln" />
                    ) : (
                        <>
                            {renderRow('Print Pack', 'PP_BLN')}
                            {renderRow('Plastic', 'PL_BLN')}
                            {renderRow('Auxiliary', 'AX_BLN')}
                            {renderRow('Total', 'TOT_BLN', true)}
                        </>
                    )}

                    {/* Section 2: Year to Date */}
                    {renderHeaderRow('Year to Date')}
                    {isLoadingList ? (
                        <ListSOSummaryTableRowSkeleton section="ytd" />
                    ) : (
                        <>
                            {renderRow('Print Pack', 'PP_YTD')}
                            {renderRow('Plastic', 'PL_YTD')}
                            {renderRow('Auxiliary', 'AX_YTD')}
                            {renderRow('Total', 'TOT_YTD', true)}
                        </>
                    )}
                </View>
            </View>
        );
    };

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator
                title="DAFTAR SALES ORDER"
            />

            <View className="flex-1 pt-4">
                <View className="px-4 bg-gray-50">
                    {renderHeader()}
                </View>
                <FlatList
                    data={[{ id: 'table_container' }]}
                    keyExtractor={(i) => i.id}
                    refreshControl={
                        <RefreshControl
                            refreshing={isLoadingList}
                            onRefresh={onRefresh}
                            colors={[theme.colors.primary]}
                        />
                    }
                    renderItem={() => (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-2">
                            <View>
                                {/* Table Header */}
                                <View className="flex-row bg-gray-200 rounded-t-xl overflow-hidden border border-gray-200">
                                    <Text className="w-12 py-3 px-2 font-bold text-[11px] text-gray-700 text-center">Line</Text>
                                    <Text className="w-24 py-3 px-2 font-bold text-[11px] text-gray-700 text-center">ST</Text>
                                    <Text className="w-24 py-3 px-2 font-bold text-[11px] text-gray-700">Date</Text>
                                    <Text className="w-32 py-3 px-2 font-bold text-[11px] text-gray-700">SO No</Text>
                                    <Text className="w-40 py-3 px-2 font-bold text-[11px] text-gray-700">Sold to</Text>
                                    <Text className="w-24 py-3 px-2 font-bold text-[11px] text-gray-700 text-center">Mata Uang</Text>
                                    <Text className="w-24 py-3 px-2 font-bold text-[11px] text-gray-700 text-right">Unit Price</Text>
                                    <Text className="w-16 py-3 px-2 font-bold text-[11px] text-gray-700 text-right">Qty</Text>
                                    <Text className="w-24 py-3 px-2 font-bold text-[11px] text-gray-700 text-right">Tax</Text>
                                    <Text className="w-28 py-3 px-2 font-bold text-[11px] text-gray-700 text-right">Subtotal</Text>
                                    <Text className="w-32 py-3 px-2 font-bold text-[11px] text-gray-700">Commodity</Text>
                                    <Text className="w-32 py-3 px-2 font-bold text-[11px] text-gray-700">Brand</Text>
                                    <Text className="w-32 py-3 px-2 font-bold text-[11px] text-gray-700">Sales</Text>
                                    <Text className="w-32 py-3 px-2 font-bold text-[11px] text-gray-700">Term of payment</Text>
                                    <Text className="w-40 py-3 px-2 font-bold text-[11px] text-gray-700">Notes</Text>
                                    <Text className="w-24 py-3 px-2 font-bold text-[11px] text-gray-700">Tgl Kirim</Text>
                                    <Text className="w-32 py-3 px-2 font-bold text-[11px] text-gray-700">No PO</Text>
                                    <Text className="w-24 py-3 px-2 font-bold text-[11px] text-gray-700">Tgl DO</Text>
                                </View>

                                {/* Table Body */}
                                {isLoadingList ? (
                                    <ListSOSkeleton />
                                ) : items.length > 0 ? items.map((item, index) => (
                                    <ListSOCard
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
            </View>
        </View>
    );
}
