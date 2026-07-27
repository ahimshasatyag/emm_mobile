import React, { useState, useCallback } from 'react';
import { View, ScrollView, RefreshControl, Text, Alert } from 'react-native';
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

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const initialize = async () => {
                setIsInitializing(true);
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
        try {
            await getApprovals();
        } finally {
            setIsRefreshing(false);
        }
    }, [getApprovals]);

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

        // Tampilkan skeleton saat inisialisasi awal atau saat loading (termasuk saat refresh)
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
            <ScrollView
                className="flex-1 p-4"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={['#2563eb']} />
                }
            >
                {approvals.map((item) => (
                    <ApprovebaruCard
                        key={item.id}
                        item={item}
                        onView={handleView}
                        onApprove={handleApprove}
                        onReject={handleReject}
                    />
                ))}
                <View className="h-20" />
            </ScrollView>
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
