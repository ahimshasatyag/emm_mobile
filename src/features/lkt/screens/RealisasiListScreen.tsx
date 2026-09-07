import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, TextInput, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Search, Calendar, Building, ChevronRight, FileText, Monitor, Plus } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LktHeaderViewScreen } from './LktHeaderViewScreen';
import { RealisasiListSkeleton } from '../skeleton/RealisasiListSkeleton';
import { ButtonAdd } from '../../../components/ui/buttonAdd';
import { formatRp } from '../../../utils/helpers/money';
import { useLkt } from '../hooks/useLkt';
import { LktDetail, Realisasi } from '../types/lkt.types';

const getStatusColor = (status: string) => {
    switch ((status || '').toUpperCase()) {
        case 'ON PROGRESS': return 'bg-amber-100 text-amber-800 border-amber-200';
        case 'CLOSE': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
        case 'DRAFT': return 'bg-gray-100 text-gray-800 border-gray-200';
        case 'CANCEL': return 'bg-rose-100 text-rose-800 border-rose-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

const ITEMS_PER_PAGE = 10;

interface RealisasiListViewProps {
    setActiveTab: (tab: 'perbaikan' | 'realisasi') => void;
    lktCode?: string;
    lktDetail?: LktDetail | null;
}

export function RealisasiListView({ setActiveTab, lktCode, lktDetail }: RealisasiListViewProps) {
    const navigation = useNavigation<any>();
    const { loadLktDetail } = useLkt();

    const [searchQuery, setSearchQuery] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [page, setPage] = useState(1);

    const realisasiList: Realisasi[] = lktDetail?.realisasi_list || [];

    const filteredData = [...realisasiList].filter(item =>
        item.actual_description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(item.lkt_sub_code)?.includes(searchQuery)
    ).sort((a, b) => b.lkt_sub_code - a.lkt_sub_code);

    const paginatedData = filteredData.slice(0, page * ITEMS_PER_PAGE);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        setPage(1);
        if (lktCode) await loadLktDetail(lktCode);
        setIsRefreshing(false);
    };

    const handleLoadMore = () => {
        if (paginatedData.length < filteredData.length) {
            setPage(prev => prev + 1);
        }
    };

    const renderFooter = () => {
        if (paginatedData.length < filteredData.length) {
            return (
                <View className="py-4 items-center justify-center">
                    <ActivityIndicator size="small" color="#0ea5e9" />
                    <Text className="text-xs text-gray-400 mt-1">Memuat lebih banyak...</Text>
                </View>
            );
        }
        return null;
    };

    const renderCard = ({ item, index }: { item: Realisasi; index: number }) => {
        const teknisiNames = item.teknisi_list?.map(t => t.nm_karyawan).join(', ') || '-';
        const statusColor = item.f_cancel === 1 ? 'bg-rose-100 text-rose-800 border-rose-200' : getStatusColor(item.status);
        const statusLabel = item.f_cancel === 1 ? 'CANCEL' : item.status;

        return (
            <Animated.View entering={FadeInDown.delay(index * 80).springify()}>
                <TouchableOpacity
                    className="bg-white p-4 rounded-xl mb-3 border border-gray-200 shadow-sm"
                    onPress={() => navigation.navigate('RealisasiEdit', {
                        lktCode,
                        lktSubCode: item.lkt_sub_code,
                    })}
                    activeOpacity={0.7}
                >
                    {/* Header: Code & Status */}
                    <View className="flex-row justify-between items-start mb-2">
                        <View className="flex-1 mr-2">
                            <Text className="text-sm font-extrabold text-blue-600">LKT-{lktCode ? lktCode.slice(-5) : '-'}</Text>
                            <Text className="text-xs font-semibold text-gray-700 mt-0.5">CST-{lktDetail?.cst_code ? lktDetail.cst_code.slice(-5) : '-'}</Text>
                            <Text className="text-xs text-gray-500 mt-0.5">{teknisiNames}</Text>
                        </View>
                        <View className={`px-2 py-1 rounded-md border ${statusColor}`}>
                            <Text className="text-[10px] font-bold uppercase">{statusLabel}</Text>
                        </View>
                    </View>

                    <View className="flex-row items-center mb-2">
                        <Calendar size={13} color="#6b7280" />
                        <Text className="text-xs text-gray-700 ml-1.5">{item.actual_starting_date || '-'}</Text>
                        <Text className="text-xs text-gray-400 mx-2">|</Text>
                        <Text className="text-xs text-gray-700">{item.actual_day} hari</Text>
                    </View>

                    <View className="flex-row items-start mb-3">
                        <FileText size={13} color="#6b7280" style={{ marginTop: 2 }} />
                        <Text className="text-xs text-gray-600 ml-1.5 flex-1" numberOfLines={2}>
                            {item.actual_description || '-'}
                        </Text>
                    </View>

                    <View className="flex-row items-center justify-between border-t border-gray-100 pt-2">
                        <View className="flex-row">
                            <View className="mr-6">
                                <Text className="text-[10px] text-gray-500">Training</Text>
                                <Text className="text-xs font-bold text-gray-800">{formatRp(item.actual_training || 0)}</Text>
                            </View>
                            <View>
                                <Text className="text-[10px] text-gray-500">Bongkar</Text>
                                <Text className="text-xs font-bold text-gray-800">{formatRp(item.actual_bongkar || 0)}</Text>
                            </View>
                        </View>
                        <View className="flex-row items-center">
                            {item.flag_daring === 1 ? (
                                <View className="flex-row items-center bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                                    <Monitor size={11} color="#059669" />
                                    <Text className="text-[10px] font-bold text-emerald-700 ml-1">Daring</Text>
                                </View>
                            ) : (
                                <View className="bg-gray-50 px-2 py-1 rounded border border-gray-200">
                                    <Text className="text-[10px] font-bold text-gray-500">Tidak</Text>
                                </View>
                            )}
                            <ChevronRight size={14} color="#9ca3af" style={{ marginLeft: 8 }} />
                        </View>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    return (
        <View className="flex-1 bg-gray-50">
            <LktHeaderViewScreen
                activeTab="realisasi"
                setActiveTab={setActiveTab}
                titleHeader={isRefreshing ? 'MEMUAT DATA...' : 'DETAIL LKT'}
                cstCode={lktDetail?.cst_code}
                lktCode={lktDetail?.lkt_code}
                onBackPress={() => navigation.navigate('Drawer', { screen: 'LktListScreen' })}
            >
                {/* Search */}
                <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 mb-4">
                    <Search size={16} color="#9ca3af" />
                    <TextInput
                        className="flex-1 ml-2 text-sm text-gray-800 p-0"
                        placeholder="Cari deskripsi / visit #..."
                        placeholderTextColor="#9ca3af"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <FlatList
                    data={isRefreshing ? [] : paginatedData}
                    keyExtractor={(item) => String(item.lkt_sub_code)}
                    renderItem={renderCard}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.3}
                    ListFooterComponent={renderFooter}
                    refreshControl={
                        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} colors={['#0ea5e9']} />
                    }
                    ListEmptyComponent={
                        isRefreshing ? (
                            <RealisasiListSkeleton />
                        ) : (
                            <View className="items-center justify-center py-10">
                                <Text className="text-gray-400 font-medium">Belum ada data realisasi.</Text>
                            </View>
                        )
                    }
                />
            </LktHeaderViewScreen>

            {lktDetail?.flag_done !== 'Draft' && lktDetail?.flag_done !== 'DONE' && lktDetail?.f_cancel !== 1 && (
                <ButtonAdd
                    onPress={() => navigation.navigate('RealisasiForm', {
                        lktCode,
                        cstCode: lktDetail?.cst_code
                    })}
                />
            )}
        </View>
    );
}
