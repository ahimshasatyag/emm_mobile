import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CalendarDays, Clock, FileText } from 'lucide-react-native';
import { InventorySchedule } from '../types/inventoryschedule.types';
import { theme } from '../../../theme/theme';

interface Props {
    schedule: InventorySchedule;
    onPress: (id: string) => void;
}

export function InventoryScheduleCard({ schedule, onPress }: Props) {
    return (
        <TouchableOpacity
            onPress={() => onPress(schedule.id)}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-3"
            activeOpacity={0.7}
        >
            <View className="flex-row justify-between items-start mb-2">
                <View className="flex-1 pr-2">
                    <Text className="text-lg font-bold text-gray-800" numberOfLines={1}>
                        {schedule.name}
                    </Text>
                    <Text className="text-sm font-medium text-gray-500 mt-1" numberOfLines={1}>
                        Asset: {schedule.asset_name || schedule.asset_id}
                    </Text>
                </View>
            </View>

            <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-gray-100">
                <View className="flex-row items-center">
                    <CalendarDays size={16} color={theme.colors.primary} />
                    <Text className="text-xs font-bold text-gray-600 ml-2">
                        Due: {schedule.due_date}
                    </Text>
                </View>

                <View className="flex-row items-center bg-gray-50 px-2 py-1 rounded-lg">
                    <CalendarDays size={16} color={theme.colors.primary} />
                    <Text className="text-xs font-bold text-gray-600 ml-2">
                        Periode: {schedule.due_date}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}
