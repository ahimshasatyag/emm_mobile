import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, FlatList, Text, RefreshControl, TextInput, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCustomerContacts } from '../hooks/useCustomerContacts';
import { CustomerContactCard } from '../components/CustomerContactCard';
import { CustomerContactListSkeleton } from '../skeleton/CustomerContactListSkeleton';
import { theme } from '../../../theme/theme';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { ButtonAdd } from '../../../components/ui/buttonAdd';
import { Search } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut, FadeInUp } from 'react-native-reanimated';
import { ErrorState } from '../../../components/shared/ErrorState';
import { EmptyState } from '../../../components/shared/EmptyState';

type RootStackParamList = {
    CustomerContactForm: undefined;
    CustomerContactEdit: { id: string };
};

export function CustomerContactListScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { customerContacts, isLoading, error, searchQuery, fetchCustomerContacts, setSearchQuery } = useCustomerContacts();

    const [isInitializing, setIsInitializing] = useState(true);
    const [visibleCount, setVisibleCount] = useState(10);
    const [isLoadMore, setIsLoadMore] = useState(false);

    useEffect(() => {
        setVisibleCount(10);
    }, [searchQuery, customerContacts]);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const initialize = async () => {
                setIsInitializing(true);
                try {
                    await fetchCustomerContacts();
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
        // fetchCustomerContacts(); handled by useFocusEffect
    }, []);

    const onAdd = () => {
        navigation.navigate('CustomerContactForm');
    };

    const onItemPress = (item: any) => {
        navigation.navigate('CustomerContactEdit', { id: item.id_customers_contact });
    };

    const handleLoadMore = useCallback(() => {
        if (visibleCount < customerContacts.length && !isLoadMore) {
            setIsLoadMore(true);
            setTimeout(() => {
                setVisibleCount(prev => prev + 10);
                setIsLoadMore(false);
            }, 600);
        }
    }, [visibleCount, customerContacts.length, isLoadMore]);

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator title="CUSTOMER CONTACTS" />

            <Animated.View entering={FadeInUp.duration(400)} className="px-6 pt-6 pb-2">
                <View className="bg-white flex-row items-center px-4 h-12 rounded-xl border border-gray-200 mb-2 shadow-sm">
                    <Search color="#9ca3af" size={20} />
                    <TextInput
                        className="flex-1 ml-2 text-gray-900 h-full"
                        placeholder="Cari nama kontak, perusahaan, no hp..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#9ca3af"
                    />
                </View>
            </Animated.View>

            <View className="flex-1">
                <FlatList
                    data={(isLoading || isInitializing) ? [] : customerContacts.slice(0, visibleCount)}
                    keyExtractor={(item) => item.id_customers_contact}
                    renderItem={({ item, index }) => (
                        <CustomerContactCard item={item} index={index} onPress={onItemPress} />
                    )}
                    contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100, flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    refreshControl={
                        <RefreshControl refreshing={isLoading && !isInitializing} onRefresh={fetchCustomerContacts} colors={[theme.colors.primary]} />
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
                    ListEmptyComponent={() => {
                        if (error) {
                            return (
                                <ErrorState
                                    title="Gagal Memuat Kontak"
                                    message={error}
                                    onRetry={fetchCustomerContacts}
                                    fullScreen={true}
                                />
                            );
                        }
                        if (isLoading || isInitializing) {
                            return (
                                <View style={{ marginHorizontal: -24 }}>
                                    <CustomerContactListSkeleton />
                                </View>
                            );
                        }
                        return (
                            <EmptyState
                                title="Data Kontak Kosong"
                                message="Tidak ada kontak pelanggan yang ditemukan."
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
