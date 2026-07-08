import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Building2, Phone, Mail, MapPin, ChevronRight } from 'lucide-react-native';
import { Supplier } from '../types/suppliers.types';
import { theme } from '../../../theme/theme';

interface Props {
    supplier: Supplier;
    onPress: () => void;
}

export function SupplierCard({ supplier, onPress }: Props) {
    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPress}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-3"
            style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3 }}
        >
            <View className="p-4 flex-row items-center">
                <View className="w-12 h-12 rounded-full items-center justify-center mr-3" style={{ backgroundColor: `${theme.colors.primary}15` }}>
                    <Building2 color={theme.colors.primary} size={24} />
                </View>

                <View className="flex-1">
                    <View className="flex-row justify-between items-start mb-1">
                        <Text className="text-sm font-bold text-gray-800 flex-1 mr-2" numberOfLines={1}>
                            {supplier.nm_suppliers}
                        </Text>
                        <View className="bg-blue-100 px-2 py-1 rounded text-center ml-2">
                            <Text className="text-[10px] font-bold text-blue-700">Qty Purchase: {supplier.qty_purchase || 0}</Text>
                        </View>
                    </View>

                    <View className="flex-row items-center mt-1">
                        <MapPin size={12} color="#9CA3AF" />
                        <Text className="text-[11px] text-gray-500 ml-1 flex-1" numberOfLines={1}>{supplier.suppliers_address || '-'}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}
