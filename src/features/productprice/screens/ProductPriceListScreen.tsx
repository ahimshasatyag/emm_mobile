import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Plus, Search, FileUp, RefreshCcw, Copy, Edit } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp, FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { useProductPrice } from '../hooks/useProductPrice';
import { ProductPriceCard } from '../components/ProductPriceCard';
import { ProductPriceListSkeleton } from '../skeleton/ProductPriceListSkeleton';
import { theme } from '../../../theme/theme';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { SpeedDial } from '../../../components/ui/SpeedDial';
import { ErrorState } from '../../../components/shared/ErrorState';
import { EmptyState } from '../../../components/shared/EmptyState';
import { ProductPrice } from '../types/productprice.types';

export function ProductPriceListScreen() {
    const navigation = useNavigation<any>();
    const { prices, isLoading, error, loadPrices } = useProductPrice();

    const [isInitializing, setIsInitializing] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const initialize = async () => {
                setIsInitializing(true);
                try {
                    await Promise.all([
                        loadPrices(),
                        new Promise(resolve => setTimeout(resolve, 800))
                    ]);
                } catch (e) {
                    // console.log(e);
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

    const filteredPrices = prices.filter((item: ProductPrice) => {
        const q = searchQuery.toLowerCase();
        return (
            item.nm_product?.toLowerCase().includes(q) ||
            item.code_product?.toLowerCase().includes(q) ||
            item.nm_product_brand?.toLowerCase().includes(q)
        );
    });

    const handleRefresh = async () => {
        await loadPrices();
    };

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator title="PRODUCT PRICE" />

            <Animated.View entering={FadeInUp.duration(400)} className="px-6 pt-6 pb-2">
                <Animated.View layout={LinearTransition.springify()} className="flex-row items-center justify-between">
                    <Animated.View layout={LinearTransition.springify()} className="flex-1 bg-white flex-row items-center px-4 h-12 rounded-xl border border-gray-200 mb-2 overflow-hidden">
                        <Search color="#9ca3af" size={20} />
                        <TextInput
                            className="flex-1 ml-2 text-gray-900"
                            placeholder="Cari nama atau kode produk..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholderTextColor="#9ca3af"
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                        />
                    </Animated.View>
                    {selectedIds.length > 0 && (
                        <Animated.View
                            entering={FadeIn.duration(200)}
                            exiting={FadeOut.duration(200)}
                            layout={LinearTransition.springify()}
                            className="ml-2 mb-2"
                        >
                            <TouchableOpacity
                                className="h-12 px-4 rounded-xl items-center justify-center flex-row shadow-sm"
                                style={{ backgroundColor: theme.colors.primary }}
                                onPress={() => {
                                    navigation.navigate('ProductPriceMultiple', { ids: selectedIds });
                                    setSelectedIds([]);
                                }}
                            >
                                <Edit color="white" size={18} />
                                {!isSearchFocused && (
                                    <Animated.Text entering={FadeIn.duration(200)} exiting={FadeOut.duration(200)} className="text-white font-bold text-xs ml-2" numberOfLines={1}>
                                        Multiple Update ({selectedIds.length})
                                    </Animated.Text>
                                )}
                            </TouchableOpacity>
                        </Animated.View>
                    )}
                </Animated.View>
            </Animated.View>

            <View className="flex-1">
                <Animated.FlatList
                    entering={FadeInDown}
                    data={(isLoading || isInitializing) ? [] : filteredPrices}
                    keyExtractor={(item) => item.id_product}
                    renderItem={({ item, index }) => (
                        <ProductPriceCard
                            item={item}
                            index={index}
                            isSelected={selectedIds.includes(item.id_product)}
                            onPress={() => {
                                if (selectedIds.length > 0) {
                                    setSelectedIds(prev =>
                                        prev.includes(item.id_product)
                                            ? prev.filter(id => id !== item.id_product)
                                            : [...prev, item.id_product]
                                    );
                                } else {
                                    navigation.navigate('ProductPriceEdit', { id: item.id_product });
                                }
                            }}
                            onLongPress={() => {
                                if (!selectedIds.includes(item.id_product)) {
                                    setSelectedIds(prev => [...prev, item.id_product]);
                                }
                            }}
                        />
                    )}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100, flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={isLoading && !isInitializing} onRefresh={handleRefresh} colors={[theme.colors.primary]} />
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
                        if (isLoading || isInitializing) {
                            return (
                                <View style={{ marginHorizontal: -16 }}>
                                    <ProductPriceListSkeleton />
                                </View>
                            );
                        }
                        return (
                            <EmptyState
                                title="Data Harga Kosong"
                                message="Tidak ada data harga produk yang ditemukan."
                                fullScreen={true}
                            />
                        );
                    }}
                />
            </View>

            {(!isLoading && !isInitializing) && !error && (
                <SpeedDial
                    actions={[
                        {
                            icon: <Plus color="white" size={20} />,
                            label: "Tambah Harga",
                            onPress: () => navigation.navigate('ProductPriceForm')
                        },
                        {
                            icon: <FileUp color="white" size={20} />,
                            label: "Upload Data",
                            onPress: () => navigation.navigate('ProductPriceUpload')
                        },
                        {
                            icon: <RefreshCcw color="white" size={20} />,
                            label: "KURS",
                            onPress: () => navigation.navigate('ProductPriceKurs')
                        }
                    ]}
                />
            )}
        </View>
    );
}
