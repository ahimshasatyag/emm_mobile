import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ListPaymentItem } from '../types/listpayment.types';

interface Props {
    item: ListPaymentItem;
    index: number;
    onPress: () => void;
}

export const ListPaymentCard = ({ item, index, onPress }: Props) => {
    const prices = (item.harga_ppn?.toString() || '0').split(',');
    const qtys = (item.tot_qty?.toString() || '0').split(',');
    const products = (item.nm_product || '-').split(',');
    const brands = (item.nm_product_brand || '-').split(',');
    const categories = (item.type_kategori || 'PP').split(',');

    const formatCurrency = (value: string | number) => {
        if (value === undefined || value === null || value === '') return '0';
        const num = typeof value === 'string' ? parseFloat(value) : value;
        return Math.round(num || 0).toLocaleString('id-ID');
    };

    let term = 'Tidak Ada DP';
    
    const dpPersenStr = item.ndp_persen?.toString() || '0';
    const dpPersenNum = parseFloat(dpPersenStr);
    const dpAmountNum = parseFloat(item.ndp_amount?.toString() || '0');
    
    const tenorNum = parseFloat(item.ntenor?.toString() || '0');
    const tenorAmountNum = parseFloat(item.ntenor_amount?.toString() || '0');

    const dp = (dpPersenNum > 0 || dpAmountNum > 0) ? `DP ${dpPersenNum || 0}% Rp ${formatCurrency(dpAmountNum)}` : '';
    const tenor = (tenorNum > 0 || tenorAmountNum > 0) ? `Tenor ${tenorNum || 0}x Rp ${formatCurrency(tenorAmountNum)}` : '';

    if (dp || tenor) {
        term = `${dp}\n${tenor}`.trim();
    }

    const rowCount = Math.max(prices.length, qtys.length, products.length, categories.length);
    const subRows = Array.from({ length: rowCount }).map((_, i) => {
        const price = parseFloat(prices[i] || '0');
        const qty = parseFloat(qtys[i] || '0');
        const isTax = item.flag_ppn == 1 || item.flag_ppn === '1';
        const tax = isTax ? price * 0.11 : 0;
        const subtotal = isTax ? Math.round(price * 1.11) : price;

        return {
            st: categories[i] || categories[0] || 'PP',
            price,
            qty,
            tax,
            subtotal,
            product: products[i] || '-',
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
                        {/* Line */}
                        <View className="w-12 border-r border-gray-200">
                            <View className="px-2 py-3">
                                {i === 0 && <Text className="text-[11px] text-gray-700 text-center">{index + 1}</Text>}
                            </View>
                        </View>
                        {/* Type */}
                        <View className="w-24 border-r border-gray-200">
                            {i !== 0 && <View className="h-[1px] bg-gray-100 mx-3" />}
                            <View className="px-2 py-3">
                                <Text className="text-[11px] text-gray-700 text-center">{sr.st}</Text>
                            </View>
                        </View>
                        {/* Tgl */}
                        <View className="w-24 border-r border-gray-200">
                            <View className="px-2 py-3">
                                {i === 0 && <Text className="text-[11px] text-gray-700 text-center">{item.date_so}</Text>}
                            </View>
                        </View>
                        {/* No SO */}
                        <View className="w-32 border-r border-gray-200">
                            <View className="px-2 py-3">
                                {i === 0 && <Text className="text-[11px] font-bold text-indigo-700">{item.code_so}</Text>}
                            </View>
                        </View>
                        {/* Customer */}
                        <View className="w-40 border-r border-gray-200">
                            <View className="px-2 py-3">
                                {i === 0 && <Text className="text-[11px] text-gray-700" numberOfLines={1}>{item.nm_customers}</Text>}
                            </View>
                        </View>
                        {/* Mata Uang */}
                        <View className="w-24 border-r border-gray-200">
                            <View className="px-2 py-3">
                                {i === 0 && <Text className="text-[11px] text-gray-700 text-center">{item.vcurrency}</Text>}
                            </View>
                        </View>
                        {/* Unit Price */}
                        <View className="w-24 border-r border-gray-200">
                            {i !== 0 && <View className="h-[1px] bg-gray-100 mx-3" />}
                            <View className="px-2 py-3">
                                <Text className="text-[11px] text-gray-700 text-right">{formatCurrency(sr.price)}</Text>
                            </View>
                        </View>
                        {/* Qty */}
                        <View className="w-16 border-r border-gray-200">
                            {i !== 0 && <View className="h-[1px] bg-gray-100 mx-3" />}
                            <View className="px-2 py-3">
                                <Text className="text-[11px] text-gray-700 text-center">{sr.qty}</Text>
                            </View>
                        </View>
                        {/* Tax */}
                        <View className="w-24 border-r border-gray-200">
                            {i !== 0 && <View className="h-[1px] bg-gray-100 mx-3" />}
                            <View className="px-2 py-3">
                                <Text className="text-[11px] text-gray-700 text-right">{formatCurrency(sr.tax)}</Text>
                            </View>
                        </View>
                        {/* Subtotal */}
                        <View className="w-28 border-r border-gray-200">
                            {i !== 0 && <View className="h-[1px] bg-gray-100 mx-3" />}
                            <View className="px-2 py-3">
                                <Text className="text-[11px] text-gray-700 text-right">{formatCurrency(sr.subtotal)}</Text>
                            </View>
                        </View>
                        {/* Commodity */}
                        <View className="w-32 border-r border-gray-200">
                            {i !== 0 && <View className="h-[1px] bg-gray-100 mx-3" />}
                            <View className="px-2 py-3">
                                <Text className="text-[11px] text-gray-700">{sr.product}</Text>
                            </View>
                        </View>
                        {/* Merk */}
                        <View className="w-32 border-r border-gray-200">
                            {i !== 0 && <View className="h-[1px] bg-gray-100 mx-3" />}
                            <View className="px-2 py-3">
                                <Text className="text-[11px] text-gray-700">{sr.brand}</Text>
                            </View>
                        </View>
                        {/* Sales */}
                        <View className="w-32 border-r border-gray-200">
                            <View className="px-2 py-3">
                                {i === 0 && <Text className="text-[11px] text-gray-700">{item.nm_karyawan}</Text>}
                            </View>
                        </View>
                        {/* Tipe Pembayaran */}
                        <View className="w-32 border-r border-gray-200">
                            <View className="px-2 py-3">
                                {i === 0 && <Text className="text-[11px] text-gray-700">{item.nm_type_pembayaran}</Text>}
                            </View>
                        </View>
                        {/* Term Pembayaran */}
                        <View className="w-32 border-r border-gray-200">
                            <View className="px-2 py-3">
                                {i === 0 && <Text className="text-[11px] text-gray-700">{term}</Text>}
                            </View>
                        </View>
                        {/* Notes */}
                        <View className="w-40 border-r border-gray-200">
                            <View className="px-2 py-3">
                                {i === 0 && <Text className="text-[11px] text-gray-700" numberOfLines={2}>{item.keterangan || '-'}</Text>}
                            </View>
                        </View>
                        {/* Detail Payment */}
                        <View className="w-48 border-r border-gray-200">
                            <View className="px-2 py-3">
                                {i === 0 && <Text className="text-[11px] text-green-700 font-medium" numberOfLines={2}>{item.detail_payment || '-'}</Text>}
                            </View>
                        </View>
                        {/* Tgl INV */}
                        <View className="w-24 border-r border-gray-200">
                            <View className="px-2 py-3">
                                {i === 0 && <Text className="text-[11px] text-gray-700 text-center">{item.date_invoice || '-'}</Text>}
                            </View>
                        </View>
                        {/* Nomor INV */}
                        <View className="w-32 border-r border-gray-200">
                            <View className="px-2 py-3">
                                {i === 0 && <Text className="text-[11px] text-gray-700">{item.code_invoice || '-'}</Text>}
                            </View>
                        </View>
                        {/* Tgl Kirim DO */}
                        <View className="w-24 border-r border-gray-200">
                            <View className="px-2 py-3">
                                {i === 0 && <Text className="text-[11px] text-gray-700 text-center">{item.date_delivery || '-'}</Text>}
                            </View>
                        </View>
                        {/* Success Fee */}
                        <View className="w-24 border-r border-gray-200">
                            <View className="px-2 py-3">
                                {i === 0 && <Text className="text-[11px] text-gray-700 text-right">{formatCurrency(item.success_fee || 0)}</Text>}
                            </View>
                        </View>
                        {/* Biaya Freight */}
                        <View className="w-24 border-r border-gray-200">
                            <View className="px-2 py-3">
                                {i === 0 && <Text className="text-[11px] text-gray-700">{
                                    item.freight?.toString() === '1' ? 'EMM' :
                                    item.freight?.toString() === '2' ? 'Cust Bayar Ditempat' :
                                    item.freight?.toString() === '3' ? `Cust Charge Rp ${formatCurrency(item.freight_amount || 0)}` :
                                    formatCurrency(item.freight_amount || 0)
                                }</Text>}
                            </View>
                        </View>
                        {/* Biaya Teknisi */}
                        <View className="w-24 border-r border-gray-200">
                            <View className="px-2 py-3">
                                {i === 0 && <Text className="text-[11px] text-gray-700">{
                                    item.teknisi?.toString() === '1' ? 'EMM' :
                                    item.teknisi?.toString() === '2' ? 'Customer' :
                                    (item.teknisi?.toString() === '3' || item.teknisi?.toString() === '6') ? `Cust Charge Rp ${formatCurrency(item.teknisi_amount || 0)}` :
                                    formatCurrency(item.teknisi_amount || 0)
                                }</Text>}
                            </View>
                        </View>
                        {/* Biaya Forklift */}
                        <View className="w-24 border-r border-gray-200">
                            <View className="px-2 py-3">
                                {i === 0 && <Text className="text-[11px] text-gray-700">{
                                    item.forklift?.toString() === '1' ? 'EMM' :
                                    item.forklift?.toString() === '2' ? 'Customer sediakan sendiri' :
                                    item.forklift?.toString() === '3' ? `Cust Charge Rp ${formatCurrency(item.forklift_amount || 0)}` :
                                    formatCurrency(item.forklift_amount || 0)
                                }</Text>}
                            </View>
                        </View>
                    </View>
                ))}
            </View>
        </TouchableOpacity>
    );
};
