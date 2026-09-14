import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { View, FlatList, RefreshControl, TextInput, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Search } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSurvey } from '../hooks/useSurvey';
import { SurveyCard } from '../components/SurveyCard';
import { SurveyListSkeleton } from '../skeleton/SurveySkeleton';
import { theme } from '../../../theme/theme';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { ErrorState } from '../../../components/shared/ErrorState';
import { EmptyState } from '../../../components/shared/EmptyState';

type RootStackParamList = {
    SurveyForm: undefined;
    SurveyEdit: { id: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function SurveyListScreen() {
    const navigation = useNavigation<NavigationProp>();
    const { surveys, isLoading, error, loadSurveys } = useSurvey();
    const [searchQuery, setSearchQuery] = useState('');
    const [isInitializing, setIsInitializing] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [visibleCount, setVisibleCount] = useState(10);
    const [isLoadMore, setIsLoadMore] = useState(false);
    const flatListRef = useRef<FlatList>(null);
    const isNavigatingToDetail = useRef(false);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            if (!isNavigatingToDetail.current) {
                setSearchQuery('');
            }
            isNavigatingToDetail.current = false;

            const init = async () => {
                setIsInitializing(true);
                try {
                    await Promise.all([
                        loadSurveys(),
                        new Promise(resolve => setTimeout(resolve, 800))
                    ]);
                } catch (e) {
                    // ignore
                } finally {
                    if (isActive) setIsInitializing(false);
                }
            };

            init();

            return () => {
                isActive = false;
                setIsInitializing(true);
            };
        }, [loadSurveys])
    );

    const handleRefresh = async () => {
        setIsRefreshing(true);
        setVisibleCount(10);
        await loadSurveys();
        setTimeout(() => setIsRefreshing(false), 800);
    };

    const filteredSurveys = useMemo(() => {
        return surveys.filter(s =>
            s.code_survey?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (s.nm_customers || '').toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [surveys, searchQuery]);

    useEffect(() => {
        setVisibleCount(10);
    }, [searchQuery, surveys]);

    const handleLoadMore = useCallback(() => {
        if (visibleCount < filteredSurveys.length && !isLoadMore) {
            setIsLoadMore(true);
            setTimeout(() => {
                setVisibleCount(prev => prev + 10);
                setIsLoadMore(false);
            }, 600);
        }
    }, [visibleCount, filteredSurveys.length, isLoadMore]);

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator title="DATA SURVEY" />

            <Animated.View entering={FadeInUp.duration(400)} className="px-6 pt-6 pb-2">
                <View className="flex-row items-center justify-between">
                    <View className="flex-1 bg-white flex-row items-center px-4 h-12 rounded-xl border border-gray-200 mb-2">
                        <Search color="#9ca3af" size={20} />
                        <TextInput
                            className="flex-1 ml-2 text-gray-900"
                            placeholder="Cari nama atau kode survey..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                </View>
            </Animated.View>

            <View className="flex-1">
                <Animated.View entering={FadeInDown} className="flex-1">
                    <FlatList
                        ref={flatListRef}
                        data={(isLoading || isInitializing || isRefreshing) ? [] : filteredSurveys.slice(0, visibleCount)}
                        keyExtractor={(item) => item.id_survey}
                        renderItem={({ item }) => (
                            <SurveyCard
                                survey={item}
                                onPress={() => {
                                    isNavigatingToDetail.current = true;
                                    navigation.navigate('SurveyEdit', { id: item.id_survey });
                                }}
                            />
                        )}
                        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
                        showsVerticalScrollIndicator={false}
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0.5}
                        refreshControl={
                            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} colors={[theme.colors.primary]} />
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
                            if (error && !isInitializing) {
                                return (
                                    <ErrorState
                                        title="Gagal Memuat Survey"
                                        message={error}
                                        onRetry={loadSurveys}
                                        fullScreen={true}
                                    />
                                );
                            }
                            if (isLoading || isInitializing || isRefreshing) {
                                return (
                                    <View style={{ marginHorizontal: -16 }}>
                                        <SurveyListSkeleton />
                                    </View>
                                );
                            }
                            return (
                                <EmptyState
                                    title="Data Survey Kosong"
                                    message="Tidak ada survey yang ditemukan."
                                    fullScreen={true}
                                />
                            );
                        }}
                    />
                </Animated.View>
            </View>
        </View>
    );
}
