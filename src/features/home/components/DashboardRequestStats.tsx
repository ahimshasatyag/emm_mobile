import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withDelay } from 'react-native-reanimated';
import { Layers, Clock, Settings } from 'lucide-react-native';
import { theme } from '../../../theme/theme';

const RequestStatCard = ({ 
    title, value, valueColor, icon, badgeText, badgeColor, badgeBg, iconBg, delay, onAction 
}: any) => {
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(20);

    useEffect(() => {
        opacity.value = withDelay(delay, withTiming(1, { duration: 500 }));
        translateY.value = withDelay(delay, withTiming(0, { duration: 500 }));
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: translateY.value }],
    }));

    return (
        <Animated.View 
            className="bg-white rounded-2xl p-4 mr-4 w-44 shadow-sm border border-gray-100 flex-col"
            style={[animatedStyle, { elevation: 2 }]}
        >
            <View className="flex-row justify-between items-start mb-3">
                <View className={`w-10 h-10 rounded-full ${iconBg} items-center justify-center`}>
                    {icon}
                </View>
                <TouchableOpacity onPress={onAction}>
                    <Text style={{ color: theme.colors.primary }} className="text-[10px] font-bold">Details &rarr;</Text>
                </TouchableOpacity>
            </View>
            <Text className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</Text>
            <Text className={`text-2xl font-extrabold mb-3 ${valueColor}`}>{value}</Text>
            
            <View className={`${badgeBg} px-2 py-1 rounded self-start mt-auto`}>
                <Text className={`${badgeColor} text-[10px] font-semibold`}>{badgeText}</Text>
            </View>
        </Animated.View>
    );
};

export function DashboardRequestStats() {
    const [activeModal, setActiveModal] = useState<string | null>(null);

    const renderModal = () => {
        if (!activeModal) return null;

        let title = '';
        if (activeModal === 'request') title = 'Status CSR Masih Baru (Request)';
        if (activeModal === 'pending') title = 'CST Belum Di Proses (Pending)';
        if (activeModal === 'progress') title = 'LKT Sedang Di Proses (In Progress)';

        return (
            <Modal transparent visible animationType="fade" onRequestClose={() => setActiveModal(null)}>
                <View className="flex-1 bg-black/50 justify-center items-center p-4">
                    <View className="bg-white rounded-xl w-full max-w-md overflow-hidden shadow-xl">
                        <View className="px-5 py-4 bg-gray-50 border-b border-gray-200 flex-row justify-between items-center">
                            <Text className="font-bold text-gray-800 text-sm">{title}</Text>
                            <TouchableOpacity onPress={() => setActiveModal(null)}>
                                <Text className="text-gray-400 font-bold text-lg leading-none">X</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="p-5 h-64 justify-center items-center">
                            <Text className="text-gray-500 text-xs text-center">Menampilkan data lapangan aktual dari modul penugasan teknis...</Text>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    };

    const requests = [
        {
            id: 'request',
            title: 'Request',
            value: '12',
            valueColor: 'text-gray-800',
            icon: <Layers color={theme.colors.primary} size={20} />,
            badgeText: 'New CSR Status',
            badgeColor: 'text-gray-600',
            badgeBg: 'bg-gray-100',
            iconBg: 'bg-red-50'
        },
        {
            id: 'pending',
            title: 'Pending',
            value: '5',
            valueColor: 'text-red-600',
            icon: <Clock color="#ea580c" size={20} />,
            badgeText: 'CST Unapproved',
            badgeColor: 'text-red-600',
            badgeBg: 'bg-red-50',
            iconBg: 'bg-orange-50'
        },
        {
            id: 'progress',
            title: 'In Progress',
            value: '8',
            valueColor: 'text-amber-500',
            icon: <Settings color="#2563eb" size={20} />,
            badgeText: 'LKT Processing',
            badgeColor: 'text-amber-600',
            badgeBg: 'bg-amber-50',
            iconBg: 'bg-blue-50'
        }
    ];

    return (
        <View className="py-2 mb-6">
            {renderModal()}
            <Text className="px-6 text-lg font-extrabold text-gray-800 mb-4">Status Permintaan</Text>
            
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 24 }}
            >
                {requests.map((req, index) => (
                    <RequestStatCard 
                        key={req.id}
                        {...req}
                        delay={index * 100}
                        onAction={() => setActiveModal(req.id)}
                    />
                ))}
            </ScrollView>
        </View>
    );
}

