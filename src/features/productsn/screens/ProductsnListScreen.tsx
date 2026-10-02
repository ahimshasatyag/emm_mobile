import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, RefreshControl, FlatList, TextInput, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Search } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut, FadeInUp, LinearTransition } from 'react-native-reanimated';
import { theme } from '../../../theme/theme';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { useProductsn } from '../hooks/useProductsn';
import { ProductsnCard } from '../components/ProductsnCard';
import { ProductsnListSkeleton } from '../skeleton/ProductsnListSkeleton';
import { ButtonAdd } from '../../../components/ui/buttonAdd';
import { ErrorState } from '../../../components/shared/ErrorState';
import { EmptyState } from '../../../components/shared/EmptyState';

export function ProductsnListScreen() {
    const navigation = useNavigation<any>();
    const { productSns, isLoading, error, fetchInitialData } = useProductsn();

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
                    await fetchInitialData();
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

    const filteredProductSns = (productSns || []).filter(item => {
        const productName = item.product?.nm_product?.toLowerCase() || '';
        const productCode = item.product?.code_product?.toLowerCase() || '';
        const sn = item.sn?.toLowerCase() || '';
        const search = searchQuery.toLowerCase();

        return productName.includes(search) || productCode.includes(search) || sn.includes(search);
    });

    useEffect(() => {
        setVisibleCount(10);
    }, [searchQuery, productSns]);

    const handleLoadMore = useCallback(() => {
        if (productSns && visibleCount < filteredProductSns.length && !isLoadMore) {
            setIsLoadMore(true);
            setTimeout(() => {
                setVisibleCount(prev => prev + 10);
                setIsLoadMore(false);
            }, 600);
        }
    }, [visibleCount, filteredProductSns.length, isLoadMore, productSns]);

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator title="SERIAL NUMBER" />

            <Animated.View entering={FadeInUp.duration(400)} className="px-6 pt-6 pb-2">
                <View className="flex-row items-center justify-between">
                    <View className="flex-1 bg-white flex-row items-center px-4 h-12 rounded-xl border border-gray-200 shadow-sm">
                        <Search color="#9CA3AF" size={20} />
                        <TextInput
                            className="flex-1 ml-2 text-gray-900 h-full"
                            placeholder="Search by SN or Product..."
                            placeholderTextColor="#9CA3AF"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                </View>
            </Animated.View>

            <View className="flex-1">
                <FlatList
                    data={(isLoading || isInitializing || !productSns) ? [] : filteredProductSns.slice(0, visibleCount)}
                    keyExtractor={(item) => String(item.id_product_sn)}
                    renderItem={({ item, index }) => (
                        <ProductsnCard
                            item={item}
                            index={index}
                            onPress={() => navigation.navigate('InventoryEdit', { id: item.id_product_sn })}
                        />
                    )}
                    contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100, flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    refreshControl={
                        <RefreshControl refreshing={isLoading && !isInitializing} onRefresh={fetchInitialData} colors={[theme.colors.primary]} />
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
                                    title="Gagal Memuat Product SN"
                                    message={error}
                                    onRetry={fetchInitialData}
                                    fullScreen={true}
                                />
                            );
                        }
                        if (isLoading || isInitializing) {
                            return (
                                <View style={{ marginHorizontal: -24 }}>
                                    <ProductsnListSkeleton />
                                </View>
                            );
                        }
                        return (
                            <EmptyState
                                title="Data Tidak Ditemukan"
                                message={searchQuery ? `Tidak ada Product SN yang cocok dengan "${searchQuery}"` : "Belum ada data Product SN."}
                                fullScreen={true}
                            />
                        );
                    }}
                />
            </View>

            {(!isLoading && !isInitializing) && !error && (
                <ButtonAdd onPress={() => navigation.navigate('InventoryForm')} />
            )}
        </View>
    );
}
