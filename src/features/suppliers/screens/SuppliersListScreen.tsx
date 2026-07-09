import React, { useState, useMemo, useCallback } from 'react';
import { View, TextInput, FlatList, RefreshControl } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { theme } from '../../../theme/theme';
import { Search, Building2 } from 'lucide-react-native';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';
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
            item.nm_suppliers.toLowerCase().includes(query) ||
            item.id_suppliers.toLowerCase().includes(query) ||
            (item.suppliers_email && item.suppliers_email.toLowerCase().includes(query))
        );
    }, [suppliers, searchQuery]);

    const onRefresh = useCallback(() => {
        refreshSuppliers();
    }, [refreshSuppliers]);

    const navigateToDetail = (id: string) => {
        navigation.navigate('SuppliersEditScreen', { id });
    };

    return (
        <View className="flex-1 bg-gray-50">
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

            <View className="flex-1">
                <FlatList
                    data={(isLoading || isInitializing || isRefreshing) ? [] : filteredData}
                    keyExtractor={(item) => item.id_suppliers}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100, flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => (
                        <Animated.View entering={FadeInDown.delay(index * 50).springify()}>
                            <SupplierCard
                                supplier={item}
                                onPress={() => navigateToDetail(item.id_suppliers)}
                            />
                        </Animated.View>
                    )}
                    refreshControl={
                        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
                    }
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
                                    <Animated.View exiting={FadeOut.duration(300)}>
                                        <SuppliersSkeleton />
                                    </Animated.View>
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
            </View>

            {(!isLoading && !isInitializing && !isRefreshing) && (
                <ButtonAdd onPress={() => navigation.navigate('SuppliersFormScreen')} />
            )}
        </View>
    );
}
