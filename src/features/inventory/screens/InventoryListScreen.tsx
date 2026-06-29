import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, RefreshControl, ScrollView, TextInput } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Plus, Search, Filter } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut, FadeInUp, LinearTransition } from 'react-native-reanimated';
import { theme } from '../../../theme/theme';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { useInventory } from '../hooks/useInventory';
import { InventoryCard } from '../components/InventoryCard';
import { InventoryListSkeleton } from '../skeleton/InventoryListSkeleton';
import { ButtonAdd } from '../../../components/ui/buttonAdd';

export function InventoryListScreen() {
    const navigation = useNavigation<any>();
    const { assets, isLoading, fetchInitialData } = useInventory();

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
                fetchInitialData();
            }
        }, [isInitializing])
    );

    const onRefresh = async () => {
        setIsRefreshing(true);
        await fetchInitialData();
        setIsRefreshing(false);
    };

    const filteredAssets = assets.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.serial?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.status?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator title="SERIAL NUMBER" />

            <Animated.View entering={FadeInUp.duration(400)} className="px-6 pt-6 pb-2">
                <View className="flex-row items-center justify-between">
                    <View className="flex-1 bg-white flex-row items-center px-4 h-12 rounded-xl border border-gray-200 mb-2">
                        <Search color="#9CA3AF" size={20} />
                        <TextInput
                            className="flex-1 ml-2 text-gray-900"
                            placeholder="Cari aset atau serial..."
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
                {(isInitializing || isRefreshing) ? (
                    <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>
                        <InventoryListSkeleton />
                    </Animated.View>
                ) : (
                    <Animated.View layout={LinearTransition.springify()}>
                        {filteredAssets.length > 0 ? (
                            filteredAssets.map((item, index) => (
                                <InventoryCard
                                    key={item.id}
                                    item={item}
                                    index={index}
                                    onPress={() => navigation.navigate('InventoryEdit', { id: item.id })}
                                />
                            ))
                        ) : (
                            <Animated.View entering={FadeIn.delay(200)} className="items-center justify-center mt-20">
                                <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-4">
                                    <Search color="#9CA3AF" size={40} />
                                </View>
                                <Text className="text-lg font-bold text-gray-800 mb-2">Aset Tidak Ditemukan</Text>
                                <Text className="text-sm text-gray-500 text-center px-10">
                                    {searchQuery ? `Tidak ada aset yang cocok dengan "${searchQuery}"` : "Belum ada data inventaris aset."}
                                </Text>
                            </Animated.View>
                        )}
                    </Animated.View>
                )}
            </ScrollView>

            {!isInitializing && !isLoading && (
                <ButtonAdd onPress={() => navigation.navigate('InventoryForm')} />
            )}
        </View>
    );
}
