import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, TextInput, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Search, Plus, Calendar, Building, ChevronRight, FileText, Monitor } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { formatRp } from '../../../utils/helpers/money';
import { LktHeaderViewScreen } from './LktHeaderViewScreen';
import { ButtonAdd } from '../../../components/ui/buttonAdd';
import { RealisasiListSkeleton } from '../skeleton/RealisasiListSkeleton';

// Dummy data mirroring the PHP query fields
const DUMMY_DATA = [
    {
        id: '1',
        lktCode: 'LKT-EMM/2025/07/03646',
        cstCode: 'CST-EMM/2025/07/03624',
        startDate: '18-07-2025',
        customer: 'RSUD JOMBANG',
        description: 'Pengecekan mesin X-Ray',
        training: 0,
        bongkar: 150000,
        isDaring: false,
        status: 'Draft',
    },
    {
        id: '2',
        lktCode: 'LKT-EMM/2025/07/03646',
        cstCode: 'CST-EMM/2025/07/03624',
        startDate: '20-07-2025',
        customer: 'RSUD JOMBANG',
        description: 'Instalasi part baru via video call',
        training: 500000,
        bongkar: 0,
        isDaring: true,
        status: 'CLOSE',
    },
];

const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
        case 'OUTSTANDING': return 'bg-cyan-100 text-cyan-800 border-cyan-200';
        case 'ON PROGRESS': return 'bg-amber-100 text-amber-800 border-amber-200';
        case 'CLOSE': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
        case 'DRAFT': return 'bg-gray-100 text-gray-800 border-gray-200';
        case 'CANCEL': return 'bg-rose-100 text-rose-800 border-rose-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

export function RealisasiListView({ setActiveTab }: { setActiveTab: (tab: 'perbaikan' | 'realisasi') => void }) {
    const navigation = useNavigation<any>();

    const [searchQuery, setSearchQuery] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 1000);
    };

    const renderCard = ({ item, index }: { item: typeof DUMMY_DATA[0], index: number }) => (
        <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
            <TouchableOpacity
                className="bg-white p-4 rounded-xl mb-3 border border-gray-200 shadow-sm"
                onPress={() => {
                    navigation.navigate('RealisasiEdit', { id: item.id })
                }}
            >
                {/* Header: Codes & Status */}
                <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1 mr-2">
                        <Text className="text-sm font-extrabold text-blue-600 mb-0.5">{item.lktCode}</Text>
                        <Text className="text-xs font-medium text-gray-500">{item.cstCode}</Text>
                    </View>
                    <View className={`px-2 py-1 rounded-md border ${getStatusColor(item.status)}`}>
                        <Text className="text-[10px] font-bold uppercase">{item.status}</Text>
                    </View>
                </View>

                {/* Info Grid */}
                <View className="flex-row items-center mb-2">
                    <View className="flex-row items-center flex-1">
                        <Building size={14} color="#6b7280" />
                        <Text className="text-xs text-gray-700 ml-1.5 font-medium" numberOfLines={1}>{item.customer}</Text>
                    </View>
                    <View className="flex-row items-center ml-2">
                        <Calendar size={14} color="#6b7280" />
                        <Text className="text-xs text-gray-700 ml-1.5">{item.startDate}</Text>
                    </View>
                </View>

                <View className="flex-row items-start mb-3">
                    <FileText size={14} color="#6b7280" className="mt-0.5" />
                    <Text className="text-xs text-gray-600 ml-1.5 flex-1" numberOfLines={2}>{item.description}</Text>
                </View>

                {/* Footer Metrics (Training, Bongkar, Daring) */}
                <View className="flex-row items-center justify-between border-t border-gray-100 pt-3">
                    <View className="flex-row">
                        <View className="mr-8">
                            <Text className="text-[10px] text-gray-500 mb-0.5">Training</Text>
                            <Text className="text-xs font-bold text-gray-800">{formatRp(item.training)}</Text>
                        </View>
                        <View>
                            <Text className="text-[10px] text-gray-500 mb-0.5">Bongkar</Text>
                            <Text className="text-xs font-bold text-gray-800">{formatRp(item.bongkar)}</Text>
                        </View>
                    </View>

                    <View className="flex-row items-center">
                        {item.isDaring ? (
                            <View className="flex-row items-center bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                                <Monitor size={12} color="#059669" />
                                <Text className="text-[10px] font-bold text-emerald-700 ml-1">Daring</Text>
                            </View>
                        ) : (
                            <View className="flex-row items-center bg-gray-50 px-2 py-1 rounded border border-gray-200">
                                <Text className="text-[10px] font-bold text-gray-500">Tidak Daring</Text>
                            </View>
                        )}
                        <ChevronRight size={16} color="#9ca3af" className="ml-2" />
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator
                title={isRefreshing ? "MEMUAT DATA..." : "DETAIL LKT"}
                showBackButton={true}
                onBackPress={() => navigation.goBack()}
                disableAnimation={true}
            />

            {/* Main Content Container */}
            <View style={{ padding: 12, flex: 1, paddingBottom: 0 }}>
                <View className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex-1 mb-4">

                    <LktHeaderViewScreen
                        activeTab="realisasi"
                        setActiveTab={setActiveTab}
                    />

                    {/* Top Action Bar (Filter) */}
                    <View className="flex-row items-center justify-between mb-4">
                        {/* Search Bar */}
                        <View className="flex-1 flex-row items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                            <Search size={16} color="#9ca3af" />
                            <TextInput
                                className="flex-1 ml-2 text-sm text-gray-800 p-0"
                                placeholder="Cari LKT / CST..."
                                placeholderTextColor="#9ca3af"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </View>
                    </View>

                    {/* List */}
                    <FlatList
                        data={isRefreshing ? [] : DUMMY_DATA}
                        keyExtractor={(item: any, index) => item.id ? item.id : index.toString()}
                        renderItem={({ item, index }) => renderCard({ item, index })}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        refreshControl={
                            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} colors={['#0ea5e9']} />
                        }
                        ListEmptyComponent={
                            isRefreshing ? (
                                <RealisasiListSkeleton />
                            ) : (
                                <View className="items-center justify-center py-10">
                                    <Text className="text-gray-400 font-medium">Tidak ada data realisasi service.</Text>
                                </View>
                            )
                        }
                    />
                </View>
            </View>

            <ButtonAdd onPress={() => navigation.navigate('RealisasiForm')} />
        </View>
    );
}
