import React, { useState, useCallback } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity, TextInput, RefreshControl, ActivityIndicator
} from 'react-native';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { Search, ChevronDown, X, Tag } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut, FadeInDown, FadeInUp, LinearTransition } from 'react-native-reanimated';
import { theme } from '../../../theme/theme';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { useProductPriceMkt } from '../hooks/useProductPriceMkt';
import { ProductPriceMktCard } from '../components/ProductPriceMktCard';
import { ProductPriceMktListSkeleton } from '../skeleton/ProductPriceMktSkeleton';
import { EmptyState } from '../../../components/shared/EmptyState';
import { ProductPriceMktProduct } from '../types/productpricemkt.types';

export function ProductPriceMktListScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const {
        products, selectedDetail, options, isLoading, isDetailLoading,
        loadProducts, loadDetail, resetDetail
    } = useProductPriceMkt();

    const [isInitializing, setIsInitializing] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductPriceMktProduct | null>(null);

    React.useEffect(() => {
        if (route.params?.timestamp) {
            setSelectedProduct(null);
            resetDetail();
            setSearchQuery('');
            setShowDropdown(false);
        }
    }, [route.params?.timestamp]);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const initialize = async () => {
                setIsInitializing(true);
                try {
                    await Promise.all([
                        loadProducts(),
                        new Promise(resolve => setTimeout(resolve, 600))
                    ]);
                } catch (e) {
                    // console.log(e);
                } finally {
                    if (isActive) setIsInitializing(false);
                }
            };

            initialize();

            return () => {
                isActive = false;
                setIsInitializing(true);
            };
        }, [])
    );

    const handleRefresh = async () => {
        await loadProducts();
        if (selectedProduct) {
            await loadDetail(selectedProduct.id_product);
        }
    };

    const filteredProducts = products.filter(p =>
        p.nm_product.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code_product.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelectProduct = async (product: ProductPriceMktProduct) => {
        setSelectedProduct(product);
        setShowDropdown(false);
        setSearchQuery('');
        await loadDetail(product.id_product);
    };

    const handleClearSelection = () => {
        setSelectedProduct(null);
        resetDetail();
        setSearchQuery('');
    };

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator title="PRODUCT PRICE MKT" />

            {/* Search / Dropdown */}
            <Animated.View entering={FadeInUp.duration(400)} className="px-6 pt-5 pb-2 z-50" style={{ zIndex: 50, elevation: 50 }}>
                <View className="z-50" style={{ zIndex: 50, elevation: 50 }}>
                    {/* Dropdown Trigger */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => setShowDropdown(prev => !prev)}
                        className="bg-white flex-row items-center px-4 h-12 rounded-xl border border-gray-200"
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.05,
                            shadowRadius: 4,
                            elevation: 2,
                        }}
                    >
                        <Tag color={theme.colors.primary} size={18} />
                        <Text
                            className="flex-1 ml-2 text-sm"
                            style={{ color: selectedProduct ? '#111827' : '#9CA3AF' }}
                            numberOfLines={1}
                        >
                            {selectedProduct ? `${selectedProduct.code_product} – ${selectedProduct.nm_product}` : 'Pilih Produk...'}
                        </Text>
                        {selectedProduct ? (
                            <TouchableOpacity onPress={handleClearSelection} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                <X color="#9CA3AF" size={18} />
                            </TouchableOpacity>
                        ) : (
                            <ChevronDown color="#9CA3AF" size={18} />
                        )}
                    </TouchableOpacity>

                    {/* Dropdown List */}
                    {showDropdown && (
                        <Animated.View
                            entering={FadeIn.duration(200)}
                            exiting={FadeOut.duration(150)}
                            className="absolute top-14 left-0 right-0 bg-white rounded-2xl border border-gray-200 z-50"
                            style={{
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.12,
                                shadowRadius: 12,
                                elevation: 10,
                                maxHeight: 280,
                            }}
                        >
                            {/* Search inside dropdown */}
                            <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
                                <Search color="#9CA3AF" size={16} />
                                <TextInput
                                    className="flex-1 ml-2 text-sm text-gray-900"
                                    placeholder="Cari kode atau nama produk..."
                                    placeholderTextColor="#9CA3AF"
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                    autoFocus
                                />
                            </View>
                            {/* Options */}
                            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 210 }}>
                                {isInitializing ? (
                                    <ActivityIndicator size="small" color={theme.colors.primary} style={{ margin: 16 }} />
                                ) : filteredProducts.length === 0 ? (
                                    <Text className="text-center text-gray-400 text-sm py-4">Produk tidak ditemukan</Text>
                                ) : (
                                    filteredProducts.map((product, index) => (
                                        <TouchableOpacity
                                            key={product.id_product}
                                            onPress={() => handleSelectProduct(product)}
                                            activeOpacity={0.7}
                                            className={`px-4 py-3 ${index < filteredProducts.length - 1 ? 'border-b border-gray-50' : ''}`}
                                        >
                                            <Text className="text-sm font-semibold text-gray-800" numberOfLines={1}>
                                                {product.code_product}
                                            </Text>
                                            <Text className="text-xs text-gray-500 mt-0.5" numberOfLines={1}>
                                                {product.nm_product}
                                            </Text>
                                        </TouchableOpacity>
                                    ))
                                )}
                            </ScrollView>
                        </Animated.View>
                    )}
                </View>
            </Animated.View>

            {/* Content */}
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 24, paddingTop: 8, paddingBottom: 40, flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading && !isInitializing}
                        onRefresh={handleRefresh}
                        colors={[theme.colors.primary]}
                    />
                }
            >
                {isInitializing ? (
                    <Animated.View exiting={FadeOut.duration(300)}>
                        <ProductPriceMktListSkeleton />
                    </Animated.View>
                ) : !selectedProduct ? (
                    <Animated.View entering={FadeIn.delay(300)} className="items-center justify-center mt-16">
                        <View className="w-24 h-24 rounded-full items-center justify-center mb-4" style={{ backgroundColor: theme.colors.primaryContainer }}>
                            <Tag color={theme.colors.primary} size={40} />
                        </View>
                        <Text className="text-lg font-bold text-gray-800 mb-2">Pilih Produk</Text>
                        <Text className="text-sm text-gray-500 text-center px-10">
                            Pilih produk dari dropdown di atas untuk melihat informasi harga marketing.
                        </Text>
                    </Animated.View>
                ) : isDetailLoading ? (
                    <Animated.View entering={FadeIn.duration(200)}>
                        <ProductPriceMktListSkeleton />
                    </Animated.View>
                ) : selectedDetail ? (
                    <Animated.View entering={FadeInDown.duration(400)}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => navigation.navigate('ProductPriceMktDetailScreen', { id_product: selectedProduct?.id_product })}
                        >
                            <ProductPriceMktCard detail={selectedDetail} options={options} />
                        </TouchableOpacity>
                    </Animated.View>
                ) : (
                    <EmptyState
                        title="Data Tidak Ditemukan"
                        message="Tidak ada data harga untuk produk yang dipilih."
                        fullScreen={false}
                    />
                )}
            </ScrollView>
        </View>
    );
}
