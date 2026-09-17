import React from 'react';
import { View, Text } from 'react-native';
import { ListPaymentSummaryItem } from '../types/listpayment.types';

interface Props {
    summary: ListPaymentSummaryItem[];
    periodeStr?: string;
}

export const ListPaymentSummary = ({ summary, periodeStr = '' }: Props) => {
    if (!summary || summary.length === 0) return null;

    const getSummary = (kat: string, type: string) => {
        const row = summary.find(s => s.kategori === kat && s.type_kategori === type);
        return {
            product_price: row ? parseFloat(row.product_price?.toString() || '0') : 0,
            nqty: row ? parseFloat(row.nqty?.toString() || '0') : 0
        };
    };

    const totalMonth = summary.filter(s => s.kategori === 'month').reduce((acc, curr) => acc + parseFloat(curr.product_price?.toString() || '0'), 0);
    const qtyMonth = summary.filter(s => s.kategori === 'month').reduce((acc, curr) => acc + parseFloat(curr.nqty?.toString() || '0'), 0);

    const totalYtd = summary.filter(s => s.kategori === 'ytd').reduce((acc, curr) => acc + parseFloat(curr.product_price?.toString() || '0'), 0);
    const qtyYtd = summary.filter(s => s.kategori === 'ytd').reduce((acc, curr) => acc + parseFloat(curr.nqty?.toString() || '0'), 0);

    const formatCurrency = (val: number) => {
        if (!val) return '0';
        return Math.round(val).toLocaleString('id-ID');
    };

    const formatPercent = (val: number, total: number) => {
        if (!total || total === 0) return '0%';
        const p = (val / total) * 100;
        return `${Math.round(p)}%`;
    };

    const formatPeriodeTitle = (p: string) => {
        if (!p || p === 'ALL') return 'All Time';
        const parts = p.split('-');
        if (parts.length === 2) {
            let m, y;
            if (parts[0].length === 4) { // YYYY-MM
                y = parts[0];
                m = parseInt(parts[1], 10);
            } else { // MM-YYYY
                m = parseInt(parts[0], 10);
                y = parts[1];
            }
            const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
            if (m >= 1 && m <= 12) return `${months[m - 1]} ${y}`;
        }
        return p;
    };

    const renderRow = (name: string, code: string, qty: number, total: number, grandTotal: number, isTotal: boolean = false) => (
        <View key={code} className={`flex-row border-b border-gray-200 ${isTotal ? 'bg-white' : 'bg-white'}`}>
            <View style={{ flex: 2 }} className="flex-row p-2 border-r border-gray-200 items-center justify-between">
                <Text className={`text-[11px] text-gray-700 ${isTotal ? 'font-bold' : ''}`}>{name}</Text>
                {!isTotal && <Text className="text-[11px] text-gray-500">{code}</Text>}
            </View>
            <View style={{ flex: 0.5 }} className="p-2 border-r border-gray-200 items-end justify-center">
                <Text className={`text-[11px] text-gray-700 ${isTotal ? 'font-bold' : ''}`}>{qty}</Text>
            </View>
            <View style={{ flex: 1.5 }} className="p-2 border-r border-gray-200 items-end justify-center">
                <Text className={`text-[11px] text-gray-700 ${isTotal ? 'font-bold' : ''}`}>{formatCurrency(total)}</Text>
            </View>
            <View style={{ flex: 0.8 }} className="p-2 items-end justify-center">
                <Text className={`text-[11px] text-gray-700 ${isTotal ? 'font-bold' : ''}`}>{isTotal ? '100%' : formatPercent(total, grandTotal)}</Text>
            </View>
        </View>
    );

    const renderHeaderRow = (title: string) => (
        <View className="flex-row bg-gray-50 border-b border-gray-200">
            <View style={{ flex: 2 }} className="p-2 border-r border-gray-200 justify-center items-center">
                <Text className="text-[11px] text-gray-700">{title}</Text>
            </View>
            <View style={{ flex: 0.5 }} className="p-2 border-r border-gray-200 justify-center items-center">
                <Text className="text-[11px] text-gray-700">Qty</Text>
            </View>
            <View style={{ flex: 1.5 }} className="p-2 border-r border-gray-200 justify-center items-center">
                <Text className="text-[11px] text-gray-700">Total</Text>
            </View>
            <View style={{ flex: 0.8 }} className="p-2 justify-center items-center">
                <Text className="text-[11px] text-gray-700">Persentase</Text>
            </View>
        </View>
    );

    const monthTitle = formatPeriodeTitle(periodeStr);

    return (
        <View className="rounded-sm border border-gray-200 overflow-hidden bg-white shadow-sm w-full mt-4">
            {renderHeaderRow(monthTitle)}
            {renderRow('Print Pack', 'PP', getSummary('month', 'PP').nqty, getSummary('month', 'PP').product_price, totalMonth)}
            {renderRow('Plastic', 'PL', getSummary('month', 'PL').nqty, getSummary('month', 'PL').product_price, totalMonth)}
            {renderRow('Auxiliary', 'AX', getSummary('month', 'AX').nqty, getSummary('month', 'AX').product_price, totalMonth)}
            {renderRow('Total', '', qtyMonth, totalMonth, totalMonth, true)}

            {renderHeaderRow('Year to date')}
            {renderRow('Print Pack', 'PP', getSummary('ytd', 'PP').nqty, getSummary('ytd', 'PP').product_price, totalYtd)}
            {renderRow('Plastic', 'PL', getSummary('ytd', 'PL').nqty, getSummary('ytd', 'PL').product_price, totalYtd)}
            {renderRow('Auxiliary', 'AX', getSummary('ytd', 'AX').nqty, getSummary('ytd', 'AX').product_price, totalYtd)}
            {renderRow('Total', '', qtyYtd, totalYtd, totalYtd, true)}
        </View>
    );
};
