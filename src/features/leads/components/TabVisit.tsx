import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Plus, Calendar } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { theme } from '../../../theme/theme';

interface TabVisitProps {
    isEditMode?: boolean;
    openAddVisitModal: () => void;
    formData: any;
    openEditVisitModal: (index: number) => void;
}

export function TabVisit({
    isEditMode = true,
    openAddVisitModal,
    formData,
    openEditVisitModal
}: TabVisitProps) {
    return (
        <Animated.View entering={FadeInUp.duration(300)}>
            <View className="flex-row items-center justify-between mb-4">
                <Text className="text-sm font-bold text-gray-700">List Visit</Text>
                {isEditMode && (
                    <TouchableOpacity
                        onPress={openAddVisitModal}
                        className="px-3 py-1.5 rounded-lg flex-row items-center"
                        style={{ backgroundColor: theme.colors.primaryContainer }}
                    >
                        <Plus color={theme.colors.primary} size={16} className="mr-1" />
                        <Text className="font-bold text-xs" style={{ color: theme.colors.primary }}>Tambah Visit</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View className="mb-4 bg-white border border-gray-100 rounded-2xl overflow-hidden">
                <View className="flex-row bg-gray-50 p-3 border-b border-gray-100">
                    <Text className="w-24 text-xs font-bold text-gray-500">Tanggal</Text>
                    <Text className="flex-1 text-xs font-bold text-gray-500">Kegiatan</Text>
                </View>

                {formData.visits.map((item: any, index: number) => (
                    <TouchableOpacity
                        key={index}
                        className="flex-row p-3 items-center border-b border-gray-50 active:bg-gray-100"
                        onPress={() => openEditVisitModal(index)}
                    >
                        <Text className="w-24 text-xs font-bold text-gray-800">{item.date_visit}</Text>
                        <Text className="flex-1 text-xs text-gray-600" numberOfLines={2}>{item.visit_activity}</Text>
                    </TouchableOpacity>
                ))}

                {formData.visits.length === 0 && (
                    <View className="py-8 items-center border-b border-gray-50 bg-white">
                        <Calendar color="#9ca3af" size={32} className="mb-2" />
                        <Text className="text-gray-400 text-xs font-medium">Belum ada kunjungan</Text>
                    </View>
                )}
            </View>
        </Animated.View>
    );
}
