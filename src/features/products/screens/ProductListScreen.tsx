import React, { useState , useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Plus, Search, CheckCircle2, XCircle } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/ProductCard';
import { ProductListSkeleton } from '../skeleton/ProductListSkeleton';
import { theme } from '../../../theme/theme';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { SpeedDial } from '../../../components/ui/SpeedDial';
import { FileUp } from 'lucide-react-native';
import { ErrorState } from '../../../components/shared/ErrorState';
import { EmptyState } from '../../../components/shared/EmptyState';

export function ProductListScreen() {
    const navigation = useNavigation<any>();
    const { products, isLoading, error, searchQuery, setSearchQuery, refreshData } = useProducts();

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
    const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

    const firstSelectedProduct = products.find(p => p.id_product === selectedProductIds[0]);

    const handleToggleStatus = () => {
        if (selectedProductIds.length === 0) return;
        const isCurrentlyInactive = firstSelectedProduct?.f_status === 'f';
        const newStatus = isCurrentlyInactive ? 't' : 'f';
        const actionWord = isCurrentlyInactive ? 'Mengaktifkan' : 'Menonaktifkan';

        Alert.alert(
            'Konfirmasi',
            `Apakah Anda yakin ingin ${actionWord.toLowerCase()} ${selectedProductIds.length} produk terpilih?`,
            [
                { text: 'Batal', style: 'cancel' },
                {
                    text: 'Ya',
                    onPress: () => {
                        // Dummy local update for UI demonstration
                        products.forEach(p => {
                            if (selectedProductIds.includes(p.id_product)) {
                                p.f_status = newStatus;
                            }
                        });
                        setSelectedProductIds([]);
                        // In a real app, you would call an API and then refreshData()
                        Alert.alert('Sukses', `${selectedProductIds.length} produk berhasil di${actionWord.toLowerCase()}.`);
                    }
                }
            ]
        );
    };

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator title="DATA PRODUCT" />

            <Animated.View entering={FadeInUp.duration(400)} className="px-6 pt-6 pb-2">
                <View className="flex-row items-center justify-between">
                    <View className="flex-1 bg-white flex-row items-center px-4 h-12 rounded-xl border border-gray-200 mb-2">
                        <Search color="#9ca3af" size={20} />
                        <TextInput
                            className="flex-1 ml-2 text-gray-900"
                            placeholder="Cari nama atau kode produk..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                    {selectedProductIds.length > 0 && firstSelectedProduct && (
                        <TouchableOpacity
                            className={`ml-2 h-12 px-4 rounded-xl items-center justify-center flex-row shadow-sm mb-2 ${firstSelectedProduct.f_status === 'f' ? 'bg-green-600' : 'bg-red-500'}`}
                            onPress={handleToggleStatus}
                        >
                            {firstSelectedProduct.f_status === 'f' ? <CheckCircle2 color="white" size={18} /> : <XCircle color="white" size={18} />}
                            <Text className="text-white font-bold text-xs ml-2">
                                {firstSelectedProduct.f_status === 'f' ? 'Aktif' : 'Tidak Aktif'}
                                {selectedProductIds.length > 1 ? ` (${selectedProductIds.length})` : ''}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </Animated.View>

            <View className="flex-1">
                <Animated.FlatList
                    entering={FadeInDown}
                    data={(isLoading || isInitializing) ? [] : products}
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
                                        if (firstSelectedProduct && firstSelectedProduct.f_status !== item.f_status) {
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
                                    if (selectedProductIds.length > 0 && firstSelectedProduct && firstSelectedProduct.f_status !== item.f_status) {
                                        return;
                                    }
                                    setSelectedProductIds(prev => [...prev, item.id_product]);
                                }
                            }}
                        />
                    )}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100, flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={isLoading} onRefresh={refreshData} colors={[theme.colors.primary]} />
                    }
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
                        if (isLoading || isInitializing) {
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
