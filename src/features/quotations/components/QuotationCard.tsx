import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FileText, User, Calendar, MoreVertical, Edit, ChevronRight } from 'lucide-react-native';
import { Quotation } from '../types/quotation.types';
import Animated, { FadeInUp } from 'react-native-reanimated';

interface QuotationCardProps {
    item: Quotation;
    index: number;
    onPress: () => void;
}

export function QuotationCard({ item, index, onPress }: QuotationCardProps) {
    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case 'APPROVED': return 'bg-green-100 text-green-700';
            case 'DRAFT': return 'bg-gray-100 text-gray-700';
            default: return 'bg-blue-100 text-blue-700';
        }
    };

    return (
        <Animated.View
            entering={FadeInUp.delay(index * 100).duration(400)}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-4 overflow-hidden"
        >
            <TouchableOpacity 
                activeOpacity={0.7}
                onPress={onPress}
                className="p-4"
            >
                <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1">
                        <View className="flex-row items-center space-x-2 mb-1">
                            <FileText size={16} color="#4F46E5" />
                            <Text className="font-bold text-gray-900 text-base">
                                {item.quotation_number}
                            </Text>
                        </View>
                        <View className="flex-row items-center space-x-2 mt-1">
                            <Calendar size={12} color="#6B7280" />
                            <Text className="text-xs text-gray-500">
                                {item.date_so}
                            </Text>
                        </View>
                    </View>
                    <View className={`px-2.5 py-1 rounded-full ${getStatusColor(item.status)}`}>
                        <Text className="text-[10px] font-bold uppercase">{item.status}</Text>
                    </View>
                </View>

                <View className="bg-gray-50 p-3 rounded-lg mb-3">
                    <View className="flex-row items-center space-x-2 mb-1.5">
                        <User size={14} color="#6B7280" />
                        <Text className="text-sm font-semibold text-gray-800" numberOfLines={1}>
                            {item.customer_name}
                        </Text>
                    </View>
                    <Text className="text-xs text-gray-500 ml-6">
                        Sales: {item.sales_person_name}
                    </Text>
                </View>

                <View className="flex-row justify-between items-end border-t border-gray-100 pt-3">
                    <View>
                        <Text className="text-[10px] text-gray-500 font-medium uppercase mb-0.5">Total</Text>
                        <Text className="text-sm font-bold text-indigo-600">
                            Rp {item.total.toLocaleString('id-ID')}
                        </Text>
                    </View>
                    <View className="items-end">
                        <Text className="text-[10px] text-gray-500 font-medium uppercase mb-0.5">Price List</Text>
                        <Text className="text-sm font-bold text-gray-700">
                            {item.price_list || '-'}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}
