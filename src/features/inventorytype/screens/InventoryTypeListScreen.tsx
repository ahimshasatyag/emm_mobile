import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { useInventoryType } from '../hooks/useInventoryType';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { setData, setLoading, setError } from '../stores/inventorytypeSlice';
import { fetchInventoryTypeApi } from '../api/inventorytype.api';
import { InventoryTypeCard } from '../components/InventoryTypeCard';
import { InventoryTypeListSkeleton } from '../skeleton/InventoryTypeListSkeleton';
import { ErrorState } from '../../../components/shared/ErrorState';
import { EmptyState } from '../../../components/shared/EmptyState';
import { ButtonAdd } from '../../../components/ui/buttonAdd';
import { theme } from '../../../theme/theme';
import { Search } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { InventoryTypeData } from '../types/inventorytype.types';

type RootStackParamList = {
    InventoryTypeForm: { id?: string } | undefined;
    InventoryTypeEdit: { id: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function InventoryTypeListScreen() {
    const { data, isLoading, error } = useInventoryType();

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
            const result = await fetchInventoryTypeApi();
            dispatch(setData(result));
        } catch (e: any) {
            dispatch(setError(e.message));
        }
    };

    const handlePressCard = (item: InventoryTypeData) => {
        navigation.navigate('InventoryTypeEdit', { id: item.id });
    };

    const handleAdd = () => {
        navigation.navigate('InventoryTypeForm');
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <HeaderNavigator isLoading={isLoading} />

            <Animated.View entering={FadeInUp.duration(400)} className="px-6 pt-6 pb-2">
                <View className="bg-white flex-row items-center px-4 h-12 rounded-xl border border-gray-200 mb-2">
                    <Search color="#9ca3af" size={20} />
                    <Text className="text-gray-400 ml-2">Cari tipe inventori...</Text>
                </View>
            </Animated.View>

            <View className="flex-1">
                <FlatList
                    data={(isLoading || isInitializing) ? [] : data}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }) => (
                        <InventoryTypeCard item={item} index={index} onPress={handlePressCard} />
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
                                    <InventoryTypeListSkeleton />
                                </View>
                            );
                        }
                        return (
                            <EmptyState
                                title="Data Kosong"
                                message="Belum ada tipe inventori yang terdaftar."
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
