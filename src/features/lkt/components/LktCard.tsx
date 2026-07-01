import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { formatDate } from '../../../utils/helpers/date';
import { LktDetail } from '../types/lkt.types';

interface LktCardProps {
    lkt: LktDetail;
}

export function LktCard({ lkt }: LktCardProps) {
    const navigation = useNavigation<any>();

    const formatCurrency = (amount: number) => {
        if (!amount) return 'Rp 0';
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'DRAFT': return 'bg-yellow-100 text-yellow-800';
            case 'OUTSTANDING': return 'bg-blue-100 text-blue-800';
            case 'ON PROGRESS': return 'bg-orange-100 text-orange-800';
            case 'DONE': return 'bg-green-100 text-green-800';
            case 'CANCEL': return 'bg-red-100 text-red-800';
            case 'CLOSE': return 'bg-gray-200 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <TouchableOpacity
            className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-3"
            onPress={() => navigation.navigate('LktEditScreen', { id: lkt.lkt_code })}
            activeOpacity={0.7}
        >
            <View className="flex-row justify-between items-start mb-2">
                <View className="flex-1 mr-3">
                    <Text className="text-sm font-bold text-gray-900">{lkt.lkt_code}</Text>
                    <Text className="text-xs text-gray-500 mt-0.5">{lkt.cst_code}</Text>
                    <Text className="text-xs text-gray-500 mt-0.5">Start: {lkt.actual_starting_date ? formatDate(new Date(lkt.actual_starting_date)) : '-'}</Text>
                </View>
                <View className={`px-2 py-1 rounded-md ${getStatusColor(lkt.status).split(' ')[0]}`}>
                    <Text className={`text-[10px] font-bold ${getStatusColor(lkt.status).split(' ')[1]}`}>
                        {lkt.status}
                    </Text>
                </View>
            </View>

            <View className="h-px bg-gray-100 my-2" />

            <View className="flex-row justify-between items-end mb-2">
                <View className="flex-1">
                    <Text className="text-xs text-gray-500 mb-0.5">Customer</Text>
                    <Text className="text-xs font-semibold text-gray-800">{lkt.nm_customers}</Text>
                </View>
                <View className="flex-1 items-end">
                    <Text className="text-xs text-gray-500 mb-0.5">Keterangan</Text>
                    <Text className="text-xs font-semibold text-gray-800">{lkt.actual_description || '-'}</Text>
                </View>
            </View>

            <View className="h-px bg-gray-100 my-2" />

            {/* New Added Fields */}
            <View className="flex-row flex-wrap">
                <View className="w-1/2 mb-2">
                    <Text className="text-[10px] text-gray-400">Provinsi / Kota</Text>
                    <Text className="text-xs font-medium text-gray-800" numberOfLines={1}>{lkt.provinsi || '-'} / {lkt.kabupaten_kota || '-'}</Text>
                </View>
                <View className="w-1/2 mb-2 pl-2">
                    <Text className="text-[10px] text-gray-400">Age In / Actual Day</Text>
                    <Text className="text-xs font-medium text-gray-800">{lkt.age_in || 0} Hari / {lkt.actual_day || 0} Hari</Text>
                </View>
                
                <View className="w-1/2 mb-2">
                    <Text className="text-[10px] text-gray-400">Service Amount</Text>
                    <Text className="text-xs font-medium text-gray-800">{formatCurrency(lkt.actual_service_amount)}</Text>
                </View>
                <View className="w-1/2 mb-2 pl-2">
                    <Text className="text-[10px] text-gray-400">Transport Amount</Text>
                    <Text className="text-xs font-medium text-gray-800">{formatCurrency(lkt.actual_transport_amount)}</Text>
                </View>

                <View className="w-1/2 mb-2">
                    <Text className="text-[10px] text-gray-400">Training / Bongkar</Text>
                    <Text className="text-xs font-medium text-gray-800">{lkt.actual_training} / {lkt.actual_bongkar}</Text>
                </View>
                <View className="w-1/2 mb-2 pl-2">
                    <Text className="text-[10px] text-gray-400">Type Transport</Text>
                    <Text className="text-xs font-medium text-gray-800">{lkt.type_transport || '-'}</Text>
                </View>

                <View className="w-1/2">
                    <Text className="text-[10px] text-gray-400">Garansi</Text>
                    <Text className={`text-xs font-bold ${lkt.garansi === 'GARANSI' ? 'text-green-600' : 'text-red-600'}`}>{lkt.garansi || '-'}</Text>
                </View>
                <View className="w-1/2 pl-2">
                    <Text className="text-[10px] text-gray-400">Daring</Text>
                    <Text className="text-xs font-medium text-gray-800">{lkt.flag_daring === 1 ? 'Ya' : 'Tidak'}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}
