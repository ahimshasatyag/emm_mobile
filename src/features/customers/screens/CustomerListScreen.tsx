import React, { useEffect , useState, useCallback } from 'react';
import { View, FlatList, Text, RefreshControl, TextInput } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCustomers } from '../hooks/useCustomers';
import { CustomerCard } from '../components/CustomerCard';
import { CustomerListSkeleton } from '../skeleton/CustomerListSkeleton';
import { theme } from '../../../theme/theme';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { ButtonAdd } from '../../../components/ui/buttonAdd';
import { Search } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut, FadeInUp } from 'react-native-reanimated';
import { ErrorState } from '../../../components/shared/ErrorState';
import { EmptyState } from '../../../components/shared/EmptyState';

type RootStackParamList = {
    CustomerForm: undefined;
    CustomerEdit: { id: string };
};

export function CustomerListScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { customers, isLoading, error, searchQuery, fetchCustomers, setSearchQuery } = useCustomers();

    const [isInitializing, setIsInitializing] = useState(true);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const initialize = async () => {
                setIsInitializing(true);
                try {
                    await Promise.all([
                        onRefresh(),
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

    useEffect(() => {
        fetchCustomers();
    }, []);

    const onAdd = () => {
        navigation.navigate('CustomerForm');
    };

    const onItemPress = (item: any) => {
        navigation.navigate('CustomerEdit', { id: item.id_customers });
    };

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator title="DATA PELANGGAN" />

            <Animated.View entering={FadeInUp.duration(400)} className="px-6 pt-6 pb-2">
                <View className="bg-white flex-row items-center px-4 h-12 rounded-xl border border-gray-200 mb-2">
                    <Search color="#9ca3af" size={20} />
                    <TextInput
                        className="flex-1 ml-2 text-gray-900"
                        placeholder="Cari nama, kode, no hp..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </Animated.View>

            <View className="flex-1">
                <FlatList
                    data={(isLoading || isInitializing) ? [] : customers}
                    keyExtractor={(item) => item.id_customers}
                    renderItem={({ item, index }) => (
                        <CustomerCard item={item} index={index} onPress={onItemPress} />
                    )}
                    contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100, flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={isLoading} onRefresh={fetchCustomers} colors={[theme.colors.primary]} />
                    }
                    ListEmptyComponent={() => {
                        if (error) {
                            return (
                                <ErrorState
                                    title="Gagal Memuat Pelanggan"
                                    message={error}
                                    onRetry={fetchCustomers}
                                    fullScreen={true}
                                />
                            );
                        }
                        if (isLoading || isInitializing) {
                            return (
                                <View style={{ marginHorizontal: -24 }}>
                                    <CustomerListSkeleton />
                                </View>
                            );
                        }
                        return (
                            <EmptyState
                                title="Data Pelanggan Kosong"
                                message="Tidak ada data pelanggan yang ditemukan."
                                fullScreen={true}
                            />
                        );
                    }}
                />
            </View>

            {(!isLoading && !isInitializing) && !error && (
                <ButtonAdd onPress={onAdd} />
            )}
        </View>
    );
}
