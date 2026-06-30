import React from 'react';
import { View, Text } from 'react-native';
import { Building2, Calendar, User, Package } from 'lucide-react-native';
import { Csr } from '../types/csr.types';
import { theme } from '../../../theme/theme';

interface CsrCardProps {
    request: Csr;
}

export function CsrCard({ request }: CsrCardProps) {
    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'DRAFT': return { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'DRAFT' };
            case 'OUTSTANDING': return { bg: 'bg-gray-100', text: 'text-gray-700', label: 'OUTSTANDING' };
            case 'CANCEL': return { bg: 'bg-red-100', text: 'text-red-700', label: 'CANCEL' };
            default: return { bg: 'bg-blue-100', text: 'text-blue-700', label: status };
        }
    };

    const statusConfig = getStatusConfig(request.status);

    return (
        <View className="bg-white p-5 rounded-2xl mb-4 border border-gray-100 shadow-sm elevation-2">
            <View className="flex-row justify-between items-start mb-4">
                <View className="flex-1 mr-3">
                    <Text className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">No CSR</Text>
                    <Text className="text-gray-900 font-bold text-base" numberOfLines={1}>{request.csr_code}</Text>
                </View>
                <View className={`${statusConfig.bg} px-3 py-1.5 rounded-full`}>
                    <Text className={`${statusConfig.text} text-xs font-bold tracking-wide`}>
                        {statusConfig.label}
                    </Text>
                </View>
            </View>

            <View className="space-y-3">
                <View className="flex-row items-center">
                    <View className="w-8 h-8 rounded-full bg-blue-50 items-center justify-center mr-3">
                        <Calendar size={14} color={theme.colors.primary} />
                    </View>
                    <View className="flex-1">
                        <Text className="text-gray-500 text-xs mb-0.5">Tanggal Request</Text>
                        <Text className="text-gray-800 text-sm font-medium">{request.csr_date}</Text>
                    </View>
                </View>
                
                <View className="flex-row items-center">
                    <View className="w-8 h-8 rounded-full bg-green-50 items-center justify-center mr-3">
                        <Building2 size={14} color="#10b981" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-gray-500 text-xs mb-0.5">Customer</Text>
                        <Text className="text-gray-800 text-sm font-medium" numberOfLines={1}>{request.nm_customers}</Text>
                    </View>
                </View>

                <View className="flex-row items-center">
                    <View className="w-8 h-8 rounded-full bg-purple-50 items-center justify-center mr-3">
                        <Package size={14} color="#8b5cf6" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-gray-500 text-xs mb-0.5">Produk</Text>
                        <Text className="text-gray-800 text-sm font-medium" numberOfLines={1}>{request.nm_product} ({request.code_product})</Text>
                    </View>
                </View>

                <View className="flex-row items-center">
                    <View className="w-8 h-8 rounded-full bg-orange-50 items-center justify-center mr-3">
                        <User size={14} color="#f59e0b" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-gray-500 text-xs mb-0.5">Requestor</Text>
                        <Text className="text-gray-800 text-sm font-medium" numberOfLines={1}>{request.nm_karyawan}</Text>
                    </View>
                </View>

                {request.csr_by && (
                    <View className="flex-row items-center">
                        <View className="w-8 h-8 rounded-full bg-cyan-50 items-center justify-center mr-3">
                            <User size={14} color="#06b6d4" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-gray-500 text-xs mb-0.5">User (Input By)</Text>
                            <Text className="text-gray-800 text-sm font-medium" numberOfLines={1}>{request.csr_by}</Text>
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
}
