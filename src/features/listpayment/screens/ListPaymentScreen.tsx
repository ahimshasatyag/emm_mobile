import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { ListPaymentCard } from '../components/ListPaymentCard';
import { ListPaymentSummary } from '../components/ListPaymentSummary';
import { ListPaymentSkeleton, ListPaymentSummaryTableRowSkeleton } from '../skeleton/ListPaymentSkeleton';
import { useListPayment } from '../hooks/useListPayment';
import { theme } from '../../../theme/theme';
import { Calendar, Filter, Check, Download } from 'lucide-react-native';
import { Dropdown } from 'react-native-element-dropdown';

import { customersApi } from '../../customers/api/customers.api';
import { productsApi } from '../../products/api/products.api';

export function ListPaymentScreen() {
    const navigation = useNavigation<any>();
    const { items, summary, isLoading, error, periode, ckPeriode, idCustomer, idProduct, handleSearch, setPeriode, setCkPeriode, setIdCustomer, setIdProduct } = useListPayment();

    const [isInitializing, setIsInitializing] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const [customerOptions, setCustomerOptions] = useState([{ label: 'Semua Customer', value: '' }]);
    const [productOptions, setProductOptions] = useState([{ label: 'Semua Product', value: '' }]);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;
            const initialize = async () => {
                setIsInitializing(true);
                try {
                    const [custRes, prodRes] = await Promise.all([
                        customersApi.fetchCustomers(),
                        productsApi.fetchProducts().catch(() => [])
                    ]);

                    if (isActive) {
                        if (custRes.success && custRes.data) {
                            setCustomerOptions([
                                { label: 'Semua Customer', value: '' },
                                ...custRes.data.map((c: any) => ({
                                    label: c.nm_customers,
                                    value: c.id_customers?.toString()
                                }))
                            ]);
                        }
                        if (prodRes && Array.isArray(prodRes)) {
                            setProductOptions([
                                { label: 'Semua Product', value: '' },
                                ...prodRes.map((p: any) => ({
                                    label: p.nm_product,
                                    value: p.id_product?.toString()
                                }))
                            ]);
                        }
                    }

                    handleSearch();
                } catch (error) {
                    // ignore
                } finally {
                    if (isActive) setIsInitializing(false);
                }
            };
            initialize();
            return () => {
                isActive = false;
                setIsInitializing(true);
            };
        }, [])
    );

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
                            data={customerOptions}
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
                            data={productOptions}
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

        return (
            <View className="px-4 mt-10 pb-24">
                <TouchableOpacity className="bg-green-600 px-4 py-2 rounded-xl flex-row items-center justify-center self-start mb-4">
                    <Download size={16} color="white" className="mr-2" />
                    <Text className="text-white font-bold text-sm">Click export to Excel</Text>
                </TouchableOpacity>
                {isLoading || isInitializing ? (
                    <ListPaymentSummaryTableRowSkeleton section="bln" />
                ) : (
                    <ListPaymentSummary summary={summary} periodeStr={periode} />
                )}
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
                                        <Text className="w-12 py-3 px-2 font-bold text-[11px] text-gray-700 text-center">Line</Text>
                                        <Text className="w-24 py-3 px-2 font-bold text-[11px] text-gray-700 text-center">Type</Text>
                                        <Text className="w-24 py-3 px-2 font-bold text-[11px] text-gray-700 text-center">Tgl</Text>
                                        <Text className="w-32 py-3 px-2 font-bold text-[11px] text-gray-700">No SO</Text>
                                        <Text className="w-40 py-3 px-2 font-bold text-[11px] text-gray-700">Customer</Text>
                                        <Text className="w-24 py-3 px-2 font-bold text-[11px] text-gray-700 text-center">Mata Uang</Text>
                                        <Text className="w-24 py-3 px-2 font-bold text-[11px] text-gray-700 text-right">Unit Price</Text>
                                        <Text className="w-16 py-3 px-2 font-bold text-[11px] text-gray-700 text-center">Qty</Text>
                                        <Text className="w-24 py-3 px-2 font-bold text-[11px] text-gray-700 text-right">Tax</Text>
                                        <Text className="w-28 py-3 px-2 font-bold text-[11px] text-gray-700 text-right">Subtotal</Text>
                                        <Text className="w-32 py-3 px-2 font-bold text-[11px] text-gray-700">Commodity</Text>
                                        <Text className="w-32 py-3 px-2 font-bold text-[11px] text-gray-700">Merk</Text>
                                        <Text className="w-32 py-3 px-2 font-bold text-[11px] text-gray-700">Sales</Text>
                                        <Text className="w-32 py-3 px-2 font-bold text-[11px] text-gray-700">Tipe Pembayaran</Text>
                                        <Text className="w-32 py-3 px-2 font-bold text-[11px] text-gray-700">Term Pembayaran</Text>
                                        <Text className="w-40 py-3 px-2 font-bold text-[11px] text-gray-700">Notes</Text>
                                        <Text className="w-48 py-3 px-2 font-bold text-[11px] text-gray-700">Detail Payment</Text>
                                        <Text className="w-24 py-3 px-2 font-bold text-[11px] text-gray-700 text-center">Tgl INV</Text>
                                        <Text className="w-32 py-3 px-2 font-bold text-[11px] text-gray-700">Nomor INV</Text>
                                        <Text className="w-24 py-3 px-2 font-bold text-[11px] text-gray-700 text-center">Tgl Kirim DO</Text>
                                        <Text className="w-24 py-3 px-2 font-bold text-[11px] text-gray-700 text-right">Success Fee</Text>
                                        <Text className="w-24 py-3 px-2 font-bold text-[11px] text-gray-700 text-right">Biaya Freight</Text>
                                        <Text className="w-24 py-3 px-2 font-bold text-[11px] text-gray-700 text-right">Biaya Teknisi</Text>
                                        <Text className="w-24 py-3 px-2 font-bold text-[11px] text-gray-700 text-right">Biaya Forklift</Text>
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
