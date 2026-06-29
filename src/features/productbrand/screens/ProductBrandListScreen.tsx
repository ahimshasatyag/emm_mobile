import React, { useState, useEffect , useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, TextInput, Alert } from 'react-native';
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
    const [selectedBrandIds, setSelectedBrandIds] = useState<string[]>([]);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        if ((!isLoading && !isInitializing)) {
            setIsRefreshing(false);
        }
    }, [isLoading]);

    const handleRefresh = () => {
        setIsRefreshing(true);
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

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator title="MEREK PRODUK" />

            <Animated.View entering={FadeInUp.duration(400)} className="px-6 pt-6 pb-2">
                <View className="flex-row items-center justify-between">
                    <View className="flex-1 bg-white flex-row items-center px-4 h-12 rounded-xl border border-gray-200 mb-2">
                        <Search color="#9ca3af" size={20} />
                        <TextInput
                            className="flex-1 ml-2 text-gray-900"
                            placeholder="Cari merek..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                </View>
            </Animated.View>

            <View className="flex-1">
                <Animated.FlatList
                    entering={FadeInDown}
                    data={(isLoading || isInitializing) ? [] : brands}
                    keyExtractor={(item) => item.id_product_brand}
                    renderItem={({ item, index }) => (
                        <ProductBrandCard
                            brand={item}
                            index={index}
                            isSelected={selectedBrandIds.includes(item.id_product_brand)}
                            onPress={() => {
                                if (selectedBrandIds.length > 0) {
                                    if (selectedBrandIds.includes(item.id_product_brand)) {
                                        setSelectedBrandIds(prev => prev.filter(id => id !== item.id_product_brand));
                                    } else {
                                        setSelectedBrandIds(prev => [...prev, item.id_product_brand]);
                                    }
                                } else {
                                    navigation.navigate('ProductBrandEdit', { id: item.id_product_brand });
                                }
                            }}
                            onLongPress={() => {
                                if (!selectedBrandIds.includes(item.id_product_brand)) {
                                    setSelectedBrandIds(prev => [...prev, item.id_product_brand]);
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
