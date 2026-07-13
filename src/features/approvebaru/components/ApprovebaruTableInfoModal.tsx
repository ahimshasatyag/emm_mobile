import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { ApprovebaruInfo } from '../types/approvebaru.types';

interface ApprovebaruTableInfoModalProps {
    approvals?: ApprovebaruInfo[];
}

export const ApprovebaruTableInfoModal: React.FC<ApprovebaruTableInfoModalProps> = ({ approvals }) => {
    return (
        <View className="mb-6">
            <ScrollView horizontal showsHorizontalScrollIndicator={true} className="pb-4">
                <View style={{ width: 800 }} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                    {/* Header Tabel */}
                    <View className="flex-row bg-gray-50 p-3 border-b border-gray-200 items-center">
                        <View style={{ width: 250 }} className="px-2"><Text className="font-bold text-gray-700 text-[13px]">Approval</Text></View>
                        <View style={{ width: 150 }} className="px-2"><Text className="font-bold text-gray-700 text-[13px]">Status Approval</Text></View>
                        <View style={{ width: 400 }} className="px-2"><Text className="font-bold text-gray-700 text-[13px]">Description</Text></View>
                    </View>
                
                {/* Isi Tabel */}
                {(!approvals || approvals.length === 0) ? (
                    <View className="p-4 items-center">
                        <Text className="text-gray-500 text-xs">No approval history found</Text>
                    </View>
                    ) : (
                        approvals.map((item, idx) => (
                            <View key={idx} className="flex-row p-3 border-b border-gray-100 items-center">
                                <View style={{ width: 250 }} className="px-2">
                                    <Text className="text-gray-600 text-xs leading-relaxed">{item.approval_name || '-'}</Text>
                                </View>
                                <View style={{ width: 150 }} className="px-2">
                                    <Text className={`text-xs font-medium ${item.status?.toLowerCase() === 'passed' ? 'text-green-600' : 'text-orange-500'}`}>
                                        {item.status || '-'}
                                    </Text>
                                </View>
                                <View style={{ width: 400 }} className="px-2">
                                    <Text className="text-gray-600 text-xs leading-relaxed">{item.description || '-'}</Text>
                                </View>
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>
        </View>
    );
};
