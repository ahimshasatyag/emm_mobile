import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, FlatList, RefreshControl, TextInput } from 'react-native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { useCounter } from '../hooks/useCounter';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { setData, setLoading, setError } from '../stores/counterSlice';
import { fetchCountersApi } from '../api/counter.api';
import { CounterCard } from '../components/CounterCard';
import { CounterListSkeleton } from '../skeleton/CounterListSkeleton';
import { ErrorState } from '../../../components/shared/ErrorState';
import { EmptyState } from '../../../components/shared/EmptyState';
import { theme } from '../../../theme/theme';
import { Search } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CounterData } from '../types/counter.types';

export function CounterListScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const { data, isLoading, error } = useCounter();

    const [isInitializing, setIsInitializing] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredData = useMemo(() => {
        if (!searchQuery) return data;
        const query = searchQuery.toLowerCase();
        return data.filter(item =>
            item.periode.toLowerCase().includes(query) ||
            item.id_counter.toLowerCase().includes(query) ||
            item.no_counter.toString().toLowerCase().includes(query)
        );
    }, [data, searchQuery]);

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

    const handleRefresh = async () => {
        dispatch(setLoading(true));
        try {
            const result = await fetchCountersApi();
            dispatch(setData(result));
        } catch (e: any) {
            dispatch(setError(e.message));
        }
    };

    const handlePressCard = (item: CounterData) => {
        navigation.navigate('CounterEdit', { id: item.id_counter });
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <HeaderNavigator isLoading={isLoading} />

            <View className="px-4 pt-3 pb-1">
                <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm mb-2">
                    <Search size={20} color="#9CA3AF" />
                    <TextInput
                        placeholder="Cari ID, Periode, atau No Counter..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        className="flex-1 ml-3 text-sm text-gray-800 p-0"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>
            </View>

            <View className="flex-1">
                <FlatList
                    data={(isLoading || isInitializing) ? [] : filteredData}
                    keyExtractor={(item) => item.id_counter}
                    renderItem={({ item, index }) => (
                        <CounterCard item={item} index={index} onPress={handlePressCard} />
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
                                    <CounterListSkeleton />
                                </View>
                            );
                        }
                        return (
                            <EmptyState
                                title="Data Kosong"
                                message="Belum ada data counter."
                                fullScreen={true}
                            />
                        );
                    }}
                />
            </View>
        </View>
    );
}
