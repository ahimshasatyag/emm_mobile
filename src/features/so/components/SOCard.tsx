import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { FileText, User, Hash, Briefcase } from 'lucide-react-native';
import { SalesOrder } from '../types/so.types';

interface SOCardProps {
    item: SalesOrder;
    index: number;
    onPress: () => void;
}

export function SOCard({ item, index, onPress }: SOCardProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'DRAFT SALES ORDER': return 'bg-gray-800';
            case 'OUTSTANDING SALES ORDER': return 'bg-yellow-500';
            case 'CANCEL SALES ORDER': return 'bg-red-500';
            case 'SALES ORDER': return 'bg-blue-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
            <TouchableOpacity 
                activeOpacity={0.7}
                onPress={onPress}
                className="bg-white rounded-xl p-4 mb-3 border border-gray-100 shadow-sm"
                style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3 }}
            >
                <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-row items-center">
                        <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center mr-3">
                            <FileText size={20} color="#3b82f6" />
                        </View>
                        <View>
                            <Text className="text-sm font-bold text-gray-800">{item.code_so}</Text>
                            <Text className="text-xs text-gray-500">{item.date_so}</Text>
                        </View>
                    </View>
                    <View className={`${getStatusColor(item.status_so)} px-2.5 py-1 rounded-full`}>
                        <Text className="text-[10px] font-bold text-white">{item.status_so}</Text>
                    </View>
                </View>

                <View className="space-y-1.5 ml-13 pl-13">
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center flex-1 mr-2">
                            <User size={14} color="#6b7280" className="mr-2" />
                            <Text className="text-xs text-gray-600 font-medium" numberOfLines={1}>{item.nm_customers}</Text>
                        </View>
                        <View className="flex-row items-center">
                            <Briefcase size={12} color="#6b7280" className="mr-1" />
                            <Text className="text-[10px] text-gray-500 font-medium">{item.nm_karyawan}</Text>
                        </View>
                    </View>
                    {item.no_po_cust ? (
                        <View className="flex-row items-center mt-1">
                            <Hash size={14} color="#6b7280" className="mr-2" />
                            <Text className="text-xs text-gray-600">PO: {item.no_po_cust}</Text>
                        </View>
                    ) : null}
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}
