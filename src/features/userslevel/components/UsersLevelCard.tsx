import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Shield, ChevronRight } from 'lucide-react-native';
import { UserLevelData } from '../types/userslevel.types';
import { theme } from '../../../theme/theme';

interface UsersLevelCardProps {
    level: UserLevelData;
    index: number;
    onPress: (level: UserLevelData) => void;
}

export function UsersLevelCard({ level, index, onPress }: UsersLevelCardProps) {
    return (
        <Animated.View entering={FadeInUp.delay(index * 100).duration(400)}>
            <TouchableOpacity
                onPress={() => onPress(level)}
                activeOpacity={0.7}
                className="bg-white p-4 rounded-2xl mb-4 flex-row items-center justify-between border border-gray-100 shadow-sm"
            >
                <View className="flex-row items-center flex-1">
                    <View className="w-12 h-12 rounded-full bg-indigo-50 items-center justify-center mr-4">
                        <Shield color={theme.colors.primary} size={24} />
                    </View>
                    <View className="flex-1">
                        <Text className="text-[15px] font-bold text-gray-800 mb-1">{level.nm_users_level}</Text>
                        <View className="bg-gray-100 self-start px-2 py-0.5 rounded-md">
                            <Text className="text-xs text-gray-500 font-medium">ID: {level.id_users_level}</Text>
                        </View>
                    </View>
                </View>
                <ChevronRight color={theme.colors.primary} size={20} />
            </TouchableOpacity>
        </Animated.View>
    );
}
