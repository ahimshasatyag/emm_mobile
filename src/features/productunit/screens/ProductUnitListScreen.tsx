import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, RefreshControl, TextInput, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Search } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useProductUnits } from '../hooks/useProductUnits';
import { ProductUnitCard } from '../components/ProductUnitCard';
import { ProductUnitListSkeleton } from '../skeleton/ProductUnitListSkeleton';
import { theme } from '../../../theme/theme';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { ButtonAdd } from '../../../components/ui/buttonAdd';
import { ErrorState } from '../../../components/shared/ErrorState';
import { EmptyState } from '../../../components/shared/EmptyState';

export function ProductUnitListScreen() {
    const navigation = useNavigation<any>();
    const { units, isLoading, error, searchQuery, setSearchQuery, loadUnits, dismissError } = useProductUnits();

    const [isInitializing, setIsInitializing] = useState(true);
    const [visibleCount, setVisibleCount] = useState(10);
    const [isLoadMore, setIsLoadMore] = useState(false);

    useEffect(() => {
        setVisibleCount(10);
    }, [searchQuery, units]);

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
    const [selectedUnitIds, setSelectedUnitIds] = useState<string[]>([]);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        if ((!isLoading && !isInitializing)) {
            setIsRefreshing(false);
        }
    }, [isLoading]);

    const handleRefresh = () => {
        setIsRefreshing(true);
        setVisibleCount(10);
        loadUnits();
    };

    useEffect(() => {
        if (error) {
            // Alert.alert('Error', error, [{ text: 'OK', onPress: dismissError }]);
        }
    }, [error, dismissError]);

    useEffect(() => {
        loadUnits();
    }, [loadUnits]);

    const handleLoadMore = useCallback(() => {
        if (visibleCount < units.length && !isLoadMore) {
            setIsLoadMore(true);
            setTimeout(() => {
                setVisibleCount(prev => prev + 10);
                setIsLoadMore(false);
            }, 600);
        }
    }, [visibleCount, units.length, isLoadMore]);

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator title="SATUAN PRODUK" />

            <Animated.View entering={FadeInUp.duration(400)} className="px-6 pt-6 pb-2">
                <View className="flex-row items-center justify-between">
                    <View className="flex-1 bg-white flex-row items-center px-4 h-12 rounded-xl border border-gray-200 mb-2">
                        <Search color="#9ca3af" size={20} />
                        <TextInput
                            className="flex-1 ml-2 text-gray-900"
                            placeholder="Cari satuan..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                </View>
            </Animated.View>

            <Animated.View entering={FadeInDown} className="flex-1">
                <FlatList
                    data={(isLoading || isInitializing) ? [] : (units || []).slice(0, visibleCount)}
                    keyExtractor={(item) => String(item?.id_product_satuan)}
                    renderItem={({ item, index }) => (
                        <ProductUnitCard
                            unit={item}
                            index={index}
                            isSelected={selectedUnitIds.includes(String(item.id_product_satuan))}
                            onPress={() => {
                                const idStr = String(item.id_product_satuan);
                                if (selectedUnitIds.length > 0) {
                                    if (selectedUnitIds.includes(idStr)) {
                                        setSelectedUnitIds(prev => prev.filter(id => id !== idStr));
                                    } else {
                                        setSelectedUnitIds(prev => [...prev, idStr]);
                                    }
                                } else {
                                    navigation.navigate('ProductUnitEdit', { id: idStr });
                                }
                            }}
                            onLongPress={() => {
                                const idStr = String(item.id_product_satuan);
                                if (!selectedUnitIds.includes(idStr)) {
                                    setSelectedUnitIds(prev => [...prev, idStr]);
                                }
                            }}
                        />
                    )}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100, flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    refreshControl={
                        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} colors={[theme.colors.primary]} />
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
                                    title="Gagal Memuat Satuan"
                                    message={error}
                                    onRetry={loadUnits}
                                    fullScreen={true}
                                />
                            );
                        }
                        if (isLoading || isInitializing) {
                            return (
                                <View style={{ marginHorizontal: -16 }}>
                                    <ProductUnitListSkeleton />
                                </View>
                            );
                        }
                        return (
                            <EmptyState
                                title="Data Kosong"
                                message="Tidak ada satuan produk yang ditemukan."
                                fullScreen={true}
                            />
                        );
                    }}
                />
            </Animated.View>

            {(!isLoading && !isInitializing) && !error && (
                <ButtonAdd onPress={() => navigation.navigate('ProductUnitForm')} />
            )}
        </View>
    );
}
