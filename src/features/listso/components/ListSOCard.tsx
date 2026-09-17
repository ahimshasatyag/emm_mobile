import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ListSOItem } from '../types/listso.types';

interface Props {
    item: ListSOItem;
    index: number;
    onPress: () => void;
}

export function ListSOCard({ item, index, onPress }: Props) {
    // Generate status color
    const getStatusColor = (status: string) => {
        return 'text-gray-700';
    };

    const formatCurrency = (value: string | number) => {
        if (value === undefined || value === null || value === '') return '0';
        const num = typeof value === 'string' ? parseFloat(value) : value;
        return (num || 0).toLocaleString('id-ID');
    };

    const prices = (item.harga_ppn?.toString() || '0').split(',');
    const qtys = (item.tot_qty?.toString() || '0').split(',');
    const products = (item.nm_product || '-').split(',');
    const brands = (item.nm_product_brand || '-').split(',');
    const categories = (item.type_kategori || 'PP').split(',');
    const stCode = categories[0] || 'PP';

    // Term of payment formatting
    let term = item.nm_type_pembayaran || '-';
    if (term.toUpperCase() !== 'CASH') {
        const dp = item.ndp_persen ? `DP ${item.ndp_persen}% Rp ${formatCurrency(item.ndp_amount || 0)}` : '';
        const tenor = item.ntenor ? `Tenor ${item.ntenor}x Rp ${formatCurrency(item.ntenor_amount || 0)}` : '';
        if (dp || tenor) {
            term = `${dp}\n${tenor}`.trim();
        }
    }

    const tglKirim = item.date_delivery || item.date_so || '-';
    const noPO = item.no_po_cust || '-';
    const tglDO = item.date_do || '-';

    const rowCount = Math.max(prices.length, qtys.length, products.length);
    const subRows = Array.from({ length: rowCount }).map((_, i) => {
        const price = parseFloat(prices[i] || '0');
        const qty = parseFloat(qtys[i] || '0');
        const isTax = item.flag_ppn == 1 || item.flag_ppn === '1';
        const tax = isTax ? price * 0.11 : 0;
        const subtotal = price + tax;
        return {
            st: categories[i] || categories[0] || 'PP',
            price,
            qty,
            tax,
            subtotal,
            commodity: products[i] || '-',
            brand: brands[i] || '-'
        };
    });

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPress}
            className={`border-b border-gray-200 border-x ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
        >
            <View className="flex-col">
                {subRows.map((sr, i) => (
                    <View key={i} className="flex-row">
                        {/* 1. Line Block */}
                        <View className="w-12 border-r border-gray-200">
                            <View className="px-2 py-3">
                                {i === 0 && <Text className="text-[11px] text-gray-700 text-center">{index + 1}</Text>}
                            </View>
                        </View>

                        {/* 2. ST Sub-rows Block */}
                        <View className="w-24 border-r border-gray-200">
                            {i !== 0 && <View className="h-[1px] bg-gray-100 mx-3" />}
                            <View className="px-2 py-3">
                                <Text className="text-[11px] text-gray-700 text-center">{sr.st}</Text>
                            </View>
                        </View>

                        {/* 3. SO Header Block */}
                        <View className="w-24 border-r border-gray-200">
                            <View className="px-2 py-3">
                                {i === 0 && <Text className="text-[11px] text-gray-700">{item.date_so}</Text>}
                            </View>
                        </View>
                        <View className="w-32 border-r border-gray-200">
                            <View className="px-2 py-3">
                                {i === 0 && <Text className="text-[11px] font-bold text-indigo-700">{item.code_so}</Text>}
                            </View>
                        </View>
                        <View className="w-40 border-r border-gray-200">
                            <View className="px-2 py-3">
                                {i === 0 && <Text className="text-[11px] text-gray-700" numberOfLines={2}>{item.nm_customers}</Text>}
                            </View>
                        </View>
                        <View className="w-24 border-r border-gray-200">
                            <View className="px-2 py-3">
                                {i === 0 && <Text className="text-[11px] text-gray-700 text-center">{item.vcurrency}</Text>}
                            </View>
                        </View>

                        {/* 4. Product Sub-rows Block */}
                        <View className="w-24 border-r border-gray-200">
                            {i !== 0 && <View className="h-[1px] bg-gray-100 mx-3" />}
                            <View className="px-2 py-3">
                                <Text className="text-[11px] text-gray-700 text-right">{formatCurrency(sr.price)}</Text>
                            </View>
                        </View>
                        <View className="w-16 border-r border-gray-200">
                            {i !== 0 && <View className="h-[1px] bg-gray-100 mx-3" />}
                            <View className="px-2 py-3">
                                <Text className="text-[11px] text-gray-700 text-right">{sr.qty}</Text>
                            </View>
                        </View>
                        <View className="w-24 border-r border-gray-200">
                            {i !== 0 && <View className="h-[1px] bg-gray-100 mx-3" />}
                            <View className="px-2 py-3">
                                <Text className="text-[11px] text-gray-700 text-right">{formatCurrency(sr.tax)}</Text>
                            </View>
                        </View>
                        <View className="w-28 border-r border-gray-200">
                            {i !== 0 && <View className="h-[1px] bg-gray-100 mx-3" />}
                            <View className="px-2 py-3">
                                <Text className="text-[11px] text-gray-700 text-right">{formatCurrency(sr.subtotal)}</Text>
                            </View>
                        </View>
                        <View className="w-32 border-r border-gray-200">
                            {i !== 0 && <View className="h-[1px] bg-gray-100 mx-3" />}
                            <View className="px-2 py-3">
                                <Text className="text-[11px] text-gray-700">{sr.commodity}</Text>
                            </View>
                        </View>
                        <View className="w-32 border-r border-gray-200">
                            {i !== 0 && <View className="h-[1px] bg-gray-100 mx-3" />}
                            <View className="px-2 py-3">
                                <Text className="text-[11px] text-gray-700">{sr.brand}</Text>
                            </View>
                        </View>

                        {/* 5. Sales & Notes Block */}
                        <View className="w-32 border-r border-gray-200">
                            <View className="px-2 py-3">
                                {i === 0 && <Text className="text-[11px] text-gray-700">{item.nm_karyawan}</Text>}
                            </View>
                        </View>
                        <View className="w-32 border-r border-gray-200">
                            <View className="px-2 py-3">
                                {i === 0 && <Text className="text-[11px] text-gray-700">{term}</Text>}
                            </View>
                        </View>
                        <View className="w-40 border-r border-gray-200">
                            <View className="px-2 py-3">
                                {i === 0 && <Text className="text-[11px] text-gray-700" numberOfLines={2}>{item.keterangan || '-'}</Text>}
                            </View>
                        </View>
                        <View className="w-24 border-r border-gray-200">
                            <View className="px-2 py-3">
                                {i === 0 && <Text className="text-[11px] text-gray-700">{tglKirim}</Text>}
                            </View>
                        </View>
                        <View className="w-32 border-r border-gray-200">
                            <View className="px-2 py-3">
                                {i === 0 && <Text className="text-[11px] text-gray-700">{noPO}</Text>}
                            </View>
                        </View>
                        <View className="w-24">
                            <View className="px-2 py-3">
                                {i === 0 && <Text className="text-[11px] text-gray-700">{tglDO}</Text>}
                            </View>
                        </View>
                    </View>
                ))}
            </View>
        </TouchableOpacity>
    );
}
