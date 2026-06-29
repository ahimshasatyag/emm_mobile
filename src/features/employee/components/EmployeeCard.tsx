import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { User, ChevronRight, Phone, Briefcase } from 'lucide-react-native';
import { EmployeeData } from '../types/employee.types';
import { theme } from '../../../theme/theme';

interface EmployeeCardProps {
    item: EmployeeData;
    index: number;
    onPress: (item: EmployeeData) => void;
}

export function EmployeeCard({ item, index, onPress }: EmployeeCardProps) {
    return (
        <Animated.View entering={FadeInUp.delay(index * 100).duration(400)}>
            <TouchableOpacity 
                onPress={() => onPress(item)}
                activeOpacity={0.7}
                className="bg-white p-4 rounded-2xl mb-4 flex-row items-center border border-gray-100 shadow-sm"
            >
                <View className="w-14 h-14 rounded-full bg-indigo-50 items-center justify-center mr-4">
                    <User color={theme.colors.primary} size={28} />
                </View>
                
                <View className="flex-1 mr-2">
                    <Text className="text-[16px] font-bold text-gray-800 mb-1" numberOfLines={1}>
                        {item.nm_karyawan}
                    </Text>
                    
                    <View className="flex-row items-center mb-1">
                        <Briefcase color="#9ca3af" size={14} className="mr-1" />
                        <Text className="text-xs text-gray-500 flex-1" numberOfLines={1}>
                            {item.nm_karyawan_divisi} • {item.nm_karyawan_posisi}
                        </Text>
                    </View>
                    
                    <View className="flex-row items-center">
                        <Phone color="#9ca3af" size={14} className="mr-1" />
                        <Text className="text-[11px] font-medium text-gray-500">
                            {item.no_hp || '-'}
                        </Text>
                        
                        <View className="ml-auto flex-row items-center">
                            <View className={`px-2 py-0.5 rounded-md ${item.flag_status === '1' ? 'bg-green-100' : 'bg-red-100'}`}>
                                <Text className={`text-[10px] font-bold ${item.flag_status === '1' ? 'text-green-700' : 'text-red-700'}`}>
                                    {item.flag_status === '1' ? 'Aktif' : 'Non-Aktif'}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
                
                <ChevronRight color="#d1d5db" size={20} />
            </TouchableOpacity>
        </Animated.View>
    );
}
