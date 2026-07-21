import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FileText, Calendar, Trash2 } from 'lucide-react-native';
import { TandaTerimaCustItem } from '../types/tandaterimacust.types';

interface TandaTerimaCustCardProps {
    data: TandaTerimaCustItem;
    onPress: () => void;
    onDelete?: () => void;
}

export const TandaTerimaCustCard: React.FC<TandaTerimaCustCardProps> = ({ data, onPress, onDelete }) => {

    const handleDelete = () => {
        if (!onDelete) return;
        onDelete();
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-3"
            activeOpacity={0.7}
        >
            <View className="flex-row justify-between items-start mb-2">
                <View className="flex-1 mr-2">
                    <Text className="text-gray-800 font-bold text-base" numberOfLines={1}>
                        {data.nm_customers}
                    </Text>
                </View>
                {onDelete && (
                    <TouchableOpacity onPress={handleDelete} className="p-1 rounded bg-red-50">
                        <Trash2 color="#ef4444" size={16} />
                    </TouchableOpacity>
                )}
            </View>

            <View className="flex-row items-center mb-1">
                <Calendar color="#9ca3af" size={14} className="mr-2" />
                <Text className="text-gray-500 text-sm">
                    {data.date_tanda_terima}
                </Text>
            </View>

            {data.keterangan ? (
                <View className="flex-row items-start mt-1">
                    <FileText color="#9ca3af" size={14} className="mr-2 mt-0.5" />
                    <Text className="text-gray-600 text-sm flex-1" numberOfLines={2}>
                        {data.keterangan}
                    </Text>
                </View>
            ) : null}

            {data.files && data.files.length > 0 && (
                <View className="mt-3 bg-gray-50 p-2 rounded-lg flex-row justify-between items-center border border-gray-100">
                    <Text className="text-xs text-gray-500 font-medium">{data.files.length} File(s) Attached</Text>
                </View>
            )}
        </TouchableOpacity>
    );
};
