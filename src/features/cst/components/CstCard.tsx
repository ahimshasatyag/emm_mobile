import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../../theme/theme';
import { formatDate } from '../../../utils/helpers/date';
import { Cst } from '../types/cst.types';

interface CstCardProps {
    cst: Cst;
}

export function CstCard({ cst }: CstCardProps) {
    const navigation = useNavigation<any>();

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'DRAFT': return 'bg-yellow-100 text-yellow-800';
            case 'OUTSTANDING': return 'bg-blue-100 text-blue-800';
            case 'ON PROGRESS': return 'bg-orange-100 text-orange-800';
            case 'DONE': return 'bg-green-100 text-green-800';
            case 'CANCEL': return 'bg-red-100 text-red-800';
            case 'PENDING': return 'bg-gray-200 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <TouchableOpacity
            className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-3"
            onPress={() => navigation.navigate('CstEditScreen', { id: cst.cst_code })}
            activeOpacity={0.7}
        >
            <View className="flex-row justify-between items-start mb-2">
                <View className="flex-1 mr-3">
                    <Text className="text-sm font-bold text-gray-900">{cst.cst_code}</Text>
                    <Text className="text-xs text-gray-500 mt-0.5">{cst.csr_code}</Text>
                    <Text className="text-xs text-gray-500 mt-0.5">Date: {cst.cst_date ? formatDate(new Date(cst.cst_date)) : '-'}</Text>
                </View>
                <View className={`px-2 py-1 rounded-md ${getStatusColor(cst.status).split(' ')[0]}`}>
                    <Text className={`text-[10px] font-bold ${getStatusColor(cst.status).split(' ')[1]}`}>
                        {cst.status}
                    </Text>
                </View>
            </View>

            <View className="h-px bg-gray-100 my-2" />

            <View className="flex-row justify-between items-end">
                <View className="flex-1">
                    <Text className="text-xs text-gray-500 mb-0.5">Customer</Text>
                    <Text className="text-xs font-semibold text-gray-800">{cst.nm_customers}</Text>
                </View>
                <View className="flex-1 items-end">
                    <Text className="text-xs text-gray-500 mb-0.5">Product</Text>
                    <Text className="text-xs font-semibold text-gray-800">{cst.nm_product}</Text>
                </View>
            </View>
            <View className="flex-row justify-between items-end mt-2">
                <View className="flex-1">
                    <Text className="text-xs text-gray-500 mb-0.5">Requestor</Text>
                    <Text className="text-xs font-semibold text-gray-800">{cst.nm_karyawan}</Text>
                </View>
                <View className="flex-1 items-end">
                    <Text className="text-xs text-gray-500 mb-0.5">User</Text>
                    <Text className="text-xs font-semibold text-gray-800">{cst.approved_csr_by}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}
