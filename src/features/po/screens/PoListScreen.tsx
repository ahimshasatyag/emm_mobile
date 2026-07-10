import React, { useState, useCallback, useMemo } from 'react';
import { View, FlatList, RefreshControl, TextInput } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { Search } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { PoCard } from '../components/PoCard';
import { PoSkeleton } from '../skeleton/PoSkeleton';
import { usePo } from '../hooks/usePo';
import { theme } from '../../../theme/theme';
import { EmptyState } from '../../../components/shared/EmptyState';
import { ErrorState } from '../../../components/shared/ErrorState';

export function PoListScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { items, isLoadingList, error, searchQuery, setSearchQuery, loadList } = usePo();

    const [isInitializing, setIsInitializing] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [statusFilter, setStatusFilter] = useState('ALL STATUS');

    React.useEffect(() => {
        if (route.params?.timestamp) {
            setStatusFilter('ALL STATUS');
        }
    }, [route.params?.timestamp]);

    const statusOptions = [
        { label: 'ALL STATUS', value: 'ALL STATUS' },
        { label: 'PO PURCHASE', value: 'PO PURCHASE' },
        { label: 'DRAFT PO', value: 'DRAFT PO' },
        { label: 'CANCEL', value: 'CANCEL' },
    ];

    const displayItems = useMemo(() => {
        if (statusFilter === 'ALL STATUS') return items;
        return items.filter((item: any) => item.status_po?.toUpperCase() === statusFilter);
    }, [items, statusFilter]);

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
                    // console.error("Failed to load list:", error);
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
        navigation.navigate('PoEditScreen', { id });
    };

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator title="PURCHASE ORDER" />

            <Animated.View entering={FadeInUp.duration(400)} className="px-4 py-3">
                <View className="flex-row items-center space-x-3">
                    <View className="flex-1 flex-row items-center bg-white px-4 py-3.5 rounded-xl border border-gray-200 shadow-sm">
                        <Search size={20} color="#9CA3AF" />
                        <TextInput
                            placeholder="Cari code po atau supplier..."
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
                    keyExtractor={(item) => item.id_po}
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
                        <PoCard
                            item={item}
                            index={index}
                            onPress={() => handleDetail(item.id_po)}
                        />
                    )}
                    ListEmptyComponent={() => {
                        if (error) {
                            return (
                                <ErrorState
                                    title="Gagal Memuat PO"
                                    message={error}
                                    onRetry={loadList}
                                    fullScreen={true}
                                />
                            );
                        }
                        if (isLoadingList || isInitializing) {
                            return (
                                <View style={{ marginHorizontal: -16 }}>
                                    <PoSkeleton />
                                </View>
                            );
                        }
                        return <EmptyState title="Tidak ada data" message="Belum ada data purchase order." />;
                    }}
                />
            </View>
        </View>
    );
}
