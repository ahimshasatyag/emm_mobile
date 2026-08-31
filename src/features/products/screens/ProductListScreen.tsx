import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Plus, Search, CheckCircle2, XCircle } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/ProductCard';
import { ProductListSkeleton } from '../skeleton/ProductListSkeleton';
import { theme } from '../../../theme/theme';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { SpeedDial } from '../../../components/ui/SpeedDial';
import { FileUp } from 'lucide-react-native';
import { ErrorState } from '../../../components/shared/ErrorState';
import { EmptyState } from '../../../components/shared/EmptyState';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';
import { ToastMessages } from '../../../components/ui/ToastMessages';
import { productsApi } from '../api/products.api';

export function ProductListScreen() {
    const navigation = useNavigation<any>();
    const { products, isLoading, error, searchQuery, setSearchQuery, refreshData } = useProducts();

    const [isInitializing, setIsInitializing] = useState(true);
    const [visibleCount, setVisibleCount] = useState(10);
    const [isLoadMore, setIsLoadMore] = useState(false);

    React.useEffect(() => {
        setVisibleCount(10);
    }, [searchQuery, products]);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const initialize = async () => {
                setIsInitializing(true);
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
                setIsInitializing(true);
            };
        }, [])
    );
    const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

    const firstSelectedProduct = products.find(p => p.id_product === selectedProductIds[0]);

    const [isModalConfirmVisible, setIsModalConfirmVisible] = useState(false);
    const [modalActionWord, setModalActionWord] = useState('');
    const [modalNewStatus, setModalNewStatus] = useState('');

    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const handleToggleStatus = () => {
        if (selectedProductIds.length === 0) return;
        const isCurrentlyInactive = String(firstSelectedProduct?.flag_active) === '0';
        const newStatus = isCurrentlyInactive ? '1' : '0';
        const actionWord = isCurrentlyInactive ? 'Mengaktifkan' : 'Menonaktifkan';

        setModalActionWord(actionWord);
        setModalNewStatus(newStatus);
        setIsModalConfirmVisible(true);
    };

    const confirmToggleStatus = async () => {
        setIsModalConfirmVisible(false);

        try {
            await Promise.all(
                selectedProductIds.map(id => {
                    const product = products.find(p => p.id_product === id);
                    if (product) {
                        const updatePayload: any = {
                            code_product: product.code_product,
                            nm_product: product.nm_product,
                            flag_active: modalNewStatus
                        };

                        if (product.id_product_kategori) updatePayload.id_product_kategori = product.id_product_kategori;
                        else if (product.kategori?.id_product_kategori) updatePayload.id_product_kategori = product.kategori.id_product_kategori;
                        
                        if (product.id_product_sub_kategori) updatePayload.id_product_sub_kategori = product.id_product_sub_kategori;
                        else if (product.sub_kategori?.id_product_sub_kategori) updatePayload.id_product_sub_kategori = product.sub_kategori.id_product_sub_kategori;
                        else if (product.subKategori?.id_product_sub_kategori) updatePayload.id_product_sub_kategori = product.subKategori.id_product_sub_kategori;
                        
                        if (product.id_product_brand) updatePayload.id_product_brand = String(product.id_product_brand);
                        else if (product.brand?.id_product_brand) updatePayload.id_product_brand = String(product.brand.id_product_brand);
                        else if (product.brand?.nm_product_brand) updatePayload.id_product_brand = String(product.brand.nm_product_brand);
                        
                        if (product.id_product_satuan) updatePayload.id_product_satuan = String(product.id_product_satuan);
                        else if (product.satuan?.id_product_satuan) updatePayload.id_product_satuan = String(product.satuan.id_product_satuan);
                        
                        if (product.product_deskripsi) updatePayload.product_deskripsi = product.product_deskripsi;
                        
                        if (product.product_refference) updatePayload.product_refference = product.product_refference;
                        
                        updatePayload.options = product.options || [];

                        return productsApi.updateProduct(id, updatePayload);
                    }
                    return Promise.resolve();
                })
            );
            
            refreshData();

            setToastMessage(`${selectedProductIds.length} produk berhasil di${modalActionWord.toLowerCase()}.`);
            setToastVisible(true);
            setSelectedProductIds([]);
        } catch (error: any) {
            console.error('Error toggling status:', error);
            Alert.alert("Gagal Menyimpan", JSON.stringify(error.response?.data?.message || error.message));
        }
    };

    const handleLoadMore = useCallback(() => {
        if (visibleCount < products.length && !isLoadMore) {
            setIsLoadMore(true);
            setTimeout(() => {
                setVisibleCount(prev => prev + 10);
                setIsLoadMore(false);
            }, 600);
        }
    }, [visibleCount, products.length, isLoadMore]);

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator title="DATA PRODUCT" />

            <ToastMessages
                visible={toastVisible}
                type="success"
                title="Success"
                message={toastMessage}
                onClose={() => setToastVisible(false)}
            />

            <ModalConfirm
                visible={isModalConfirmVisible}
                title="Konfirmasi"
                message={`Apakah Anda yakin ingin ${modalActionWord.toLowerCase()} ${selectedProductIds.length} produk terpilih?`}
                onCancel={() => setIsModalConfirmVisible(false)}
                onConfirm={confirmToggleStatus}
            />

            <Animated.View entering={FadeInUp.duration(400)} className="px-6 pt-6 pb-2">
                <View className="flex-row items-center justify-between">
                    <View className="flex-1 bg-white flex-row items-center px-4 h-12 rounded-xl border border-gray-200 mb-2 shadow-sm">
                        <Search color="#9ca3af" size={20} />
                        <TextInput
                            className="flex-1 ml-2 text-gray-900 h-full"
                            placeholder="Cari nama atau kode produk..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholderTextColor="#9ca3af"
                        />
                    </View>
                    {selectedProductIds.length > 0 && firstSelectedProduct && (
                        <TouchableOpacity
                            className={`ml-2 h-12 px-4 rounded-xl items-center justify-center flex-row shadow-sm mb-2 ${String(firstSelectedProduct.flag_active) === '0' ? 'bg-green-600' : 'bg-red-500'}`}
                            onPress={handleToggleStatus}
                        >
                            {String(firstSelectedProduct.flag_active) === '0' ? <CheckCircle2 color="white" size={18} /> : <XCircle color="white" size={18} />}
                            <Text className="text-white font-bold text-xs ml-2">
                                {String(firstSelectedProduct.flag_active) === '0' ? 'Aktif' : 'Tidak Aktif'}
                                {selectedProductIds.length > 1 ? ` (${selectedProductIds.length})` : ''}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </Animated.View>

            <View className="flex-1">
                <FlatList
                    data={(isInitializing || (isLoading && products.length === 0)) ? [] : products.slice(0, visibleCount)}
                    keyExtractor={(item) => item.id_product}
                    renderItem={({ item, index }) => (
                        <ProductCard
                            product={item}
                            index={index}
                            isSelected={selectedProductIds.includes(item.id_product)}
                            onPress={() => {
                                if (selectedProductIds.length > 0) {
                                    if (selectedProductIds.includes(item.id_product)) {
                                        setSelectedProductIds(prev => prev.filter(id => id !== item.id_product));
                                    } else {
                                        if (firstSelectedProduct && firstSelectedProduct.flag_active !== item.flag_active) {
                                            return;
                                        }
                                        setSelectedProductIds(prev => [...prev, item.id_product]);
                                    }
                                } else {
                                    navigation.navigate('ProductEdit', { id: item.id_product });
                                }
                            }}
                            onLongPress={() => {
                                if (!selectedProductIds.includes(item.id_product)) {
                                    if (selectedProductIds.length > 0 && firstSelectedProduct && firstSelectedProduct.flag_active !== item.flag_active) {
                                        return;
                                    }
                                    setSelectedProductIds(prev => [...prev, item.id_product]);
                                }
                            }}
                        />
                    )}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100, flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    refreshControl={
                        <RefreshControl refreshing={isLoading && !isInitializing} onRefresh={refreshData} colors={[theme.colors.primary]} />
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
                                    title="Gagal Memuat Produk"
                                    message={error}
                                    onRetry={refreshData}
                                    fullScreen={true}
                                />
                            );
                        }
                        if (isInitializing || (isLoading && products.length === 0)) {
                            return (
                                <View style={{ marginHorizontal: -16 }}>
                                    <ProductListSkeleton />
                                </View>
                            );
                        }
                        return (
                            <EmptyState
                                title="Data Produk Kosong"
                                message="Tidak ada produk yang ditemukan."
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
                            label: "Tambah Produk",
                            onPress: () => navigation.navigate('ProductForm')
                        },
                        {
                            icon: <FileUp color="white" size={20} />,
                            label: "Upload Data",
                            onPress: () => navigation.navigate('ProductUpload')
                        }
                    ]}
                />
            )}
        </View>
    );
}
