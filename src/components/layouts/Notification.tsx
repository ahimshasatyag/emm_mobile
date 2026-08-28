import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Pressable, ActivityIndicator } from 'react-native';
import { X, Bell, Info, CheckCircle, AlertTriangle } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { fetchNotifications, markAsRead, markAllAsRead } from '../../stores/notificationSlice';

interface NotificationProps {
    visible: boolean;
    onClose: () => void;
}

const formatRelativeTime = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString.replace(' ', 'T'));
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 0) return 'Baru saja';
    if (diffInSeconds < 60) return 'Baru saja';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit lalu`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam lalu`;
    return `${Math.floor(diffInSeconds / 86400)} hari lalu`;
};

export const Notification: React.FC<NotificationProps> = ({ visible, onClose }) => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<DrawerNavigationProp<any>>();
    const dispatch = useAppDispatch();
    
    const { notifications, loading } = useAppSelector(state => state.notification);
    const authUser = useAppSelector(state => state.auth.user);

    useEffect(() => {
        if (visible) {
            dispatch(fetchNotifications(authUser?.id_user));
        }
    }, [visible, dispatch, authUser]);

    const unreadCount = notifications.filter(n => !n.is_read || n.is_read === 0).length;

    const handleMarkAllAsRead = () => {
        if (authUser?.id_user) {
            dispatch(markAllAsRead(authUser.id_user));
        }
    };

    const handleMarkAsReadAction = (id: number) => {
        dispatch(markAsRead(id));
        
        // Logika navigasi dapat diletakkan di sini sesuai dengan desain asli
        const notif = notifications.find(n => n.id_notifikasi === id);
        if (notif) {
            // Contoh implementasi logika dari desain asli:
            // if (notif.judul.includes('Registrasi')) {
            //    onClose();
            //    navigation.navigate('ApprovalTab');
            // }
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="none"
            statusBarTranslucent={true}
            onRequestClose={onClose}
        >
            <View className="flex-1 flex-row">
                {/* Overlay (Click outside to close) */}
                <View className="flex-1 bg-black/30">
                    <Pressable className="flex-1 w-full h-full" onPress={onClose} />
                </View>

                {/* Sidebar Notification */}
                <View 
                    className="w-[85%] max-w-[400px] h-full bg-gray-50 absolute right-0 shadow-2xl"
                    style={{ elevation: 20, shadowColor: '#000', shadowOffset: { width: -10, height: 0 }, shadowOpacity: 0.15, shadowRadius: 20 }}
                >
                    {/* Header */}
                    <View 
                        className="flex-row items-center justify-between px-5 bg-white border-b border-gray-100"
                        style={{ paddingTop: insets.top > 0 ? insets.top + 5 : 15, paddingBottom: 16 }}
                    >
                        <View className="flex-row items-center">
                            <View className="w-12 h-12 rounded-full bg-blue-50 items-center justify-center mr-3 border border-blue-100">
                                <Bell color="#3b82f6" size={24} />
                            </View>
                            <View>
                                <Text className="text-xl font-bold text-gray-800">Notifikasi</Text>
                                <Text className="text-sm text-gray-500">
                                    {unreadCount > 0 ? `Anda memiliki ${unreadCount} pesan baru` : 'Tidak ada pesan baru'}
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={onClose} className="p-2.5 bg-gray-50 rounded-full border border-gray-200" activeOpacity={0.7}>
                            <X color="#6b7280" size={20} />
                        </TouchableOpacity>
                    </View>

                    {/* Content */}
                    <ScrollView className="flex-1 p-5" showsVerticalScrollIndicator={false}>
                        {loading && notifications.length === 0 ? (
                            <View className="items-center justify-center py-10">
                                <ActivityIndicator size="large" color="#3b82f6" />
                                <Text className="text-gray-500 mt-4">Memuat notifikasi...</Text>
                            </View>
                        ) : (
                            <>
                                {unreadCount > 0 && (
                                    <TouchableOpacity onPress={handleMarkAllAsRead} className="mb-4 self-end">
                                        <Text className="text-blue-600 font-medium text-sm">Tandai semua dibaca</Text>
                                    </TouchableOpacity>
                                )}
                        {notifications.length === 0 ? (
                            <View className="items-center justify-center py-10 opacity-50">
                                <Bell color="#9ca3af" size={40} className="mb-3" />
                                <Text className="text-gray-500">Belum ada notifikasi.</Text>
                            </View>
                        ) : (
                            notifications.map((notif) => (
                                <TouchableOpacity 
                                    key={notif.id_notifikasi}
                                    activeOpacity={0.7}
                                    onPress={() => handleMarkAsReadAction(notif.id_notifikasi)}
                                    className={`flex-row p-4 mb-4 rounded-2xl border ${notif.is_read ? 'bg-white border-gray-200' : 'bg-blue-50/40 border-blue-200'}`}
                                    style={{ elevation: notif.is_read ? 1 : 0, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3 }}
                                >
                                    <View className={`w-11 h-11 rounded-full items-center justify-center mr-3 mt-0.5 
                                        ${notif.action === 'Update' ? 'bg-blue-100' : notif.action === 'Create' ? 'bg-green-100' : 'bg-red-100'}`}>
                                        {notif.action === 'Update' && <Info color="#3b82f6" size={20} />}
                                        {notif.action === 'Create' && <CheckCircle color="#10b981" size={20} />}
                                        {notif.action === 'Delete' && <AlertTriangle color="#ef4444" size={20} />}
                                    </View>
                                    <View className="flex-1">
                                        <View className="flex-row justify-between items-start mb-1">
                                            <Text className={`font-bold text-[15px] flex-1 mr-2 ${notif.is_read ? 'text-gray-800' : 'text-blue-900'}`}>{notif.judul}</Text>
                                            <Text className="text-[11px] text-gray-400 font-medium mt-0.5">{formatRelativeTime(notif.created_at)}</Text>
                                        </View>
                                        <Text className="text-gray-600 text-[13px] leading-5 pr-2">{notif.pesan}</Text>
                                    </View>
                                    {!notif.is_read && (
                                        <View className="w-2.5 h-2.5 rounded-full bg-blue-500 absolute top-4 right-4" />
                                    )}
                                </TouchableOpacity>
                            ))
                        )}
                        </>
                        )}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};
