import React, { useState, useCallback, useEffect } from 'react';
import { View, FlatList, RefreshControl, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Search, Plus } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut, FadeInDown, Layout } from 'react-native-reanimated';
import { theme } from '../../../theme/theme';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { useProductPriceReq } from '../hooks/useProductPriceReq';
import { ProductPriceReqCard } from '../components/ProductPriceReqCard';
import { ProductPriceReqListSkeleton } from '../skeleton/ProductPriceReqSkeleton';
import { EmptyState } from '../../../components/shared/EmptyState';
import { ButtonAdd } from '../../../components/ui/buttonAdd';

export function ProductPriceReqListScreen() {
    const navigation = useNavigation<any>();
    const { requests, isLoading, loadRequests } = useProductPriceReq();
    
    const [isInitializing, setIsInitializing] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const initialize = async () => {
                setIsInitializing(true);
                try {
                    await Promise.all([
                        loadRequests(),
                        new Promise(resolve => setTimeout(resolve, 600))
                    ]);
                } finally {
                    if (isActive) setIsInitializing(false);
                }
            };

            initialize();

            return () => {
                isActive = false;
                setIsInitializing(true);
            };
        }, [loadRequests])
    );

    const handleRefresh = async () => {
        setIsInitializing(true);
        try {
            await Promise.all([
                loadRequests(),
                new Promise(resolve => setTimeout(resolve, 600))
            ]);
        } finally {
            setIsInitializing(false);
        }
    };

    const filteredRequests = requests.filter(r => 
        (r.nm_product || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.code_product || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const [visibleCount, setVisibleCount] = useState(10);
    const [isLoadMore, setIsLoadMore] = useState(false);

    useEffect(() => {
        setVisibleCount(10);
    }, [searchQuery]);

    const handleLoadMore = () => {
        if (visibleCount < filteredRequests.length) {
            setIsLoadMore(true);
            setTimeout(() => {
                setVisibleCount(prev => prev + 10);
                setIsLoadMore(false);
            }, 500);
        }
    };

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator 
                title="PRODUCT PRICE REQUEST" 
                rightIcon={<Plus color={theme.colors.primary} size={24} />}
                onRightIconPress={() => navigation.navigate('ProductPriceReqFormScreen')}
            />

            <View className="px-6 pt-5 pb-2">
                <View className="bg-white flex-row items-center px-4 h-12 rounded-xl border border-gray-200 shadow-sm">
                    <Search color="#9CA3AF" size={18} />
                    <TextInput
                        className="flex-1 ml-2 text-sm text-gray-800"
                        placeholder="Cari kode atau nama produk..."
                        placeholderTextColor="#9CA3AF"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            {isInitializing ? (
                <View style={{ padding: 24, paddingTop: 8 }}>
                    <Animated.View exiting={FadeOut.duration(300)}>
                        <ProductPriceReqListSkeleton />
                    </Animated.View>
                </View>
            ) : filteredRequests.length === 0 ? (
                <View style={{ padding: 24 }}>
                    <EmptyState 
                        title="Data Kosong"
                        message="Tidak ada data pengajuan harga yang ditemukan."
                        fullScreen={false}
                    />
                </View>
            ) : (
                <FlatList
                    data={filteredRequests.slice(0, visibleCount)}
                    keyExtractor={(item) => item.id}
                    className="flex-1"
                    contentContainerStyle={{ padding: 24, paddingTop: 8, paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    refreshControl={
                        <RefreshControl
                            refreshing={isLoading && !isInitializing}
                            onRefresh={handleRefresh}
                            colors={[theme.colors.primary]}
                        />
                    }
                    renderItem={({ item: request, index }) => (
                        <Animated.View 
                            entering={FadeInDown.delay((index % 10) * 100).springify()}
                            layout={Layout.springify()}
                        >
                            <TouchableOpacity 
                                activeOpacity={0.8}
                                onPress={() => navigation.navigate('ProductPriceReqEditScreen', { id: request.id })}
                            >
                                <ProductPriceReqCard request={request} />
                            </TouchableOpacity>
                        </Animated.View>
                    )}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
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
                />
            )}

            <ButtonAdd onPress={() => navigation.navigate('ProductPriceReqFormScreen')} />
        </View>
    );
}
