import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, RefreshControl, TextInput } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Search } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useKasBankIn } from '../hooks/useKasBankIn';
import { KasBankInCard } from '../components/KasBankInCard';
import { KasBankInListSkeleton } from '../skeleton/KasBankInListSkeleton';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { EmptyState } from '../../../components/shared/EmptyState';
import { ButtonAdd } from '../../../components/ui/buttonAdd';
import { theme } from '../../../theme/theme';

export const KasBankInListScreen = () => {
    const navigation = useNavigation<any>();
    const { kasBankIns, isLoading, loadKasBankIns, error } = useKasBankIn();

    const [isInitializing, setIsInitializing] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const initialize = async () => {
                setIsInitializing(true);
                try {
                    await Promise.all([
                        loadKasBankIns(),
                        new Promise(resolve => setTimeout(resolve, 600))
                    ]);
                } finally {
                    if (isActive) setIsInitializing(false);
                }
            };

            initialize();

            return () => {
                isActive = false;
                setIsInitializing(true);
            };
        }, [loadKasBankIns])
    );

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await Promise.all([
                loadKasBankIns(),
                new Promise(resolve => setTimeout(resolve, 600))
            ]);
        } finally {
            setIsRefreshing(false);
        }
    };

    const filteredList = kasBankIns.filter(item => {
        const matchSearch = item.code_kb_masuk?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.deskripsi?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchSearch;
    });

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator title="PENERIMAAN KAS DAN BANK" />

            <Animated.View entering={FadeInUp.duration(400)} className="px-4 py-3">
                <View className="flex-row items-center space-x-3">
                    <View className="flex-1 flex-row items-center bg-white px-4 py-3.5 rounded-xl border border-gray-200 shadow-sm">
                        <Search size={20} color="#9CA3AF" />
                        <TextInput
                            placeholder="Cari Dokumen..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            className="flex-1 ml-3 text-sm text-gray-800 p-0"
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>
                </View>
            </Animated.View>

            <View className="flex-1">
                <Animated.FlatList
                    entering={FadeInDown}
                    data={isLoading || isInitializing || isRefreshing ? [] : filteredList}
                    keyExtractor={(item) => item.id_kb_masuk}
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 20, paddingHorizontal: 16 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={handleRefresh}
                            colors={[theme.colors.primary]}
                        />
                    }
                    renderItem={({ item }) => (
                        <KasBankInCard
                            item={item}
                            onPress={() => {

                            }}
                        />
                    )}
                    ListEmptyComponent={() => {
                        if (isLoading || isInitializing || isRefreshing) {
                            return <KasBankInListSkeleton />;
                        }
                        return (
                            <EmptyState
                                title="Tidak ada Data"
                                description="Data Kas Bank Masuk yang Anda cari tidak ditemukan."
                            />
                        );
                    }}
                />
            </View>

            <ButtonAdd onPress={() => navigation.navigate('KasBankInForm', { id: null })} />
        </View>
    );
};
