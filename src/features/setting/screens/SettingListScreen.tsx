import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, FlatList, RefreshControl, TextInput, ActivityIndicator } from 'react-native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { useSetting } from '../hooks/useSetting';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { setData, setLoading, setError } from '../stores/settingSlice';
import { fetchSettingsApi } from '../api/setting.api';
import { SettingCard } from '../components/SettingCard';
import { SettingListSkeleton } from '../skeleton/SettingListSkeleton';
import { ErrorState } from '../../../components/shared/ErrorState';
import { EmptyState } from '../../../components/shared/EmptyState';
import { ButtonAdd } from '../../../components/ui/buttonAdd';
import { theme } from '../../../theme/theme';
import { Search } from 'lucide-react-native';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SettingData } from '../types/setting.types';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';

type RootStackParamList = {
    SettingForm: { id?: string } | undefined;
    SettingEdit: { id: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function SettingListScreen() {
    const { data, isLoading, error } = useSetting();

    const [isInitializing, setIsInitializing] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [visibleCount, setVisibleCount] = useState(10);
    const [isLoadMore, setIsLoadMore] = useState(false);

    const route = useRoute();
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMsg, setToastMsg] = useState('');
    const [toastType, setToastType] = useState<ToastType>('success');
    const [toastTitle, setToastTitle] = useState('Sukses');

    // Handle toast messages from navigation params
    React.useEffect(() => {
        const params = route.params as any;
        if (params?.toastMessage) {
            setToastMsg(params.toastMessage);
            setToastType(params.toastType || 'success');
            setToastTitle(params.toastType === 'error' ? 'Gagal' : 'Sukses');
            setToastVisible(true);

            // Clear params so it doesn't show again on re-focus
            navigation.setParams({ toastMessage: undefined, toastType: undefined });
        }
    }, [route.params]);

    const filteredData = useMemo(() => {
        if (!searchQuery) return data;
        const query = searchQuery.toLowerCase();
        return data.filter(item =>
            item.setting_label.toLowerCase().includes(query) ||
            (item.setting_value && item.setting_value.toLowerCase().includes(query))
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
                    await handleRefresh();
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
    const dispatch = useAppDispatch();
    const navigation = useNavigation<NavigationProp>();

    const handleRefresh = async () => {
        dispatch(setLoading(true));
        try {
            const result = await fetchSettingsApi();
            dispatch(setData(result));
        } catch (e: any) {
            dispatch(setError(e.message));
        }
    };

    const handlePressCard = (item: SettingData) => {
        navigation.navigate('SettingEdit', { id: item.setting_id });
    };

    const handleAdd = () => {
        navigation.navigate('SettingForm');
    };

    const handleLoadMore = useCallback(() => {
        if (visibleCount < filteredData.length && !isLoadMore) {
            setIsLoadMore(true);
            setTimeout(() => {
                setVisibleCount(prev => prev + 10);
                setIsLoadMore(false);
            }, 600); // 600ms artificial delay for loading sensation
        }
    }, [visibleCount, filteredData.length, isLoadMore]);

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <HeaderNavigator isLoading={isLoading} />

            <View className="px-4 pt-3 pb-1">
                <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm mb-2">
                    <Search size={20} color="#9CA3AF" />
                    <TextInput
                        placeholder="Cari label atau value setting..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        className="flex-1 ml-3 text-sm text-gray-800 p-0"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>
            </View>

            <View className="flex-1">
                <FlatList
                    data={(isLoading || isInitializing) ? [] : filteredData.slice(0, visibleCount)}
                    keyExtractor={(item) => item.setting_id}
                    renderItem={({ item, index }) => (
                        <SettingCard item={item} index={index} onPress={handlePressCard} />
                    )}
                    contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100, flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    refreshControl={
                        <RefreshControl refreshing={isLoading && !isInitializing} onRefresh={handleRefresh} colors={[theme.colors.primary]} />
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
                                    title="Gagal Memuat Data"
                                    message={error}
                                    onRetry={handleRefresh}
                                    fullScreen={true}
                                />
                            );
                        }
                        if (isLoading || isInitializing) {
                            return (
                                <View style={{ marginHorizontal: -24 }}>
                                    <SettingListSkeleton />
                                </View>
                            );
                        }
                        return (
                            <EmptyState
                                title="Data Kosong"
                                message="Belum ada setting yang terdaftar."
                                fullScreen={true}
                            />
                        );
                    }}
                />
            </View>

            {(!isLoading && !isInitializing) && !error && (
                <ButtonAdd onPress={handleAdd} />
            )}

            <ToastMessages
                visible={toastVisible}
                type={toastType}
                title={toastTitle}
                message={toastMsg}
                onClose={() => setToastVisible(false)}
            />
        </View>
    );
}
