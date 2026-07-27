import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { AccountingApproval } from '../types/approve.types';
import { CheckCircle, XCircle } from 'lucide-react-native';
import { ApproveSkeleton } from '../skeleton/ApproveSkeleton';
import { EmptyState } from '../../../components/shared/EmptyState';
import { useState } from 'react';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';
import { useApprove } from '../hooks/useApprove';

interface AccountingTabProps {
    data: AccountingApproval[];
    onApprove: (id: string, action: string) => void;
    onReject: (id: string, action: string) => void;
    onRowPress?: (id: string, folder: string, code: string) => void;
    isRefreshing?: boolean;
    onRefresh?: () => void;
    loading?: boolean;
}

export const AccountingTab: React.FC<AccountingTabProps> = ({ data, onApprove, onReject, onRowPress, isRefreshing, onRefresh, loading }) => {
    const { validateApproval } = useApprove();
    const [toast, setToast] = useState<{ visible: boolean; message: string; type: ToastType }>({ visible: false, message: '', type: 'error' });
    const [modalConfig, setModalConfig] = useState<{ visible: boolean; type: 'approve' | 'reject' | null; item: AccountingApproval | null }>({
        visible: false,
        type: null,
        item: null
    });

    const handleAction = (item: AccountingApproval, type: 'approve' | 'reject') => {
        const actionCode = type === 'approve' ? item.action_approve : item.action_canceled;
        const errorMsg = validateApproval(actionCode);
        
        if (errorMsg) {
            setToast({ visible: true, message: errorMsg, type: 'error' });
            return;
        }

        setModalConfig({ visible: true, type, item });
    };

    const handleConfirmModal = () => {
        if (!modalConfig.item || !modalConfig.type) return;
        const { item, type } = modalConfig;
        const actionCode = type === 'approve' ? item.action_approve : item.action_canceled;
        setModalConfig(prev => ({ ...prev, visible: false }));
        
        if (type === 'approve') onApprove(item.id_approval, actionCode);
        else onReject(item.id_approval, actionCode);
    };

    return (
        <View className="flex-1">
            <ToastMessages
                visible={toast.visible}
                title="Validasi"
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(prev => ({ ...prev, visible: false }))}
            />
            <ModalConfirm
                visible={modalConfig.visible}
                title={modalConfig.type === 'approve' ? 'Approve ?' : 'Reject ?'}
                message={`Apakah anda yakin ${modalConfig.type === 'approve' ? 'Approve' : 'Reject'} ?`}
                confirmText={`Ya, ${modalConfig.type === 'approve' ? 'Approve' : 'Reject'} !`}
                cancelText="Tidak, batalkan!"
                onConfirm={handleConfirmModal}
                onCancel={() => setModalConfig(prev => ({ ...prev, visible: false }))}
            />

            {loading ? (
                <ScrollView 
                    className="flex-1" 
                    refreshControl={
                        onRefresh ? (
                            <RefreshControl refreshing={!!isRefreshing} onRefresh={onRefresh} colors={['#2563eb']} />
                        ) : undefined
                    }
                >
                    <ApproveSkeleton hideHeader={true} type="accounting" />
                </ScrollView>
            ) : data.length === 0 ? (
                <ScrollView 
                    className="flex-1" 
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
                    refreshControl={
                        onRefresh ? (
                            <RefreshControl refreshing={!!isRefreshing} onRefresh={onRefresh} colors={['#2563eb']} />
                        ) : undefined
                    }
                >
                    <EmptyState title="Tidak ada data" message="Belum ada accounting approval." />
                </ScrollView>
            ) : (
                <ScrollView 
                    className="flex-1 p-4" 
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        onRefresh ? (
                            <RefreshControl refreshing={!!isRefreshing} onRefresh={onRefresh} colors={['#2563eb']} />
                        ) : undefined
                    }
                >
            {data.map((item, index) => (
                <TouchableOpacity 
                    key={index} 
                    activeOpacity={0.8}
                    onPress={() => onRowPress && onRowPress(item.id_approval, item.nm_module, item.code_key_table)}
                    className="bg-white p-4 rounded-xl shadow-sm mb-4 border border-gray-100"
                >
                    <View className="flex-row justify-between items-start mb-2">
                        <View>
                            <Text className="text-sm text-gray-500">{item.date_request}</Text>
                            <Text className="text-base font-bold text-gray-800">{item.code_key_table}</Text>
                        </View>
                        <View className="bg-purple-50 px-2 py-1 rounded-md border border-purple-100">
                            <Text className="text-xs text-purple-600 font-medium">{item.nm_module}</Text>
                        </View>
                    </View>
                    
                    <View className="mb-3">
                        <Text className="text-sm font-bold text-gray-700">Request by: {item.nm_users}</Text>
                        {item.alasan ? (
                             <Text className="text-xs text-red-500 mt-1 font-medium bg-red-50 p-2 rounded-md">Alasan: {item.alasan}</Text>
                        ) : null}
                    </View>

                    <View className="flex-row justify-end space-x-2 pt-3 border-t border-gray-100">
                        <TouchableOpacity 
                            onPress={() => handleAction(item, 'reject')}
                            className="bg-red-50 px-4 py-2 rounded-lg flex-row items-center border border-red-100"
                        >
                            <XCircle size={14} color="#dc2626" />
                            <Text className="text-red-600 font-bold ml-1 text-sm">Reject</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => handleAction(item, 'approve')}
                            className="bg-green-50 px-4 py-2 rounded-lg flex-row items-center border border-green-100 ml-2"
                        >
                            <CheckCircle size={14} color="#16a34a" />
                            <Text className="text-green-600 font-bold ml-1 text-sm">Approve</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            ))}
                <View className="h-10" />
                </ScrollView>
            )}
        </View>
    );
};
