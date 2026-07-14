import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { DoItem } from '../types/do.types';
import { Calendar, FileText, User } from 'lucide-react-native';

interface DoCardProps {
    item: DoItem;
    onPress: (id: string) => void;
}

export const DoCard: React.FC<DoCardProps> = ({ item, onPress }) => {
    
    const getStatusColor = (status: string) => {
        switch(status) {
            case 'DRAFT DELIVERY ORDER': return 'bg-gray-100 text-gray-700 border-gray-200';
            case 'WAITING AVAILABILITY': return 'bg-orange-50 text-orange-600 border-orange-200';
            case 'READY TO DELIVER': return 'bg-blue-50 text-blue-600 border-blue-200';
            case 'DELIVERED': return 'bg-green-50 text-green-600 border-green-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

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
                <View className={`px-2.5 py-1 rounded-md border ${getStatusColor(item.status_do)}`}>
                    <Text className="text-[10px] font-bold text-center">{item.status_do}</Text>
                </View>
            </View>

            <View className="flex-row items-center mt-2">
                <Calendar size={14} color="#6B7280" />
                <Text className="text-xs text-gray-600 ml-1.5">{item.date_do}</Text>
            </View>
            
            <View className="flex-row items-center mt-1.5">
                <FileText size={14} color="#6B7280" />
                <Text className="text-xs text-gray-600 ml-1.5">Source: {item.code_so}</Text>
            </View>
        </TouchableOpacity>
    );
};
