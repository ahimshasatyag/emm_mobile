import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { ApprovebaruItem } from '../types/approvebaru.types';
import { CheckCircle, XCircle, Eye, User, Clock, FileText } from 'lucide-react-native';

interface ApprovebaruCardProps {
    item: ApprovebaruItem;
    onView: (id: number) => void;
    onApprove: (id: number) => void;
    onReject: (id: number) => void;
}

export const ApprovebaruCard: React.FC<ApprovebaruCardProps> = ({ item, onView, onApprove, onReject }) => {
    const handleApprove = () => {
        Alert.alert(
            'Konfirmasi Approval',
            'Apakah Anda yakin ingin menyetujui approval ini?',
            [
                { text: 'Tidak', style: 'cancel' },
                {
                    text: 'Ya, Approve',
                    onPress: () => onApprove(item.id),
                    style: 'default'
                }
            ]
        );
    };

    const handleReject = () => {
        // In a real app, you might want to show a modal to input rejection reason
        Alert.alert(
            'Konfirmasi Reject',
            'Apakah Anda yakin ingin menolak approval ini?',
            [
                { text: 'Tidak', style: 'cancel' },
                {
                    text: 'Ya, Reject',
                    onPress: () => onReject(item.id),
                    style: 'destructive'
                }
            ]
        );
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approved':
                return { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle, color: '#15803d' };
            case 'pending':
                return { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock, color: '#a16207' };
            case 'rejected':
                return { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle, color: '#b91c1c' };
            default:
                return { bg: 'bg-gray-100', text: 'text-gray-700', icon: FileText, color: '#374151' };
        }
    };

    const StatusIcon = getStatusColor(item.status).icon;

    return (
        <View className="bg-white p-4 rounded-xl shadow-sm mb-4 border border-gray-100">
            {/* Header */}
            <View className="flex-row justify-between items-start mb-3">
                <View className="flex-row items-center flex-1">
                    <View className="h-10 w-10 rounded-full bg-blue-100 items-center justify-center mr-3">
                        <User size={20} color="#3b82f6" />
                    </View>
                    <View className="flex-1 justify-center">
                        <Text className="text-sm font-bold text-gray-800">{item.requester_name}</Text>
                    </View>
                </View>
                
                <View className={`px-3 py-1.5 rounded-full flex-row items-center ${getStatusColor(item.status).bg}`}>
                    <StatusIcon size={12} color={getStatusColor(item.status).color} className="mr-1" />
                    <Text className={`text-xs font-bold ${getStatusColor(item.status).text}`}>
                        {item.status.toUpperCase()}
                    </Text>
                </View>
            </View>

            {/* Content */}
            <View className="mb-4">
                <Text className="text-sm text-gray-700 leading-relaxed">{item.description}</Text>
            </View>

            {/* Actions */}
            <View className="flex-row justify-end pt-3 border-t border-gray-100 space-x-2">
                <TouchableOpacity 
                    onPress={() => onView(item.id)}
                    className="bg-blue-50 px-4 py-2 rounded-lg flex-row items-center border border-blue-100"
                >
                    <Eye size={14} color="#2563eb" />
                    <Text className="text-blue-600 font-bold ml-1 text-sm">View</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={handleReject}
                    className="bg-red-50 px-4 py-2 rounded-lg flex-row items-center border border-red-100 ml-2"
                >
                    <XCircle size={14} color="#dc2626" />
                    <Text className="text-red-600 font-bold ml-1 text-sm">Reject</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={handleApprove}
                    className="bg-green-50 px-4 py-2 rounded-lg flex-row items-center border border-green-100 ml-2"
                >
                    <CheckCircle size={14} color="#16a34a" />
                    <Text className="text-green-600 font-bold ml-1 text-sm">Approve</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
