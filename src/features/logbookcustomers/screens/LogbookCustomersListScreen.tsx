import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, Animated as RNAnimated, RefreshControl } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Search } from 'lucide-react-native';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { RootState, AppDispatch } from '../../../stores';
import { fetchLogbookCustomers } from '../stores/logbookcustomersSlice';
import { LogbookCustomersCard } from '../components/LogbookCustomersCard';
import { LogbookCustomersListSkeleton } from '../skeleton/LogbookCustomersListSkeleton';
import { theme } from '../../../theme/theme';
import { ButtonAdd } from '../../../components/ui/buttonAdd';
import { ErrorState } from '../../../components/shared/ErrorState';
import { EmptyState } from '../../../components/shared/EmptyState';

export function LogbookCustomersListScreen() {
    const navigation = useNavigation<any>();
    const dispatch = useDispatch<AppDispatch>();
    const { list, isLoading, error } = useSelector((state: RootState) => state.logbookcustomers);

    const [searchQuery, setSearchQuery] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);

    const loadData = async () => {
        await dispatch(fetchLogbookCustomers());
    };

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
                } catch (err) {
                    // console.error(err);
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

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await loadData();
        setIsRefreshing(false);
    };

    const filteredData = list.filter(item =>
        item.id_customers.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.nm_customer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator title="LOGBOOK CUSTOMERS" />

            <Animated.View entering={FadeInUp.duration(400)} className="px-6 pt-6 pb-2">
                <View className="flex-row items-center justify-between">
                    <View className="flex-1 bg-white flex-row items-center px-4 h-12 rounded-xl border border-gray-200 mb-2">
                        <Search color="#9ca3af" size={20} />
                        <TextInput
                            className="flex-1 ml-2 text-gray-900"
                            placeholder="Cari ID atau nama customer..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                </View>
            </Animated.View>

            <View className="flex-1">
                {error && <ErrorState onRetry={loadData} />}

                <Animated.FlatList
                    entering={FadeInDown}
                    data={(isLoading || isInitializing) ? [] : filteredData}
                    keyExtractor={item => item.id_log_book}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100, flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} colors={[theme.colors.primary]} />
                    }
                    ListEmptyComponent={() => {
                        if (error) {
                            return (
                                <ErrorState
                                    title="Gagal Memuat Logbook"
                                    message={error}
                                    onRetry={loadData}
                                    fullScreen={true}
                                />
                            );
                        }
                        if (isLoading || isInitializing) {
                            return (
                                <View style={{ marginHorizontal: -16 }}>
                                    <LogbookCustomersListSkeleton />
                                </View>
                            );
                        }
                        return (
                            <EmptyState
                                title="Data Kosong"
                                message={searchQuery ? "Data tidak ditemukan" : "Belum ada logbook customer."}
                                fullScreen={true}
                            />
                        );
                    }}
                    renderItem={({ item, index }) => {
                        if (isInitializing || isLoading) return null;
                        return (
                            <LogbookCustomersCard logbook={item} index={index} />
                        );
                    }}
                />
            </View>

            {(!isLoading && !isInitializing) && !error && (
                <ButtonAdd onPress={() => navigation.navigate('LogbookCustomersFormScreen')} />
            )}
        </View>
    );
}
