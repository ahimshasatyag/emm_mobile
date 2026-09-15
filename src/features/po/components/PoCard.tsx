import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Calendar, FileText, CheckCircle2, Clock, XCircle, Building2 } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { PoHeader } from '../types/po.types';
import { formatDate } from '../../../utils/helpers/date';

interface PoCardProps {
    item: PoHeader;
    index: number;
    onPress: () => void;
}

export function PoCard({ item, index, onPress }: PoCardProps) {
    const getStatusColor = (status: string) => {
        switch (status?.toUpperCase()) {
            case 'PO PURCHASE':
                return { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle2, color: '#15803d' };
            case 'DRAFT PO':
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
            entering={FadeInUp.delay((index % 10) * 100).duration(400)}
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
                                {item.date_po ? formatDate(new Date(item.date_po)) : '-'}
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

            </TouchableOpacity>
        </Animated.View>
    );
}
