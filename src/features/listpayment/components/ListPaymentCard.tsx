import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { ListPaymentItem } from '../types/listpayment.types';
import { formatRp } from '../../../utils/helpers/money';


interface Props {
    item: ListPaymentItem;
    index: number;
    onPress: () => void;
}

export const ListPaymentCard = ({ item, index, onPress }: Props) => {

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPress}
            className={`flex-row border-b border-gray-200 border-x items-center ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
        >
            <Text className="w-12 py-3 px-2 text-[11px] text-gray-700 text-center">{index + 1}</Text>
            <Text className="w-24 py-3 px-2 text-[11px] text-gray-700 text-center">{item.type_kategori}</Text>
            <Text className="w-24 py-3 px-2 text-[11px] text-gray-700 text-center">{item.date_so}</Text>
            <Text className="w-32 py-3 px-2 text-[11px] font-bold text-indigo-700">{item.code_so}</Text>
            <Text className="w-40 py-3 px-2 text-[11px] text-gray-700" numberOfLines={1}>{item.nm_customers}</Text>
            <Text className="w-32 py-3 px-2 text-[11px] text-gray-700" numberOfLines={1}>{item.nm_product}</Text>
            <Text className="w-24 py-3 px-2 text-[11px] text-gray-700 text-center">{item.vcurrency}</Text>
            <Text className="w-24 py-3 px-2 text-[11px] text-gray-700 text-right">{formatRp(item.harga_ppn)}</Text>
            <Text className="w-16 py-3 px-2 text-[11px] text-gray-700 text-center">{item.tot_qty}</Text>
            <Text className="w-28 py-3 px-2 text-[11px] text-gray-700 text-right">{formatRp(item.subtotal)}</Text>
            <Text className="w-32 py-3 px-2 text-[11px] text-gray-700 text-center">{item.code_invoice || '-'}</Text>
            <Text className="w-48 py-3 px-2 text-[11px] text-green-700 font-medium" numberOfLines={2}>{item.detail_payment || '-'}</Text>
            <Text className="w-32 py-3 px-2 text-[11px] text-gray-700">{item.nm_type_pembayaran}</Text>
            <Text className="w-32 py-3 px-2 text-[11px] text-gray-700" numberOfLines={2}>{item.term_pembayaran}</Text>
            <Text className="w-32 py-3 px-2 text-[11px] text-gray-700">{item.nm_karyawan}</Text>
        </TouchableOpacity>
    );
};
