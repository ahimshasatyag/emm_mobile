import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TextInput, RefreshControl, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Search } from 'lucide-react-native';
import { useSalesRetur } from '../hooks/useSalesRetur';
import { SalesReturCard } from '../components/SalesReturCard';
import { SalesReturSkeleton } from '../skeleton/SalesReturSkeleton';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { ButtonAdd } from '../../../components/ui/buttonAdd';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
    SalesReturEdit: { id: string };
    SalesReturForm: undefined;
};

export function SalesReturListScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { items, isLoading, loadReturs } = useSalesRetur();
    const [search, setSearch] = useState('');
    const [isInitializing, setIsInitializing] = useState(true);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const initialize = async () => {
                setIsInitializing(true);
                try {
                    await Promise.all([
                        loadReturs(),
                        new Promise(resolve => setTimeout(resolve, 800))
                    ]);
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
        }, [loadReturs])
    );

    const filteredData = items.filter(item => 
        item.code_sr?.toLowerCase().includes(search.toLowerCase()) ||
        item.code_do?.toLowerCase().includes(search.toLowerCase()) ||
        item.nm_customers?.toLowerCase().includes(search.toLowerCase())
    );

    const handlePress = (id: string) => {
        navigation.navigate('SalesReturEdit', { id });
    };

    return (
        <KeyboardAvoidingView 
            className="flex-1 bg-gray-50"
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <HeaderNavigator title="SALES RETUR" />
            
            <View className="px-4 py-3">
                <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-4 py-3.5 shadow-sm">
                    <Search size={20} color="#9CA3AF" />
                    <TextInput
                        placeholder="Cari No. Retur, DO, Customer..."
                        value={search}
                        onChangeText={setSearch}
                        className="flex-1 ml-3 text-sm text-gray-800 p-0"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>
            </View>

            <FlatList
                data={(isLoading || isInitializing) ? [] : filteredData}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                    <SalesReturCard 
                        item={item} 
                        index={index} 
                        onPress={() => handlePress(item.id)}
                    />
                )}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isLoading && !isInitializing} onRefresh={loadReturs} />
                }
                ListEmptyComponent={
                    () => {
                        if (isLoading || isInitializing) {
                            return (
                                <View style={{ marginHorizontal: -16 }}>
                                    <SalesReturSkeleton />
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

            <ButtonAdd onPress={() => navigation.navigate('SalesReturForm')} />
        </KeyboardAvoidingView>
    );
}
