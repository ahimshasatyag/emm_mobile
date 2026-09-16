import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator, ScrollView } from 'react-native';
import { HistoryApproval } from '../types/approve.types';
import { CheckCircle2, XCircle } from 'lucide-react-native';
import { theme } from '../../../theme/theme';
import { ApproveSkeleton } from '../skeleton/ApproveSkeleton';
import { EmptyState } from '../../../components/shared/EmptyState';

interface HistoryTabProps {
    data: HistoryApproval[];
    onRowPress?: (id: string, folder: string, code: string) => void;
    isRefreshing?: boolean;
    onRefresh?: () => void;
    loading?: boolean;
}

export const HistoryTab: React.FC<HistoryTabProps> = ({ data, onRowPress, isRefreshing, onRefresh, loading }) => {
    const [visibleCount, setVisibleCount] = useState(10);
    const [isLoadMore, setIsLoadMore] = useState(false);

    useEffect(() => {
        if (isRefreshing || data.length < visibleCount) {
            setVisibleCount(10);
        }
    }, [isRefreshing, data.length]);

    const handleLoadMore = useCallback(() => {
        if (visibleCount < data.length && !isLoadMore) {
            setIsLoadMore(true);
            setTimeout(() => {
                setVisibleCount(prev => prev + 10);
                setIsLoadMore(false);
            }, 600);
        }
    }, [visibleCount, data.length, isLoadMore]);

    if (loading) {
        return (
            <ScrollView
                className="flex-1"
                refreshControl={
                    onRefresh ? (
                        <RefreshControl refreshing={!!isRefreshing} onRefresh={onRefresh} colors={['#2563eb']} />
                    ) : undefined
                }
            >
                <ApproveSkeleton hideHeader={true} type="history" />
            </ScrollView>
        );
    }

    if (data.length === 0) {
        return (
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
                refreshControl={
                    onRefresh ? (
                        <RefreshControl refreshing={!!isRefreshing} onRefresh={onRefresh} colors={['#2563eb']} />
                    ) : undefined
                }
            >
                <EmptyState title="Tidak ada data" message="Belum ada riwayat approval." />
            </ScrollView>
        );
    }

    return (
        <FlatList
            className="flex-1"
            data={data.slice(0, visibleCount)}
            keyExtractor={(item, index) => item.id_approval || index.toString()}
            contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            refreshControl={
                onRefresh ? (
                    <RefreshControl refreshing={!!isRefreshing} onRefresh={onRefresh} colors={['#2563eb']} />
                ) : undefined
            }
            renderItem={({ item }) => (
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => onRowPress && onRowPress(item.id_approval, item.nm_module, item.code_key_table)}
                    className="bg-white p-4 rounded-xl shadow-sm mb-4 border border-gray-100"
                >
                    <View className="flex-row justify-between items-start mb-1">
                        <Text className="text-sm font-bold text-gray-800 flex-1 mr-2">{item.code_key_table}</Text>
                        {item.action_dipilih === 1 ? (
                            <View className="bg-green-50 px-3 py-1 rounded-full border border-green-100 flex-row items-center">
                                <CheckCircle2 size={12} color="#16a34a" />
                                <Text className="text-green-600 text-[10px] font-bold ml-1">Approved</Text>
                            </View>
                        ) : (
                            <View className="bg-red-50 px-3 py-1 rounded-full border border-red-100 flex-row items-center">
                                <XCircle size={12} color="#dc2626" />
                                <Text className="text-red-600 text-[10px] font-bold ml-1">Rejected</Text>
                            </View>
                        )}
                    </View>

                    <Text className="text-xs text-gray-600 mb-1">User: {item.nm_users}</Text>
                    <View className="flex-row justify-between items-start mb-1 gap-x-2">
                        <Text className="text-xs text-gray-500">{item.date_request}</Text>
                        <Text className="text-xs font-medium text-gray-500 flex-1 text-right">Module: {item.nm_module}</Text>
                    </View>
                    {item.alasan && item.alasan !== '-' ? (
                        <Text className="text-[10px] text-gray-400 italic">Note: {item.alasan}</Text>
                    ) : null}
                </TouchableOpacity>
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
        />
    );
};
