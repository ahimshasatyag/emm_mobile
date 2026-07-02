import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { HistoryService } from '../types/cekserialnumber.types';
import { Calendar, User, FileText, Activity } from 'lucide-react-native';
import { theme } from '../../../theme/theme';

interface HistoryServiceCardProps {
    item: HistoryService;
    index: number;
}

export function HistoryServiceCard({ item, index }: HistoryServiceCardProps) {
    return (
        <Animated.View
            entering={FadeInUp.delay(index * 100).duration(400)}
            className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-3"
        >
            <View className="flex-row justify-between items-center border-b border-gray-100 pb-3 mb-3">
                <View className="flex-row items-center">
                    <View className="w-8 h-8 rounded-full bg-blue-50 items-center justify-center mr-3">
                        <Activity size={16} color={theme.colors.primary} />
                    </View>
                    <View>
                        <Text className="text-xs text-gray-500 mb-0.5">No CST</Text>
                        <Text className="text-sm font-extrabold text-gray-900">{item.cst_code}</Text>
                    </View>
                </View>
                <View className="items-end">
                    <Text className="text-xs text-gray-500 mb-0.5">Total Realisasi</Text>
                    <Text className="text-sm font-bold text-green-600">{item.total_realisasi}</Text>
                </View>
            </View>

            <View className="space-y-2 mb-3">
                <View className="flex-row">
                    <View className="w-5 mt-0.5"><Calendar size={14} color="#6b7280" /></View>
                    <View className="flex-1">
                        <Text className="text-xs font-semibold text-gray-700">{item.cst_date}</Text>
                    </View>
                </View>
                <View className="flex-row">
                    <View className="w-5 mt-0.5"><User size={14} color="#6b7280" /></View>
                    <View className="flex-1">
                        <Text className="text-xs text-gray-700">{item.teknisi}</Text>
                    </View>
                </View>
            </View>

            <View className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                <View>
                    <Text className="text-[10px] font-bold text-gray-500 uppercase mb-1.5">Catatan Kerusakan</Text>
                    <Text className="text-xs text-gray-800 leading-relaxed">{item.catatan_kerusakan}</Text>
                </View>
                <View className="h-px bg-gray-200 my-6" />
                <View>
                    <Text className="text-[10px] font-bold text-gray-500 uppercase mb-1.5">Laporan Akhir</Text>
                    <Text className="text-xs text-gray-800 leading-relaxed">{item.laporan_akhir}</Text>
                </View>
            </View>
        </Animated.View>
    );
}
