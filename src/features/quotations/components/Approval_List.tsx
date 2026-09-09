import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { theme } from '../../../theme/theme';
import { Check, X, Bell, EyeOff } from 'lucide-react-native';

export interface ApprovalItem {
    id: number;
    approval_name: string;
    description: string;
    approver_name: string;
    status: 'pending' | 'approved' | 'rejected' | string;
    f_request_approval: number;
    can_approve: boolean; // Based on user role
    is_super_admin: boolean;
}

interface ApprovalListProps {
    data: ApprovalItem[];
    onApprove?: (id: number) => void;
    onReject?: (id: number) => void;
    onIgnore?: (id: number) => void;
    onRequestApproval?: (id: number) => void;
}

export function ApprovalList({
    data,
    onApprove,
    onReject,
    onIgnore,
    onRequestApproval
}: ApprovalListProps) {

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approved': return 'bg-green-100 text-green-700';
            case 'rejected': return 'bg-red-100 text-red-700';
            case 'pending': return 'bg-orange-100 text-orange-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    if (!data || data.length === 0) {
        return (
            <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mt-4">
                <Text className="text-xs font-bold text-gray-500 uppercase mb-2 border-b border-gray-100 pb-2">
                    Approval List
                </Text>
                <Text className="text-sm text-gray-500 italic text-center py-4">Belum ada data approval.</Text>
            </View>
        );
    }

    return (
        <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mt-4">
            <Text className="text-xs font-bold text-gray-500 uppercase mb-4 border-b border-gray-100 pb-2">
                Approval List
            </Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View>
                    {/* Header */}
                    <View className="flex-row border-b border-gray-200 pb-2 mb-2">
                        <Text className="w-32 font-bold text-gray-700 text-xs">Approval</Text>
                        <Text className="w-48 font-bold text-gray-700 text-xs">Description</Text>
                        <Text className="w-32 font-bold text-gray-700 text-xs">Approver User</Text>
                        <Text className="w-24 font-bold text-gray-700 text-xs text-center">Status</Text>
                        <Text className="w-40 font-bold text-gray-700 text-xs text-center">Action</Text>
                    </View>

                    {/* Rows */}
                    {data.map((row, index) => (
                        <View key={index} className="flex-row items-center border-b border-gray-100 py-3">
                            <Text className="w-32 text-gray-800 text-xs">{row.approval_name}</Text>
                            <Text className="w-48 text-gray-600 text-xs" numberOfLines={2}>{row.description}</Text>
                            <Text className="w-32 text-gray-800 text-xs">{row.approver_name}</Text>

                            <View className="w-24 items-center">
                                <View className={`px-2 py-1 rounded-md ${getStatusColor(row.status)}`}>
                                    <Text className="text-[10px] font-bold uppercase">{row.status}</Text>
                                </View>
                            </View>

                            <View className="w-40 flex-row justify-center flex-wrap gap-1 px-2">
                                {row.status.toLowerCase() === 'pending' && (
                                    <>
                                        {row.can_approve && (
                                            <>
                                                <TouchableOpacity
                                                    className="bg-green-500 px-2 py-1 rounded flex-row items-center m-0.5"
                                                    onPress={() => onApprove && onApprove(row.id)}
                                                >
                                                    <Check size={10} color="white" />
                                                    <Text className="text-white text-[10px] font-bold ml-1">Approve</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    className="bg-red-500 px-2 py-1 rounded flex-row items-center m-0.5"
                                                    onPress={() => onReject && onReject(row.id)}
                                                >
                                                    <X size={10} color="white" />
                                                    <Text className="text-white text-[10px] font-bold ml-1">Reject</Text>
                                                </TouchableOpacity>
                                            </>
                                        )}

                                        {row.is_super_admin && (
                                            <TouchableOpacity
                                                className="bg-gray-500 px-2 py-1 rounded flex-row items-center m-0.5"
                                                onPress={() => onIgnore && onIgnore(row.id)}
                                            >
                                                <EyeOff size={10} color="white" />
                                                <Text className="text-white text-[10px] font-bold ml-1">Ignore</Text>
                                            </TouchableOpacity>
                                        )}

                                        {row.f_request_approval === 0 && (
                                            <TouchableOpacity
                                                className="bg-blue-500 px-2 py-1 rounded flex-row items-center m-0.5"
                                                onPress={() => onRequestApproval && onRequestApproval(row.id)}
                                            >
                                                <Bell size={10} color="white" />
                                                <Text className="text-white text-[10px] font-bold ml-1">Request Approval</Text>
                                            </TouchableOpacity>
                                        )}
                                    </>
                                )}
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}
