import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { MataUangCard } from '../components/MataUangCard';
import { MataUangSkeleton } from '../skeleton/MataUangSkeleton';
import { useMataUang } from '../hooks/useMataUang';
import { theme } from '../../../theme/theme';
import { Dropdown } from 'react-native-element-dropdown';
import { Database } from 'lucide-react-native';

export function MataUangScreen() {
    const navigation = useNavigation<any>();
    const { items, isLoading, error, baseCurrency, handleRefresh, handleSetBaseCurrency } = useMataUang();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const onRefresh = useCallback(async () => {
        setIsRefreshing(true);
        handleRefresh();
        setIsRefreshing(false);
    }, [handleRefresh]);

    const dropdownData = items.map(item => ({
        label: item.mata_uang,
        value: item.mata_uang
    }));

    const renderHeader = () => (
        <View className="mt-2 mb-1">
            <View className="mb-2">
                <View className="border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm">
                    <Dropdown
                        style={{ height: 48, paddingHorizontal: 16 }}
                        data={dropdownData}
                        labelField="label"
                        valueField="value"
                        placeholder="Pilih Mata Uang..."
                        value={baseCurrency}
                        onChange={(item) => handleSetBaseCurrency(item.value)}
                        search
                        searchPlaceholder="Cari..."
                    />
                </View>
            </View>
        </View>
    );

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator title="MATA UANG" />

            <View className="flex-1 pt-4">
                <View className="px-4">
                    {renderHeader()}
                </View>

                {error ? (
                    <View className="flex-1 justify-center items-center p-5">
                        <Text className="text-red-500 text-center">{error}</Text>
                    </View>
                ) : (
                    <FlatList
                        data={[{ id: 'table_container' }]}
                        keyExtractor={(i) => i.id}
                        refreshControl={
                            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
                        }
                        renderItem={() => (
                            <View className="px-4 pb-20">
                                <View className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                        <View>
                                            {/* Table Header */}
                                            <View className="flex-row bg-gray-200 rounded-t-xl overflow-hidden border border-gray-200">
                                                <Text className="w-24 py-3 px-2 font-bold text-[12px] text-gray-700 text-center">Mata Uang</Text>
                                                <Text className="w-40 py-3 px-2 font-bold text-[12px] text-gray-700 text-right">Kurs</Text>
                                                <Text className="w-40 py-3 px-2 font-bold text-[12px] text-gray-700 text-right">Rate</Text>
                                                <Text className="w-48 py-3 px-2 font-bold text-[12px] text-gray-700 text-center">Date Update</Text>
                                            </View>

                                            {/* Table Body */}
                                            {isLoading ? (
                                                <MataUangSkeleton />
                                            ) : items.length > 0 ? items.map((item, index) => (
                                                <MataUangCard
                                                    key={item.mata_uang}
                                                    item={item}
                                                    index={index}
                                                />
                                            )) : (
                                                <View className="py-10 bg-white border border-t-0 border-gray-100 rounded-b-xl items-center justify-center">
                                                    <Database size={32} color="#9ca3af" className="mb-2" />
                                                    <Text className="text-gray-500">Tidak ada data ditemukan</Text>
                                                </View>
                                            )}
                                        </View>
                                    </ScrollView>
                                </View>
                            </View>
                        )}
                        contentContainerStyle={{ paddingBottom: 100 }}
                    />
                )}
            </View>
        </View>
    );
}
