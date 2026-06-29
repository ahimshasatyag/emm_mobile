import React, { useState , useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, FlatList, RefreshControl } from 'react-native';
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
import Animated, { FadeInUp } from 'react-native-reanimated';

export function UsersLogListScreen() {
    const { data, isLoading, error } = useUsersLog();

    const [isInitializing, setIsInitializing] = useState(true);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const initialize = async () => {
                setIsInitializing(true);
                try {
                    await Promise.all([
                        handleRefresh(),
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

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <HeaderNavigator isLoading={isLoading} />

            <Animated.View entering={FadeInUp.duration(400)} className="px-6 pt-6 pb-2">
                <View className="bg-white flex-row items-center px-4 h-12 rounded-xl border border-gray-200 mb-2">
                    <Search color="#9ca3af" size={20} />
                    <Text className="text-gray-400 ml-2">Cari log aktivitas pengguna...</Text>
                </View>
            </Animated.View>

            <View className="flex-1">
                <FlatList
                    data={(isLoading || isInitializing) ? [] : data} // Kosongkan saat loading agar memicu skeleton
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }) => (
                        <UsersLogCard log={item} index={index} />
                    )}
                    contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100, flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} colors={[theme.colors.primary]} />
                    }
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
