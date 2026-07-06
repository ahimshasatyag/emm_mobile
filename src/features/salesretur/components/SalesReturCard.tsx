import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Calendar, User, Tag, Hash } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SalesRetur } from '../types/salesretur.types';

interface SalesReturCardProps {
    item: SalesRetur;
    index: number;
    onPress: () => void;
}

export function SalesReturCard({ item, index, onPress }: SalesReturCardProps) {
    const getStatusColor = (status: string) => {
        switch (status?.toUpperCase()) {
            case 'DRAFT': return 'bg-yellow-100 text-yellow-800';
            case 'CONFIRMED': return 'bg-green-100 text-green-800';
            case 'CANCEL': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <Animated.View entering={FadeInUp.delay(index * 100)}>
            <TouchableOpacity
                onPress={onPress}
                className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100"
                activeOpacity={0.7}
            >
                {/* Header */}
                <View className="flex-row justify-between items-start mb-1">
                    <View className="flex-row items-start flex-1 mr-2">
                        <View className="bg-blue-50 p-2 rounded-lg mr-3 mt-1">
                            <Tag size={18} color="#3B82F6" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-gray-900 font-semibold text-base" numberOfLines={1}>
                                {item.code_sr}
                            </Text>
                            <Text className="text-gray-600 text-sm mt-0.5">{item.nm_customers || item.id_customers}</Text>
                            <View className="flex-row items-center mt-1.5">
                                <Calendar size={12} color="#9CA3AF" className="mr-1.5" />
                                <Text className="text-gray-500 text-xs">
                                    {new Date(item.date).toLocaleDateString('id-ID', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric'
                                    })}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View className={`px-2.5 py-1 rounded-full ${getStatusColor(item.status).split(' ')[0]}`}>
                        <Text className={`text-xs font-semibold ${getStatusColor(item.status).split(' ')[1]}`}>
                            {item.status}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}
