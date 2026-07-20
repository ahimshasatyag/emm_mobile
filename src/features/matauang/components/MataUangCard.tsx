import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MataUangItem } from '../types/matauang.types';

interface Props {
    item: MataUangItem & { rate: number };
    index: number;
}

export const MataUangCard = ({ item, index }: Props) => {
    // Helper for non-RP formatting just to have commas
    const formatNumber = (val: number, fractionDigits: number = 2) => {
        return val.toLocaleString('id-ID', { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits });
    };

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            className={`flex-row border-b border-gray-200 border-x items-center ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
        >
            <Text className="w-24 py-4 px-2 text-[12px] font-bold text-gray-800 text-center">{item.mata_uang}</Text>
            <Text className="w-40 py-4 px-2 text-[12px] text-gray-700 text-right">{formatNumber(item.kurs, 2)}</Text>
            <Text className="w-40 py-4 px-2 text-[12px] text-blue-600 font-bold text-right">{formatNumber(item.rate, 5)}</Text>
            <Text className="w-48 py-4 px-2 text-[12px] text-gray-500 text-center">{item.date_create}</Text>
        </TouchableOpacity>
    );
};
