import React, { useEffect, useState } from 'react';
import { View, ScrollView, RefreshControl, Text } from 'react-native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { useWhatsappChat } from '../hooks/useWhatsappChat';
import { WhatsappChatLogSkeleton } from '../skeleton/WhatsappChatSkeleton';
import { theme } from '../../../theme/theme';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export const WhatsappLogScreen = () => {
    const { logs, loading, loadLogs } = useWhatsappChat();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const onRefresh = async () => {
        setIsRefreshing(true);
        await loadLogs();
        setIsRefreshing(false);
    };

    useEffect(() => {
        loadLogs();
    }, []);

    const getStatusBadge = (status: number) => {
        switch (status) {
            case 0:
                return <View className="bg-gray-800 px-2 py-1 rounded-md"><Text className="text-white text-[10px] font-bold">BELUM TERKIRIM</Text></View>;
            case 1:
                return <View className="bg-info px-2 py-1 rounded-md"><Text className="text-white text-[10px] font-bold">TERKIRIM</Text></View>;
            default:
                return <View className="bg-red-500 px-2 py-1 rounded-md"><Text className="text-white text-[10px] font-bold">GAGAL</Text></View>;
        }
    };

    const formatDate = (isoString: string) => {
        const d = new Date(isoString);
        return `${d.getDate().toString().padStart(2,'0')}-${(d.getMonth()+1).toString().padStart(2,'0')}-${d.getFullYear()} ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
    };

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator title="Log Status Pesan" showBackButton={true} />

            <ScrollView
                className="flex-1 p-4"
                refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />}
            >
                {loading && !isRefreshing ? (
                    <WhatsappChatLogSkeleton />
                ) : (
                    <Animated.View entering={FadeIn} exiting={FadeOut} className="bg-white rounded-xl shadow-sm border border-gray-100 mb-10 overflow-hidden">
                        {logs.length === 0 ? (
                            <View className="items-center py-10">
                                <Text className="text-gray-500">Belum ada log pesan</Text>
                            </View>
                        ) : (
                            <View>
                                {logs.map((log, index) => (
                                    <View key={log.id_message_wa} className={`p-4 flex-row items-start ${index !== logs.length -1 ? 'border-b border-gray-100' : ''}`}>
                                        <View className="flex-1 mr-2">
                                            <Text className="text-gray-800 font-bold text-sm mb-1">{log.mobile_number.replace('@s.whatsapp.net', '')}</Text>
                                            <Text className="text-gray-600 text-xs mb-2" numberOfLines={2}>{log.message}</Text>
                                            <Text className="text-gray-400 text-[10px]">Create: {formatDate(log.date_create)}</Text>
                                            {log.date_update && <Text className="text-gray-400 text-[10px]">Update: {formatDate(log.date_update)}</Text>}
                                        </View>
                                        <View className="items-end">
                                            {getStatusBadge(log.flag_status)}
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )}
                    </Animated.View>
                )}
            </ScrollView>
        </View>
    );
};
