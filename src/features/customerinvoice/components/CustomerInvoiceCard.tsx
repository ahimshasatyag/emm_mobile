import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronRight, FileText, Calendar, Building2, User, Banknote } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { CustomerInvoice } from '../types/customerinvoice';
import { formatRp, formatUsd } from '../../../utils/helpers/money';

interface CustomerInvoiceCardProps {
    item: CustomerInvoice;
    onPress: (id: string) => void;
}

export const CustomerInvoiceCard = ({ item, onPress }: CustomerInvoiceCardProps) => {

    const getStatusColor = (status: string) => {
        switch (status?.toUpperCase()) {
            case 'OPEN': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'PAID': return 'bg-green-100 text-green-700 border-green-200';
            case 'CLOSE': return 'bg-gray-100 text-gray-700 border-gray-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <Animated.View entering={FadeInDown.duration(400)}>
            <TouchableOpacity
                onPress={() => onPress(item.id_invoice)}
                activeOpacity={0.7}
                className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100"
            >
                <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-row items-center flex-1">
                        <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center mr-3">
                            <FileText size={20} color="#2563EB" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-[13px] text-gray-500 font-medium">{item.code_invoice}</Text>
                            <Text className="text-[15px] font-bold text-gray-900 mt-0.5" numberOfLines={1}>
                                {item.nm_customers}
                            </Text>
                        </View>
                    </View>
                    <View className={`px-2.5 py-1 rounded-full border ${getStatusColor(item.status_invoice)}`}>
                        <Text className="text-[11px] font-bold">{item.status_invoice}</Text>
                    </View>
                </View>

                <View className="flex-row mb-3 bg-gray-50 rounded-xl p-3">
                    <View className="flex-1">
                        <View className="flex-row items-center mb-1.5">
                            <Calendar size={14} color="#6B7280" />
                            <Text className="text-[12px] text-gray-600 ml-2">{item.date_invoice}</Text>
                        </View>
                        <View className="flex-row items-center">
                            <Building2 size={14} color="#6B7280" />
                            <Text className="text-[12px] text-gray-600 ml-2" numberOfLines={1}>{item.code_so}</Text>
                        </View>
                    </View>
                    <View className="flex-1">
                        <View className="flex-row items-center mb-1.5">
                            <User size={14} color="#6B7280" />
                            <Text className="text-[12px] text-gray-600 ml-2" numberOfLines={1}>{item.nm_karyawan}</Text>
                        </View>
                        <View className="flex-row items-center">
                            <Banknote size={14} color="#6B7280" />
                            <Text className="text-[12px] text-gray-600 ml-2">{item.vcurrency}</Text>
                        </View>
                    </View>
                </View>

                <View className="flex-row justify-between items-end border-t border-gray-100 pt-3">
                    <View>
                        <Text className="text-[11px] text-gray-500 mb-0.5">Total</Text>
                        <Text className="text-sm font-bold text-gray-900">
                            {item.vcurrency === 'USD' ? formatUsd(item.ntot_price_netto_amount) : formatRp(item.ntot_price_netto_amount)}
                        </Text>
                    </View>
                    <View className="items-end">
                        <Text className="text-[11px] text-gray-500 mb-0.5">Balance</Text>
                        <Text className="text-sm font-bold text-red-600">
                            {item.vcurrency === 'USD' ? formatUsd(item.ntot_balance) : formatRp(item.ntot_balance)}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};
