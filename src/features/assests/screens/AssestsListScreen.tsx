import React, { useState, useMemo, useCallback } from 'react';
import { View, TextInput, FlatList, RefreshControl } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { theme } from '../../../theme/theme';
import { Search } from 'lucide-react-native';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';
import { useAssests } from '../hooks/useAssests';
import { AssestListCard } from '../components/AssestListCard';
import { AssestSkeleton } from '../skeleton/AssestSkeleton';
import { EmptyState } from '../../../components/shared/EmptyState';
import { ErrorState } from '../../../components/shared/ErrorState';
import { ButtonAdd } from '../../../components/ui/buttonAdd';

export function AssestsListScreen() {
    const navigation = useNavigation<any>();
    const { items, isLoading, error, handleRefresh } = useAssests();
    const [searchQuery, setSearchQuery] = useState('');
    const [isInitializing, setIsInitializing] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

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
                    if (isActive) setIsInitializing(false);
                }
            };
            initialize();
            return () => {
                isActive = false;
                setIsInitializing(true);
            };
        }, [handleRefresh])
    );

    const filteredData = useMemo(() => {
        if (!searchQuery) return items;
        const query = searchQuery.toLowerCase();
        return items.filter(item => 
            item.name.toLowerCase().includes(query) ||
            item.inventory_number.toLowerCase().includes(query)
        );
    }, [items, searchQuery]);

    const onRefresh = useCallback(async () => {
        setIsRefreshing(true);
        try {
            await handleRefresh();
        } finally {
            setIsRefreshing(false);
        }
    }, [handleRefresh]);

    const navigateToDetail = (id: string, item: any) => {
        navigation.navigate('AssestsEditScreen', { assetId: id, asset: item });
    };

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator title="ASSET MANAGEMENT" />

            <View className="px-4 py-3">
                <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-4 py-3.5 shadow-sm">
                    <Search size={20} color="#9CA3AF" />
                    <TextInput
                        placeholder="Cari nama atau nomor asset..."
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
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100, flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => (
                        <Animated.View entering={FadeInDown.delay(index * 50).springify()}>
                            <AssestListCard
                                item={item}
                                onPress={() => navigateToDetail(item.id, item)}
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
                                    onRetry={handleRefresh}
                                    fullScreen={true}
                                />
                            );
                        }
                        if (isLoading || isInitializing || isRefreshing) {
                            return (
                                <View style={{ marginHorizontal: -16 }}>
                                    <Animated.View exiting={FadeOut.duration(300)}>
                                        <AssestSkeleton />
                                    </Animated.View>
                                </View>
                            );
                        }
                        return (
                            <EmptyState
                                title="Data Kosong"
                                message="Tidak ada asset yang ditemukan."
                                fullScreen={true}
                            />
                        );
                    }}
                />
            </View>

            {(!isLoading && !isInitializing && !isRefreshing) && (
                <ButtonAdd onPress={() => navigation.navigate('AssestFormScreen', { mode: 'add' })} />
            )}
        </View>
    );
}
