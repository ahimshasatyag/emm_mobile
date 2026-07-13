import React from 'react';
import { View, Text, ScrollView } from 'react-native';

const mockProducts = [
    {
        id: '1',
        product: 'Produk A',
        serialNumber: 'SN-001',
        uom: 'Pcs',
        unitPrice: 100000,
        quantity: 2,
        total: 200000,
    },
    {
        id: '2',
        product: 'Produk B',
        serialNumber: 'SN-002',
        uom: 'Box',
        unitPrice: 500000,
        quantity: 1,
        total: 500000,
    },
];

export const ApproveModalProductTable = () => {
    // Dummy calculations
    const subTotal = 700000;
    const total = 777000; // With PPN 11%
    const totalPembayaran = 700000;
    const balance = 77000;

    const formatCurrency = (amount: number) => {
        return `Rp ${amount.toLocaleString('id-ID')}`;
    };

    return (
        <View className="mb-4">
            <Text className="text-gray-500 text-xs font-bold mb-2 uppercase tracking-wider">Detail Product</Text>
            
            <View className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View>
                        {/* Table Header */}
                        <View className="flex-row bg-gray-50 border-b border-gray-200 p-3 w-[750px]">
                            <Text className="w-40 text-gray-500 text-xs font-bold">Product</Text>
                            <Text className="w-32 text-gray-500 text-xs font-bold">Serial Number</Text>
                            <Text className="w-20 text-gray-500 text-xs font-bold">UOM</Text>
                            <Text className="w-32 text-gray-500 text-xs font-bold text-right">Unit Price</Text>
                            <Text className="w-24 text-gray-500 text-xs font-bold text-center">Quantity</Text>
                            <Text className="w-32 text-gray-500 text-xs font-bold text-right">Total</Text>
                        </View>

                        {/* Table Body */}
                        {mockProducts.map((item, index) => (
                            <View 
                                key={item.id} 
                                className={`flex-row p-3 border-b w-[750px] border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                            >
                                <Text className="w-40 text-gray-800 text-xs">{item.product}</Text>
                                <Text className="w-32 text-gray-800 text-xs">{item.serialNumber}</Text>
                                <Text className="w-20 text-gray-800 text-xs">{item.uom}</Text>
                                <Text className="w-32 text-gray-800 text-xs text-right">{formatCurrency(item.unitPrice)}</Text>
                                <Text className="w-24 text-gray-800 text-xs text-center">{item.quantity}</Text>
                                <Text className="w-32 text-gray-800 text-xs font-medium text-right">{formatCurrency(item.total)}</Text>
                            </View>
                        ))}
                    </View>
                </ScrollView>

                {/* Footer Totals */}
                <View className="bg-gray-50 p-4 border-t border-gray-200">
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-gray-500 text-xs font-medium">SUB-TOTAL</Text>
                        <Text className="text-gray-800 text-xs font-bold">{formatCurrency(subTotal)}</Text>
                    </View>
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-gray-500 text-xs font-medium">TOTAL (Inc. PPN)</Text>
                        <Text className="text-gray-800 text-xs font-bold">{formatCurrency(total)}</Text>
                    </View>
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-gray-500 text-xs font-medium">Total Pembayaran</Text>
                        <Text className="text-emerald-600 text-xs font-bold">{formatCurrency(totalPembayaran)}</Text>
                    </View>
                    <View className="flex-row justify-between pt-2 border-t border-gray-200 mt-2">
                        <Text className="text-gray-800 text-xs font-bold uppercase">Balance</Text>
                        <Text className="text-red-600 text-xs font-bold">{formatCurrency(balance)}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};
