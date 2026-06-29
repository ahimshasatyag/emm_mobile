import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Activity, Calendar, Monitor, User } from 'lucide-react-native';
import { UsersLogData } from '../types/userslog.types';
import { theme } from '../../../theme/theme';

interface UsersLogCardProps {
    log: UsersLogData;
    index: number;
}

export function UsersLogCard({ log, index }: UsersLogCardProps) {
    return (
        <Animated.View 
            entering={FadeInUp.delay(index * 100).duration(400)}
            className="bg-white p-4 rounded-2xl mb-4 border border-gray-100 shadow-sm"
        >
            <View className="flex-row items-center mb-3">
                <View className="w-10 h-10 rounded-full bg-indigo-50 items-center justify-center mr-3">
                    <User color={theme.colors.primary} size={20} />
                </View>
                <View className="flex-1">
                    <Text className="text-[15px] font-bold text-gray-800">{log.username}</Text>
                    <View className="flex-row items-center mt-1">
                        <Calendar color="#9ca3af" size={12} />
                        <Text className="text-xs text-gray-500 ml-1">{log.date}</Text>
                    </View>
                </View>
            </View>

            <View className="bg-gray-50 rounded-xl p-3">
                <View className="flex-row items-start mb-2">
                    <Activity color="#6366f1" size={16} className="mt-0.5" />
                    <View className="ml-2 flex-1">
                        <Text className="text-xs text-gray-500 font-medium mb-0.5">Aktivitas</Text>
                        <Text className="text-sm font-semibold text-gray-800">{log.activity}</Text>
                    </View>
                </View>
                <View className="flex-row items-start">
                    <Monitor color="#0ea5e9" size={16} className="mt-0.5" />
                    <View className="ml-2 flex-1">
                        <Text className="text-xs text-gray-500 font-medium mb-0.5">IP Address</Text>
                        <Text className="text-sm font-semibold text-gray-800">{log.ipAddress}</Text>
                    </View>
                </View>
            </View>
        </Animated.View>
    );
}
