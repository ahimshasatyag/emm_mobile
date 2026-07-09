import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Building2, Calendar, FileText, CheckCircle2, Clock, XCircle } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { theme } from '../../../theme/theme';
import { QuotationAP } from '../types/quotationsap.types';
import { formatRp } from '../../../utils/helpers/money';

interface QuotationsAPCardProps {
    item: QuotationAP;
    index: number;
    onPress: () => void;
}

export function QuotationsAPCard({ item, index, onPress }: QuotationsAPCardProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'QUOTATION':
                return { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle2, color: '#15803d' };
            case 'DRAFT':
                return { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock, color: '#a16207' };
            case 'CANCEL':
                return { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle, color: '#b91c1c' };
            default:
                return { bg: 'bg-gray-100', text: 'text-gray-700', icon: FileText, color: '#374151' };
        }
    };

    const StatusIcon = getStatusColor(item.status_po).icon;

    return (
        <Animated.View
            entering={FadeInUp.delay(index * 100).springify()}
            className="mb-4"
        >
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={onPress}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
            >
                {/* Header */}
                <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1 mr-3">
                        <Text className="text-sm font-bold text-gray-900 mb-1">
                            {item.code_po}
                        </Text>
                        <View className="flex-row items-center">
                            <Calendar size={14} color="#6b7280" className="mr-1" />
                            <Text className="text-xs text-gray-500">
                                {item.date_po}
                            </Text>
                        </View>
                    </View>
                    <View className={`px-3 py-1.5 rounded-full flex-row items-center ${getStatusColor(item.status_po).bg}`}>
                        <StatusIcon size={12} color={getStatusColor(item.status_po).color} className="mr-1" />
                        <Text className={`text-xs font-bold ${getStatusColor(item.status_po).text}`}>
                            {item.status_po}
                        </Text>
                    </View>
                </View>

                {/* Divider */}
                <View className="h-[1px] bg-gray-100 w-full mb-3" />

                {/* Content */}
                <View className="space-y-2">
                    <View className="flex-row items-start">
                        <View className="w-8 h-8 rounded-full bg-blue-50 items-center justify-center mr-3 mt-1">
                            <Building2 size={16} color={theme.colors.primary} />
                        </View>
                        <View className="flex-1">
                            <Text className="text-xs text-gray-500 mb-0.5">Supplier</Text>
                            <Text className="text-sm font-semibold text-gray-900">
                                {item.nm_suppliers}
                            </Text>
                        </View>
                    </View>

                    <View className="flex-row items-start pt-2">
                        <View className="w-8 h-8 rounded-full bg-orange-50 items-center justify-center mr-3 mt-1">
                            <FileText size={16} color="#f97316" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-xs text-gray-500 mb-0.5">Notes</Text>
                            <Text className="text-sm text-gray-700" numberOfLines={2}>
                                {item.notes || '-'}
                            </Text>
                        </View>
                    </View>
                    
                    <View className="flex-row items-start pt-2">
                        <View className="flex-1">
                            <Text className="text-xs text-gray-500 mb-0.5">Total Amount</Text>
                            <Text className="text-sm font-bold text-gray-900">
                                {formatRp(item.amount_total)}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}
