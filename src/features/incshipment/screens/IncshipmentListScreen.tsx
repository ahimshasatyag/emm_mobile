import React, { useState, useCallback, useMemo } from 'react';
import { View, FlatList, RefreshControl, TextInput } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Search } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { IncshipmentCard } from '../components/IncshipmentCard';
import { IncshipmentSkeleton } from '../skeleton/IncshipmentSkeleton';
import { useIncshipment } from '../hooks/useIncshipment';
import { theme } from '../../../theme/theme';
import { EmptyState } from '../../../components/shared/EmptyState';
import { ErrorState } from '../../../components/shared/ErrorState';

export function IncshipmentListScreen() {
    const navigation = useNavigation<any>();
    const { items, isLoadingList, error, searchQuery, setSearchQuery, loadList } = useIncshipment();

    const [isInitializing, setIsInitializing] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [statusFilter, setStatusFilter] = useState('ALL STATUS');

    const statusOptions = [
        { label: 'ALL STATUS', value: 'ALL STATUS' },
        { label: 'READY TO RECEIVE', value: 'READY TO RECEIVE' },
        { label: 'RECEIVED', value: 'RECEIVED' },
    ];

    const displayItems = useMemo(() => {
        let filtered = items;
        if (statusFilter !== 'ALL STATUS') {
            filtered = filtered.filter(item => item.status_incoming?.toUpperCase() === statusFilter);
        }
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                item =>
                    item.code.toLowerCase().includes(query) ||
                    item.code_po.toLowerCase().includes(query) ||
                    item.nm_suppliers.toLowerCase().includes(query)
            );
        }
        return filtered;
    }, [items, statusFilter, searchQuery]);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;
            const initialize = async () => {
                setIsInitializing(true);
                try {
                    await loadList();
                } catch (error) {
                    // handled by reducer
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

    const onRefresh = useCallback(async () => {
        setIsRefreshing(true);
        try {
            await loadList();
        } finally {
            setIsRefreshing(false);
        }
    }, [loadList]);

    const handleDetail = (id: string) => {
        navigation.navigate('IncshipmentEditScreen', { id });
    };

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator title="INCOMING SHIPMENT" />

            <Animated.View entering={FadeInUp.duration(400)} className="px-4 py-3">
                <View className="flex-row items-center space-x-3">
                    <View className="flex-1 flex-row items-center bg-white px-4 py-3.5 rounded-xl border border-gray-200 shadow-sm">
                        <Search size={20} color="#9CA3AF" />
                        <TextInput
                            placeholder="Cari Code IS, PO, atau Supplier..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            className="flex-1 ml-3 text-sm text-gray-800 p-0"
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>
                    <View className="w-36 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden justify-center">
                        <Dropdown
                            style={{ height: 48, paddingHorizontal: 12 }}
                            placeholderStyle={{ fontSize: 13, color: '#6b7280' }}
                            selectedTextStyle={{ fontSize: 13, color: '#111827', fontWeight: '500' }}
                            data={statusOptions}
                            labelField="label"
                            valueField="value"
                            placeholder="Status"
                            value={statusFilter}
                            onChange={(item) => setStatusFilter(item.value)}
                        />
                    </View>
                </View>
            </Animated.View>

            <View className="flex-1">
                <Animated.FlatList
                    entering={FadeInDown}
                    data={(isLoadingList || isInitializing) ? [] : displayItems}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{
                        flexGrow: 1,
                        paddingBottom: 100,
                        paddingHorizontal: 16
                    }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={onRefresh}
                            colors={[theme.colors.primary]}
                        />
                    }
                    renderItem={({ item, index }) => (
                        <IncshipmentCard
                            item={item}
                            index={index}
                            onPress={() => handleDetail(item.id)}
                        />
                    )}
                    ListEmptyComponent={() => {
                        if (error) {
                            return (
                                <ErrorState
                                    title="Gagal Memuat Data"
                                    message={error}
                                    onRetry={loadList}
                                    fullScreen={true}
                                />
                            );
                        }
                        if (isLoadingList || isInitializing) {
                            return (
                                <View style={{ marginHorizontal: -16 }}>
                                    <IncshipmentSkeleton />
                                </View>
                            );
                        }
                        return <EmptyState title="Tidak ada data" message="Belum ada data incoming shipment." />;
                    }}
                />
            </View>
        </View>
    );
}
