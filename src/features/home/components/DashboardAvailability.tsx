import React from 'react';
import { View, Text } from 'react-native';
import { techniciansPP, techniciansPL } from '../data/mockDashboard';

export function DashboardAvailability() {
    const renderTable = (title: string, data: any[]) => (
        <View className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
            <View className="bg-gray-50 px-5 py-4 border-b border-gray-200">
                <Text className="text-sm font-bold text-gray-800">{title}</Text>
            </View>
            <View className="p-4">
                <View className="flex-row border-b border-gray-200 pb-2 mb-2">
                    <Text className="w-10 text-center text-xs font-bold text-gray-500">No</Text>
                    <Text className="flex-1 text-xs font-bold text-gray-500 ml-2">Date</Text>
                    <Text className="flex-1 text-xs font-bold text-gray-500">Nama Teknisi</Text>
                </View>
                {data.map((tech) => (
                    <View key={tech.no} className="flex-row py-2 border-b border-gray-100">
                        <Text className="w-10 text-center text-xs font-bold text-gray-400">{tech.no}</Text>
                        <Text className="flex-1 text-xs text-gray-700 ml-2">{tech.date}</Text>
                        <Text className="flex-1 text-xs font-semibold text-gray-800">{tech.name}</Text>
                    </View>
                ))}
            </View>
        </View>
    );

    return (
        <View className="px-6">
            {renderTable('Teknisi Print Pack Tanpa Jadwal Kerja (No LKT)', techniciansPP)}
            {renderTable('Teknisi Plastic Tanpa Jadwal Kerja (No LKT)', techniciansPL)}
        </View>
    );
}
