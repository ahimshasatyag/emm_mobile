import React, { useEffect, useState, useMemo } from 'react';
import { View, ScrollView, RefreshControl, Text, TextInput } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { fetchTandaTerimaCusts, deleteTandaTerimaCust } from '../stores/tandaterimacustSlice';
import { TandaTerimaCustCard } from '../components/TandaTerimaCustCard';
import { TandaTerimaCustListSkeleton } from '../skeleton/TandaTerimaCustListSkeleton';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { theme } from '../../../theme/theme';
import { ButtonAdd } from '../../../components/ui/buttonAdd';
import { ModalCancel } from '../../../components/ui/ModalCancel';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';
import { Search } from 'lucide-react-native';

type RootStackParamList = {
    TandaTerimaCustListScreen: { toastMessage?: string; toastType?: ToastType };
    TandaTerimaCustFormScreen: undefined;
    TandaTerimaCustEditScreen: { id: string };
};
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const TandaTerimaCustListScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const dispatch = useAppDispatch();
    const { list, loading } = useAppSelector(state => state.tandaterimacust);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastType, setToastType] = useState<ToastType>('success');
    const [toastMsg, setToastMsg] = useState('');
    const route = useRoute<RouteProp<RootStackParamList, 'TandaTerimaCustListScreen'>>();

    const loadData = async (showRefresh = false) => {
        if (showRefresh) setIsRefreshing(true);
        await dispatch(fetchTandaTerimaCusts());
        if (showRefresh) setIsRefreshing(false);
    };

    useEffect(() => {
        loadData();
    }, [dispatch]);

    useEffect(() => {
        if (route.params?.toastMessage) {
            setToastMsg(route.params.toastMessage);
            setToastType(route.params.toastType || 'success');
            setToastVisible(true);
            navigation.setParams({ toastMessage: undefined, toastType: undefined });
        }
    }, [route.params?.toastMessage]);

    const handleDeleteClick = (id: string) => {
        setItemToDelete(id);
        setDeleteModalVisible(true);
    };

    const confirmDelete = async () => {
        if (itemToDelete) {
            await dispatch(deleteTandaTerimaCust(itemToDelete));
            setDeleteModalVisible(false);
            setItemToDelete(null);

            setToastMsg('Data berhasil dihapus!');
            setToastType('success');
            setToastVisible(true);
        }
    };

    const filteredList = useMemo(() => {
        if (!searchQuery) return list;
        const query = searchQuery.toLowerCase();
        return list.filter(item =>
            item.nm_customers.toLowerCase().includes(query) ||
            (item.keterangan && item.keterangan.toLowerCase().includes(query)) ||
            item.date_tanda_terima.toLowerCase().includes(query)
        );
    }, [list, searchQuery]);

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator title={isRefreshing ? "MEMUAT DATA..." : "REPOSITORY TANDA TERIMA"} showBackButton={false} />

            <View className="px-4 pt-3 pb-1">
                <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
                    <Search size={20} color="#9CA3AF" />
                    <TextInput
                        placeholder="Cari customer atau keterangan..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        className="flex-1 ml-3 text-sm text-gray-800 p-0"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>
            </View>

            <ScrollView
                className="flex-1 px-4 pt-2"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={() => loadData(true)} colors={[theme.colors.primary]} />
                }
            >
                {(loading || isRefreshing) ? (
                    <TandaTerimaCustListSkeleton />
                ) : (
                    <Animated.View entering={FadeIn} exiting={FadeOut} className="flex-1">
                        {filteredList.length === 0 ? (
                            <View className="items-center justify-center py-10">
                                <Text className="text-gray-500">Belum ada data Tanda Terima</Text>
                            </View>
                        ) : (
                            filteredList.map((item) => (
                                <TandaTerimaCustCard
                                    key={item.id_tanda_terima_cust}
                                    data={item}
                                    onPress={() => navigation.navigate('TandaTerimaCustEditScreen', { id: item.id_tanda_terima_cust })}
                                    onDelete={() => handleDeleteClick(item.id_tanda_terima_cust)}
                                />
                            ))
                        )}
                        <View className="h-32" />
                    </Animated.View>
                )}
            </ScrollView>

            <ButtonAdd onPress={() => navigation.navigate('TandaTerimaCustFormScreen')} />

            <ModalCancel
                visible={deleteModalVisible}
                title="Hapus Data"
                message="Anda yakin ingin menghapus data ini?"
                confirmText="Ya, Hapus"
                cancelText="Batal"
                onConfirm={confirmDelete}
                onCancel={() => {
                    setDeleteModalVisible(false);
                    setItemToDelete(null);
                }}
            />

            <ToastMessages
                visible={toastVisible}
                type={toastType}
                message={toastMsg}
                onClose={() => setToastVisible(false)}
            />
        </View>
    );
};
