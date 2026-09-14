import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { View, TextInput, FlatList, RefreshControl, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { theme } from '../../../theme/theme';
import { Search, Building2 } from 'lucide-react-native';
import { useSuppliers } from '../hooks/useSuppliers';
import { SupplierCard } from '../components/SupplierCard';
import { SuppliersSkeleton } from '../skeleton/SuppliersSkeleton';
import { EmptyState } from '../../../components/shared/EmptyState';
import { ErrorState } from '../../../components/shared/ErrorState';
import { ButtonAdd } from '../../../components/ui/buttonAdd';

export function SuppliersListScreen() {
    const navigation = useNavigation<any>();
    const { suppliers, isLoading, isRefreshing, error, loadSuppliers, refreshSuppliers } = useSuppliers();
    const [searchQuery, setSearchQuery] = useState('');
    const [isInitializing, setIsInitializing] = useState(true);
    const [visibleCount, setVisibleCount] = useState(10);
    const [isLoadMore, setIsLoadMore] = useState(false);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;
            const initialize = async () => {
                setIsInitializing(true);
                try {
                    await Promise.all([
                        loadSuppliers(),
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
        }, [loadSuppliers])
    );

    const filteredData = useMemo(() => {
        if (!searchQuery) return suppliers;
        const query = searchQuery.toLowerCase();
        return suppliers.filter(item =>
            item.nm_suppliers?.toLowerCase().includes(query) ||
            item.id_suppliers?.toString().toLowerCase().includes(query) ||
            (item.suppliers_email && item.suppliers_email.toLowerCase().includes(query))
        );
    }, [suppliers, searchQuery]);

    useEffect(() => {
        setVisibleCount(10);
    }, [searchQuery, suppliers]);

    const handleLoadMore = useCallback(() => {
        if (visibleCount < filteredData.length && !isLoadMore) {
            setIsLoadMore(true);
            setTimeout(() => {
                setVisibleCount(prev => prev + 10);
                setIsLoadMore(false);
            }, 600);
        }
    }, [visibleCount, filteredData.length, isLoadMore]);

    const onRefresh = useCallback(() => {
        refreshSuppliers();
    }, [refreshSuppliers]);

    const navigateToDetail = (id: string) => {
        navigation.navigate('SuppliersEditScreen', { id });
    };

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-gray-50"
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <HeaderNavigator title="SUPPLIERS" />

            <View className="px-4 py-3">
                <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-4 py-3.5 shadow-sm">
                    <Search size={20} color="#9CA3AF" />
                    <TextInput
                        placeholder="Cari nama, ID, atau email..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        className="flex-1 ml-3 text-sm text-gray-800 p-0"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>
            </View>

            <FlatList
                className="flex-1"
                data={(isLoading || isInitializing || isRefreshing) ? [] : filteredData.slice(0, visibleCount)}
                keyExtractor={(item) => item.id_suppliers?.toString()}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                renderItem={({ item, index }) => (
                    <SupplierCard
                        supplier={item}
                        index={index}
                        onPress={() => navigateToDetail(item.id_suppliers)}
                    />
                )}
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
                                title="Gagal Memuat Data"
                                message={error}
                                onRetry={loadSuppliers}
                                fullScreen={true}
                            />
                        );
                    }
                    if (isLoading || isInitializing || isRefreshing) {
                        return (
                            <View style={{ marginHorizontal: -16 }}>
                                <SuppliersSkeleton />
                            </View>
                        );
                    }
                    return (
                        <EmptyState
                            title="Data Kosong"
                            message="Tidak ada supplier yang ditemukan."
                            fullScreen={true}
                        />
                    );
                }}
            />
            {(!isLoading && !isInitializing && !isRefreshing) && (
                <ButtonAdd onPress={() => navigation.navigate('SuppliersFormScreen')} />
            )}
        </KeyboardAvoidingView>
    );
}
