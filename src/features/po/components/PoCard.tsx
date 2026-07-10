import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FileText, Calendar, Building2, ChevronRight } from 'lucide-react-native';
import { theme } from '../../../theme/theme';
import { PoHeader } from '../types/po.types';

interface PoCardProps {
    item: PoHeader;
    index: number;
    onPress: () => void;
}

export function PoCard({ item, index, onPress }: PoCardProps) {
    const getStatusColor = (status: string) => {
        switch (status?.toUpperCase()) {
            case 'PO PURCHASE': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'DRAFT PO': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'CANCEL': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const statusStyle = getStatusColor(item.status_po);

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPress}
            className="bg-white rounded-2xl p-4 mb-4 border border-gray-100 shadow-sm"
            style={{ elevation: 2 }}
        >
            <View className="flex-row justify-between items-start mb-3">
                <View className="flex-row items-center flex-1 mr-2">
                    <View className="w-8 h-8 rounded-full bg-blue-50 items-center justify-center mr-2">
                        <FileText size={16} color={theme.colors.primary} />
                    </View>
                    <Text className="text-[15px] font-bold text-gray-900" numberOfLines={1}>
                        {item.code_po}
                    </Text>
                </View>
                <View className={`px-2.5 py-1 rounded-md border ${statusStyle}`}>
                    <Text className="text-[11px] font-bold" style={{ color: statusStyle.match(/text-(\w+)-700/)?.[0]?.replace('text-', '') }}>
                        {item.status_po}
                    </Text>
                </View>
            </View>

            <View className="space-y-2.5 pl-10">
                <View className="flex-row items-center">
                    <Calendar size={14} color="#6B7280" />
                    <Text className="text-xs text-gray-600 ml-2">
                        {item.date_po}
                    </Text>
                </View>
                
                <View className="flex-row items-center pr-4">
                    <Building2 size={14} color="#6B7280" />
                    <Text className="text-xs text-gray-600 ml-2" numberOfLines={1}>
                        {item.nm_suppliers}
                    </Text>
                </View>
            </View>

        </TouchableOpacity>
    );
}
