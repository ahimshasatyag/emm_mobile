import React, { useEffect , useState, useCallback } from 'react';
import { View, FlatList, Text, RefreshControl, TextInput } from 'react-native';
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
        fetchCustomerContacts();
    }, []);

    const onAdd = () => {
        navigation.navigate('CustomerContactForm');
    };

    const onItemPress = (item: any) => {
        navigation.navigate('CustomerContactEdit', { id: item.id_customers_contact });
    };

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator title="KONTAK PELANGGAN" />

            <Animated.View entering={FadeInUp.duration(400)} className="px-6 pt-6 pb-2">
                <View className="bg-white flex-row items-center px-4 h-12 rounded-xl border border-gray-200 mb-2">
                    <Search color="#9ca3af" size={20} />
                    <TextInput
                        className="flex-1 ml-2 text-gray-900"
                        placeholder="Cari nama kontak, perusahaan, no hp..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </Animated.View>

            <View className="flex-1">
                <FlatList
                    data={(isLoading || isInitializing) ? [] : customerContacts}
                    keyExtractor={(item) => item.id_customers_contact}
                    renderItem={({ item, index }) => (
                        <CustomerContactCard item={item} index={index} onPress={onItemPress} />
                    )}
                    contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100, flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={isLoading} onRefresh={fetchCustomerContacts} colors={[theme.colors.primary]} />
                    }
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
