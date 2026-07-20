import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AssetItem } from '../types/assests.types';
import { Package, Calendar } from 'lucide-react-native';
import { theme } from '../../../theme/theme';

interface Props {
    item: AssetItem;
    onPress: () => void;
}

export const AssestListCard = ({ item, onPress }: Props) => {
    const getBadgeStyle = (status: string) => {
        switch (status) {
            case 'active': return { bg: 'bg-green-100', text: 'text-green-700', label: 'Active' };
            case 'normal': return { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Normal' };
            case 'not_assigned': return { bg: 'bg-gray-200', text: 'text-gray-700', label: 'Not Assigned' };
            case 'sold': return { bg: 'bg-red-100', text: 'text-red-700', label: 'Sold' };
            case 'rusak': return { bg: 'bg-slate-700', text: 'text-white', label: 'Rusak' };
            default: return { bg: 'bg-gray-100', text: 'text-gray-700', label: status };
        }
    };

    const badge = getBadgeStyle(item.status);

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPress}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-3"
        >
            <View className="flex-row justify-between items-start mb-2">
                <View className="flex-1 mr-2">
                    <Text className="text-gray-900 font-bold text-base mb-1">{item.name}</Text>
                    <View className="flex-row items-center">
                        <Package size={14} color={theme.colors.outline} />
                        <Text className="text-gray-500 text-xs ml-1">{item.category_name}</Text>
                    </View>
                </View>
                <View className={`px-2 py-1 rounded-full ${badge.bg}`}>
                    <Text className={`text-[10px] font-bold ${badge.text}`}>{badge.label}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};
