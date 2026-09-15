import React from 'react';
import { View, Text } from 'react-native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';

export function IncshipmentFormScreen() {
    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator title="TAMBAH INCOMING SHIPMENT" />
            <View className="flex-1 items-center justify-center p-8">
                <Text className="text-gray-500 text-center font-medium leading-6">
                    Incoming Shipment tidak dapat dibuat secara manual. Data ini akan otomatis dibuat ("Generate IS") ketika Purchase Order disetujui atau diterima.
                </Text>
            </View>
        </View>
    );
}
