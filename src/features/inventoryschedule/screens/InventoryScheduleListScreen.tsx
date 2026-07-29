import React, { useState, useMemo, useCallback } from 'react';
import { View, TextInput, FlatList, RefreshControl } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Search } from 'lucide-react-native';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';
import { theme } from '../../../theme/theme';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { fetchSchedulesList } from '../stores/inventoryscheduleSlice';
import { InventoryScheduleListSkeleton } from '../skeleton/InventoryScheduleListSkeleton';
import { InventoryScheduleCard } from '../components/InventoryScheduleCard';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { EmptyState } from '../../../components/shared/EmptyState';
import { ErrorState } from '../../../components/shared/ErrorState';
import { ButtonAdd } from '../../../components/ui/buttonAdd';

export function InventoryScheduleListScreen() {
    const navigation = useNavigation<any>();
    const dispatch = useAppDispatch();
    const { schedules, loading, error } = useAppSelector((state) => state.inventoryschedule);

    const [searchQuery, setSearchQuery] = useState('');
    const [isInitializing, setIsInitializing] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const loadData = useCallback(async () => {
        await dispatch(fetchSchedulesList());
    }, [dispatch]);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;
            const initialize = async () => {
                setIsInitializing(true);
                try {
                    await Promise.all([
                        loadData(),
                        new Promise(resolve => setTimeout(resolve, 800))
                    ]);
                } catch (error) {
                    // console.error("Failed to load:", error);
                } finally {
                    if (isActive) setIsInitializing(false);
                }
            };
            initialize();
            return () => {
                isActive = false;
                setIsInitializing(true);
            };
        }, [loadData])
    );

    const filteredData = useMemo(() => {
        if (!searchQuery) return schedules;
        const query = searchQuery.toLowerCase();
        return schedules.filter(schedule =>
            schedule.name.toLowerCase().includes(query) ||
            (schedule.asset_name && schedule.asset_name.toLowerCase().includes(query)) ||
            (schedule.deskripsi && schedule.deskripsi.toLowerCase().includes(query))
        );
    }, [schedules, searchQuery]);

    const onRefresh = useCallback(async () => {
        setIsRefreshing(true);
        try {
            await loadData();
        } finally {
            setIsRefreshing(false);
        }
    }, [loadData]);

    const navigateToDetail = (id: string) => {
        navigation.navigate('InventoryScheduleEditScreen', { id });
    };

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator title="ASSET SCHEDULE" />

            <View className="px-4 py-3">
                <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-4 py-3.5 shadow-sm">
                    <Search size={20} color="#9CA3AF" />
                    <TextInput
                        placeholder="Cari jadwal atau nama aset..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        className="flex-1 ml-3 text-sm text-gray-800 p-0"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>
            </View>

            <View className="flex-1">
                <FlatList
                    data={(loading || isInitializing || isRefreshing) ? [] : filteredData}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100, flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => (
                        <Animated.View entering={FadeInDown.delay(index * 50).springify()}>
                            <InventoryScheduleCard
                                schedule={item}
                                onPress={() => navigateToDetail(item.id)}
                            />
                        </Animated.View>
                    )}
                    refreshControl={
                        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
                    }
                    ListEmptyComponent={() => {
                        if (error) {
                            return (
                                <ErrorState
                                    title="Gagal Memuat Data"
                                    message={error}
                                    onRetry={loadData}
                                    fullScreen={true}
                                />
                            );
                        }
                        if (loading || isInitializing || isRefreshing) {
                            return (
                                <View style={{ marginHorizontal: -16 }}>
                                    <Animated.View exiting={FadeOut.duration(300)}>
                                        <InventoryScheduleListSkeleton />
                                    </Animated.View>
                                </View>
                            );
                        }
                        return (
                            <EmptyState
                                title="Data Kosong"
                                message="Tidak ada jadwal yang ditemukan."
                                fullScreen={true}
                            />
                        );
                    }}
                />
            </View>

            {(!loading && !isInitializing && !isRefreshing) && (
                <ButtonAdd onPress={() => navigation.navigate('InventoryScheduleFormScreen')} />
            )}
        </View>
    );
}
