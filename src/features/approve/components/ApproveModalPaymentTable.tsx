import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Eye } from 'lucide-react-native';

const mockPayments = [
    {
        id: '1',
        paymentMethod: 'Transfer BCA',
        tgl: '13/07/2026',
        dp: 'Ya',
        keterangan: 'DP Termin 1',
        amount: 350000,
        status: 'Lunas',
    },
    {
        id: '2',
        paymentMethod: 'Tunai',
        tgl: '14/07/2026',
        dp: 'Tidak',
        keterangan: 'Pelunasan sisa',
        amount: 350000,
        status: 'Pending',
    },
];

export const ApproveModalPaymentTable = () => {
    const formatCurrency = (amount: number) => {
        return `Rp ${amount.toLocaleString('id-ID')}`;
    };

    return (
        <View className="mb-4">
            <Text className="text-gray-500 text-xs font-bold mb-2 uppercase tracking-wider">Detail Payment</Text>
            
            <View className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View>
                        {/* Table Header */}
                        <View className="flex-row bg-gray-50 border-b border-gray-200 p-3 w-[800px]">
                            <Text className="w-32 text-gray-500 text-xs font-bold">Payment Method</Text>
                            <Text className="w-24 text-gray-500 text-xs font-bold">Tgl</Text>
                            <Text className="w-20 text-gray-500 text-xs font-bold">DP</Text>
                            <Text className="w-40 text-gray-500 text-xs font-bold">Keterangan</Text>
                            <Text className="w-32 text-gray-500 text-xs font-bold text-right">Amount</Text>
                            <Text className="w-24 text-gray-500 text-xs font-bold text-center">Status</Text>
                            <Text className="w-20 text-gray-500 text-xs font-bold text-center">Aksi</Text>
                        </View>

                        {/* Table Body */}
                        {mockPayments.map((item, index) => (
                            <View 
                                key={item.id} 
                                className={`flex-row items-center p-3 border-b w-[800px] border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                            >
                                <Text className="w-32 text-gray-800 text-xs">{item.paymentMethod}</Text>
                                <Text className="w-24 text-gray-800 text-xs">{item.tgl}</Text>
                                <Text className="w-20 text-gray-800 text-xs">{item.dp}</Text>
                                <Text className="w-40 text-gray-800 text-xs">{item.keterangan}</Text>
                                <Text className="w-32 text-gray-800 text-xs font-medium text-right">{formatCurrency(item.amount)}</Text>
                                <View className="w-24 items-center">
                                    <View className={`px-2 py-1 rounded-md ${item.status === 'Lunas' ? 'bg-emerald-100' : 'bg-amber-100'}`}>
                                        <Text className={`text-[10px] font-bold ${item.status === 'Lunas' ? 'text-emerald-700' : 'text-amber-700'}`}>
                                            {item.status}
                                        </Text>
                                    </View>
                                </View>
                                <View className="w-20 items-center">
                                    <TouchableOpacity className="bg-blue-50 p-1.5 rounded-md border border-blue-100">
                                        <Eye size={14} color="#3b82f6" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>
        </View>
    );
};
