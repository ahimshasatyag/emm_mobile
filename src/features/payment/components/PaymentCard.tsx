import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Payment } from '../types/payment';
import { theme } from '../../../theme/theme';

interface PaymentCardProps {
    payment: Payment;
    onPress: () => void;
    onLongPress?: () => void;
    isSelected?: boolean;
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'TERIMA': return 'bg-blue-100 text-blue-700 border-blue-200';
        case 'SETOR': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        case 'CAIR': return 'bg-teal-100 text-teal-800 border-teal-200';
        case 'TOLAK': return 'bg-red-100 text-red-700 border-red-200';
        case 'BATAL': return 'bg-gray-800 text-white border-gray-900';
        case 'DRAFT': default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
};

const formatCurrency = (amount: number, currency: string = 'IDR') => {
    return `${currency} ${amount.toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, ".")}`;
};

export const PaymentCard: React.FC<PaymentCardProps> = ({ payment, onPress, onLongPress, isSelected }) => {
    return (
        <TouchableOpacity 
            onPress={onPress}
            onLongPress={onLongPress}
            activeOpacity={0.7}
            className={`bg-white rounded-xl p-4 mb-3 border shadow-sm ${isSelected ? 'bg-orange-50' : 'border-gray-100'}`}
            style={isSelected ? { borderColor: theme.colors.primary } : undefined}
        >
            <View className="flex-row justify-between items-start mb-2">
                <View>
                    <Text className="text-gray-900 font-bold text-base">{payment.code_payment_schdl}</Text>
                    <Text className="text-gray-500 text-xs mt-1">{payment.date_update}</Text>
                </View>
                <View className={`px-2 py-1 rounded-md border ${getStatusColor(payment.status_payment)}`}>
                    <Text className={`text-xs font-bold ${payment.status_payment === 'BATAL' ? 'text-white' : ''}`}>
                        {payment.status_payment}
                    </Text>
                </View>
            </View>

            <View className="border-t border-gray-50 pt-3 mt-1 flex-row justify-between items-center">
                <View>
                    <Text className="text-gray-500 text-xs mb-1">Customer</Text>
                    <Text className="text-gray-800 font-medium">{payment.nm_customers}</Text>
                </View>
                <View className="items-end">
                    <Text className="text-gray-500 text-xs mb-1">Amount ({payment.date_payment})</Text>
                    <Text className="text-gray-900 font-bold">{formatCurrency(payment.v_amount, payment.vcurrency)}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};
