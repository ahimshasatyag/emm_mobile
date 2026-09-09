import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { View, Text, FlatList, TextInput, RefreshControl, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Search } from 'lucide-react-native';
import { useQuotations } from '../hooks/useQuotations';
import { QuotationCard } from '../components/QuotationCard';
import { QuotationListSkeleton } from '../skeleton/QuotationListSkeleton';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { ButtonAdd } from '../../../components/ui/buttonAdd';
import { theme } from '../../../theme/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
    QuotationEdit: { id: string };
    QuotationForm: undefined;
};

export function QuotationListScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { quotations, isLoading, refresh } = useQuotations();
    const [search, setSearch] = useState('');
    const [isInitializing, setIsInitializing] = useState(true);

    const [visibleCount, setVisibleCount] = useState(10);
    const [isLoadMore, setIsLoadMore] = useState(false);
    const [statusFilter, setStatusFilter] = useState('ALL STATUS');
    const flatListRef = useRef<FlatList>(null);
    const isNavigatingToDetail = useRef(false);

    const statusOptions = [
        { label: 'All Status', value: 'ALL STATUS' },
        { label: 'Draft Quotation', value: 'DRAFT QUOTATION' },
        { label: 'Quotation', value: 'QUOTATION' },
        { label: 'Cancel Quotation', value: 'CANCEL QUOTATION' }
    ];

    const filteredData = useMemo(() => {
        let result = [...quotations];
        
        if (search) {
            const query = search.toLowerCase();
            result = result.filter(item => 
                (item.quotation_number && item.quotation_number.toLowerCase().includes(query)) ||
                (item.customer_name && item.customer_name.toLowerCase().includes(query)) ||
                (item.sales_person_name && item.sales_person_name.toLowerCase().includes(query))
            );
        }

        if (statusFilter !== 'ALL STATUS') {
            result = result.filter(item => item.status?.toUpperCase() === statusFilter);
        }

        // Sort: Newest date first, then highest ID first (for items on the same date)
        result.sort((a, b) => {
            const dateA = new Date(a.date_so || 0).getTime();
            const dateB = new Date(b.date_so || 0).getTime();
            
            if (dateB !== dateA) {
                return dateB - dateA;
            }
            
            const idA = parseInt(a.id_quotation || '0');
            const idB = parseInt(b.id_quotation || '0');
            return idB - idA;
        });

        return result;
    }, [quotations, search, statusFilter]);

    useEffect(() => {
        setVisibleCount(10);
    }, [search, quotations, statusFilter]);

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
                        refresh(),
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

    const handlePress = (id: string) => {
        isNavigatingToDetail.current = true;
        navigation.navigate('QuotationEdit', { id });
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
        <KeyboardAvoidingView 
            className="flex-1 bg-gray-50"
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <HeaderNavigator title="QUOTATIONS" />
            
            <View className="px-4 py-3">
                <View className="flex-row items-center space-x-3">
                    <View className="flex-1 flex-row items-center bg-white border border-gray-200 rounded-xl px-4 py-3.5 shadow-sm">
                        <Search size={20} color="#9CA3AF" />
                        <TextInput
                            placeholder="Cari Quotation, Customer..."
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
                            placeholder="Semua Status"
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
                keyExtractor={(item) => item.id_quotation}
                renderItem={({ item, index }) => (
                    <QuotationCard 
                        item={item} 
                        index={index} 
                        onPress={() => handlePress(item.id_quotation)}
                    />
                )}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                refreshControl={
                    <RefreshControl refreshing={isLoading && !isInitializing} onRefresh={refresh} colors={[theme.colors.primary]} />
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
                                    <QuotationListSkeleton />
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

            {(!isLoading && !isInitializing) && (
                <ButtonAdd onPress={() => navigation.navigate('QuotationForm')} />
            )}
        </KeyboardAvoidingView>
    );
}
