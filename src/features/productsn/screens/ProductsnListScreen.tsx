import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, RefreshControl, ScrollView, TextInput } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Search } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut, FadeInUp, LinearTransition } from 'react-native-reanimated';
import { theme } from '../../../theme/theme';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { useProductsn } from '../hooks/useProductsn';
import { ProductsnCard } from '../components/ProductsnCard';
import { ProductsnListSkeleton } from '../skeleton/ProductsnListSkeleton';
import { ButtonAdd } from '../../../components/ui/buttonAdd';

export function ProductsnListScreen() {
    const navigation = useNavigation<any>();
    const { productSns, isLoading, fetchInitialData, fetchProductSns } = useProductsn();

    const [searchQuery, setSearchQuery] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);

    const initialize = async () => {
        setIsInitializing(true);
        await fetchInitialData();
        setIsInitializing(false);
    };

    useEffect(() => {
        initialize();
    }, []);

    useFocusEffect(
        useCallback(() => {
            if (!isInitializing) {
                fetchProductSns();
            }
        }, [isInitializing])
    );

    const onRefresh = async () => {
        setIsRefreshing(true);
        await fetchInitialData();
        setIsRefreshing(false);
    };

    const filteredProductSns = productSns.filter(item => {
        const productName = item.product?.nm_product?.toLowerCase() || '';
        const productCode = item.product?.code_product?.toLowerCase() || '';
        const sn = item.sn?.toLowerCase() || '';
        const search = searchQuery.toLowerCase();

        return productName.includes(search) || productCode.includes(search) || sn.includes(search);
    });

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator title="PRODUCT SN" />

            <Animated.View entering={FadeInUp.duration(400)} className="px-6 pt-6 pb-2">
                <View className="flex-row items-center justify-between">
                    <View className="flex-1 bg-white flex-row items-center px-4 h-12 rounded-xl border border-gray-200 shadow-sm">
                        <Search color="#9CA3AF" size={20} />
                        <TextInput
                            className="flex-1 ml-2 text-gray-900 h-full"
                            placeholder="Search by SN or Product..."
                            placeholderTextColor="#9CA3AF"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                </View>
            </Animated.View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
                }
            >
                {(isInitializing || (isLoading && productSns.length === 0)) ? (
                    <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>
                        <ProductsnListSkeleton />
                    </Animated.View>
                ) : (
                    <Animated.View layout={LinearTransition.springify()}>
                        {filteredProductSns.length > 0 ? (
                            filteredProductSns.map((item, index) => (
                                <ProductsnCard
                                    key={item.id_product_sn}
                                    item={item}
                                    index={index}
                                    onPress={() => navigation.navigate('ProductsnEdit', { id: item.id_product_sn })}
                                />
                            ))
                        ) : (
                            <Animated.View entering={FadeIn.delay(200)} className="items-center justify-center mt-20">
                                <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-4">
                                    <Search color="#9CA3AF" size={40} />
                                </View>
                                <Text className="text-lg font-bold text-gray-800 mb-2">Data Tidak Ditemukan</Text>
                                <Text className="text-sm text-gray-500 text-center px-10">
                                    {searchQuery ? `Tidak ada Product SN yang cocok dengan "${searchQuery}"` : "Belum ada data Product SN."}
                                </Text>
                            </Animated.View>
                        )}
                    </Animated.View>
                )}
            </ScrollView>

            {!isInitializing && (
                <ButtonAdd onPress={() => navigation.navigate('ProductsnForm')} />
            )}
        </View>
    );
}
