import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { DoItem } from '../types/do.types';
import { Calendar, FileText } from 'lucide-react-native';
import { formatDate } from '../../../utils/helpers/date';
import { getDoStatusColor } from '../hooks/useDo';

interface DoCardProps {
    item: DoItem;
    onPress: (id: string) => void;
}

export const DoCard: React.FC<DoCardProps> = ({ item, onPress }) => {

    const statusColor = getDoStatusColor(item.status_do);

    return (
        <TouchableOpacity
            onPress={() => onPress(item.id_do)}
            activeOpacity={0.7}
            className="bg-white p-4 rounded-xl shadow-sm mb-4 border border-gray-100"
        >
            <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1 mr-3">
                    <Text className="text-sm text-gray-500 mb-1">{item.code_do}</Text>
                    <Text className="text-base font-bold text-gray-800">{item.nm_customers}</Text>
                </View>
                <View className={`px-2.5 py-1 rounded-md border ${statusColor.bg}`}>
                    <Text className={`text-[10px] font-bold text-center ${statusColor.text}`}>{item.status_do}</Text>
                </View>
            </View>

            <View className="flex-row items-center mt-2">
                <Calendar size={14} color="#6B7280" />
                <Text className="text-xs text-gray-600 ml-1.5">{item.date_do ? formatDate(new Date(item.date_do)) : '-'}</Text>
            </View>

            <View className="flex-row items-center mt-1.5">
                <FileText size={14} color="#6B7280" />
                <Text className="text-xs text-gray-600 ml-1.5">Source: {item.code_so}</Text>
            </View>
        </TouchableOpacity>
    );
};
