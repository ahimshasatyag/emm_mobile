import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, FlatList, TextInput, RefreshControl, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Search } from 'lucide-react-native';
import { useSO } from '../hooks/useSO';
import { SOCard } from '../components/SOCard';
import { SOListSkeleton } from '../skeleton/SOSkeleton';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
    SOEdit: { id: string };
};

export function SOListScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { items, isLoading, loadList } = useSO();
    const [search, setSearch] = useState('');
    const [isInitializing, setIsInitializing] = useState(true);

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

    const filteredData = items.filter(item => 
        item.code_so.toLowerCase().includes(search.toLowerCase()) ||
        item.nm_customers.toLowerCase().includes(search.toLowerCase()) ||
        item.nm_karyawan.toLowerCase().includes(search.toLowerCase())
    );

    const handlePress = (id: string) => {
        navigation.navigate('SOEdit', { id });
    };

    return (
        <KeyboardAvoidingView 
            className="flex-1 bg-gray-50"
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <HeaderNavigator title="SALES ORDER" />
            
            <View className="px-4 py-3">
                <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-4 py-3.5 shadow-sm">
                    <Search size={20} color="#9CA3AF" />
                    <TextInput
                        placeholder="Cari SO, Customer, Sales..."
                        value={search}
                        onChangeText={setSearch}
                        className="flex-1 ml-3 text-sm text-gray-800 p-0"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>
            </View>

            <FlatList
                data={(isLoading || isInitializing) ? [] : filteredData}
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
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={loadList} />
                }
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
