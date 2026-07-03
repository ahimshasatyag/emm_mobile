import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Plus, Search } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSurvey } from '../hooks/useSurvey';
import { SurveyCard } from '../components/SurveyCard';
import { SurveyListSkeleton } from '../skeleton/SurveySkeleton';
import { theme } from '../../../theme/theme';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { ButtonAdd } from '../../../components/ui/buttonAdd';
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

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const init = async () => {
                if (isActive) {
                    setIsInitializing(true);
                    await loadSurveys();
                    // Add a small delay so skeleton is visible on first load
                    setTimeout(() => {
                        if (isActive) setIsInitializing(false);
                    }, 500);
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
        await loadSurveys();
        setTimeout(() => {
            setIsRefreshing(false);
        }, 800); // Simulate network delay to show skeleton
    };

    const filteredSurveys = surveys.filter(s => 
        s.code_survey.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.nm_customers.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                <Animated.FlatList
                    entering={FadeInDown}
                    data={(isLoading || isInitializing || isRefreshing) ? [] : filteredSurveys}
                    keyExtractor={(item) => item.id_survey}
                    renderItem={({ item }) => (
                        <SurveyCard
                            survey={item}
                            onPress={() => navigation.navigate('SurveyEdit', { id: item.id_survey })}
                        />
                    )}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100, flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} colors={[theme.colors.primary]} />
                    }
                    ListEmptyComponent={() => {
                        if (error) {
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
            </View>

            {(!isLoading && !isInitializing && !isRefreshing) && !error && (
                <ButtonAdd onPress={() => navigation.navigate('SurveyForm')} />
            )}
        </View>
    );
}
