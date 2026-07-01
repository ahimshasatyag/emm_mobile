import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { LogbookCustomer } from '../types/logbookcustomers.types';

interface LogbookCustomersCardProps {
    logbook: LogbookCustomer;
    index: number;
}

export function LogbookCustomersCard({ logbook, index }: LogbookCustomersCardProps) {
    const navigation = useNavigation<any>();

    return (
        <Animated.View entering={FadeInUp.delay(index * 100)}>
            <TouchableOpacity
                className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-3"
                onPress={() => navigation.navigate('LogbookCustomersEditScreen', { id: logbook.id_log_book })}
                activeOpacity={0.7}
            >
                <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-1 mr-3">
                        <Text className="text-sm font-bold text-gray-900">{logbook.id_customers}</Text>
                        <Text className="text-xs font-semibold text-gray-800 mt-0.5">{logbook.nm_customer}</Text>
                    </View>
                </View>

                <View className="h-px bg-gray-100 my-2" />

                <View className="flex-row justify-between items-end">
                    <View className="flex-1">
                        <Text className="text-xs text-gray-500 mb-0.5">Created By</Text>
                        <Text className="text-xs font-semibold text-gray-800">{logbook.username}</Text>
                    </View>
                    <View className="flex-1 items-end">
                        <Text className="text-xs text-gray-500 mb-0.5">Date</Text>
                        <Text className="text-xs font-semibold text-gray-800">{logbook.date_log_book}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}
