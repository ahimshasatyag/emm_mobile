import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, TextInput, Animated as RNAnimated, RefreshControl, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Search } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { RootState, AppDispatch } from '../../../stores';
import { fetchLogbookCustomers } from '../stores/logbookcustomersSlice';
import { LogbookCustomersCard } from '../components/LogbookCustomersCard';
import { LogbookCustomersListSkeleton } from '../skeleton/LogbookCustomersListSkeleton';
import { theme } from '../../../theme/theme';
import { ButtonAdd } from '../../../components/ui/buttonAdd';
import { ErrorState } from '../../../components/shared/ErrorState';
import { EmptyState } from '../../../components/shared/EmptyState';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';

export function LogbookCustomersListScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const dispatch = useDispatch<AppDispatch>();
    const { list, isLoading, error } = useSelector((state: RootState) => state.logbookcustomers);

    const [searchQuery, setSearchQuery] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);
    const [visibleCount, setVisibleCount] = useState(10);
    const flatListRef = useRef<any>(null);

    const [toast, setToast] = useState<{ visible: boolean; message: string; type: ToastType }>({
        visible: false,
        message: '',
        type: 'success'
    });

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

    useEffect(() => {
        if (route.params?.toastMessage) {
            setToast({
                visible: true,
                message: route.params.toastMessage,
                type: route.params.toastType || 'success'
            });
            navigation.setParams({ toastMessage: undefined, toastType: undefined, timestamp: undefined });
        }
    }, [route.params?.toastMessage, route.params?.timestamp]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await loadData();
        setVisibleCount(10);
        setIsRefreshing(false);
    };

    useEffect(() => {
        setVisibleCount(10);
        if (flatListRef.current) {
            flatListRef.current.scrollToOffset({ offset: 0, animated: false });
        }
    }, [searchQuery]);

    const filteredData = list.filter(item => {
        const idMatch = item.id_customers?.toLowerCase().includes(searchQuery.toLowerCase());
        const nm = item.nm_customer || item.nm_customers || '';
        const nameMatch = nm.toLowerCase().includes(searchQuery.toLowerCase());
        return idMatch || nameMatch;
    });

    const displayData = filteredData.slice(0, visibleCount);

    const handleLoadMore = () => {
        if (visibleCount < filteredData.length) {
            setVisibleCount(prev => prev + 10);
        }
    };

    return (
        <View className="flex-1 bg-gray-50">
            <ToastMessages
                visible={toast.visible}
                title={toast.type === 'error' ? 'Error' : 'Sukses'}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(prev => ({ ...prev, visible: false }))}
            />

            <HeaderNavigator title="LOGBOOK CUSTOMERS" />

            <Animated.View entering={FadeInUp.duration(400)} className="px-4 pt-3 pb-1">
                <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm mb-2">
                    <Search size={20} color="#9CA3AF" />
                    <TextInput
                        placeholder="Cari ID atau nama customer..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        className="flex-1 ml-3 text-sm text-gray-800 p-0"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>
            </Animated.View>

            <View className="flex-1">
                {error && <ErrorState onRetry={loadData} />}

                <Animated.FlatList
                    ref={flatListRef}
                    data={(isLoading || isInitializing) ? [] : displayData}
                    keyExtractor={item => item.id_log_book}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100, flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} colors={[theme.colors.primary]} />
                    }
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={() => {
                        if (visibleCount < filteredData.length && !isLoading && !isInitializing) {
                            return (
                                <View style={{ paddingVertical: 20, alignItems: 'center' }}>
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
