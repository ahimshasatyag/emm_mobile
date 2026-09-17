import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { EmployeeDivisiData } from '../types/employeedivisi.types';
import { theme } from '../../../theme/theme';
import { Building } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface EmployeeDivisiCardProps {
    item: EmployeeDivisiData;
    index: number;
    onPress: (item: EmployeeDivisiData) => void;
}

export function EmployeeDivisiCard({ item, index, onPress }: EmployeeDivisiCardProps) {
    return (
        <Animated.View
            entering={FadeInDown.delay(index * 100).springify().damping(12)}
            className="mb-4"
        >
            <TouchableOpacity
                onPress={() => onPress(item)}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 15,
                    elevation: 2,
                }}
            >
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1">
                        <View className="w-12 h-12 rounded-full items-center justify-center mr-4" style={{ backgroundColor: theme.colors.primaryContainer }}>
                            <Building color={theme.colors.primary} size={24} />
                        </View>
                        <View className="flex-1">
                            <Text className="text-lg font-bold text-gray-900 mb-1" numberOfLines={1}>
                                {item.nm_karyawan_divisi}
                            </Text>
                            <Text className="text-xs font-medium text-gray-500">
                                Kode: {item.id_karyawan_divisi}
                            </Text>
                        </View>
                    </View>
                    <View className="w-8 h-8 rounded-full bg-gray-50 items-center justify-center ml-2 border border-gray-100">
                        <Text className="text-gray-400 font-bold text-lg">›</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}
