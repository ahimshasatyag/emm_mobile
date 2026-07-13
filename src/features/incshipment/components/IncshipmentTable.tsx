import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { theme } from '../../../theme/theme';
import { IncshipmentDetail } from '../types/incshipment.types';
import { Check } from 'lucide-react-native';
import { IncshipmentOptionTable } from './IncshipmentOptionTable';

interface IncshipmentTableProps {
    details: IncshipmentDetail[];
    showCheckbox: boolean;
    selectedIds: string[];
    onToggleSelect: (id: string) => void;
}

export function IncshipmentTable({ details, showCheckbox, selectedIds, onToggleSelect }: IncshipmentTableProps) {
    if (!details || details.length === 0) {
        return (
            <View className="bg-white rounded-xl border border-gray-200 p-8 items-center justify-center">
                <Text className="text-gray-500 font-medium text-sm">Tidak ada barang</Text>
            </View>
        );
    }

    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="bg-white rounded-xl border border-gray-200 overflow-hidden min-w-[800px]">
                {/* Header Table */}
                <View className="flex-row bg-gray-50 border-b border-gray-200">
                    <View className="w-24 p-3 border-r border-gray-200 justify-center">
                        <Text className="text-xs font-bold text-gray-700">Kode</Text>
                    </View>
                    <View className="w-48 p-3 border-r border-gray-200 justify-center">
                        <Text className="text-xs font-bold text-gray-700">Product</Text>
                    </View>
                    <View className="w-16 p-3 border-r border-gray-200 justify-center items-center">
                        <Text className="text-xs font-bold text-gray-700">Qty</Text>
                    </View>
                    <View className="w-20 p-3 border-r border-gray-200 justify-center items-center">
                        <Text className="text-xs font-bold text-gray-700">Satuan</Text>
                    </View>
                    <View className="w-40 p-3 border-r border-gray-200 justify-center">
                        <Text className="text-xs font-bold text-gray-700">SN</Text>
                    </View>
                    <View className="w-32 p-3 border-r border-gray-200 justify-center">
                        <Text className="text-xs font-bold text-gray-700">Source</Text>
                    </View>
                    <View className="w-32 p-3 border-r border-gray-200 justify-center">
                        <Text className="text-xs font-bold text-gray-700">Destination</Text>
                    </View>
                    {showCheckbox && (
                        <View className="w-16 p-3 justify-center items-center">
                            <Text className="text-xs font-bold text-gray-700">Aksi</Text>
                        </View>
                    )}
                </View>

                {/* Body Table */}
                {details.map((item, index) => {
                    const isSelected = selectedIds.includes(item.id_dtl);
                    return (
                        <View key={item.id_dtl} className={`flex-col ${index !== details.length - 1 ? 'border-b border-gray-100' : ''}`}>
                            <View className="flex-row">
                                <View className="w-24 p-3 border-r border-gray-100 justify-center">
                                    <Text className="text-[13px] text-gray-700 font-medium" numberOfLines={2}>
                                        {item.code_product}
                                    </Text>
                                </View>
                                <View className="w-48 p-3 border-r border-gray-100 justify-center">
                                    <Text className="text-[13px] text-gray-700" numberOfLines={2}>
                                        {item.nm_product}
                                    </Text>
                                </View>
                                <View className="w-16 p-3 border-r border-gray-100 justify-center items-center">
                                    <Text className="text-[13px] text-gray-900 font-semibold">
                                        {item.qty}
                                    </Text>
                                </View>
                                <View className="w-20 p-3 border-r border-gray-100 justify-center items-center">
                                    <Text className="text-[13px] text-gray-600">
                                        {item.nm_product_satuan}
                                    </Text>
                                </View>
                                <View className="w-40 p-3 border-r border-gray-100 justify-center">
                                    <Text className="text-[13px] text-gray-700 font-medium">
                                        {item.sn}
                                    </Text>
                                </View>
                                <View className="w-32 p-3 border-r border-gray-100 justify-center">
                                    <Text className="text-[13px] text-gray-600">
                                        {item.lokasi_source}
                                    </Text>
                                </View>
                                <View className="w-32 p-3 border-r border-gray-100 justify-center">
                                    <Text className="text-[13px] text-gray-600">
                                        {item.lokasi_destination}
                                    </Text>
                                </View>
                                {showCheckbox && (
                                    <View className="w-16 p-3 justify-center items-center">
                                        <TouchableOpacity
                                            activeOpacity={0.7}
                                            onPress={() => onToggleSelect(item.id_dtl)}
                                            className={`w-6 h-6 rounded-md border items-center justify-center ${isSelected ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}
                                        >
                                            {isSelected && <Check size={14} color="#FFF" />}
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>

                            {/* Option Table */}
                            {item.options && item.options.length > 0 && (
                                <View className="p-3 bg-gray-50/50">
                                    <IncshipmentOptionTable 
                                        options={item.options} 
                                        isReadOnly={!showCheckbox}
                                    />
                                </View>
                            )}
                        </View>
                    );
                })}
            </View>
        </ScrollView>
    );
}
