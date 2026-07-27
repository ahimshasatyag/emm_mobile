import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { QuotationApproval } from '../types/approve.types';
import { CheckCircle, XCircle } from 'lucide-react-native';
import { ApproveSkeleton } from '../skeleton/ApproveSkeleton';
import { EmptyState } from '../../../components/shared/EmptyState';
import { useState } from 'react';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';
import { useApprove } from '../hooks/useApprove';

interface QuotationsTabProps {
    data: QuotationApproval[];
    onApprove: (id: string, action: string) => void;
    onReject: (id: string, action: string) => void;
    onRowPress?: (id: string, code: string) => void;
    isRefreshing?: boolean;
    onRefresh?: () => void;
    loading?: boolean;
}

export const QuotationsTab: React.FC<QuotationsTabProps> = ({ data, onApprove, onReject, onRowPress, isRefreshing, onRefresh, loading }) => {
    const { validateApproval } = useApprove();
    const [toast, setToast] = useState<{ visible: boolean; message: string; type: ToastType }>({ visible: false, message: '', type: 'error' });
    const [modalConfig, setModalConfig] = useState<{ visible: boolean; type: 'approve' | 'reject' | null; item: QuotationApproval | null }>({
        visible: false,
        type: null,
        item: null
    });

    const handleAction = (item: QuotationApproval, type: 'approve' | 'reject') => {
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
                    <ApproveSkeleton hideHeader={true} />
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
                    <EmptyState title="Tidak ada data" message="Belum ada quotations untuk disetujui." />
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
                    onPress={() => onRowPress && onRowPress(item.id_approval, item.code_so)}
                    className="bg-white p-4 rounded-xl shadow-sm mb-4 border border-gray-100"
                >
                    <View className="flex-row justify-between items-start mb-2">
                        <View>
                            <Text className="text-sm text-gray-500">{item.date_request}</Text>
                            <Text className="text-base font-bold text-gray-800">{item.code_so}</Text>
                        </View>
                        <View className="bg-blue-50 px-2 py-1 rounded-md">
                            <Text className="text-xs text-blue-600 font-medium">{item.nm_type_pembayaran}</Text>
                        </View>
                    </View>
                    
                    <View className="mb-2">
                        <Text className="text-sm font-bold text-gray-700">{item.nm_customers}</Text>
                        <Text className="text-xs text-gray-500">Sales: {item.nm_karyawan}</Text>
                    </View>

                    <View className="bg-gray-50 p-2 rounded-lg mb-3">
                        <Text className="text-xs text-gray-600 mb-1">DP: {item.ndp_persen}% (Rp {item.ndp_amount.toLocaleString('id-ID')})</Text>
                        <Text className="text-xs text-gray-600 mb-1">Tenor: {item.ntenor} bln (Rp {item.ntenor_amount.toLocaleString('id-ID')}/bln)</Text>
                        <Text className="text-xs text-gray-600">Waktu Bayar: {item.nm_waktu_bayar}</Text>
                        {item.internal_notes ? (
                             <Text className="text-xs text-gray-600 mt-1 italic">Note: {item.internal_notes}</Text>
                        ) : null}
                    </View>

                    {item.products && item.products.length > 0 && (
                        <View className="mb-3">
                            <Text className="text-xs font-bold text-gray-700 mb-1">Products:</Text>
                            {item.products.map((prod, pIdx) => (
                                <View key={pIdx} className="flex-row justify-between items-center bg-gray-50 p-2 rounded-lg mb-1 border border-gray-100">
                                     <Text className="text-xs font-medium text-gray-600 flex-1">{prod.code_product}</Text>
                                     <View className="items-end">
                                        <Text className="text-xs font-bold text-gray-800">Rp {prod.product_price.toLocaleString('id-ID')}</Text>
                                        {prod.ndiskon_persen > 0 && (
                                            <Text className="text-[10px] text-red-500 font-bold">Disc {prod.ndiskon_persen}%</Text>
                                        )}
                                     </View>
                                </View>
                            ))}
                        </View>
                    )}

                    <View className="flex-row justify-end space-x-2 pt-2 border-t border-gray-100">
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
