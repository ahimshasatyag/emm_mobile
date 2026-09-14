import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { View, Text, FlatList, TextInput, RefreshControl, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Search } from 'lucide-react-native';
import { useSalesContract } from '../hooks/useSalesContract';
import { SalesContractCard } from '../components/SalesContractCard';
import { SalesContractSkeleton } from '../skeleton/SalesContractSkeleton';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { ButtonAdd } from '../../../components/ui/buttonAdd';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '../../../theme/theme';

type RootStackParamList = {
    SalesContractEdit: { id: string };
    SalesContractListSO: undefined;
};

export function SalesContractListScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { items, isLoading, loadContracts } = useSalesContract();
    const [search, setSearch] = useState('');
    const [isInitializing, setIsInitializing] = useState(true);

    const [visibleCount, setVisibleCount] = useState(10);
    const [isLoadMore, setIsLoadMore] = useState(false);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const initialize = async () => {
                setIsInitializing(true);
                try {
                    await Promise.all([
                        loadContracts(),
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
        }, [loadContracts])
    );

    useEffect(() => {
        setVisibleCount(10);
    }, [search, items]);

    const filteredData = useMemo(() => {
        if (!search) return items;
        const query = search.toLowerCase();
        return items.filter(item => 
            item.code_sales_contract?.toLowerCase().includes(query) ||
            item.code_so?.toLowerCase().includes(query) ||
            item.nm_customers?.toLowerCase().includes(query)
        );
    }, [items, search]);

    const handleLoadMore = useCallback(() => {
        if (visibleCount < filteredData.length && !isLoadMore) {
            setIsLoadMore(true);
            setTimeout(() => {
                setVisibleCount(prev => prev + 10);
                setIsLoadMore(false);
            }, 600);
        }
    }, [visibleCount, filteredData.length, isLoadMore]);

    const handlePress = (id: string) => {
        navigation.navigate('SalesContractEdit', { id });
    };

    return (
        <KeyboardAvoidingView 
            className="flex-1 bg-gray-50"
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <HeaderNavigator title="SALES CONTRACT" />
            
            <View className="px-4 py-3">
                <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-4 py-3.5 shadow-sm">
                    <Search size={20} color="#9CA3AF" />
                    <TextInput
                        placeholder="Cari Sales Contract, SO, Customer..."
                        value={search}
                        onChangeText={setSearch}
                        className="flex-1 ml-3 text-sm text-gray-800 p-0"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>
            </View>

            <FlatList
                data={(isLoading || isInitializing) ? [] : filteredData.slice(0, visibleCount)}
                keyExtractor={(item) => item.id_sales_contract}
                renderItem={({ item, index }) => (
                    <SalesContractCard 
                        item={item} 
                        index={index} 
                        onPress={() => handlePress(item.id_sales_contract)}
                    />
                )}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100, flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={loadContracts} colors={[theme.colors.primary]} />
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
                                    <SalesContractSkeleton />
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

            <ButtonAdd onPress={() => navigation.navigate('SalesContractListSO')} />
        </KeyboardAvoidingView>
    );
}
