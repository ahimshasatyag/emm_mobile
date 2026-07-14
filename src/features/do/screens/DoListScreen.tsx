import React, { useState, useCallback } from 'react';
import { View, FlatList, RefreshControl, TextInput } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Search } from 'lucide-react-native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { EmptyState } from '../../../components/shared/EmptyState';
import { ErrorState } from '../../../components/shared/ErrorState';
import { useDo } from '../hooks/useDo';
import { DoCard } from '../components/DoCard';
import { DoSkeleton } from '../skeleton/DoSkeleton';

export const DoListScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { list, loading, error, getList } = useDo();
    const [searchQuery, setSearchQuery] = useState('');
    const [isInitializing, setIsInitializing] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [statusFilter, setStatusFilter] = useState('ALL STATUS');

    React.useEffect(() => {
        if (route.params?.timestamp) {
            setStatusFilter('ALL STATUS');
        }
    }, [route.params?.timestamp]);

    const statusOptions = [
        { label: 'ALL STATUS', value: 'ALL STATUS' },
        { label: 'DRAFT DELIVERY ORDER', value: 'DRAFT DELIVERY ORDER' },
        { label: 'WAITING AVAILABILITY', value: 'WAITING AVAILABILITY' },
        { label: 'READY TO DELIVER', value: 'READY TO DELIVER' },
        { label: 'DELIVERED', value: 'DELIVERED' }
    ];

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const initialize = async () => {
                setIsInitializing(true);
                try {
                    await Promise.all([
                        getList(),
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
        }, [getList])
    );

    const onRefresh = useCallback(async () => {
        setIsRefreshing(true);
        try {
            await getList();
        } finally {
            setIsRefreshing(false);
        }
    }, [getList]);

    const handleDetail = (id: string) => {
        navigation.navigate('DoEditScreen', { id });
    };

    const filteredList = list.filter(item => {
        const matchSearch = item.code_do.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.nm_customers.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.code_so.toLowerCase().includes(searchQuery.toLowerCase());
        const matchStatus = statusFilter === 'ALL STATUS' || item.status_do?.toUpperCase() === statusFilter;
        return matchSearch && matchStatus;
    });

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator title="DELIVERY ORDER" />

            <Animated.View entering={FadeInUp.duration(400)} className="px-4 py-3">
                <View className="flex-row items-center space-x-3">
                    <View className="flex-1 flex-row items-center bg-white px-4 py-3.5 rounded-xl border border-gray-200 shadow-sm">
                        <Search size={20} color="#9CA3AF" />
                        <TextInput
                            placeholder="Cari DO, Pelanggan, atau Source DO..."
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
                    data={(loading || isInitializing) && !isRefreshing ? [] : filteredList}
                    keyExtractor={(item) => item.id_do}
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 20, paddingHorizontal: 16 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={['#2563eb']} />
                    }
                    renderItem={({ item }) => (
                        <DoCard item={item} onPress={handleDetail} />
                    )}
                    ListEmptyComponent={() => {
                        if (error && !isInitializing) {
                            return (
                                <ErrorState
                                    title="Gagal Memuat DO"
                                    message={error}
                                    onRetry={getList}
                                    fullScreen={true}
                                />
                            );
                        }
                        if (loading || isInitializing) {
                            return <DoSkeleton />;
                        }
                        return <EmptyState title="Tidak ada data" message="Belum ada Delivery Order." />;
                    }}
                />
            </View>
        </View>
    );
};
