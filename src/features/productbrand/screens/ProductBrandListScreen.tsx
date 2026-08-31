import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Search } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useProductBrands } from '../hooks/useProductBrands';
import { ProductBrandCard } from '../components/ProductBrandCard';
import { ProductBrandListSkeleton } from '../skeleton/ProductBrandListSkeleton';
import { theme } from '../../../theme/theme';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { ButtonAdd } from '../../../components/ui/buttonAdd';
import { ErrorState } from '../../../components/shared/ErrorState';
import { EmptyState } from '../../../components/shared/EmptyState';

export function ProductBrandListScreen() {
    const navigation = useNavigation<any>();
    const { brands, isLoading, error, successMessage, searchQuery, setSearchQuery, refreshData, dismissSuccess, dismissError } = useProductBrands();

    const [isInitializing, setIsInitializing] = useState(true);
    const [visibleCount, setVisibleCount] = useState(10);
    const [isLoadMore, setIsLoadMore] = useState(false);

    useEffect(() => {
        setVisibleCount(10);
    }, [searchQuery, brands?.length]);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const initialize = async () => {
                if (brands?.length === 0) {
                    setIsInitializing(true);
                }

                try {
                    await refreshData();
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
            };
        }, [brands?.length])
    );
    const [selectedBrandIds, setSelectedBrandIds] = useState<string[]>([]);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        if ((!isLoading && !isInitializing)) {
            setIsRefreshing(false);
        }
    }, [isLoading]);

    const handleRefresh = () => {
        setIsRefreshing(true);
        setVisibleCount(10);
        refreshData();
    };

    const handleLoadMore = useCallback(() => {
        if (visibleCount < brands.length && !isLoadMore) {
            setIsLoadMore(true);
            setTimeout(() => {
                setVisibleCount(prev => prev + 10);
                setIsLoadMore(false);
            }, 600);
        }
    }, [visibleCount, brands.length, isLoadMore]);

    useEffect(() => {
        if (successMessage) {
            Alert.alert('Sukses', successMessage, [{ text: 'OK', onPress: dismissSuccess }]);
        }
        if (error) {
            Alert.alert('Error', error, [{ text: 'OK', onPress: dismissError }]);
        }
    }, [successMessage, error, dismissSuccess, dismissError]);

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator title="PRODUK BRAND" />

            <Animated.View entering={FadeInUp.duration(400)} className="px-6 pt-6 pb-2">
                <View className="flex-row items-center justify-between">
                    <View className="flex-1 bg-white flex-row items-center px-4 h-12 rounded-xl border border-gray-200 mb-2 shadow-sm">
                        <Search color="#9ca3af" size={20} />
                        <TextInput
                            className="flex-1 ml-2 text-gray-900 h-full"
                            placeholder="Cari brand..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholderTextColor="#9ca3af"
                        />
                    </View>
                </View>
            </Animated.View>

            <View className="flex-1">
                <FlatList
                    data={isInitializing ? [] : (brands || []).slice(0, visibleCount)}
                    keyExtractor={(item) => String(item?.id_product_brand)}
                    renderItem={({ item, index }) => (
                        <ProductBrandCard
                            brand={item}
                            index={index}
                            isSelected={selectedBrandIds.includes(String(item.id_product_brand))}
                            onPress={() => {
                                const idStr = String(item.id_product_brand);
                                if (selectedBrandIds.length > 0) {
                                    if (selectedBrandIds.includes(idStr)) {
                                        setSelectedBrandIds(prev => prev.filter(id => id !== idStr));
                                    } else {
                                        setSelectedBrandIds(prev => [...prev, idStr]);
                                    }
                                } else {
                                    navigation.navigate('ProductBrandEdit', { id: idStr });
                                }
                            }}
                            onLongPress={() => {
                                const idStr = String(item.id_product_brand);
                                if (!selectedBrandIds.includes(idStr)) {
                                    setSelectedBrandIds(prev => [...prev, idStr]);
                                }
                            }}
                        />
                    )}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100, flexGrow: 1 }}
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
                                    title="Gagal Memuat Merek"
                                    message={error}
                                    onRetry={refreshData}
                                    fullScreen={true}
                                />
                            );
                        }
                        if (isLoading || isInitializing) {
                            return (
                                <View style={{ marginHorizontal: -16 }}>
                                    <ProductBrandListSkeleton />
                                </View>
                            );
                        }
                        return (
                            <EmptyState
                                title="Data Kosong"
                                message="Tidak ada merek produk yang ditemukan."
                                fullScreen={true}
                            />
                        );
                    }}
                />
            </View>

            {(!isLoading && !isInitializing) && !error && (
                <ButtonAdd onPress={() => navigation.navigate('ProductBrandForm')} />
            )}
        </View>
    );
}
