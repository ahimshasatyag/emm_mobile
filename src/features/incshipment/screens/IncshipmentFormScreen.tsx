import React from 'react';
import { View, Text } from 'react-native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';

export function IncshipmentFormScreen() {
    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator title="TAMBAH INCOMING SHIPMENT" />
            <View className="flex-1 items-center justify-center">
                <Text className="text-gray-500">
                    Form Incoming Shipment (Placeholder)
                </Text>
            </View>
        </View>
    );
}
