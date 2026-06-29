import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Hash, ChevronRight, Calendar } from 'lucide-react-native';
import { CounterData } from '../types/counter.types';
import { theme } from '../../../theme/theme';

interface CounterCardProps {
    item: CounterData;
    index: number;
    onPress: (item: CounterData) => void;
}

export function CounterCard({ item, index, onPress }: CounterCardProps) {
    return (
        <Animated.View entering={FadeInUp.delay(index * 100).duration(400)}>
            <TouchableOpacity
                onPress={() => onPress(item)}
                activeOpacity={0.7}
                className="bg-white p-4 rounded-2xl mb-4 flex-row items-center justify-between border border-gray-100 shadow-sm"
            >
                <View className="flex-row items-center flex-1">
                    <View className="w-12 h-12 rounded-full items-center justify-center mr-4 bg-indigo-50">
                        <Hash color={theme.colors.primary} size={24} />
                    </View>
                    <View className="flex-1">
                        <Text className="text-[15px] font-bold text-gray-800 mb-1">Kode: {item.id_counter}</Text>
                        <View className="flex-row items-center mt-1">
                            <View className="bg-gray-100 self-start px-2 py-0.5 rounded-md">
                                <Text className="text-xs text-gray-500 font-medium">Periode: {item.periode}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View className="items-end">
                    <Text className="text-[11px] text-gray-400 mb-0.5 font-medium">Counter</Text>
                    <View className="flex-row items-center">
                        <Text className="text-lg font-bold text-gray-700 mr-2">{item.no_counter.toLocaleString('id-ID')}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}
