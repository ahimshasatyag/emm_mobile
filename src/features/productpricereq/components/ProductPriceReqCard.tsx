import React from 'react';
import { View, Text } from 'react-native';
import { Tag, User, Hash } from 'lucide-react-native';
import { ProductPriceReq } from '../types/productpricereq.types';
import { theme } from '../../../theme/theme';

interface Props {
    request: ProductPriceReq;
}

export function ProductPriceReqCard({ request }: Props) {
    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'CONFIRM':
                return { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'CONFIRM' };
            case 'SUCCESS':
                return { bg: 'bg-green-100', text: 'text-green-700', label: 'SUCCESS' };
            case 'CANCEL':
                return { bg: 'bg-red-100', text: 'text-red-700', label: 'CANCEL' };
            default:
                return { bg: 'bg-gray-100', text: 'text-gray-700', label: 'DRAFT' };
        }
    };

    const statusStyle = getStatusStyle(request.status);

    return (
        <View className="bg-white rounded-xl p-4 mb-3 border border-gray-100 shadow-sm">
            <View className="flex-row justify-between items-start mb-3">
                <View className="flex-row items-center flex-1 mr-3">
                    <View className="w-10 h-10 rounded-full items-center justify-center mr-3" style={{ backgroundColor: theme.colors.primaryContainer }}>
                        <Tag color={theme.colors.primary} size={20} />
                    </View>
                    <View className="flex-1">
                        <Text className="text-gray-800 font-bold text-base" numberOfLines={2}>
                            {request.nm_product}
                        </Text>
                        <Text className="text-gray-500 text-xs mt-0.5">
                            {request.code_product}
                        </Text>
                    </View>
                </View>
                <View className={`px-2.5 py-1 rounded-md ${statusStyle.bg}`}>
                    <Text className={`text-[10px] font-bold ${statusStyle.text}`}>
                        {statusStyle.label}
                    </Text>
                </View>
            </View>

            <View className="flex-row items-center mt-2 border-t border-gray-50 pt-3">
                <View className="flex-row items-center">
                    <User color="#9CA3AF" size={14} />
                    <Text className="text-gray-600 text-xs ml-1.5 font-medium">{request.nm_users}</Text>
                </View>
            </View>
        </View>
    );
}
