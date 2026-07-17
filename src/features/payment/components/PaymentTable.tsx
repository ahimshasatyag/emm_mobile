import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { formatRp } from '../../../utils/helpers/money';

interface PaymentDetail {
    id: string;
    paymentMethod: string;
    noGiro: string;
    bankName: string;
    date: string;
    amount: string;
    keterangan: string;
    dp: boolean;
}

interface PaymentTableProps {
    details: PaymentDetail[];
    onRowClick: (detail: PaymentDetail) => void;
}

export const PaymentTable: React.FC<PaymentTableProps> = ({ details, onRowClick }) => {
    return (
        <View className="mt-4 bg-white border border-gray-200 rounded-lg overflow-hidden">
            <View>
                {/* Table Header */}
                <View className="flex-row bg-gray-50 py-3 px-2 border-b border-gray-200">
                    <Text className="w-[30%] text-xs font-bold text-gray-700 text-left px-1">Payment Method</Text>
                    <Text className="w-[20%] text-xs font-bold text-gray-700 text-left px-1">Bank Name</Text>
                    <Text className="flex-1 text-xs font-bold text-gray-700 text-right px-1">Amount</Text>
                </View>

                {/* Table Body */}
                {details.length > 0 ? (
                    details.map((item, index) => (
                        <TouchableOpacity
                            key={item.id}
                            onPress={() => onRowClick(item)}
                            className={`flex-row py-3 px-2 items-center border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                        >
                            <Text className="w-[30%] text-xs text-gray-700 text-left px-1">{item.paymentMethod}</Text>
                            <Text className="w-[20%] text-xs text-gray-700 text-left px-1">{item.bankName || '-'}</Text>
                            <Text className="flex-1 text-xs font-bold text-gray-800 text-right px-1">
                                {formatRp(parseFloat(item.amount) || 0)}
                            </Text>
                        </TouchableOpacity>
                    ))
                ) : (
                    <View className="py-8 items-center justify-center bg-white min-w-full">
                        <Text className="text-gray-400 text-sm">No data available.</Text>
                    </View>
                )}
            </View>
        </View>
    );
};
