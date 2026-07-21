import React, { useEffect, useState } from 'react';
import { View, ScrollView, RefreshControl, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { useWhatsappChat } from '../hooks/useWhatsappChat';
import { WhatsappChatListSkeleton } from '../skeleton/WhatsappChatSkeleton';
import { ContactItem } from '../components/ContactItem';
import { NewChatModal } from '../components/NewChatModal';
import { theme } from '../../../theme/theme';
import { MessageSquarePlus, History } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export const WhatsappChatListScreen = () => {
    const navigation = useNavigation<any>();
    const { contacts, loading, loadContacts, handleSendMessage, sending } = useWhatsappChat();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [newChatModalVisible, setNewChatModalVisible] = useState(false);

    const onRefresh = async () => {
        setIsRefreshing(true);
        await loadContacts();
        setIsRefreshing(false);
    };

    useEffect(() => {
        loadContacts();
    }, []);

    const handleSendNewChat = async (phone: string, message: string) => {
        await handleSendMessage(phone, message, () => {
            setNewChatModalVisible(false);
            // Navigate to room directly
            navigation.navigate('WhatsappChatRoomScreen', { contactNumber: phone });
        });
    };

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator title={isRefreshing ? "MEMUAT DATA..." : "WhatsApp Chat"} showBackButton={false} />

            <View className="flex-row px-4 pt-4 pb-2 justify-between items-center">
                <Text className="text-gray-800 font-bold text-lg">Pesan Terakhir</Text>
                <TouchableOpacity 
                    onPress={() => navigation.navigate('WhatsappLogScreen')}
                    className="flex-row items-center bg-white border border-gray-200 px-3 py-1.5 rounded-full shadow-sm"
                >
                    <History color={theme.colors.primary} size={16} className="mr-1" />
                    <Text style={{ color: theme.colors.primary }} className="font-semibold text-xs">Log Status</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                className="flex-1 px-4"
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />}
            >
                {loading || isRefreshing ? (
                    <WhatsappChatListSkeleton />
                ) : (
                    <Animated.View entering={FadeIn} exiting={FadeOut}>
                        {contacts.length === 0 ? (
                            <View className="items-center py-10">
                                <Text className="text-gray-500">Belum ada percakapan</Text>
                            </View>
                        ) : (
                            contacts.map((c) => (
                                <ContactItem 
                                    key={c.number} 
                                    contact={c} 
                                    onPress={() => navigation.navigate('WhatsappChatRoomScreen', { contactNumber: c.number })} 
                                />
                            ))
                        )}
                        <View className="h-24" />
                    </Animated.View>
                )}
            </ScrollView>

            <TouchableOpacity
                className="absolute bottom-6 right-6 w-14 h-14 rounded-full shadow-lg items-center justify-center"
                style={{ backgroundColor: theme.colors.primary }}
                onPress={() => setNewChatModalVisible(true)}
            >
                <MessageSquarePlus color="white" size={24} />
            </TouchableOpacity>

            <NewChatModal 
                visible={newChatModalVisible}
                onDismiss={() => setNewChatModalVisible(false)}
                onSend={handleSendNewChat}
                sending={sending}
            />
        </View>
    );
};
