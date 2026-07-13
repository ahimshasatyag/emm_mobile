import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { ApprovebaruProduct } from '../types/approvebaru.types';

interface ApprovebaruTableProductModalProps {
    products: ApprovebaruProduct[];
}

export const ApprovebaruTableProductModal: React.FC<ApprovebaruTableProductModalProps> = ({ products }) => {
    const totalAmount = products.reduce((sum, item) => sum + (item.qty * item.price), 0);

    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={true} className="pb-4">
            <View style={{ width: 1082 }} className="border border-gray-200 rounded-xl overflow-hidden">
                {/* Header Tabel */}
                <View className="flex-row bg-gray-100 p-4 border-b border-gray-200 items-center">
                    <View style={{ width: 120 }} className="px-2"><Text className="font-bold text-gray-700 text-xs">Product Code</Text></View>
                    <View style={{ width: 250 }} className="px-2"><Text className="font-bold text-gray-700 text-xs">Product Name</Text></View>
                    <View style={{ width: 120 }} className="px-2"><Text className="font-bold text-gray-700 text-xs">Status Barang</Text></View>
                    <View style={{ width: 120 }} className="px-2"><Text className="font-bold text-gray-700 text-xs text-right">Harga</Text></View>
                    <View style={{ width: 80 }} className="px-2"><Text className="font-bold text-gray-700 text-xs text-center">Qty</Text></View>
                    <View style={{ width: 90 }} className="px-2"><Text className="font-bold text-gray-700 text-xs text-center">Satuan</Text></View>
                    <View style={{ width: 140 }} className="px-2"><Text className="font-bold text-gray-700 text-xs">Delivery Term</Text></View>
                    <View style={{ width: 130 }} className="px-2"><Text className="font-bold text-gray-700 text-xs text-right">Line Total</Text></View>
                </View>
                
                {/* Isi Tabel */}
                {products.map((prod, idx) => (
                    <View key={idx} className="flex-row p-4 border-b border-gray-100 bg-white items-center">
                        <View style={{ width: 120 }} className="px-2"><Text className="text-gray-600 text-xs">{prod.code_product}</Text></View>
                        <View style={{ width: 250 }} className="px-2"><Text className="text-gray-800 font-medium text-xs leading-relaxed">{prod.nm_product}</Text></View>
                        <View style={{ width: 120 }} className="px-2"><Text className="text-gray-600 text-xs">{prod.status_barang || '-'}</Text></View>
                        <View style={{ width: 120 }} className="px-2"><Text className="text-gray-600 text-xs text-right">{prod.price.toLocaleString()}</Text></View>
                        <View style={{ width: 80 }} className="px-2"><Text className="text-gray-800 font-medium text-xs text-center">{prod.qty}</Text></View>
                        <View style={{ width: 90 }} className="px-2"><Text className="text-gray-600 text-xs text-center">{prod.nm_product_satuan}</Text></View>
                        <View style={{ width: 140 }} className="px-2"><Text className="text-gray-600 text-xs leading-relaxed">{prod.delivery_term || '-'}</Text></View>
                        <View style={{ width: 130 }} className="px-2"><Text className="text-gray-800 font-bold text-xs text-right">{(prod.qty * prod.price).toLocaleString()}</Text></View>
                    </View>
                ))}

                {/* Footer Total */}
                <View className="flex-row bg-gray-50 p-4 border-t-2 border-gray-200 items-center">
                    <View className="flex-1 px-2"><Text className="font-bold text-gray-800 text-sm text-right">Total</Text></View>
                    <View style={{ width: 130 }} className="px-2"><Text className="font-bold text-blue-600 text-sm text-right">{totalAmount.toLocaleString()}</Text></View>
                </View>
            </View>
        </ScrollView>
    );
};
