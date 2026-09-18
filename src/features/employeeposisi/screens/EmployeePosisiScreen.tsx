import React, { useState, useCallback, useMemo } from 'react';
import { View, FlatList, RefreshControl, TextInput, ActivityIndicator } from 'react-native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { useEmployeePosisi } from '../hooks/useEmployeePosisi';
import { EmployeePosisiCard } from '../components/EmployeePosisiCard';
import { EmployeePosisiListSkeleton } from '../skeleton/EmployeePosisiListSkeleton';
import { ErrorState } from '../../../components/shared/ErrorState';
import { EmptyState } from '../../../components/shared/EmptyState';
import { ButtonAdd } from '../../../components/ui/buttonAdd';
import { theme } from '../../../theme/theme';
import { Search } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { EmployeePosisi } from '../types/employeeposisi.types';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';

type RootStackParamList = {
    EmployeePosisiForm: { id?: string } | undefined;
    EmployeePosisiEdit: { id: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function EmployeePosisiScreen() {
    const { posisis: data, isLoading, error, refetch } = useEmployeePosisi();

    const [isInitializing, setIsInitializing] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [visibleCount, setVisibleCount] = useState(10);
    const [isLoadMore, setIsLoadMore] = useState(false);

    const route = useRoute();
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMsg, setToastMsg] = useState('');
    const [toastType, setToastType] = useState<ToastType>('success');
    const [toastTitle, setToastTitle] = useState('Sukses');

    React.useEffect(() => {
        const params = route.params as any;
        if (params?.toastMessage) {
            setToastMsg(params.toastMessage);
            setToastType(params.toastType || 'success');
            setToastTitle(params.toastType === 'error' ? 'Gagal' : 'Sukses');
            setToastVisible(true);
            
            navigation.setParams({ toastMessage: undefined, toastType: undefined });
        }
    }, [route.params]);

    const filteredData = useMemo(() => {
        if (!searchQuery) return data;
        const query = searchQuery.toLowerCase();
        return data.filter(item =>
            (item.nm_karyawan_posisi?.toLowerCase() || '').includes(query) ||
            (item.id_karyawan_posisi?.toString() || '').includes(query)
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
                    await Promise.all([
                        refetch(),
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
        }, [refetch])
    );
    const navigation = useNavigation<NavigationProp>();

    const handlePressCard = (item: EmployeePosisi) => {
        navigation.navigate('EmployeePosisiEdit', { id: item.id_karyawan_posisi.toString() });
    };

    const handleAdd = () => {
        navigation.navigate('EmployeePosisiForm');
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
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <HeaderNavigator isLoading={isLoading} />

            <Animated.View entering={FadeInUp.duration(400)} className="px-6 pt-6 pb-2">
                <View className="bg-white flex-row items-center px-4 h-12 rounded-xl border border-gray-200 mb-2 shadow-sm">
                    <Search color="#9ca3af" size={20} />
                    <TextInput
                        className="flex-1 ml-2 text-gray-900 h-full"
                        placeholder="Cari posisi..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#9ca3af"
                    />
                </View>
            </Animated.View>

            <View className="flex-1">
                <FlatList
                    data={(isLoading || isInitializing) ? [] : filteredData.slice(0, visibleCount)}
                    keyExtractor={(item) => item.id_karyawan_posisi.toString()}
                    renderItem={({ item, index }) => (
                        <EmployeePosisiCard item={item} index={index} onPress={handlePressCard} />
                    )}
                    contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100, flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    refreshControl={
                        <RefreshControl refreshing={isLoading && !isInitializing} onRefresh={refetch} colors={[theme.colors.primary]} />
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
                                    message={typeof error === 'string' ? error : 'Terjadi kesalahan'}
                                    onRetry={refetch}
                                    fullScreen={true}
                                />
                            );
                        }
                        if (isLoading || isInitializing) {
                            return (
                                <View style={{ marginHorizontal: -24 }}>
                                    <EmployeePosisiListSkeleton />
                                </View>
                            );
                        }
                        return (
                            <EmptyState
                                title="Data Kosong"
                                message="Belum ada posisi yang terdaftar."
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
