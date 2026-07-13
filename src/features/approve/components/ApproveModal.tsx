import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { X, Printer } from 'lucide-react-native';
import { ApproveModalProductTable } from './ApproveModalProductTable';
import { ApproveModalPaymentTable } from './ApproveModalPaymentTable';
import { ApproveModalSkeleton } from '../skeleton/ApproveModalSkeleton';

interface ApproveModalProps {
    visible: boolean;
    onClose: () => void;
    idApproval: string | null;
    nmFolder?: string;
    idKeyTable?: string;
}

export const ApproveModal: React.FC<ApproveModalProps> = ({
    visible,
    onClose,
    idApproval,
    nmFolder = 'unknown',
    idKeyTable = 'unknown'
}) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (visible) {
            setLoading(true);
            // Simulate the AJAX call from vmodal.php
            // $.ajax({ url: base_url + nm_folder + '/cform/edit/' + id_key_table + '/f/' ... })
            const timer = setTimeout(() => {
                setLoading(false);
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [visible, idApproval]);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-end bg-black/50">
                <View className="bg-white rounded-t-3xl h-[85%]">
                    {/* Header */}
                    <View className="flex-row justify-between items-center p-5 border-b border-gray-100">
                        <View>
                            <Text className="text-lg font-bold text-gray-800">Detail Approval</Text>
                            <Text className="text-xs text-gray-500">ID: {idApproval}</Text>
                        </View>
                        <TouchableOpacity
                            onPress={onClose}
                            className="bg-gray-100 p-2 rounded-full"
                        >
                            <X size={20} color="#4b5563" />
                        </TouchableOpacity>
                    </View>

                    {/* Body */}
                    <View className="flex-1 p-5">
                        {loading ? (
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <ApproveModalSkeleton />
                            </ScrollView>
                        ) : (
                            <ScrollView showsVerticalScrollIndicator={false}>

                                {/* Dummy form detail */}
                                <View className="mb-4">
                                    <View className="flex-row flex-wrap justify-between mb-4">
                                        <TouchableOpacity className="bg-blue-500 flex-row items-center justify-center p-3 rounded-lg w-[48%] mb-2 shadow-sm">
                                            <Printer size={16} color="#ffffff" />
                                            <Text className="text-white text-xs font-bold ml-2">Print Tanda Terima</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity className="bg-blue-500 flex-row items-center justify-center p-3 rounded-lg w-[48%] mb-2 shadow-sm">
                                            <Printer size={16} color="#ffffff" />
                                            <Text className="text-white text-xs font-bold ml-2">Print Tanda Terima 2</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity className="bg-blue-600 flex-row items-center justify-center p-3 rounded-lg w-[48%] mb-2 shadow-sm">
                                            <Printer size={16} color="#ffffff" />
                                            <Text className="text-white text-xs font-bold ml-2">Print Invoice 1</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity className="bg-blue-600 flex-row items-center justify-center p-3 rounded-lg w-[48%] mb-2 shadow-sm">
                                            <Printer size={16} color="#ffffff" />
                                            <Text className="text-white text-xs font-bold ml-2">Print Invoice 2</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <Text className="text-gray-500 text-xs font-bold mb-1 uppercase tracking-wider">Detail Proforma Invoice</Text>
                                    <View className="bg-white p-4 rounded-xl border border-gray-200 mb-3">
                                        <View className="flex-row justify-between mb-2">
                                            <Text className="text-gray-500 text-xs">Customer</Text>
                                            <Text className="text-gray-800 text-xs font-bold">PT Angin Ribut (Dummy)</Text>
                                        </View>
                                        <View className="flex-row justify-between mb-2">
                                            <Text className="text-gray-500 text-xs">Source Document</Text>
                                            <Text className="text-gray-800 text-xs font-bold">SO-2024-0099</Text>
                                        </View>
                                        <View className="flex-row justify-between mb-2">
                                            <Text className="text-gray-500 text-xs">Invoice Date</Text>
                                            <Text className="text-gray-800 text-xs font-bold">13 Jul 2026</Text>
                                        </View>
                                        <View className="flex-row justify-between mb-2">
                                            <Text className="text-gray-500 text-xs">Currency</Text>
                                            <Text className="text-gray-800 text-xs font-bold">IDR</Text>
                                        </View>
                                        <View className="flex-row justify-between">
                                            <Text className="text-gray-500 text-xs">PPN</Text>
                                            <Text className="text-gray-800 text-xs font-bold">11%</Text>
                                        </View>
                                    </View>

                                    <ApproveModalProductTable />
                                    <ApproveModalPaymentTable />
                                </View>
                            </ScrollView>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
};
