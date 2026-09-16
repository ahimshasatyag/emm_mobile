import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { KasBankInHeader } from '../types/kasbankin.types';
import { formatRp } from '../../../utils/helpers/money';
import { formatDate } from '../../../utils/helpers/date';

interface KasBankInCardProps {
    item: KasBankInHeader;
    index: number;
    onPress: () => void;
}

export const KasBankInCard: React.FC<KasBankInCardProps> = ({ item, index, onPress }) => {
    return (
        <Animated.View
            entering={FadeInUp.delay((index % 10) * 100).duration(400)}
            className="bg-white rounded-xl mb-3 shadow-sm border border-gray-100 overflow-hidden"
        >
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.7}
                className="p-4"
            >
            <View className="flex-row justify-between items-start mb-2">
                <View>
                    <Text className="text-gray-900 font-bold text-base">{item.code_kb_masuk}</Text>
                    <Text className="text-gray-500 text-xs mt-1">{item.d_bank ? formatDate(new Date(item.d_bank)) : '-'}</Text>
                </View>
            </View>

            <View className="border-t border-gray-50 pt-3 mt-1 flex-row justify-between items-center">
                <View className="flex-1">
                    <Text className="text-gray-500 text-xs mb-1">Deskripsi</Text>
                    <Text className="text-gray-800 text-sm" numberOfLines={2}>{item.deskripsi}</Text>
                </View>
                <View className="items-end ml-2">
                    <Text className="text-gray-500 text-xs mb-1">Total</Text>
                    <Text className="text-gray-900 font-bold">{formatRp(item.v_amount)}</Text>
                </View>
            </View>
            </TouchableOpacity>
        </Animated.View>
    );
};
