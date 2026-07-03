import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TextInput, RefreshControl, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Search } from 'lucide-react-native';
import { useQuotations } from '../hooks/useQuotations';
import { QuotationCard } from '../components/QuotationCard';
import { QuotationListSkeleton } from '../skeleton/QuotationListSkeleton';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { ButtonAdd } from '../../../components/ui/buttonAdd';
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

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

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

    const filteredData = quotations.filter(item => 
        item.quotation_number.toLowerCase().includes(search.toLowerCase()) ||
        item.customer_name.toLowerCase().includes(search.toLowerCase()) ||
        item.sales_person_name.toLowerCase().includes(search.toLowerCase())
    );

    const handlePress = (id: string) => {
        navigation.navigate('QuotationEdit', { id });
    };

    return (
        <KeyboardAvoidingView 
            className="flex-1 bg-gray-50"
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <HeaderNavigator title="QUOTATIONS" />
            
            <View className="px-4 py-3">
                <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-4 py-3.5 shadow-sm">
                    <Search size={20} color="#9CA3AF" />
                    <TextInput
                        placeholder="Cari Quotation, Customer..."
                        value={search}
                        onChangeText={setSearch}
                        className="flex-1 ml-3 text-sm text-gray-800 p-0"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>
            </View>

            <FlatList
                data={(isLoading || isInitializing) ? [] : filteredData}
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
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={refresh} />
                }
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
