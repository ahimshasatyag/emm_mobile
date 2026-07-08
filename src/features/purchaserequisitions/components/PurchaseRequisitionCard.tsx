import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Calendar, User } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { PurchaseRequisition } from '../types/purchaserequisitions';
import { formatDate } from '../../../utils/helpers/date';

interface Props {
    item: PurchaseRequisition;
    index: number;
    onPress: () => void;
}

export function PurchaseRequisitionCard({ item, index, onPress }: Props) {
    const isSubmitted = item.status_pr === 'PR';

    return (
        <Animated.View entering={FadeInDown.delay(index * 100)}>
            <TouchableOpacity
                onPress={onPress}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-3"
            >
                <View className="flex-row justify-between items-center mb-3">
                    <View className="flex-1">
                        <Text className="font-bold text-gray-900 text-base">{item.code_pr}</Text>
                        <View className="flex-row items-center mt-1">
                            <User size={14} color="#6B7280" />
                            <Text className="text-gray-500 text-xs ml-1 mr-3">{item.username}</Text>
                        </View>
                    </View>
                    <View className={`px-2 py-1 rounded-md ${isSubmitted ? 'bg-blue-100' : 'bg-gray-100'}`}>
                        <Text className={`text-[10px] font-bold ${isSubmitted ? 'text-blue-700' : 'text-gray-600'}`}>
                            {isSubmitted ? 'SUBMITTED' : 'DRAFT'}
                        </Text>
                    </View>
                </View>

                <View className="flex-row items-center justify-between border-t border-gray-100 pt-3">
                    <View className="flex-row items-center">
                        <Calendar size={14} color="#9CA3AF" />
                        <Text className="text-gray-500 text-xs ml-1">Req: {item.date_request ? formatDate(new Date(item.date_request)) : '-'}</Text>
                    </View>
                    <View className="flex-row items-center">
                        <Calendar size={14} color="#EF4444" />
                        <Text className="text-red-500 font-medium text-xs ml-1">Due: {item.date_deadline ? formatDate(new Date(item.date_deadline)) : '-'}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}
