import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { formatRp, formatUsd } from '../../../utils/helpers/money';

interface ProductTableProps {
    detail: any;
}

export const ProductTable: React.FC<ProductTableProps> = ({ detail }) => {
    const isUSD = detail.vcurrency === 'USD';
    const fmt = (val: number) => isUSD ? formatUsd(val) : formatRp(val);

    // Kalkulasi summary yang benar
    const totalInclPPN = Number(detail.ntot_price_netto_amount) || 0;
    const ppnPersen = Number(detail.nppn_amount) || 0;
    const hasPPN = String(detail.flag_ppn) === '1' && ppnPersen > 0;

    // SUB-TOTAL = total dibagi (1 + persen/100), karena TOTAL sudah include PPN
    const subTotal = hasPPN ? totalInclPPN / (1 + ppnPersen / 100) : totalInclPPN;
    const ppnAmount = hasPPN ? totalInclPPN - subTotal : 0;

    // Total Pembayaran = jumlah v_amount dari invoice_dtl yang status_payment = 'CAIR'
    const totalPembayaran = (detail.invoice_dtl || [])
        .filter((p: any) => p.status_payment === 'CAIR' && String(p.f_cancel) !== '1')
        .reduce((sum: number, p: any) => sum + Number(p.v_amount || 0), 0);

    return (
        <View className="border-b border-gray-100">
            <View className="p-4 border-b border-gray-100">
                <Text className="text-sm font-bold text-gray-800">Detail Produk</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View>
                    {/* Table Header */}
                    <View className="flex-row bg-gray-100 py-3 px-4 border-b border-gray-200">
                        <Text className="w-48 text-xs font-bold text-gray-600">Product</Text>
                        <Text className="w-20 text-xs font-bold text-gray-600 text-center">UOM</Text>
                        <Text className="w-32 text-xs font-bold text-gray-600 text-right">Unit Price</Text>
                        <Text className="w-20 text-xs font-bold text-gray-600 text-center">Qty</Text>
                        <Text className="w-32 text-xs font-bold text-gray-600 text-right">Total</Text>
                    </View>

                    {/* Table Body */}
                    {(() => {
                        const rows = detail.barang || detail.items || [];
                        if (rows.length > 0) {
                            return rows.map((item: any, index: number) => {
                                // product_price di SO sudah include PPN → tampilkan harga sebelum PPN
                                const taxRate = Number(item.ntax) > 0 ? Number(item.ntax) : ppnPersen;
                                const divisor = hasPPN && taxRate > 0 ? (1 + taxRate / 100) : 1;
                                const unitPriceExcl = Number(item.product_price) / divisor;
                                const lineTotal = unitPriceExcl * Number(item.nqty);
                                return (
                                <View key={(item.id_product ?? index) + '_' + index} className="flex-row py-3 px-4 border-b border-gray-100 items-center">
                                    <View className="w-48">
                                        <Text className="text-sm font-medium text-gray-800">{item.code_product}</Text>
                                        <Text className="text-xs text-gray-500">{item.nm_product}</Text>
                                    </View>
                                    <Text className="w-20 text-sm text-gray-600 text-center">{item.nm_product_satuan}</Text>
                                    <Text className="w-32 text-sm text-gray-800 text-right">{fmt(unitPriceExcl)}</Text>
                                    <Text className="w-20 text-sm text-gray-800 text-center font-semibold">{item.nqty}</Text>
                                    <Text className="w-32 text-sm text-gray-800 text-right font-bold">{fmt(lineTotal)}</Text>
                                </View>
                                );
                            });
                        }
                        return (
                            <View className="py-8 px-4 items-center justify-center">
                                <Text className="text-gray-400">Tidak ada item</Text>
                            </View>
                        );
                    })()}
                </View>
            </ScrollView>

            {/* Summary */}
            <View className="p-4 bg-gray-50 border-t border-gray-100 space-y-2">
                <View className="flex-row justify-between">
                    <Text className="text-sm text-gray-600 font-medium">SUB-TOTAL</Text>
                    <Text className="text-sm text-gray-800 font-bold">{fmt(subTotal)}</Text>
                </View>
                {hasPPN && (
                    <View className="flex-row justify-between">
                        <Text className="text-sm text-gray-600 font-medium">PPN {ppnPersen}%</Text>
                        <Text className="text-sm text-gray-800 font-bold">{fmt(ppnAmount)}</Text>
                    </View>
                )}
                <View className="flex-row justify-between pt-2 border-t border-gray-200">
                    <Text className="text-sm text-gray-800 font-bold">TOTAL</Text>
                    <Text className="text-base text-blue-600 font-bold">{fmt(totalInclPPN)}</Text>
                </View>
                <View className="flex-row justify-between">
                    <Text className="text-sm text-gray-600 font-medium">Total Pembayaran</Text>
                    <Text className="text-sm text-gray-800 font-bold">{fmt(totalPembayaran)}</Text>
                </View>
                <View className="flex-row justify-between">
                    <Text className="text-sm text-gray-800 font-bold">Balance</Text>
                    <Text className="text-base text-red-600 font-bold">{fmt(Number(detail.ntot_balance) || 0)}</Text>
                </View>
            </View>
        </View>
    );
};
