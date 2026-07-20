import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronRight, Folder } from 'lucide-react-native';
import { theme } from '../../../theme/theme';
import { DivisionSopSummary } from '../types/sop.types';

interface SopDivisionCardProps {
    data: DivisionSopSummary;
    onPress: () => void;
}

export const SopDivisionCard: React.FC<SopDivisionCardProps> = ({ data, onPress }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-3 flex-row items-center justify-between"
            activeOpacity={0.7}
        >
            <View className="flex-row items-center flex-1">
                <View className="w-12 h-12 rounded-full items-center justify-center mr-4" style={{ backgroundColor: theme.colors.primaryContainer }}>
                    <Folder color={theme.colors.primary} size={24} />
                </View>
                <View className="flex-1">
                    <Text className="text-gray-800 font-bold text-lg">{data.divisi}</Text>
                    <Text className="text-gray-500 text-sm mt-1">{data.total} SOP Documents</Text>
                </View>
            </View>
            <ChevronRight color={theme.colors.primary} size={20} />
        </TouchableOpacity>
    );
};
