import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, FlatList, RefreshControl, TextInput } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { Search } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { QuotationsAPCard } from '../components/QuotationsAPCard';
import { QuotationsAPSkeleton } from '../skeleton/QuotationsAPSkeleton';
import { useQuotationsAP } from '../hooks/useQuotationsAP';
import { theme } from '../../../theme/theme';
import { EmptyState } from '../../../components/shared/EmptyState';
import { ErrorState } from '../../../components/shared/ErrorState';
import { ButtonAdd } from '../../../components/ui/buttonAdd';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';

export function QuotationsAPListScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { items, isLoadingList, error, searchQuery, setSearchQuery, loadList } = useQuotationsAP();

    const [isInitializing, setIsInitializing] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [statusFilter, setStatusFilter] = useState('ALL STATUS');
    const [toast, setToast] = useState<{ visible: boolean; message: string; type: ToastType; title?: string }>({
        visible: false,
        message: '',
        type: 'success'
    });

    // Reset status filter only when accessed fresh from Sidebar (which passes a new timestamp)
    React.useEffect(() => {
        if (route.params?.timestamp) {
            setStatusFilter('ALL STATUS');
            if (route.params?.showToast) {
                setToast({
                    visible: true,
                    message: route.params.toastMessage || '',
                    type: route.params.toastType || 'success',
                    title: route.params.toastTitle || 'Sukses'
                });
                navigation.setParams({ showToast: undefined, toastMessage: undefined, toastType: undefined, toastTitle: undefined });
            }
        }
    }, [route.params?.timestamp]);

    const statusOptions = [
        { label: 'ALL STATUS', value: 'ALL STATUS' },
        { label: 'QUOTATION', value: 'QUOTATION' },
        { label: 'DRAFT', value: 'DRAFT' },
        { label: 'CANCEL', value: 'CANCEL' },
    ];

    const displayItems = useMemo(() => {
        if (statusFilter === 'ALL STATUS') return items;
        return items.filter((item: any) => item.status_po?.toUpperCase() === statusFilter);
    }, [items, statusFilter]);

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
                    // console.error("Failed to load list:", error);
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
        }, [loadList])
    );

    const onRefresh = useCallback(async () => {
        setIsRefreshing(true);
        try {
            await loadList();
        } finally {
            setIsRefreshing(false);
        }
    }, [loadList]);

    const handleAdd = () => {
        navigation.navigate('QuotationsAPFormScreen');
    };

    const handleDetail = (id: string) => {
        navigation.navigate('QuotationsAPEditScreen', { id });
    };

    return (
        <View className="flex-1 bg-gray-50">
            <ToastMessages
                visible={toast.visible}
                title={toast.title || (toast.type === 'error' ? 'Error' : 'Sukses')}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(prev => ({ ...prev, visible: false }))}
            />
            <HeaderNavigator title="QUOTATIONS AP" />

            <Animated.View entering={FadeInUp.duration(400)} className="px-4 py-3">
                <View className="flex-row items-center space-x-3">
                    <View className="flex-1 flex-row items-center bg-white px-4 py-3.5 rounded-xl border border-gray-200 shadow-sm">
                        <Search size={20} color="#9CA3AF" />
                        <TextInput
                            placeholder="Cari code po atau supplier..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            className="flex-1 ml-3 text-sm text-gray-800 p-0"
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>
                    <View className="w-32 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden justify-center">
                        <Dropdown
                            style={{ height: 48, paddingHorizontal: 12 }}
                            placeholderStyle={{ fontSize: 14, color: '#6b7280' }}
                            selectedTextStyle={{ fontSize: 14, color: '#111827', fontWeight: '500' }}
                            data={statusOptions}
                            labelField="label"
                            valueField="value"
                            placeholder="Status"
                            value={statusFilter}
                            onChange={(item) => setStatusFilter(item.value)}
                        />
                    </View>
                </View>
            </Animated.View>

            <View className="flex-1">
                <Animated.FlatList
                    entering={FadeInDown}
                    data={(isLoadingList || isInitializing) ? [] : displayItems}
                    keyExtractor={(item) => item.id_po}
                    contentContainerStyle={{
                        flexGrow: 1,
                        paddingBottom: 100,
                        paddingHorizontal: 16
                    }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={onRefresh}
                            colors={[theme.colors.primary]}
                        />
                    }
                    renderItem={({ item, index }) => (
                        <QuotationsAPCard
                            item={item}
                            index={index}
                            onPress={() => handleDetail(item.id_po)}
                        />
                    )}
                    ListEmptyComponent={() => {
                        if (error) {
                            return (
                                <ErrorState
                                    title="Gagal Memuat Quotations"
                                    message={error}
                                    onRetry={loadList}
                                    fullScreen={true}
                                />
                            );
                        }
                        if (isLoadingList || isInitializing) {
                            return (
                                <View style={{ marginHorizontal: -16 }}>
                                    <QuotationsAPSkeleton />
                                </View>
                            );
                        }
                        return <EmptyState title="Tidak ada data" message="Belum ada data quotations AP." />;
                    }}
                />
            </View>

            {(!isLoadingList && !isInitializing) && (
                <Animated.View entering={FadeInUp.delay(300)}>
                    <ButtonAdd onPress={handleAdd} />
                </Animated.View>
            )}
        </View>
    );
}
