import React, { useState, useCallback } from 'react';
import { View, FlatList, RefreshControl, TouchableOpacity, TextInput, Text, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Search, Calendar, CheckSquare, Square } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { theme } from '../../../theme/theme';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import DateTimePicker from "@react-native-community/datetimepicker";
import { Dropdown } from "react-native-element-dropdown";
import { useLkt } from '../hooks/useLkt';
import { LktCard } from '../components/LktCard';
import { LktListSkeleton } from '../skeleton/LktListSkeleton';
import { EmptyState } from '../../../components/shared/EmptyState';

const ITEMS_PER_PAGE = 10;

export function LktListScreen() {
    const navigation = useNavigation<any>();
    const { items, isLoading, filter, loadLkts, updateFilter, applyFilter } = useLkt();

    const [isInitializing, setIsInitializing] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [isAll, setIsAll] = useState(false);
    const [page, setPage] = useState(1);

    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);

    const handleApplyFilter = () => {
        setPage(1);
        updateFilter({
            startDate,
            endDate,
            statusFilter,
            isAll,
            searchQuery
        });
        loadLkts({
            startDate,
            endDate,
            statusFilter,
            isAll,
            searchQuery
        });
    };

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const initialize = async () => {
                setIsInitializing(true);
                setPage(1);
                try {
                    await Promise.all([
                        loadLkts(filter),
                        new Promise(resolve => setTimeout(resolve, 600))
                    ]);
                } finally {
                    if (isActive) setIsInitializing(false);
                }
            };

            initialize();

            return () => {
                isActive = false;
                setIsInitializing(true);
            };
        }, [loadLkts])
    );

    const handleRefresh = async () => {
        setIsInitializing(true);
        setPage(1);
        try {
            await Promise.all([
                loadLkts(filter),
                new Promise(resolve => setTimeout(resolve, 600))
            ]);
        } finally {
            setIsInitializing(false);
        }
    };

    const filteredItems = applyFilter(filter);
    const paginatedItems = filteredItems.slice(0, page * ITEMS_PER_PAGE);

    const handleLoadMore = () => {
        if (paginatedItems.length < filteredItems.length) {
            setPage(prev => prev + 1);
        }
    };

    const renderFooter = () => {
        if (paginatedItems.length < filteredItems.length) {
            return (
                <View className="py-4 items-center justify-center">
                    <ActivityIndicator size="small" color={theme.colors.primary} />
                    <Text className="text-xs text-gray-400 mt-1">Memuat lebih banyak...</Text>
                </View>
            );
        }
        return null;
    };

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator
                title="LEMBAR KERJA TEKNISI"
            />

            <View className="px-6 pt-5 pb-4">
                <View className="bg-white flex-row items-center px-4 h-12 rounded-xl border border-gray-200 shadow-sm mb-4">
                    <Search color="#9CA3AF" size={18} />
                    <TextInput
                        className="flex-1 ml-2 text-sm text-gray-800"
                        placeholder="Cari LKT / CST / Customer..."
                        placeholderTextColor="#9CA3AF"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Date Filter */}
                <View className="flex-row justify-between mb-3">
                    <View className="flex-1 mr-2">
                        <Text className="text-xs text-gray-500 mb-1">Dari Tanggal</Text>
                        <TouchableOpacity
                            className="bg-white flex-row items-center px-3 h-10 rounded-lg border border-gray-200 shadow-sm"
                            onPress={() => setShowStartDatePicker(true)}
                        >
                            <Calendar color="#9CA3AF" size={14} />
                            <Text className={`flex-1 ml-2 text-xs ${startDate ? 'text-gray-800' : 'text-gray-400'}`}>
                                {startDate || 'YYYY-MM-DD'}
                            </Text>
                        </TouchableOpacity>
                        {showStartDatePicker && (
                            <DateTimePicker
                                value={startDate ? new Date(startDate) : new Date()}
                                mode="date"
                                display="default"
                                onChange={(event, date) => {
                                    setShowStartDatePicker(false);
                                    if (date) {
                                        const y = date.getFullYear();
                                        const m = String(date.getMonth() + 1).padStart(2, '0');
                                        const d = String(date.getDate()).padStart(2, '0');
                                        setStartDate(`${y}-${m}-${d}`);
                                    }
                                }}
                            />
                        )}
                    </View>
                    <View className="flex-1 ml-2">
                        <Text className="text-xs text-gray-500 mb-1">Sampai Tanggal</Text>
                        <TouchableOpacity
                            className="bg-white flex-row items-center px-3 h-10 rounded-lg border border-gray-200 shadow-sm"
                            onPress={() => setShowEndDatePicker(true)}
                        >
                            <Calendar color="#9CA3AF" size={14} />
                            <Text className={`flex-1 ml-2 text-xs ${endDate ? 'text-gray-800' : 'text-gray-400'}`}>
                                {endDate || 'YYYY-MM-DD'}
                            </Text>
                        </TouchableOpacity>
                        {showEndDatePicker && (
                            <DateTimePicker
                                value={endDate ? new Date(endDate) : new Date()}
                                mode="date"
                                display="default"
                                onChange={(event, date) => {
                                    setShowEndDatePicker(false);
                                    if (date) {
                                        const y = date.getFullYear();
                                        const m = String(date.getMonth() + 1).padStart(2, '0');
                                        const d = String(date.getDate()).padStart(2, '0');
                                        setEndDate(`${y}-${m}-${d}`);
                                    }
                                }}
                            />
                        )}
                    </View>
                </View>

                {/* Status, All Checkbox, and Filter Button */}
                <View className="flex-row items-center justify-between z-10">
                    <View className="flex-1 mr-3 border border-gray-200 rounded-lg bg-white overflow-hidden">
                        <Dropdown
                            style={{ height: 40, paddingHorizontal: 12 }}
                            data={[
                                { label: 'All Status', value: 'ALL' },
                                { label: 'DRAFT', value: 'DRAFT' },
                                { label: 'ON PROGRESS', value: 'ON PROGRESS' },
                                { label: 'DONE', value: 'DONE' },
                                { label: 'CANCEL', value: 'CANCEL' },
                                { label: 'CLOSE', value: 'CLOSE' }
                            ]}
                            labelField="label"
                            valueField="value"
                            placeholder="Pilih Status"
                            value={statusFilter}
                            onChange={(item) => setStatusFilter(item.value)}
                            selectedTextStyle={{ fontSize: 12, color: '#1f2937' }}
                            placeholderStyle={{ fontSize: 12, color: '#9CA3AF' }}
                            itemTextStyle={{ fontSize: 12 }}
                        />
                    </View>

                    <TouchableOpacity
                        className="flex-row items-center mr-3"
                        onPress={() => setIsAll(!isAll)}
                    >
                        {isAll ? <CheckSquare color={theme.colors.primary} size={20} /> : <Square color="#9CA3AF" size={20} />}
                        <Text className="text-sm font-medium text-gray-700 ml-1.5">All</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="px-4 py-2.5 rounded-lg items-center justify-center"
                        style={{ backgroundColor: theme.colors.primary }}
                        onPress={handleApplyFilter}
                    >
                        <Text className="text-white text-xs font-bold">Filter</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {isInitializing ? (
                <View className="flex-1 px-6">
                    <LktListSkeleton />
                </View>
            ) : filteredItems.length > 0 ? (
                <FlatList
                    data={paginatedItems}
                    keyExtractor={(item, index) => `${item.id_afs_lkt}_${index}`}
                    renderItem={({ item, index }) => (
                        <Animated.View
                            entering={FadeInDown.delay(index * 60).springify()}
                        >
                            <LktCard lkt={item as any} />
                        </Animated.View>
                    )}
                    contentContainerStyle={{ padding: 24, paddingTop: 8, paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.3}
                    ListFooterComponent={renderFooter}
                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            onRefresh={handleRefresh}
                            colors={[theme.colors.primary]}
                            tintColor={theme.colors.primary}
                        />
                    }
                />
            ) : (
                <EmptyState
                    title="Tidak ada Data LKT"
                    description="Data LKT yang Anda cari tidak ditemukan."
                />
            )}
        </View>
    );
}
