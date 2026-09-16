import React, { useState, useCallback } from 'react';
import { View, ScrollView, RefreshControl, Text, Alert, FlatList, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { EmptyState } from '../../../components/shared/EmptyState';
import { ErrorState } from '../../../components/shared/ErrorState';
import { useApprovebaru } from '../hooks/useApprovebaru';
import { ApprovebaruCard } from '../components/ApprovebaruCard';
import { ApprovebaruModal } from '../components/ApprovebaruModal';
import { ApprovebaruSkeleton } from '../skeleton/ApprovebaruSkeleton';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';

export const ApprovebaruListScreen = () => {
    const {
        approvals,
        currentDetail,
        loading,
        loadingDetail,
        error,
        getApprovals,
        getApprovalDetail,
        submitApprove,
        submitReject,
        resetDetail
    } = useApprovebaru();

    const [isInitializing, setIsInitializing] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [toast, setToast] = useState<{ visible: boolean; message: string; type: ToastType }>({ visible: false, message: '', type: 'success' });

    const [visibleCount, setVisibleCount] = useState(10);
    const [isLoadMore, setIsLoadMore] = useState(false);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const initialize = async () => {
                setIsInitializing(true);
                setVisibleCount(10);
                try {
                    await Promise.all([
                        getApprovals(),
                        new Promise(resolve => setTimeout(resolve, 800))
                    ]);
                } catch (error) {
                    // console.error(error);
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
        }, [getApprovals])
    );

    const onRefresh = useCallback(async () => {
        setIsRefreshing(true);
        setVisibleCount(10);
        try {
            await getApprovals();
        } finally {
            setIsRefreshing(false);
        }
    }, [getApprovals]);

    const handleLoadMore = useCallback(() => {
        if (visibleCount < approvals.length && !isLoadMore) {
            setIsLoadMore(true);
            setTimeout(() => {
                setVisibleCount(prev => prev + 10);
                setIsLoadMore(false);
            }, 600);
        }
    }, [visibleCount, approvals.length, isLoadMore]);

    const handleView = (id: number) => {
        setSelectedId(id);
        setModalVisible(true);
        getApprovalDetail(id);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedId(null);
        resetDetail();
    };

    const handleApprove = async (id: number) => {
        const result = await submitApprove(id);
        if (result.meta.requestStatus === 'fulfilled') {
            setToast({ visible: true, message: 'Approval berhasil disetujui', type: 'success' });
            setModalVisible(false); // Close detail modal if open
        } else {
            setToast({ visible: true, message: 'Terjadi kesalahan saat menyetujui', type: 'error' });
        }
    };

    const handleReject = async (id: number) => {
        const reason = "Ditolak oleh sistem (dummy)";
        const result = await submitReject(id, reason);
        if (result.meta.requestStatus === 'fulfilled') {
            setToast({ visible: true, message: 'Approval berhasil ditolak', type: 'success' });
            setModalVisible(false); // Close detail modal if open
        } else {
            setToast({ visible: true, message: 'Terjadi kesalahan saat menolak', type: 'error' });
        }
    };

    const renderContent = () => {
        if (error && !isInitializing) {
            return (
                <ScrollView 
                    className="flex-1"
                    contentContainerStyle={{ flexGrow: 1 }}
                    refreshControl={
                        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={['#2563eb']} />
                    }
                >
                    <ErrorState 
                        title="Gagal Memuat Approval"
                        message={error}
                        onRetry={getApprovals}
                        fullScreen={true}
                    />
                </ScrollView>
            );
        }

        const isLoadingState = isInitializing || loading;

        if (isLoadingState) {
            return (
                <ScrollView
                    className="flex-1"
                    refreshControl={
                        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={['#2563eb']} />
                    }
                >
                    <ApprovebaruSkeleton />
                </ScrollView>
            );
        }

        if (approvals.length === 0) {
            return (
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
                    refreshControl={
                        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={['#2563eb']} />
                    }
                >
                    <EmptyState title="Tidak ada data" message="Tidak ada antrean approval saat ini." />
                </ScrollView>
            );
        }

        return (
            <FlatList
                className="flex-1"
                data={approvals.slice(0, visibleCount)}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item, index }) => (
                    <ApprovebaruCard
                        item={item}
                        index={index}
                        onView={handleView}
                        onApprove={handleApprove}
                        onReject={handleReject}
                    />
                )}
                contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={['#2563eb']} />
                }
                ListFooterComponent={() => {
                    if (isLoadMore) {
                        return (
                            <View className="py-4 items-center justify-center">
                                <ActivityIndicator size="small" color="#2563eb" />
                            </View>
                        );
                    }
                    return null;
                }}
            />
        );
    };

    return (
        <View className="flex-1 bg-[#f9fafb]">
            <ToastMessages
                visible={toast.visible}
                title={toast.type === 'success' ? 'Sukses' : 'Gagal'}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(prev => ({ ...prev, visible: false }))}
            />
            <HeaderNavigator title="APPROVE BARU" isBack={false} />

            {/* Content Area */}
            {renderContent()}

            {/* Detail Modal */}
            <ApprovebaruModal
                visible={modalVisible}
                onClose={handleCloseModal}
                detail={currentDetail}
                loading={loadingDetail}
                onApprove={() => selectedId && handleApprove(selectedId)}
                onReject={() => selectedId && handleReject(selectedId)}
                approvalId={selectedId}
            />
        </View>
    );
};
