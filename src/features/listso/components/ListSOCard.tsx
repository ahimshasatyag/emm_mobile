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
        const num = typeof value === 'string' ? parseFloat(value) : value;
        return num.toLocaleString('id-ID');
    };

    const statusStyle = getStatusColor(item.status_so);

    // Fallback data for fields that don't exist in dummy ListSOItem
    const unitPrice = formatCurrency(item.harga_ppn / (item.tot_qty || 1));
    const subtotal = formatCurrency(item.harga_ppn);
    const tax = '11%';
    const brand = '-';
    const commodity = '-';
    const term = '30 Hari';
    const notes = '-';
    const tglKirim = item.date_so;
    const noPO = '-';
    const tglDO = '-';

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPress}
            className={`flex-row border-b border-gray-200 border-x ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
        >
            <Text className="w-12 py-3 px-2 text-[11px] text-gray-700 text-center">{index + 1}</Text>

            <Text className="w-24 py-3 px-2 text-[11px] text-gray-700 text-center">{item.status_so}</Text>

            <Text className="w-24 py-3 px-2 text-[11px] text-gray-700">{item.date_so}</Text>
            <Text className="w-32 py-3 px-2 text-[11px] font-bold text-indigo-700">{item.code_so}</Text>
            <Text className="w-40 py-3 px-2 text-[11px] text-gray-700" numberOfLines={1}>{item.nm_customers}</Text>
            <Text className="w-24 py-3 px-2 text-[11px] text-gray-700 text-center">{item.vcurrency}</Text>
            <Text className="w-24 py-3 px-2 text-[11px] text-gray-700 text-right">{unitPrice}</Text>
            <Text className="w-16 py-3 px-2 text-[11px] text-gray-700 text-right">{item.tot_qty}</Text>
            <Text className="w-24 py-3 px-2 text-[11px] text-gray-700 text-right">{tax}</Text>
            <Text className="w-28 py-3 px-2 text-[11px] text-gray-700 text-right">{subtotal}</Text>
            <Text className="w-32 py-3 px-2 text-[11px] text-gray-700">{commodity}</Text>
            <Text className="w-32 py-3 px-2 text-[11px] text-gray-700">{brand}</Text>
            <Text className="w-32 py-3 px-2 text-[11px] text-gray-700">{item.nm_karyawan}</Text>
            <Text className="w-32 py-3 px-2 text-[11px] text-gray-700">{term}</Text>
            <Text className="w-40 py-3 px-2 text-[11px] text-gray-700" numberOfLines={1}>{notes}</Text>
            <Text className="w-24 py-3 px-2 text-[11px] text-gray-700">{tglKirim}</Text>
            <Text className="w-32 py-3 px-2 text-[11px] text-gray-700">{noPO}</Text>
            <Text className="w-24 py-3 px-2 text-[11px] text-gray-700">{tglDO}</Text>
        </TouchableOpacity>
    );
}
