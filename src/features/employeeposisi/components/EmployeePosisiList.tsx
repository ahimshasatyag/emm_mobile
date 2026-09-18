import React from 'react';
import { View, Text, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Edit2, User, ChevronRight } from 'lucide-react-native';
import { EmployeePosisi } from '../types/employeeposisi.types';
import { EmployeePosisiSkeleton } from '../skeleton/EmployeePosisiSkeleton';
import { theme } from '../../../theme/theme';

interface EmployeePosisiListProps {
    data: EmployeePosisi[];
    isLoading: boolean;
    onRefresh: () => void;
}

export const EmployeePosisiList: React.FC<EmployeePosisiListProps> = ({
    data,
    isLoading,
    onRefresh
}) => {
    const navigation = useNavigation<any>();

    const renderItem = ({ item, index }: { item: EmployeePosisi; index: number }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('EmployeePosisiEdit', { id: item.id_karyawan_posisi })}
            className={`bg-white rounded-xl p-4 shadow-sm border border-gray-100 ${
                index !== data.length - 1 ? 'mb-3' : ''
            }`}
        >
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                    <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center mr-3">
                        <User size={20} color={theme.colors.primary} />
                    </View>
                    <View className="flex-1">
                        <Text className="text-gray-900 font-bold text-base mb-1" numberOfLines={1}>
                            {item.nm_karyawan_posisi}
                        </Text>
                        <Text className="text-gray-500 text-xs">
                            ID: {item.id_karyawan_posisi}
                        </Text>
                    </View>
                </View>
                <View className="flex-row items-center">
                    <View className="w-8 h-8 rounded-full bg-gray-50 items-center justify-center mr-2">
                        <Edit2 size={16} color={theme.colors.text.secondary} />
                    </View>
                    <ChevronRight size={20} color={theme.colors.text.secondary} />
                </View>
            </View>
        </TouchableOpacity>
    );

    if (isLoading && data.length === 0) {
        return (
            <View className="p-4 space-y-3">
                {[1, 2, 3, 4, 5].map((key) => (
                    <EmployeePosisiSkeleton key={key} />
                ))}
            </View>
        );
    }

    return (
        <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id_karyawan_posisi.toString()}
            contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={isLoading}
                    onRefresh={onRefresh}
                    colors={[theme.colors.primary]}
                    tintColor={theme.colors.primary}
                />
            }
            ListEmptyComponent={() => (
                <View className="py-12 items-center justify-center">
                    <View className="w-16 h-16 rounded-full bg-gray-50 items-center justify-center mb-4">
                        <User size={32} color={theme.colors.text.tertiary} />
                    </View>
                    <Text className="text-gray-500 text-base font-medium">Belum ada data posisi</Text>
                    <Text className="text-gray-400 text-sm mt-1">Data posisi yang ditambahkan akan tampil di sini</Text>
                </View>
            )}
        />
    );
};
