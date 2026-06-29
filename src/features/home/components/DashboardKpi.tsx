import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import { kpiTechnicians } from '../data/mockDashboard';
import { theme } from '../../../theme/theme';

export function DashboardKpi() {
    const [selectedMonth, setSelectedMonth] = useState('May');
    const [selectedYear, setSelectedYear] = useState('2026');
    const [isMonthModalVisible, setMonthModalVisible] = useState(false);
    const [isYearModalVisible, setYearModalVisible] = useState(false);

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const years = ['2025', '2026', '2027'];

    const renderPickerModal = (visible: boolean, setVisible: (v: boolean) => void, data: string[], selectedValue: string, onSelect: (v: string) => void) => (
        <Modal transparent visible={visible} animationType="slide" onRequestClose={() => setVisible(false)}>
            <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
                <View className="bg-white rounded-t-2xl p-4 min-h-[300px]">
                    <View className="flex-row justify-between items-center mb-4 border-b border-gray-100 pb-2">
                        <Text className="text-lg font-bold text-gray-800">Select Option</Text>
                        <TouchableOpacity onPress={() => setVisible(false)} className="p-2">
                            <Text className="text-gray-500 font-bold">Close</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {data.map((item) => (
                            <TouchableOpacity 
                                key={item} 
                                className={`py-3 border-b border-gray-100 ${selectedValue === item ? 'bg-indigo-50' : ''}`}
                                onPress={() => { onSelect(item); setVisible(false); }}
                            >
                                <Text className={`text-center font-semibold ${selectedValue === item ? 'text-indigo-600' : 'text-gray-700'}`}>{item}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );

    return (
        <View className="px-6 mb-6">
            <View className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <Text className="text-sm font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">KPI Teknisi Performance</Text>

                {/* Filter Controls */}
                <View className="bg-gray-50 p-4 rounded-xl mb-6">
                    <View className="flex-row items-center justify-between mb-4">
                        <View className="flex-1 mr-2">
                            <Text className="text-xs font-bold text-gray-500 mb-1">Month:</Text>
                            <TouchableOpacity 
                                className="bg-white border border-gray-200 rounded-lg px-3 py-2"
                                onPress={() => setMonthModalVisible(true)}
                            >
                                <Text className="text-xs font-semibold text-gray-700">{selectedMonth}</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="flex-1 mr-2">
                            <Text className="text-xs font-bold text-gray-500 mb-1">Year:</Text>
                            <TouchableOpacity 
                                className="bg-white border border-gray-200 rounded-lg px-3 py-2"
                                onPress={() => setYearModalVisible(true)}
                            >
                                <Text className="text-xs font-semibold text-gray-700">{selectedYear}</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="flex-1 justify-end mt-4">
                            <TouchableOpacity 
                                className="rounded-lg py-2 items-center justify-center"
                                style={{ backgroundColor: theme.colors.primary }}
                                onPress={() => Alert.alert('KPI Search', `Searching for ${selectedMonth} ${selectedYear}...`)}
                            >
                                <Text className="text-white font-bold text-xs">Search</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Status KPI Title */}
                <View className="bg-gray-100 self-start px-3 py-1.5 rounded-lg mb-4">
                    <Text className="text-xs font-bold text-gray-700">
                        KPI Teknisi Periode : <Text style={{ color: theme.colors.primary }}>{selectedMonth}, {selectedYear}</Text>
                    </Text>
                </View>

                {/* KPI List */}
                <View style={{ flexDirection: 'column' }}>
                    {kpiTechnicians.map((tech, index) => (
                        <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                            <Text style={{ width: 112, fontSize: 12, fontWeight: '600', color: '#374151' }} numberOfLines={1}>{tech.name}</Text>
                            <View style={{ flex: 1, height: 20, backgroundColor: '#f3f4f6', borderRadius: 8, overflow: 'hidden' }}>
                                <View style={{ height: '100%', backgroundColor: '#10b981', borderRadius: 8, width: `${tech.score}%` }} />
                                <View style={{ position: 'absolute', right: 12, top: 0, bottom: 0, justifyContent: 'center' }}>
                                    <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#4b5563' }}>{tech.score}%</Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            </View>

            {/* Modals */}
            {isMonthModalVisible && renderPickerModal(isMonthModalVisible, setMonthModalVisible, months, selectedMonth, setSelectedMonth)}
            {isYearModalVisible && renderPickerModal(isYearModalVisible, setYearModalVisible, years, selectedYear, setSelectedYear)}
        </View>
    );
}
