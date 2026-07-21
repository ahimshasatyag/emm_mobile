import React, { useEffect, useRef } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { useWhatsappChat } from '../hooks/useWhatsappChat';
import { MessageBubble } from '../components/MessageBubble';
import { MessageInput } from '../components/MessageInput';
import { WhatsappChatRoomSkeleton } from '../skeleton/WhatsappChatSkeleton';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

type RouteParams = {
    WhatsappChatRoomScreen: { contactNumber: string };
};

export const WhatsappChatRoomScreen = () => {
    const route = useRoute<RouteProp<RouteParams, 'WhatsappChatRoomScreen'>>();
    const { contactNumber } = route.params;
    const { activeMessages, loading, loadMessages, clearMessages, handleSendMessage, sending } = useWhatsappChat();
    const scrollViewRef = useRef<ScrollView>(null);

    useEffect(() => {
        loadMessages(contactNumber);
        return () => {
            clearMessages();
        };
    }, [contactNumber]);

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator title={contactNumber.replace('@s.whatsapp.net', '')} showBackButton={true} />

            <ScrollView
                className="flex-1 p-4"
                ref={scrollViewRef}
                onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                showsVerticalScrollIndicator={false}
            >
                {loading ? (
                    <WhatsappChatRoomSkeleton />
                ) : (
                    <Animated.View entering={FadeIn} exiting={FadeOut}>
                        {activeMessages.length === 0 ? (
                            <View className="items-center py-10 bg-white rounded-xl shadow-sm border border-gray-100">
                                <Text className="text-gray-500">Mulai percakapan dengan {contactNumber.replace('@s.whatsapp.net', '')}</Text>
                            </View>
                        ) : (
                            activeMessages.map((msg, index) => (
                                <MessageBubble key={index} message={msg} />
                            ))
                        )}
                        <View className="h-6" />
                    </Animated.View>
                )}
            </ScrollView>

            <MessageInput 
                sending={sending}
                onSend={(text) => handleSendMessage(contactNumber, text)}
            />
        </View>
    );
};
