import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Settings, ChevronRight } from 'lucide-react-native';
import { SettingData } from '../types/setting.types';
import { theme } from '../../../theme/theme';

interface SettingCardProps {
    item: SettingData;
    index: number;
    onPress: (item: SettingData) => void;
}

export function SettingCard({ item, index, onPress }: SettingCardProps) {
    const isActive = item.setting_flag === '1';

    return (
        <Animated.View entering={FadeInUp.delay(index * 100).duration(400)}>
            <TouchableOpacity
                onPress={() => onPress(item)}
                activeOpacity={0.7}
                className="bg-white p-4 rounded-2xl mb-4 flex-row items-center justify-between border border-gray-100 shadow-sm"
            >
                <View className="flex-row items-center flex-1">
                    <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${isActive ? 'bg-indigo-50' : 'bg-gray-100'}`}>
                        <Settings color={isActive ? theme.colors.primary : '#9ca3af'} size={24} />
                    </View>
                    <View className="flex-1 mr-2">
                        <Text className="text-[15px] font-bold text-gray-800 mb-1" numberOfLines={1}>{item.setting_label}</Text>
                        <View className="flex-row flex-wrap items-center mt-1">
                            <View className="bg-gray-100 self-start px-2 py-0.5 rounded-md mr-2 mb-1">
                                <Text className="text-[11px] text-gray-500 font-medium">Key: {item.setting_key}</Text>
                            </View>
                            <View className={`${isActive ? 'bg-green-50' : 'bg-gray-100'} self-start px-2 py-0.5 rounded-md mb-1`}>
                                <Text className={`text-[11px] font-bold ${isActive ? 'text-green-600' : 'text-gray-500'}`}>
                                    {isActive ? 'Aktif' : 'Tidak Aktif'}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
                <ChevronRight color={theme.colors.primary} size={20} />
            </TouchableOpacity>
        </Animated.View>
    );
}
