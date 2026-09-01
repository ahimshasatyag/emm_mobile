import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, FlatList, TextInput, RefreshControl, Text, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Search } from 'lucide-react-native';
import { useProductPriceLog } from '../hooks/useProductPriceLog';
import { ProductPriceLogCard } from '../components/ProductPriceLogCard';
import { ProductPriceLogSkeleton } from '../skeleton/ProductPriceLogSkeleton';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { EmptyState } from '../../../components/shared/EmptyState';
import { ErrorState } from '../../../components/shared/ErrorState';
import { theme } from '../../../theme/theme';
import Animated, { FadeInUp } from 'react-native-reanimated';

export function ProductPriceLogListScreen() {
    const navigation = useNavigation<any>();
    const { logs, isLoading, error, loadLogs, resetError } = useProductPriceLog();
    const [searchQuery, setSearchQuery] = useState('');
    const [isInitializing, setIsInitializing] = useState(true);

    const [visibleCount, setVisibleCount] = useState(10);
    const [isLoadMore, setIsLoadMore] = useState(false);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const initialize = async () => {
                if (isActive) {
                    setIsInitializing(true);
                    resetError();
                    await loadLogs();
                    setIsInitializing(false);
                    setIsLoadMore(false);
                }
            };

            initialize();

            return () => {
                isActive = false;
                setIsInitializing(true);
            };
        }, [loadLogs, resetError])
    );

    const onRefresh = useCallback(async () => {
        setVisibleCount(10);
        resetError();
        await loadLogs();
    }, [loadLogs, resetError]);

    const filteredLogs = useMemo(() => {
        const query = searchQuery.toLowerCase();
        return logs.filter(log =>
            (log.nm_product || '').toLowerCase().includes(query) ||
            (log.code_product || '').toLowerCase().includes(query) ||
            (log.nm_users || log.username || '').toLowerCase().includes(query)
        );
    }, [logs, searchQuery]);

    useEffect(() => {
        setVisibleCount(10);
    }, [searchQuery]);

    const handleLoadMore = useCallback(() => {
        if (visibleCount < filteredLogs.length && !isLoadMore) {
            setIsLoadMore(true);
            setTimeout(() => {
                setVisibleCount(prev => prev + 10);
                setIsLoadMore(false);
            }, 600);
        }
    }, [visibleCount, filteredLogs.length, isLoadMore]);

    const isShowSkeleton = isLoading || isInitializing;

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator
                title="LOG SEARCH"
                showBackButton={true}
                onBackPress={() => navigation.goBack()}
            />

            <Animated.View entering={FadeInUp.duration(400)} className="px-6 pt-6 pb-2">
                <View className="bg-white flex-row items-center px-4 h-12 rounded-xl border border-gray-200 mb-2 shadow-sm">
                    <Search color="#9CA3AF" size={20} />
                    <TextInput
                        className="flex-1 ml-2 text-gray-900 h-full"
                        placeholder="Cari produk atau user..."
                        placeholderTextColor="#9CA3AF"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </Animated.View>

            <View className="flex-1">
                <FlatList
                    data={isShowSkeleton ? [] : filteredLogs.slice(0, visibleCount)}
                    keyExtractor={(item, index) => `${item.code_product}_${item.username}_${index}`}
                    renderItem={({ item, index }) => <ProductPriceLogCard log={item} index={index} />}
                    contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100, flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    refreshControl={
                        <RefreshControl
                            refreshing={isLoading && !isInitializing}
                            onRefresh={onRefresh}
                            colors={[theme.colors.primary]}
                        />
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
                                    title="Gagal Memuat Data"
                                    message={error}
                                    onRetry={onRefresh}
                                    fullScreen={true}
                                />
                            );
                        }
                        if (isShowSkeleton) {
                            return (
                                <View className="mt-4">
                                    <ProductPriceLogSkeleton />
                                </View>
                            );
                        }
                        return (
                            <EmptyState
                                title="Tidak ada data log harga"
                                message={searchQuery ? "Coba ubah kata kunci pencarian Anda" : "Belum ada riwayat perubahan harga saat ini"}
                            />
                        );
                    }}
                />
            </View>
        </View>
    );
}
