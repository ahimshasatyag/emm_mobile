import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { ApprovebaruDetail } from '../types/approvebaru.types';
import { X, CheckCircle, XCircle, FileText, User, MapPin, ClipboardList } from 'lucide-react-native';
import { ApprovebaruTableProductModal } from './ApprovebaruTableProductModal';
import { ApprovebaruTableInfoModal } from './ApprovebaruTableInfoModal';
import { ApprovebaruModalSkeleton } from '../skeleton/ApprovebaruModalSkeleton';

interface ApprovebaruModalProps {
    visible: boolean;
    onClose: () => void;
    detail: ApprovebaruDetail | null;
    loading: boolean;
    onApprove: () => void;
    onReject: () => void;
}

const FieldRow = ({ label, value }: { label: string, value: string | undefined }) => (
    <View className="mb-5">
        <Text className="text-[13px] font-bold text-gray-700 mb-1">{label}</Text>
        <Text className="text-[13px] text-gray-600 leading-relaxed">{value || '-'}</Text>
    </View>
);

export const ApprovebaruModal: React.FC<ApprovebaruModalProps> = ({ 
    visible, 
    onClose, 
    detail, 
    loading,
    onApprove,
    onReject
}) => {
    
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/50 justify-end">
                <View className="bg-white rounded-t-3xl h-[85%]">
                    {/* Header */}
                    <View className="p-5 border-b border-gray-100">
                        <View className="flex-row justify-between items-center mb-1">
                            <Text className="text-lg font-bold text-gray-800">Detail Approval</Text>
                            <TouchableOpacity onPress={onClose} className="p-1">
                                <X size={24} color="#6b7280" />
                            </TouchableOpacity>
                        </View>
                        {detail && (
                            <Text className="text-[13px] font-medium text-gray-600">
                                {detail.code_approval || '-'} - {detail.related_approvals?.[0]?.description || '-'}
                            </Text>
                        )}
                    </View>

                    {/* Body */}
                    <View className="flex-1">
                        {loading || !detail ? (
                            <ScrollView showsVerticalScrollIndicator={false} className="p-5">
                                <ApprovebaruModalSkeleton />
                            </ScrollView>
                        ) : (
                            <ScrollView showsVerticalScrollIndicator={false} className="flex-1 p-5">
                                <View className="flex-row mx-[-8px] mb-6">
                                    <View className="flex-1 px-2">
                                        <FieldRow label="Salesperson" value={detail.salesperson} />
                                        <FieldRow label="Delivery To" value={detail.delivery_to} />
                                        
                                        <Text className="text-lg text-gray-600 mb-6 mt-2">Informasi Pembeli</Text>
                                        <FieldRow label="Nama" value={detail.customer_name} />
                                        <FieldRow label="Alamat" value={detail.customer_address} />
                                        <FieldRow label="Email" value={detail.customer_email} />
                                    <FieldRow label="Telepon" value={detail.customer_phone} />

                                    <Text className="text-lg text-gray-600 mb-6 mt-2">Informasi Pembayaran</Text>
                                    <FieldRow label="Metode Payment" value={detail.metode_payment} />
                                    <FieldRow label="DP %" value={detail.dp} />
                                    <FieldRow label="DP RP" value={detail.dp_rp} />
                                    <FieldRow label="Cicilan RP" value={detail.cicilan_rp} />
                                    <FieldRow label="Tipe Pembayaran" value={detail.tipe_pembayaran} />
                                    <FieldRow label="Waktu Bayar" value={detail.waktu_bayar} />
                                    <FieldRow label="TENOR" value={detail.tenor} />
                                </View>

                                <View className="flex-1 px-2">
                                    <FieldRow label="Tanggal" value={detail.date} />
                                    <FieldRow label="Estimasi Pengiriman" value={detail.estimated_delivery} />
                                    
                                    <View style={{ height: 48 }} />
                                    <FieldRow label="Mata Uang" value={detail.currency} />
                                    <FieldRow label="Kurs" value={detail.kurs} />
                                    <FieldRow label="PPN" value={detail.ppn} />
                                    <FieldRow label="Delivery Term" value={detail.delivery_term} />
                                    <FieldRow label="Biaya Freight" value={detail.biaya_freight} />
                                    <FieldRow label="Biaya Teknisi" value={detail.biaya_teknisi} />
                                    <FieldRow label="Biaya Forklift" value={detail.biaya_forklift} />

                                    <Text className="text-lg text-gray-600 mb-6 mt-2">Informasi Tambahan</Text>
                                    <FieldRow label="Kode SO Excel" value={detail.kode_so_excel} />
                                    <FieldRow label="No PO Customer" value={detail.no_po_customer} />
                                    <FieldRow label="Success fee (Rp)" value={detail.success_fee} />
                                    <FieldRow label="Internal Notes" value={detail.internal_notes} />
                                    <FieldRow label="Keterangan" value={detail.keterangan} />
                                </View>
                            </View>

                            <View className="mb-6">
                                <View className="flex-row items-center mb-3">
                                    <FileText size={18} color="#4b5563" />
                                    <Text className="text-base font-bold text-gray-800 ml-2">Daftar Produk</Text>
                                </View>
                                
                                <ApprovebaruTableProductModal products={detail.products} />
                            </View>

                            <View className="mb-6">
                                <View className="flex-row items-center mb-3">
                                    <ClipboardList size={18} color="#4b5563" />
                                    <Text className="text-base font-bold text-gray-800 ml-2">Informasi Approval</Text>
                                </View>
                                
                                <ApprovebaruTableInfoModal approvals={detail.related_approvals || []} />
                            </View>

                            <View className="h-20" />
                        </ScrollView>
                    )}
                    </View>

                    {!loading && detail && (
                        <View className="flex-row justify-between p-5 border-t border-gray-100 bg-white">
                            <TouchableOpacity 
                                onPress={() => {
                                    onClose();
                                    onReject();
                                }}
                                className="flex-1 bg-red-50 py-3 rounded-xl flex-row justify-center items-center mr-2 border border-red-100"
                            >
                                <XCircle size={18} color="#dc2626" />
                                <Text className="text-red-600 font-bold ml-2 text-base">Reject</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                onPress={() => {
                                    onClose();
                                    onApprove();
                                }}
                                className="flex-1 bg-green-600 py-3 rounded-xl flex-row justify-center items-center ml-2 shadow-sm"
                            >
                                <CheckCircle size={18} color="#ffffff" />
                                <Text className="text-white font-bold ml-2 text-base">Approve</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
};
