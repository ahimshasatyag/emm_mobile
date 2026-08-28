import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, FlatList, RefreshControl, TextInput, ActivityIndicator } from 'react-native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { useInventoryCategory } from '../hooks/useInventoryCategory';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { setData, setLoading, setError } from '../stores/inventorycategorySlice';
import { fetchInventoryCategoryApi } from '../api/inventorycategory.api';
import { InventoryCategoryCard } from '../components/InventoryCategoryCard';
import { InventoryCategoryListSkeleton } from '../skeleton/InventoryCategoryListSkeleton';
import { ErrorState } from '../../../components/shared/ErrorState';
import { EmptyState } from '../../../components/shared/EmptyState';
import { ButtonAdd } from '../../../components/ui/buttonAdd';
import { theme } from '../../../theme/theme';
import { Search } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { InventoryCategoryData } from '../types/inventorycategory.types';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';

type RootStackParamList = {
    InventoryCategoryForm: { id?: string } | undefined;
    InventoryCategoryEdit: { id: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function InventoryCategoryListScreen() {
    const { data, isLoading, error } = useInventoryCategory();

    const [isInitializing, setIsInitializing] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [visibleCount, setVisibleCount] = useState(10);
    const [isLoadMore, setIsLoadMore] = useState(false);

    const route = useRoute();
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMsg, setToastMsg] = useState('');
    const [toastType, setToastType] = useState<ToastType>('success');
    const [toastTitle, setToastTitle] = useState('Sukses');

    React.useEffect(() => {
        const params = route.params as any;
        if (params?.toastMessage) {
            setToastMsg(params.toastMessage);
            setToastType(params.toastType || 'success');
            setToastTitle(params.toastType === 'error' ? 'Gagal' : 'Sukses');
            setToastVisible(true);
            
            navigation.setParams({ toastMessage: undefined, toastType: undefined });
        }
    }, [route.params]);

    const filteredData = useMemo(() => {
        if (!searchQuery) return data;
        const query = searchQuery.toLowerCase();
        return data.filter(item =>
            item.name.toLowerCase().includes(query)
        );
    }, [data, searchQuery]);

    React.useEffect(() => {
        setVisibleCount(10);
    }, [searchQuery, data]);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const initialize = async () => {
                setIsInitializing(true);
                try {
                    await handleRefresh();
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
    const dispatch = useAppDispatch();
    const navigation = useNavigation<NavigationProp>();

    const handleRefresh = async () => {
        dispatch(setLoading(true));
        try {
            const result = await fetchInventoryCategoryApi();
            dispatch(setData(result));
        } catch (e: any) {
            dispatch(setError(e.message));
        }
    };

    const handlePressCard = (item: InventoryCategoryData) => {
        navigation.navigate('InventoryCategoryEdit', { id: item.id });
    };

    const handleAdd = () => {
        navigation.navigate('InventoryCategoryForm');
    };

    const handleLoadMore = useCallback(() => {
        if (visibleCount < filteredData.length && !isLoadMore) {
            setIsLoadMore(true);
            setTimeout(() => {
                setVisibleCount(prev => prev + 10);
                setIsLoadMore(false);
            }, 600);
        }
    }, [visibleCount, filteredData.length, isLoadMore]);

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <HeaderNavigator isLoading={isLoading} />

            <Animated.View entering={FadeInUp.duration(400)} className="px-6 pt-6 pb-2">
                <View className="bg-white flex-row items-center px-4 h-12 rounded-xl border border-gray-200 mb-2 shadow-sm">
                    <Search color="#9ca3af" size={20} />
                    <TextInput
                        className="flex-1 ml-2 text-gray-900 h-full"
                        placeholder="Cari kategori inventori..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#9ca3af"
                    />
                </View>
            </Animated.View>

            <View className="flex-1">
                <FlatList
                    data={(isLoading || isInitializing) ? [] : filteredData.slice(0, visibleCount)}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }) => (
                        <InventoryCategoryCard item={item} index={index} onPress={handlePressCard} />
                    )}
                    contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100, flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    refreshControl={
                        <RefreshControl refreshing={isLoading && !isInitializing} onRefresh={handleRefresh} colors={[theme.colors.primary]} />
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
                                    onRetry={handleRefresh}
                                    fullScreen={true}
                                />
                            );
                        }
                        if (isLoading || isInitializing) {
                            return (
                                <View style={{ marginHorizontal: -24 }}>
                                    <InventoryCategoryListSkeleton />
                                </View>
                            );
                        }
                        return (
                            <EmptyState
                                title="Data Kosong"
                                message="Belum ada kategori inventori yang terdaftar."
                                fullScreen={true}
                            />
                        );
                    }}
                />
            </View>

            {(!isLoading && !isInitializing) && !error && (
                <ButtonAdd onPress={handleAdd} />
            )}

            <ToastMessages
                visible={toastVisible}
                type={toastType}
                title={toastTitle}
                message={toastMsg}
                onClose={() => setToastVisible(false)}
            />
        </View>
    );
}
