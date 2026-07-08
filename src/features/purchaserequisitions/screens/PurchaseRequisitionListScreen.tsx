import React, { useState, useCallback } from 'react';
import { View, RefreshControl, TextInput } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Search } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { PurchaseRequisitionCard } from '../components/PurchaseRequisitionCard';
import { PurchaseRequisitionSkeleton } from '../skeleton/PurchaseRequisitionSkeleton';
import { usePurchaseRequisitions } from '../hooks/usePurchaseRequisitions';
import { theme } from '../../../theme/theme';
import { EmptyState } from '../../../components/shared/EmptyState';
import { ErrorState } from '../../../components/shared/ErrorState';
import { SpeedDial } from '../../../components/ui/SpeedDial';
import { FileText, ListChecks } from 'lucide-react-native';

export function PurchaseRequisitionListScreen() {
    const navigation = useNavigation<any>();
    const { items, isLoadingList, error, searchQuery, setSearchQuery, loadList } = usePurchaseRequisitions();

    const [isInitializing, setIsInitializing] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const onRefresh = useCallback(async () => {
        setIsRefreshing(true);
        try {
            await loadList();
        } finally {
            setIsRefreshing(false);
        }
    }, [loadList]);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;
            const initialize = async () => {
                setIsInitializing(true);
                try {
                    await Promise.all([
                        loadList(),
                        new Promise(resolve => setTimeout(resolve, 800))
                    ]);
                } catch (error) {
                    // console.error("Failed to load:", error);
                } finally {
                    if (isActive) setIsInitializing(false);
                }
            };
            initialize();
            return () => {
                isActive = false;
                setIsInitializing(true);
            };
        }, [loadList])
    );

    const navigateToDetail = (id: string) => {
        navigation.navigate('PurchaseRequisitionEditScreen', { id });
    };

    const speedDialActions = [
        {
            icon: <FileText size={20} color="white" />,
            label: "Tambah PR",
            onPress: () => navigation.navigate('PurchaseRequisitionFormScreen')
        },
        {
            icon: <ListChecks size={20} color="white" />,
            label: "Create Quotation",
            onPress: () => navigation.navigate('PurchaseRequisitionListPRScreen')
        }
    ];

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator title="PURCHASE REQUISITIONS" />

            <Animated.View entering={FadeInUp.duration(400)} className="px-4 py-3">
                <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-4 py-3.5 shadow-sm">
                    <Search size={20} color="#9CA3AF" />
                    <TextInput
                        placeholder="Cari kode PR, nama atau status..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        className="flex-1 ml-3 text-sm text-gray-800 p-0"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>
            </Animated.View>

            <View className="flex-1">
                <Animated.FlatList
                    entering={FadeInDown}
                    data={(isLoadingList || isInitializing) ? [] : items}
                    keyExtractor={(item) => item.id_pr}
                    renderItem={({ item, index }) => (
                        <PurchaseRequisitionCard
                            item={item}
                            index={index}
                            onPress={() => navigateToDetail(item.id_pr)}
                        />
                    )}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100, flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
                    }
                    ListEmptyComponent={() => {
                        if (error) {
                            return (
                                <ErrorState
                                    title="Gagal Memuat PR"
                                    message={error}
                                    onRetry={loadList}
                                    fullScreen={true}
                                />
                            );
                        }
                        if (isLoadingList || isInitializing) {
                            return (
                                <View style={{ marginHorizontal: -16 }}>
                                    <PurchaseRequisitionSkeleton />
                                </View>
                            );
                        }
                        return (
                            <EmptyState
                                title="Data PR Kosong"
                                message="Tidak ada purchase requisition yang ditemukan."
                                fullScreen={true}
                            />
                        );
                    }}
                />
            </View>

            {(!isLoadingList && !isInitializing) && (
                <SpeedDial actions={speedDialActions} />
            )}
        </View>
    );
}
