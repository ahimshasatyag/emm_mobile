import React, { useState, useEffect , useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Plus, Search, CheckCircle2, XCircle } from 'lucide-react-native';
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
    const { units, isLoading, error, successMessage, searchQuery, setSearchQuery, loadUnits, dismissSuccess, dismissError } = useProductUnits();

    const [isInitializing, setIsInitializing] = useState(true);

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
        loadUnits();
    };

    useEffect(() => {
        if (successMessage) {
            Alert.alert('Sukses', successMessage, [{ text: 'OK', onPress: dismissSuccess }]);
        }
        if (error) {
            Alert.alert('Error', error, [{ text: 'OK', onPress: dismissError }]);
        }
    }, [successMessage, error, dismissSuccess, dismissError]);

    useEffect(() => {
        loadUnits();
    }, [loadUnits]);

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

            <View className="flex-1">
                <Animated.FlatList
                    entering={FadeInDown}
                    data={(isLoading || isInitializing) ? [] : units}
                    keyExtractor={(item) => item.id_product_satuan}
                    renderItem={({ item, index }) => (
                        <ProductUnitCard
                            unit={item}
                            index={index}
                            isSelected={selectedUnitIds.includes(item.id_product_satuan)}
                            onPress={() => {
                                if (selectedUnitIds.length > 0) {
                                    if (selectedUnitIds.includes(item.id_product_satuan)) {
                                        setSelectedUnitIds(prev => prev.filter(id => id !== item.id_product_satuan));
                                    } else {
                                        setSelectedUnitIds(prev => [...prev, item.id_product_satuan]);
                                    }
                                } else {
                                    navigation.navigate('ProductUnitEdit', { id: item.id_product_satuan });
                                }
                            }}
                            onLongPress={() => {
                                if (!selectedUnitIds.includes(item.id_product_satuan)) {
                                    setSelectedUnitIds(prev => [...prev, item.id_product_satuan]);
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
            </View>

            {(!isLoading && !isInitializing) && !error && (
                <ButtonAdd onPress={() => navigation.navigate('ProductUnitForm')} />
            )}
        </View>
    );
}
