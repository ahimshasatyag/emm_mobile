import React, { useState, useCallback, useMemo } from 'react';
import { View, FlatList, Text, RefreshControl, TextInput, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Search } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { ButtonAdd } from '../../../components/ui/buttonAdd';
import { ApprovalSchemeCard } from '../components/ApprovalSchemeCard';
import { ApprovalSchemeListSkeleton } from '../skeleton/ApprovalSchemeListSkeleton';
import { useApprovalScheme } from '../hooks/useApprovalScheme';
import { theme } from '../../../theme/theme';
import { ErrorState } from '../../../components/shared/ErrorState';
import { EmptyState } from '../../../components/shared/EmptyState';

type RootStackParamList = {
    ApprovalSchemeForm: undefined;
    ApprovalSchemeEdit: { id: string };
};

export function ApprovalSchemeListScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const {
        data,
        isLoading,
        error,
        searchQuery,
        setSearchQuery,
        loadData
    } = useApprovalScheme();

    const [isInitializing, setIsInitializing] = useState(true);
    const [visibleCount, setVisibleCount] = useState(10);
    const [isLoadMore, setIsLoadMore] = useState(false);

    const filteredData = useMemo(() => {
        if (!searchQuery) return data;
        const query = searchQuery.toLowerCase();
        return data.filter(item =>
            item.scheme_name.toLowerCase().includes(query)
        );
    }, [data, searchQuery]);

    React.useEffect(() => {
        setVisibleCount(10);
    }, [searchQuery, data]);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const initialize = async () => {
                setIsInitializing(true);
                try {
                    await loadData();
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

    const handleAdd = () => {
        navigation.navigate('ApprovalSchemeForm');
    };

    const handleItemPress = (item: any) => {
        navigation.navigate('ApprovalSchemeEdit', { id: item.id });
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
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator title="SKEMA APPROVAL" />

            <Animated.View entering={FadeInUp.duration(400)} className="px-6 pt-6 pb-2">
                <View className="bg-white flex-row items-center px-4 h-12 rounded-xl border border-gray-200 mb-2 shadow-sm">
                    <Search color="#9ca3af" size={20} />
                    <TextInput
                        className="flex-1 ml-2 text-gray-900 h-full"
                        placeholder="Cari nama skema..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#9ca3af"
                    />
                </View>
            </Animated.View>

            <View className="flex-1">
                <FlatList
                    data={(isLoading || isInitializing) ? [] : filteredData.slice(0, visibleCount)}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }) => (
                        <ApprovalSchemeCard item={item} index={index} onPress={handleItemPress} />
                    )}
                    contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100, flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    refreshControl={
                        <RefreshControl refreshing={isLoading && !isInitializing} onRefresh={loadData} colors={[theme.colors.primary]} />
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
                                    title="Gagal Memuat Skema"
                                    message={error}
                                    onRetry={loadData}
                                    fullScreen={true}
                                />
                            );
                        }
                        if (isLoading || isInitializing) {
                            return (
                                <View style={{ marginHorizontal: -24 }}>
                                    <ApprovalSchemeListSkeleton />
                                </View>
                            );
                        }
                        return (
                            <EmptyState
                                title="Data Skema Kosong"
                                message="Tidak ada data skema approval yang ditemukan."
                                fullScreen={true}
                            />
                        );
                    }}
                />
            </View>

            {(!isLoading && !isInitializing) && !error && (
                <ButtonAdd onPress={handleAdd} />
            )}
        </View>
    );
}
