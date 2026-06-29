import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { LayoutList, ChevronRight } from 'lucide-react-native';
import { InventoryCategoryData } from '../types/inventorycategory.types';
import { theme } from '../../../theme/theme';

interface InventoryCategoryCardProps {
    item: InventoryCategoryData;
    index: number;
    onPress: (item: InventoryCategoryData) => void;
}

export function InventoryCategoryCard({ item, index, onPress }: InventoryCategoryCardProps) {
    return (
        <Animated.View entering={FadeInUp.delay(index * 100).duration(400)}>
            <TouchableOpacity
                onPress={() => onPress(item)}
                activeOpacity={0.7}
                className="bg-white p-4 rounded-2xl mb-4 flex-row items-center justify-between border border-gray-100 shadow-sm"
            >
                <View className="flex-row items-center flex-1">
                    <View className="w-12 h-12 rounded-full bg-indigo-50 items-center justify-center mr-4">
                        <LayoutList color={theme.colors.primary} size={24} />
                    </View>
                    <View className="flex-1 mr-2">
                        <Text className="text-[15px] font-bold text-gray-800 mb-1" numberOfLines={1}>{item.name}</Text>
                        <View className="bg-gray-100 self-start px-2 py-0.5 rounded-md mt-1">
                            <Text className="text-[11px] text-gray-500 font-medium">Kode: {item.id}</Text>
                        </View>
                    </View>
                </View>
                <ChevronRight color={theme.colors.primary} size={20} />
            </TouchableOpacity>
        </Animated.View>
    );
}
