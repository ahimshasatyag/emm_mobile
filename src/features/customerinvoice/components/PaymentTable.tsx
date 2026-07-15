import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { formatRp, formatUsd } from '../../../utils/helpers/money';

interface PaymentTableProps {
    detail: any;
    onEditPayment?: (payment: any) => void;
    onCairPayment?: (payment: any) => void;
    onBatalPayment?: (payment: any) => void;
}

export const PaymentTable: React.FC<PaymentTableProps> = ({ detail, onEditPayment, onCairPayment, onBatalPayment }) => {
    return (
        <View>
            <View className="p-4 border-b border-gray-100 flex-row justify-between items-center">
                <Text className="text-sm font-bold text-gray-800">Histori Pembayaran</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View>
                    {/* Table Header */}
                    <View className="flex-row bg-gray-100 py-3 px-4 border-b border-gray-200">
                        <Text className="w-10 text-xs font-bold text-gray-600 text-center">No</Text>
                        <Text className="w-32 text-xs font-bold text-gray-600">Method</Text>
                        <Text className="w-24 text-xs font-bold text-gray-600 text-center">Tgl</Text>
                        <Text className="w-32 text-xs font-bold text-gray-600">Ref/Keterangan</Text>
                        <Text className="w-32 text-xs font-bold text-gray-600 text-right">Amount</Text>
                        <Text className="w-24 text-xs font-bold text-gray-600 text-center">Status</Text>
                        <Text className="w-64 text-xs font-bold text-gray-600 pl-4">Aksi</Text>
                    </View>

                    {/* Table Body */}
                    {detail.payments && detail.payments.length > 0 ? (
                        detail.payments.map((payment: any, index: number) => (
                            <View key={payment.id_invoice_dtl} className="flex-row py-3 px-4 border-b border-gray-100 items-center">
                                <Text className="w-10 text-sm text-gray-600 text-center">{index + 1}</Text>
                                <Text className="w-32 text-sm text-gray-800 font-medium">{payment.nm_payment_method}</Text>
                                <Text className="w-24 text-sm text-gray-600 text-center">{payment.date_draft}</Text>
                                <Text className="w-32 text-sm text-gray-600">{payment.payment_ref}</Text>
                                <Text className="w-32 text-sm text-gray-800 text-right font-bold">{detail.vcurrency === 'USD' ? formatUsd(payment.v_amount) : formatRp(payment.v_amount)}</Text>
                                <View className="w-24 items-center">
                                    <View className={`px-2 py-1 rounded ${payment.status_payment === 'CAIR' ? 'bg-green-100' : 'bg-gray-100'}`}>
                                        <Text className={`text-xs font-bold ${payment.status_payment === 'CAIR' ? 'text-green-700' : 'text-gray-700'}`}>
                                            {payment.status_payment}
                                        </Text>
                                    </View>
                                </View>
                                <View className="w-64 flex-row flex-wrap gap-2 pl-4 py-2">
                                    <TouchableOpacity 
                                        onPress={() => onEditPayment && onEditPayment(payment)}
                                        className="bg-blue-500 px-3 py-1.5 rounded"
                                    >
                                        <Text className="text-white text-xs font-bold">Edit</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        onPress={() => onCairPayment && onCairPayment(payment)}
                                        className="bg-green-500 px-3 py-1.5 rounded"
                                    >
                                        <Text className="text-white text-xs font-bold">Cair</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        onPress={() => onBatalPayment && onBatalPayment(payment)}
                                        className="bg-red-500 px-3 py-1.5 rounded"
                                    >
                                        <Text className="text-white text-xs font-bold">Batal</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity className="bg-purple-500 px-3 py-1.5 rounded">
                                        <Text className="text-white text-xs font-bold">PI</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity className="bg-orange-500 px-3 py-1.5 rounded">
                                        <Text className="text-white text-xs font-bold">Back</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity className="bg-blue-600 px-3 py-1.5 rounded">
                                        <Text className="text-white text-xs font-bold">INV</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity className="bg-indigo-500 px-3 py-1.5 rounded">
                                        <Text className="text-white text-xs font-bold">INV Leasing</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    ) : (
                        <View className="py-8 px-4 items-center justify-center">
                            <Text className="text-gray-400">Belum ada pembayaran</Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};
