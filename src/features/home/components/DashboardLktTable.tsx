import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useHomeData } from '../hooks/useHomeData';
import { theme } from '../../../theme/theme';

export function DashboardLktTable() {
    const { data } = useHomeData();
    const lktSchedules = data?.jadwalLkt || [];

    return (
        <View className="px-6 mb-6">
            <View className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <View className="bg-gray-50 px-5 py-4 border-b border-gray-200 flex-row items-center justify-between">
                    <Text className="text-sm font-bold text-gray-800">
                        Jadwal LKT Hari Ini : <Text style={{ color: theme.colors.primary }}>{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</Text>
                    </Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View className="p-4 flex-col min-w-[800px]">
                        <View className="flex-row border-b border-gray-200 pb-3 mb-2">
                            <Text className="w-12 text-center text-xs font-bold text-gray-500">No</Text>
                            <Text className="w-28 text-center text-xs font-bold text-gray-500">LKT Code</Text>
                            <Text className="w-28 text-center text-xs font-bold text-gray-500">CST Code</Text>
                            <Text className="w-48 text-left text-xs font-bold text-gray-500 ml-2">Customers</Text>
                            <Text className="w-32 text-left text-xs font-bold text-gray-500 ml-2">Lokasi</Text>
                            <Text className="w-40 text-left text-xs font-bold text-gray-500 ml-2">Product</Text>
                            <Text className="w-48 text-left text-xs font-bold text-gray-500 ml-2">Kerusakan</Text>
                            <Text className="w-64 text-left text-xs font-bold text-gray-500 ml-2">Request</Text>
                        </View>
                        {lktSchedules.map((sched, index) => (
                            <View key={index} className="flex-row py-3 border-b border-gray-100">
                                <Text className="w-12 text-center text-xs font-bold text-gray-400">{index + 1}</Text>
                                <View className="w-28 items-center justify-start">
                                    <View className="bg-indigo-50 px-2 py-0.5 rounded">
                                        <Text className="text-indigo-700 font-mono font-bold text-[10.5px]">{sched.lkt_code}</Text>
                                    </View>
                                </View>
                                <View className="w-28 items-center justify-start">
                                    <View className="bg-amber-50 px-2 py-0.5 rounded">
                                        <Text className="text-amber-700 font-mono font-bold text-[10.5px]">{sched.cst_code}</Text>
                                    </View>
                                </View>
                                <Text className="w-48 text-xs font-semibold text-gray-800 ml-2">{sched.nm_customers}</Text>
                                <Text className="w-32 text-xs text-gray-700 ml-2">{sched.lokasi}</Text>
                                <Text className="w-40 text-xs font-medium text-gray-700 ml-2">{sched.code_product}</Text>
                                <Text className="w-48 text-xs text-gray-700 ml-2" numberOfLines={2}>{sched.actual_description}</Text>
                                <Text className="w-64 text-xs text-gray-500 ml-2" numberOfLines={2}>{sched.nm_karyawan}</Text>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}
