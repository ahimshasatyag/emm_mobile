import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
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
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { InventoryCategoryData } from '../types/inventorycategory.types';

type RootStackParamList = {
    InventoryCategoryForm: { id?: string } | undefined;
    InventoryCategoryEdit: { id: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function InventoryCategoryListScreen() {
    const { data, isLoading, error } = useInventoryCategory();

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

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <HeaderNavigator isLoading={isLoading} />

            <Animated.View entering={FadeInUp.duration(400)} className="px-6 pt-6 pb-2">
                <View className="bg-white flex-row items-center px-4 h-12 rounded-xl border border-gray-200 mb-2">
                    <Search color="#9ca3af" size={20} />
                    <Text className="text-gray-400 ml-2">Cari kategori inventori...</Text>
                </View>
            </Animated.View>

            <View className="flex-1">
                <FlatList
                    data={(isLoading || isInitializing) ? [] : data}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }) => (
                        <InventoryCategoryCard item={item} index={index} onPress={handlePressCard} />
                    )}
                    contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100, flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} colors={[theme.colors.primary]} />
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
        </View>
    );
}
