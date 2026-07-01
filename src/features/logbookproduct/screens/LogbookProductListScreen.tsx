import React, { useEffect, useState, useCallback } from 'react';
import { View, TextInput, RefreshControl } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Search } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { fetchLogbookProducts } from '../stores/logbookproductSlice';
import { RootState, AppDispatch } from '../../../stores';
import { LogbookProductCard } from '../components/LogbookProductCard';
import { LogbookProductListSkeleton } from '../skeleton/LogbookProductListSkeleton';
import { theme } from '../../../theme/theme';
import { ButtonAdd } from '../../../components/ui/buttonAdd';
import { ErrorState } from '../../../components/shared/ErrorState';
import { EmptyState } from '../../../components/shared/EmptyState';

export function LogbookProductListScreen() {
    const navigation = useNavigation<any>();
    const dispatch = useDispatch<AppDispatch>();
    
    const { list, isLoading, error } = useSelector((state: RootState) => state.logbookproduct || { list: [], isLoading: false, error: null });
    const [searchQuery, setSearchQuery] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);

    const loadData = async () => {
        await dispatch(fetchLogbookProducts());
    };

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const initialize = async () => {
                setIsInitializing(true);
                try {
                    await Promise.all([
                        loadData(),
                        new Promise(resolve => setTimeout(resolve, 800))
                    ]);
                } catch (err) {
                    // console.error("Failed to load:", err);
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

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await loadData();
        setIsRefreshing(false);
    };

    const filteredList = list.filter(item => 
        item.nm_product?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code_product?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id_log_book?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator title="LOGBOOK PRODUCT" />

            <Animated.View entering={FadeInUp.duration(400)} className="px-6 pt-6 pb-2">
                <View className="flex-row items-center justify-between">
                    <View className="flex-1 bg-white flex-row items-center px-4 h-12 rounded-xl border border-gray-200 mb-2">
                        <Search color="#9ca3af" size={20} />
                        <TextInput
                            className="flex-1 ml-2 text-gray-900"
                            placeholder="Cari kode atau nama produk..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                </View>
            </Animated.View>

            <View className="flex-1">
                <Animated.FlatList
                    entering={FadeInDown}
                    data={(isLoading || isInitializing) ? [] : filteredList}
                    keyExtractor={(item) => item.id_log_book}
                    renderItem={({ item, index }) => <LogbookProductCard logbook={item} index={index} />}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100, flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} colors={[theme.colors.primary]} />
                    }
                    ListEmptyComponent={() => {
                        if (error) {
                            return (
                                <ErrorState
                                    title="Gagal Memuat Logbook"
                                    message={error}
                                    onRetry={loadData}
                                    fullScreen={true}
                                />
                            );
                        }
                        if (isLoading || isInitializing) {
                            return (
                                <View style={{ marginHorizontal: -16 }}>
                                    <LogbookProductListSkeleton />
                                </View>
                            );
                        }
                        return (
                            <EmptyState
                                title="Data Logbook Kosong"
                                message="Tidak ada data logbook product yang ditemukan."
                                fullScreen={true}
                            />
                        );
                    }}
                />
            </View>

            {(!isLoading && !isInitializing) && !error && (
                <ButtonAdd onPress={() => navigation.navigate('LogbookProductFormScreen')} />
            )}
        </View>
    );
}
