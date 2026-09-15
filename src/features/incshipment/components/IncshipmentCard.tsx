import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Package, Calendar, Building2, ChevronRight } from 'lucide-react-native';
import { theme } from '../../../theme/theme';
import { IncshipmentHeader } from '../types/incshipment.types';

interface IncshipmentCardProps {
    item: IncshipmentHeader;
    index: number;
    onPress: () => void;
}

export function IncshipmentCard({ item, index, onPress }: IncshipmentCardProps) {
    const getStatusStyle = (item: IncshipmentHeader) => {
        const status = item.status_incoming?.toUpperCase();
        if (status === 'RECEIVED') {
            return { view: 'bg-emerald-100 border-emerald-200', text: 'text-emerald-700' };
        }
        if (status === 'READY TO RECEIVE') {
            // Jika belum assign barcode, warna merah
            if (item.f_assign_barcode === 0) {
                return { view: 'bg-red-50 border-red-200', text: 'text-red-600' };
            }
            // Jika sudah assign barcode, warna normal (item/hitam)
            return { view: 'bg-gray-100 border-gray-300', text: 'text-gray-800' };
        }
        return { view: 'bg-gray-100 border-gray-200', text: 'text-gray-700' };
    };

    const statusStyle = getStatusStyle(item);

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
                        <Package size={16} color={theme.colors.primary} />
                    </View>
                    <Text className="text-[15px] font-bold text-gray-900" numberOfLines={1}>
                        {item.code}
                    </Text>
                </View>
                <View className={`px-2.5 py-1 rounded-md border ${statusStyle.view}`}>
                    <Text className={`text-[11px] font-bold ${statusStyle.text}`}>
                        {item.status_incoming}
                    </Text>
                </View>
            </View>

            <View className="space-y-2.5 pl-10">
                <View className="flex-row items-center">
                    <Calendar size={14} color="#6B7280" />
                    <Text className="text-xs text-gray-600 ml-2">
                        {item.date_create}
                    </Text>
                </View>
                
                <View className="flex-row items-center pr-4">
                    <Building2 size={14} color="#6B7280" />
                    <Text className="text-xs text-gray-600 ml-2" numberOfLines={1}>
                        {item.nm_suppliers}
                    </Text>
                </View>
                
                <View className="flex-row items-center pr-4">
                    <Text className="text-xs text-gray-500 font-medium">PO: </Text>
                    <Text className="text-xs text-gray-600 ml-1" numberOfLines={1}>
                        {item.code_po}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}
