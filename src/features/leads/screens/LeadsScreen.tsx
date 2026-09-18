import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View, Text, RefreshControl, TextInput, ActivityIndicator, FlatList } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { Search } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { LeadsCard } from '../components/LeadsCard';
import { LeadsSkeleton } from '../skeleton/LeadsSkeleton';
import { useLeads } from '../hooks/useLeads';
import { theme } from '../../../theme/theme';
import { EmptyState } from '../../../components/shared/EmptyState';
import { ErrorState } from '../../../components/shared/ErrorState';
import { ButtonAdd } from '../../../components/ui/buttonAdd';

export function LeadsScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { items, isLoadingList, error, searchQuery, setSearchQuery, loadList } = useLeads();

    const [isInitializing, setIsInitializing] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [statusFilter, setStatusFilter] = useState('ALL STATUS');
    const [visibleCount, setVisibleCount] = useState(10);
    const [isLoadMore, setIsLoadMore] = useState(false);

    // Reset status filter
    React.useEffect(() => {
        if (route.params?.timestamp) {
            setStatusFilter('ALL STATUS');
        }
    }, [route.params?.timestamp]);

    const statusOptions = [
        { label: 'ALL STATUS', value: 'ALL STATUS' },
        { label: 'DRAFT', value: 'DRAFT' },
        { label: 'ONGOING', value: 'ONGOING' },
        { label: 'OPEN', value: 'OPEN' },
        { label: 'FAIL', value: 'FAIL' },
        { label: 'SUCCESS', value: 'SUCCESS' },
        { label: 'CANCEL', value: 'CANCEL' },
    ];

    const displayItems = useMemo(() => {
        if (statusFilter === 'ALL STATUS') return items;
        return items.filter((item: any) => item.status?.toUpperCase() === statusFilter);
    }, [items, statusFilter]);

    useEffect(() => {
        setVisibleCount(10);
    }, [searchQuery, items, statusFilter]);

    const handleLoadMore = useCallback(() => {
        if (visibleCount < displayItems.length && !isLoadMore) {
            setIsLoadMore(true);
            setTimeout(() => {
                setVisibleCount(prev => prev + 10);
                setIsLoadMore(false);
            }, 600);
        }
    }, [visibleCount, displayItems.length, isLoadMore]);

    const onRefresh = useCallback(async () => {
        setIsRefreshing(true);
        try {
            await loadList();
        } finally {
            setIsRefreshing(false);
        }
    }, [loadList]);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const initialize = async () => {
                setIsInitializing(true);
                try {
                    await Promise.all([
                        loadList(),
                        new Promise(resolve => setTimeout(resolve, 800))
                    ]);
                } catch (error) {
                    // console.error("Failed to load:", error);
                } finally {
                    if (isActive) {
                        setIsInitializing(false);
                    }
                }
            };

            initialize();

            return () => {
                isActive = false;
                setIsInitializing(true);
            };
        }, [loadList])
    );

    const navigateToDetail = (id: string) => {
        navigation.navigate('LeadsEditScreen', { id });
    };

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator title="DAFTAR LEADS" />

            <Animated.View entering={FadeInUp.duration(400)} className="px-4 py-3 flex-row gap-2">
                <View className="flex-1 flex-row items-center bg-white border border-gray-200 rounded-xl px-4 py-3.5 shadow-sm">
                    <Search size={20} color="#9CA3AF" />
                    <TextInput
                        placeholder="Cari customer, kode..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        className="flex-1 ml-3 text-sm text-gray-800 p-0"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>
                <View className="w-28 bg-white border border-gray-200 rounded-xl shadow-sm justify-center">
                    <Dropdown
                        style={{ paddingHorizontal: 12, height: 48 }}
                        selectedTextStyle={{ fontSize: 13, fontWeight: 'bold', color: theme.colors.primary, textAlign: 'center' }}
                        itemTextStyle={{ fontSize: 13 }}
                        data={statusOptions}
                        labelField="label"
                        valueField="value"
                        value={statusFilter}
                        onChange={item => setStatusFilter(item.value)}
                        renderRightIcon={() => null}
                    />
                </View>
            </Animated.View>

            <View className="flex-1">
                <Animated.View className="flex-1" entering={FadeInDown}>
                    <FlatList
                        data={(isLoadingList || isInitializing) ? [] : (displayItems || []).slice(0, visibleCount)}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item, index }) => (
                        <LeadsCard
                            item={item}
                            index={index}
                            onPress={() => navigateToDetail(item.id)}
                        />
                    )}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100, flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    refreshControl={
                        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
                    }
                    ListFooterComponent={() => {
                        if (isLoadMore) {
                            return (
                                <View className="py-4 items-center justify-center">
                                    <ActivityIndicator size="small" color={theme.colors.primary} />
                                </View>
                            );
                        }
                        return null;
                    }}
                    ListEmptyComponent={() => {
                        if (error) {
                            return (
                                <ErrorState
                                    title="Gagal Memuat Leads"
                                    message={error}
                                    onRetry={loadList}
                                    fullScreen={true}
                                />
                            );
                        }
                        if (isLoadingList || isInitializing) {
                            return (
                                <View style={{ marginHorizontal: -16 }}>
                                    <LeadsSkeleton />
                                </View>
                            );
                        }
                        return (
                            <EmptyState
                                title="Data Leads Kosong"
                                message="Tidak ada leads yang ditemukan."
                                fullScreen={true}
                            />
                        );
                    }}
                />
                </Animated.View>
            </View>

            {(!isLoadingList && !isInitializing) && (
                <ButtonAdd onPress={() => navigation.navigate('LeadsFormScreen')} />
            )}
        </View>
    );
}
