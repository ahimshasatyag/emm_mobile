import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FileText, ChevronRight } from 'lucide-react-native';
import { theme } from '../../../theme/theme';
import { SopItem } from '../types/sop.types';

interface SopCardProps {
    data: SopItem;
    onPress: () => void;
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'DRAFT': return { bg: 'bg-gray-100', text: 'text-gray-700' };
        case 'IN PROGRESS': return { bg: 'bg-orange-100', text: 'text-orange-700' };
        case 'FINALIZE': return { bg: 'bg-green-100', text: 'text-green-700' };
        case 'HISTORY': return { bg: 'bg-blue-100', text: 'text-blue-700' };
        default: return { bg: 'bg-gray-100', text: 'text-gray-700' };
    }
};

export const SopCard: React.FC<SopCardProps> = ({ data, onPress }) => {
    const statusColor = getStatusColor(data.status);

    return (
        <TouchableOpacity
            onPress={onPress}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-3"
            activeOpacity={0.7}
        >
            <View className="flex-row justify-between items-start mb-2">
                <View className="flex-row items-center flex-1 mr-2">
                    <FileText color={theme.colors.primary} size={18} className="mr-2" />
                    <Text className="text-gray-500 font-bold flex-1" numberOfLines={1}>{data.code_sop}</Text>
                </View>
                <View className={`px-2 py-1 rounded-full ${statusColor.bg}`}>
                    <Text className={`text-xs font-bold ${statusColor.text}`}>{data.status}</Text>
                </View>
            </View>
            
            <View className="flex-row justify-between items-center mt-2">
                <Text className="text-gray-800 font-bold text-base flex-1 mr-2" numberOfLines={2}>
                    {data.nm_sop}
                </Text>
                <ChevronRight color={theme.colors.primary} size={20} />
            </View>
        </TouchableOpacity>
    );
};
