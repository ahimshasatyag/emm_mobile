import React, { useState, useCallback, useMemo } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, FlatList, RefreshControl, TextInput, ActivityIndicator } from 'react-native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { useUsersLog } from '../hooks/useUsersLog';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { setData, setLoading, setError } from '../stores/userslogSlice';
import { fetchUsersLogApi } from '../api/userslog.api';
import { UsersLogCard } from '../components/UsersLogCard';
import { UsersLogListSkeleton } from '../skeleton/UsersLogListSkeleton';
import { ErrorState } from '../../../components/shared/ErrorState';
import { EmptyState } from '../../../components/shared/EmptyState';
import { theme } from '../../../theme/theme';
import { Search } from 'lucide-react-native';

export function UsersLogListScreen() {
    const { data, isLoading, error } = useUsersLog();

    const [isInitializing, setIsInitializing] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [visibleCount, setVisibleCount] = useState(10);
    const [isLoadMore, setIsLoadMore] = useState(false);

    const filteredData = useMemo(() => {
        if (!searchQuery) return data;
        const query = searchQuery.toLowerCase();
        return data.filter(item =>
            item.username.toLowerCase().includes(query) ||
            item.activity.toLowerCase().includes(query)
        );
    }, [data, searchQuery]);

    React.useEffect(() => {
        setVisibleCount(10);
    }, [searchQuery, data]);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const initialize = async () => {
                setIsInitializing(true);
                try {
                    await handleRefresh();
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
        }, [])
    );
    const dispatch = useAppDispatch();

    const handleRefresh = async () => {
        dispatch(setLoading(true));
        try {
            const result = await fetchUsersLogApi();
            dispatch(setData(result));
        } catch (e: any) {
            dispatch(setError(e.message));
        }
    };

    const handleLoadMore = useCallback(() => {
        if (visibleCount < filteredData.length && !isLoadMore) {
            setIsLoadMore(true);
            setTimeout(() => {
                setVisibleCount(prev => prev + 10);
                setIsLoadMore(false);
            }, 600); // 600ms artificial delay for loading sensation
        }
    }, [visibleCount, filteredData.length, isLoadMore]);

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <HeaderNavigator isLoading={isLoading} />

            <View className="px-4 pt-3 pb-1">
                <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm mb-2">
                    <Search size={20} color="#9CA3AF" />
                    <TextInput
                        placeholder="Cari username atau aktivitas..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        className="flex-1 ml-3 text-sm text-gray-800 p-0"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>
            </View>

            <View className="flex-1">
                <FlatList
                    data={(isLoading || isInitializing) ? [] : filteredData.slice(0, visibleCount)} // Kosongkan saat loading agar memicu skeleton
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }) => (
                        <UsersLogCard log={item} index={index} />
                    )}
                    contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100, flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    refreshControl={
                        <RefreshControl refreshing={isLoading && !isInitializing} onRefresh={handleRefresh} colors={[theme.colors.primary]} />
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
                                    title="Gagal Memuat Data Log"
                                    message={error}
                                    onRetry={handleRefresh}
                                    fullScreen={true}
                                />
                            );
                        }
                        if (isLoading || isInitializing) {
                            return (
                                <View style={{ marginHorizontal: -24 }}>
                                    <UsersLogListSkeleton />
                                </View>
                            );
                        }
                        return (
                            <EmptyState
                                title="Data Log Kosong"
                                message="Belum ada aktivitas yang terekam di sistem."
                                fullScreen={true}
                            />
                        );
                    }}
                />
            </View>
        </View>
    );
}
