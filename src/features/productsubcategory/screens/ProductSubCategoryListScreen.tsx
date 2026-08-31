import React, { useEffect, useCallback, useState, useMemo } from 'react';
import { View, Text, FlatList, TextInput, RefreshControl, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Search } from 'lucide-react-native';
import { useProductSubCategories } from '../hooks/useProductSubCategories';
import { ProductSubCategoryCard } from '../components/ProductSubCategoryCard';
import { ProductSubCategoryListSkeleton } from '../skeleton/ProductSubCategoryListSkeleton';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { ErrorState } from '../../../components/shared/ErrorState';
import { EmptyState } from '../../../components/shared/EmptyState';
import { theme } from '../../../theme/theme';
import { ButtonAdd } from '../../../components/ui/buttonAdd';
import Animated, { FadeInUp } from 'react-native-reanimated';

export function ProductSubCategoryListScreen() {
    const navigation = useNavigation<any>();
    const { 
        subCategories, 
        isLoading, 
        error,
        searchQuery, 
        setSearchQuery, 
        loadSubCategories,
        clearStatusMessages
    } = useProductSubCategories();

    const [isInitializing, setIsInitializing] = useState(true);
    const [visibleCount, setVisibleCount] = useState(10);
    const [isLoadMore, setIsLoadMore] = useState(false);

    useEffect(() => {
        setVisibleCount(10);
    }, [searchQuery, subCategories]);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const initialize = async () => {
                setIsInitializing(true);
                try {
                    await Promise.all([
                        onRefresh(),
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
    
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        if ((!isLoading && !isInitializing)) {
            setIsRefreshing(false);
        }
    }, [isLoading]);

    useEffect(() => {
        loadSubCategories();
    }, []);

    useFocusEffect(
        useCallback(() => {
            clearStatusMessages();
        }, [])
    );

    const onRefresh = () => {
        setIsRefreshing(true);
        setVisibleCount(10);
        loadSubCategories();
    };

    const handleLoadMore = useCallback(() => {
        if (visibleCount < subCategories.length && !isLoadMore) {
            setIsLoadMore(true);
            setTimeout(() => {
                setVisibleCount(prev => prev + 10);
                setIsLoadMore(false);
            }, 600);
        }
    }, [visibleCount, subCategories.length, isLoadMore]);

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <HeaderNavigator title="SUB KATEGORI PRODUK" isLoading={isLoading} />

            <Animated.View entering={FadeInUp.duration(400)} className="px-6 pt-6 pb-2">
                <View className="flex-row items-center justify-between">
                    <View className="flex-1 bg-white flex-row items-center px-4 h-12 rounded-xl border border-gray-200 mb-2 shadow-sm">
                        <Search color="#9ca3af" size={20} />
                        <TextInput
                            className="flex-1 ml-2 text-gray-900 h-full"
                            placeholder="Cari sub kategori..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholderTextColor="#9ca3af"
                        />
                    </View>
                </View>
            </Animated.View>

            <View className="flex-1">
                <FlatList
                    data={(isLoading || isInitializing) ? [] : subCategories.slice(0, visibleCount)}
                    keyExtractor={(item) => String(item.id_product_sub_kategori)}
                    renderItem={({ item, index }) => (
                        <ProductSubCategoryCard
                            subCategory={item}
                            index={index}
                            onPress={() => navigation.navigate('ProductSubCategoryEdit', { id: item.id_product_sub_kategori })}
                        />
                    )}
                    contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100, flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
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
                                    onRetry={onRefresh}
                                    fullScreen={true}
                                />
                            );
                        }
                        if (isLoading || isInitializing) {
                            return (
                                <View style={{ marginHorizontal: -24 }}>
                                    <ProductSubCategoryListSkeleton />
                                </View>
                            );
                        }
                        return (
                            <EmptyState
                                title="Data Kosong"
                                message="Belum ada sub kategori yang ditambahkan atau tidak sesuai pencarian."
                                fullScreen={true}
                            />
                        );
                    }}
                />
            </View>

            {(!isLoading && !isInitializing) && !error && (
                <ButtonAdd onPress={() => navigation.navigate('ProductSubCategoryForm')} />
            )}
        </View>
    );
}
