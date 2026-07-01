import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CornerDownRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

interface LktHeaderViewScreenProps {
    activeTab: 'perbaikan' | 'realisasi';
    setActiveTab: (tab: 'perbaikan' | 'realisasi') => void;
}

export function LktHeaderViewScreen({ activeTab, setActiveTab }: LktHeaderViewScreenProps) {
    return (
        <View>
            {/* Title Headers */}
            <View className="mb-4">
                <Text className="text-xl font-extrabold text-slate-800">CST-EMM/2025/07/03624</Text>
                <View className="flex-row items-center mt-1 ml-1">
                    <CornerDownRight color="#334155" size={20} strokeWidth={3} className="mr-2" style={{ marginTop: -6 }} />
                    <Text className="text-base font-bold text-slate-800">LKT-EMM/2025/07/03646</Text>
                </View>
            </View>
            
            <Text className="font-bold text-gray-800 mb-2">LKT Detail</Text>

            {/* Tabs */}
            <View className="flex-row border-b border-gray-200 mb-4">
                <TouchableOpacity 
                    className={`px-4 py-2 ${activeTab === 'perbaikan' ? 'border-b-2 border-[#9e0b0f]' : ''}`}
                    onPress={() => setActiveTab('perbaikan')}
                >
                    <Text className={`text-sm font-bold ${activeTab === 'perbaikan' ? 'text-[#9e0b0f]' : 'text-gray-500'}`}>Laporan Perbaikan</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    className={`px-4 py-2 ${activeTab === 'realisasi' ? 'border-b-2 border-[#9e0b0f]' : ''}`}
                    onPress={() => setActiveTab('realisasi')}
                >
                    <Text className={`text-sm font-bold ${activeTab === 'realisasi' ? 'text-[#9e0b0f]' : 'text-gray-500'}`}>Realisasi Service</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
