import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { View, Text, FlatList, TextInput, RefreshControl, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Search } from 'lucide-react-native';
import { useSO } from '../hooks/useSO';
import { SOCard } from '../components/SOCard';
import { SOListSkeleton } from '../skeleton/SOSkeleton';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { theme } from '../../../theme/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
    SOEdit: { id: string };
};

export function SOListScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { items, isLoading, loadList } = useSO();
    const [search, setSearch] = useState('');
    const [isInitializing, setIsInitializing] = useState(true);

    const [visibleCount, setVisibleCount] = useState(10);
    const [isLoadMore, setIsLoadMore] = useState(false);
    const [statusFilter, setStatusFilter] = useState('ALL STATUS');
    const flatListRef = useRef<FlatList>(null);
    const isNavigatingToDetail = useRef(false);

    const statusOptions = [
        { label: 'All Status', value: 'ALL STATUS' },
        { label: 'Sales Order', value: 'SALES ORDER' },
        { label: 'Sale to Invoice', value: 'SALE TO INVOICE' }
    ];

    const filteredData = useMemo(() => {
        let result = [...items];
        
        if (search) {
            const query = search.toLowerCase();
            result = result.filter(item => 
                (item.code_so && item.code_so.toLowerCase().includes(query)) ||
                (item.nm_customers && item.nm_customers.toLowerCase().includes(query)) ||
                (item.nm_karyawan && item.nm_karyawan.toLowerCase().includes(query))
            );
        }

        if (statusFilter !== 'ALL STATUS') {
            result = result.filter(item => item.status_so?.toUpperCase() === statusFilter);
        }

        // Sort: Urutkan berdasarkan code_so terbaru (descending)
        result.sort((a, b) => {
            const codeA = a.code_so || '';
            const codeB = b.code_so || '';
            return codeB.localeCompare(codeA);
        });

        return result;
    }, [items, search, statusFilter]);

    useEffect(() => {
        setVisibleCount(10);
    }, [search, items, statusFilter]);

    const handlePress = (id: string) => {
        isNavigatingToDetail.current = true;
        navigation.navigate('SOEdit', { id });
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

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            if (!isNavigatingToDetail.current) {
                setStatusFilter('ALL STATUS');
            }
            isNavigatingToDetail.current = false;

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

    return (
        <KeyboardAvoidingView 
            className="flex-1 bg-gray-50"
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <HeaderNavigator title="SALES ORDER" />
            
            <View className="px-4 py-3">
                <View className="flex-row items-center space-x-3">
                    <View className="flex-1 flex-row items-center bg-white border border-gray-200 rounded-xl px-4 py-3.5 shadow-sm">
                        <Search size={20} color="#9CA3AF" />
                        <TextInput
                            placeholder="Cari SO, Customer, Sales..."
                            value={search}
                            onChangeText={setSearch}
                            className="flex-1 ml-3 text-sm text-gray-800 p-0"
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>
                    <View className="w-36 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden justify-center">
                        <Dropdown
                            style={{ height: 48, paddingHorizontal: 12 }}
                            placeholderStyle={{ fontSize: 13, color: '#6b7280' }}
                            selectedTextStyle={{ fontSize: 13, color: '#111827', fontWeight: '500' }}
                            data={statusOptions}
                            labelField="label"
                            valueField="value"
                            placeholder="Status"
                            value={statusFilter}
                            onChange={(item) => {
                                setStatusFilter(item.value);
                                flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
                            }}
                        />
                    </View>
                </View>
            </View>

            <FlatList
                ref={flatListRef}
                className="flex-1"
                data={(isLoading || isInitializing) ? [] : filteredData.slice(0, visibleCount)}
                keyExtractor={(item) => item.id_so}
                renderItem={({ item, index }) => (
                    <SOCard 
                        item={item} 
                        index={index} 
                        onPress={() => handlePress(item.id_so)}
                    />
                )}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                refreshControl={
                    <RefreshControl refreshing={isLoading && !isInitializing} onRefresh={loadList} colors={[theme.colors.primary]} />
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
                ListEmptyComponent={
                    () => {
                        if (isLoading || isInitializing) {
                            return (
                                <View style={{ marginHorizontal: -16 }}>
                                    <SOListSkeleton />
                                </View>
                            );
                        }
                        return (
                            <View className="flex-1 justify-center items-center pt-20">
                                <Text className="text-gray-500 font-medium">Data tidak ditemukan</Text>
                            </View>
                        );
                    }
                }
            />

        </KeyboardAvoidingView>
    );
}
