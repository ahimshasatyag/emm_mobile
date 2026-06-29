import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { ShieldCheck, ChevronRight } from 'lucide-react-native';
import { ApprovalItemData } from '../types/approvalitems.types';
import { theme } from '../../../theme/theme';

interface ApprovalItemCardProps {
    item: ApprovalItemData;
    index: number;
    onPress: (item: ApprovalItemData) => void;
}

export function ApprovalItemCard({ item, index, onPress }: ApprovalItemCardProps) {
    const isAuto = item.approval_type === 'auto';

    return (
        <Animated.View entering={FadeInUp.delay(index * 100).duration(400)}>
            <TouchableOpacity
                onPress={() => onPress(item)}
                activeOpacity={0.7}
                className="bg-white p-4 rounded-2xl mb-4 flex-row items-center justify-between border border-gray-100 shadow-sm"
            >
                <View className="flex-row items-center flex-1">
                    <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${isAuto ? 'bg-orange-50' : 'bg-emerald-50'}`}>
                        <ShieldCheck color={isAuto ? theme.colors.warning : theme.colors.success} size={24} />
                    </View>
                    <View className="flex-1 mr-2">
                        <Text className="text-[15px] font-bold text-gray-800 mb-1" numberOfLines={1}>{item.approval_name}</Text>
                        <View className="flex-row items-center flex-wrap gap-2 mt-1">
                            <View className="bg-gray-100 px-2 py-0.5 rounded-md">
                                <Text className="text-[11px] text-gray-500 font-medium">Modul: {item.module_name}</Text>
                            </View>
                            <View className={`${isAuto ? 'bg-orange-100' : 'bg-emerald-100'} px-2 py-0.5 rounded-md`}>
                                <Text className={`text-[11px] font-bold uppercase ${isAuto ? 'text-orange-600' : 'text-emerald-600'}`}>{item.approval_type}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <ChevronRight color={theme.colors.primary} size={20} />
            </TouchableOpacity>
        </Animated.View>
    );
}
