import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Search } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useProductCategories } from '../hooks/useProductCategories';
import { ProductCategoryCard } from '../components/ProductCategoryCard';
import { ProductCategoryListSkeleton } from '../skeleton/ProductCategoryListSkeleton';
import { theme } from '../../../theme/theme';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { ButtonAdd } from '../../../components/ui/buttonAdd';
import { ErrorState } from '../../../components/shared/ErrorState';
import { EmptyState } from '../../../components/shared/EmptyState';

export function ProductCategoryListScreen() {
    const navigation = useNavigation<any>();
    const { categories, isLoading, error, successMessage, searchQuery, setSearchQuery, refreshData, editCategory, dismissSuccess, dismissError } = useProductCategories();

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
                        refreshData(),
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
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<Array<string | number>>([]);
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

    useEffect(() => {
        if (successMessage) {
            Alert.alert('Sukses', successMessage, [{ text: 'OK', onPress: dismissSuccess }]);
        }
        if (error) {
            Alert.alert('Error', error, [{ text: 'OK', onPress: dismissError }]);
        }
    }, [successMessage, error, dismissSuccess, dismissError]);

    const handleToggleStatus = () => {
        // Feature removed as category has no status
    };

    const handleLoadMore = useCallback(() => {
        if (categories && visibleCount < categories.length && !isLoadMore) {
            setIsLoadMore(true);
            setTimeout(() => {
                setVisibleCount(prev => prev + 10);
                setIsLoadMore(false);
            }, 600);
        }
    }, [visibleCount, categories?.length, isLoadMore, categories]);

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator title="KATEGORI PRODUK" />

            <Animated.View entering={FadeInUp.duration(400)} className="px-6 pt-6 pb-2">
                <View className="flex-row items-center justify-between">
                    <View className="flex-1 bg-white flex-row items-center px-4 h-12 rounded-xl border border-gray-200 mb-2 shadow-sm">
                        <Search color="#9ca3af" size={20} />
                        <TextInput
                            className="flex-1 ml-2 text-gray-900 h-full"
                            placeholder="Cari kategori..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholderTextColor="#9ca3af"
                        />
                    </View>
                </View>
            </Animated.View>

            <View className="flex-1">
                <FlatList
                    data={(isLoading || isInitializing) ? [] : (categories || []).slice(0, visibleCount)}
                    keyExtractor={(item) => String(item.id_product_kategori)}
                    renderItem={({ item, index }) => (
                        <ProductCategoryCard
                            category={item}
                            index={index}
                            isSelected={selectedCategoryIds.includes(item.id_product_kategori)}
                            onPress={() => {
                                if (selectedCategoryIds.length > 0) {
                                    if (selectedCategoryIds.includes(item.id_product_kategori)) {
                                        setSelectedCategoryIds(prev => prev.filter(id => id !== item.id_product_kategori));
                                    } else {
                                        setSelectedCategoryIds(prev => [...prev, item.id_product_kategori]);
                                    }
                                } else {
                                    navigation.navigate('ProductCategoryEdit', { id: item.id_product_kategori });
                                }
                            }}
                            onLongPress={() => {
                                if (!selectedCategoryIds.includes(item.id_product_kategori)) {
                                    setSelectedCategoryIds(prev => [...prev, item.id_product_kategori]);
                                }
                            }}
                        />
                    )}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100, flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} colors={[theme.colors.primary]} />
                    }
                    ListEmptyComponent={() => {
                        if (error) {
                            return (
                                <ErrorState
                                    title="Gagal Memuat Kategori"
                                    message={error}
                                    onRetry={refreshData}
                                    fullScreen={true}
                                />
                            );
                        }
                        if (isLoading || isInitializing) {
                            return (
                                <View style={{ marginHorizontal: -16 }}>
                                    <ProductCategoryListSkeleton />
                                </View>
                            );
                        }
                        return (
                            <EmptyState
                                title="Data Kosong"
                                message="Tidak ada kategori produk yang ditemukan."
                                fullScreen={true}
                            />
                        );
                    }}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={
                        isLoadMore ? (
                            <View className="py-4 items-center">
                                <ActivityIndicator size="small" color={theme.colors.primary} />
                            </View>
                        ) : null
                    }
                />
            </View>

            {(!isLoading && !isInitializing) && !error && (
                <ButtonAdd onPress={() => navigation.navigate('ProductCategoryForm')} />
            )}
        </View>
    );
}
