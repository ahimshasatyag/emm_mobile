import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { View, Text, FlatList, RefreshControl, TextInput, ActivityIndicator } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { Search } from 'lucide-react-native';
import { theme } from '../../../theme/theme';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { EmptyState } from '../../../components/shared/EmptyState';
import { ErrorState } from '../../../components/shared/ErrorState';
import { useCustomerInvoice } from '../hooks/useCustomerInvoice';
import { CustomerInvoiceCard } from '../components/CustomerInvoiceCard';
import { CustomerInvoiceSkeleton } from '../skeleton/CustomerInvoiceSkeleton';

export const CustomerInvoiceListScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { list, loading, error, getList } = useCustomerInvoice();

    const [searchQuery, setSearchQuery] = useState('');
    const [isInitializing, setIsInitializing] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [statusFilter, setStatusFilter] = useState('ALL STATUS');
    const [visibleCount, setVisibleCount] = useState(10);
    const [isLoadMore, setIsLoadMore] = useState(false);
    const flatListRef = useRef<FlatList>(null);
    const isNavigatingToDetail = useRef(false);


    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            if (!isNavigatingToDetail.current) {
                setStatusFilter('ALL STATUS');
            }
            isNavigatingToDetail.current = false;

            const initialize = async () => {
                setIsInitializing(true);
                try {
                    await Promise.all([
                        getList(),
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
        }, [getList])
    );

    const statusOptions = [
        { label: 'ALL STATUS', value: 'ALL STATUS' },
        { label: 'OPEN', value: 'OPEN' },
        { label: 'PAID', value: 'PAID' },
        { label: 'CLOSE', value: 'CLOSE' }
    ];

    const onRefresh = useCallback(async () => {
        setIsRefreshing(true);
        try {
            await getList();
        } finally {
            setIsRefreshing(false);
        }
    }, [getList]);

    const handleDetail = (id: string) => {
        isNavigatingToDetail.current = true;
        navigation.navigate('CustomerInvoiceEditScreen', { id });
    };

    const filteredList = useMemo(() => {
        return (list || []).filter(item => {
            const matchSearch = item.code_invoice?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.nm_customers?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.code_so?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchStatus = statusFilter === 'ALL STATUS' || item.status_invoice?.toUpperCase() === statusFilter;
            return matchSearch && matchStatus;
        });
    }, [list, searchQuery, statusFilter]);

    useEffect(() => {
        setVisibleCount(10);
    }, [searchQuery, list, statusFilter]);

    const handleLoadMore = useCallback(() => {
        if (visibleCount < filteredList.length && !isLoadMore) {
            setIsLoadMore(true);
            setTimeout(() => {
                setVisibleCount(prev => prev + 10);
                setIsLoadMore(false);
            }, 600);
        }
    }, [visibleCount, filteredList.length, isLoadMore]);

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator title="CUSTOMER INVOICES" />


            <FlatList
                ref={flatListRef as any}
                className="flex-1"
                data={(loading || isInitializing || isRefreshing) ? [] : (filteredList.slice(0, visibleCount) ?? [])}
                keyExtractor={(item: any) => item.id_invoice}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100, paddingTop: 16 }}
                showsVerticalScrollIndicator={false}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListHeaderComponent={
                    <Animated.View entering={FadeInUp.duration(400)} className="mb-4">
                        <View className="flex-row items-center space-x-3">
                            <View className="flex-1 flex-row items-center bg-white px-4 py-3.5 rounded-xl border border-gray-200 shadow-sm">
                                <Search size={20} color="#9CA3AF" />
                                <TextInput
                                    placeholder="Cari Invoice, Pelanggan, atau SO..."
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                    className="flex-1 ml-3 text-sm text-gray-800 p-0"
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>
                            <View className="w-32 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden justify-center">
                                <Dropdown
                                    style={{ height: 48, paddingHorizontal: 12 }}
                                    placeholderStyle={{ fontSize: 14, color: '#6b7280' }}
                                    selectedTextStyle={{ fontSize: 14, color: '#111827', fontWeight: '500' }}
                                    data={statusOptions}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Status"
                                    value={statusFilter}
                                    onChange={(item) => {
                                        setStatusFilter(item.value);
                                        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
                                    }}
                                />
                            </View>
                        </View>
                    </Animated.View>
                }
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={['#2563eb']} />
                }
                renderItem={({ item, index }) => (
                    <CustomerInvoiceCard item={item} index={index} onPress={handleDetail} />
                )}
                ListEmptyComponent={() => {
                    if (error && !isInitializing) {
                        return (
                            <ErrorState
                                title="Gagal Memuat Invoice"
                                message={error}
                                onRetry={getList}
                                fullScreen={true}
                            />
                        );
                    }
                    if (loading || isInitializing || isRefreshing) {
                        return (
                            <View style={{ marginHorizontal: -16 }}>
                                <CustomerInvoiceSkeleton />
                            </View>
                        );
                    }
                    return <EmptyState title="Tidak ada data" message="Belum ada Customer Invoice." fullScreen={true} />;
                }}
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
            />
        </View>
    );
};
