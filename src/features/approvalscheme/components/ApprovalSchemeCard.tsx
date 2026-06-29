import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Network, ChevronRight } from 'lucide-react-native';
import { ApprovalSchemeData } from '../types/approvalscheme.types';
import { theme } from '../../../theme/theme';

interface ApprovalSchemeCardProps {
    item: ApprovalSchemeData;
    index: number;
    onPress: (item: ApprovalSchemeData) => void;
}

export function ApprovalSchemeCard({ item, index, onPress }: ApprovalSchemeCardProps) {
    return (
        <Animated.View entering={FadeInUp.delay(index * 100).duration(400)}>
            <TouchableOpacity
                onPress={() => onPress(item)}
                activeOpacity={0.7}
                className="bg-white p-4 rounded-2xl mb-4 flex-row items-center justify-between border border-gray-100 shadow-sm"
            >
                <View className="flex-row items-center flex-1">
                    <View className="w-12 h-12 rounded-full items-center justify-center mr-4 bg-indigo-50">
                        <Network color={theme.colors.primary} size={24} />
                    </View>
                    <View className="flex-1 mr-2">
                        <Text className="text-[15px] font-bold text-gray-800 mb-1" numberOfLines={1}>{item.scheme_name}</Text>
                        <Text className="text-xs text-gray-500" numberOfLines={1}>{item.description || 'Tidak ada deskripsi'}</Text>
                    </View>
                </View>
                <ChevronRight color={theme.colors.primary} size={20} />
            </TouchableOpacity>
        </Animated.View>
    );
}
