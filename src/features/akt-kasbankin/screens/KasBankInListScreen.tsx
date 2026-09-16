import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { View, FlatList, RefreshControl, TextInput, DeviceEventEmitter, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { Search } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useKasBankIn } from '../hooks/useKasBankIn';
import { KasBankInCard } from '../components/KasBankInCard';
import { KasBankInListSkeleton } from '../skeleton/KasBankInListSkeleton';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { EmptyState } from '../../../components/shared/EmptyState';
import { ButtonAdd } from '../../../components/ui/buttonAdd';
import { theme } from '../../../theme/theme';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';

export const KasBankInListScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { kasBankIns, isLoading, loadKasBankIns, error } = useKasBankIn();

    const [isInitializing, setIsInitializing] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [toast, setToast] = useState<{ visible: boolean; message: string; type: ToastType }>({ visible: false, message: '', type: 'error' });

    const [visibleCount, setVisibleCount] = useState(10);
    const [isLoadMore, setIsLoadMore] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        const subscription = DeviceEventEmitter.addListener('kasBankInSaved', (message) => {
            setToast({ visible: true, message, type: 'success' });
        });

        // Fallback for route params just in case
        if (route.params?.successMessage) {
            setToast({ visible: true, message: route.params.successMessage, type: 'success' });
            navigation.setParams({ successMessage: undefined });
        }

        return () => {
            subscription.remove();
        };
    }, [route.params?.successMessage]);

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

    const filteredList = useMemo(() => {
        let result = [...(kasBankIns || [])];
        
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(item => 
                (item.code_kb_masuk && item.code_kb_masuk.toLowerCase().includes(query)) ||
                (item.deskripsi && item.deskripsi.toLowerCase().includes(query))
            );
        }

        result.sort((a, b) => {
            const dateA = new Date(a.d_bank || 0).getTime();
            const dateB = new Date(b.d_bank || 0).getTime();
            
            if (dateB !== dateA) {
                return dateB - dateA;
            }
            
            const idA = parseInt(a.id_kb_masuk || '0');
            const idB = parseInt(b.id_kb_masuk || '0');
            return idB - idA;
        });

        return result;
    }, [kasBankIns, searchQuery]);

    useEffect(() => {
        setVisibleCount(10);
    }, [searchQuery, kasBankIns]);

    const handleLoadMore = useCallback(() => {
        if (visibleCount < filteredList.length && !isLoadMore) {
            setIsLoadMore(true);
            setTimeout(() => {
                setVisibleCount(prev => prev + 10);
                setIsLoadMore(false);
            }, 600);
        }
    }, [visibleCount, filteredList.length, isLoadMore]);

    return (
        <View className="flex-1 bg-gray-50">
            <ToastMessages
                visible={toast.visible}
                title={toast.type === 'success' ? 'Success' : 'Pemberitahuan'}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(prev => ({ ...prev, visible: false }))}
            />
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
                <FlatList
                    ref={flatListRef}
                    data={isLoading || isInitializing || isRefreshing ? [] : filteredList.slice(0, visibleCount)}
                    keyExtractor={(item) => item.id_kb_masuk}
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 100, paddingHorizontal: 16 }}
                    showsVerticalScrollIndicator={false}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={handleRefresh}
                            colors={[theme.colors.primary]}
                        />
                    }
                    renderItem={({ item, index }) => (
                        <KasBankInCard
                            item={item}
                            index={index}
                            onPress={() => {
                                // Add navigation if needed
                            }}
                        />
                    )}
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
                        if (isLoading || isInitializing || isRefreshing) {
                            return (
                                <View style={{ marginHorizontal: -16 }}>
                                    <KasBankInListSkeleton />
                                </View>
                            );
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
